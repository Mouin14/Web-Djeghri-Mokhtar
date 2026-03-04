<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Appointment;
use App\Models\AppointmentImage;
use App\Models\Patient;
use Illuminate\Http\Request;
use App\Http\Resources\AppointmentResource;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;

class PatientAppointmentsController extends Controller
{
    /**
     * Get patient's own appointments
     */
    public function index(Request $request)
    {
        // Get the authenticated user's patient profile
        $user = $request->user();
        $patient = Patient::where('utilisateur_id', $user->id)->first();

        if (!$patient) {
            return response()->json([
                'success' => false,
                'message' => 'Patient profile not found'
            ], 404);
        }

        $appointments = Appointment::where('patient_id', $patient->id)
            ->with(['patient.user', 'doctor.user', 'images'])
            ->orderByRaw('appointment_date IS NULL')  // NULL dates first (pending)
            ->orderBy('appointment_date', 'desc')
            ->orderBy('appointment_time', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => AppointmentResource::collection($appointments),
        ]);
    }

    /**
     * Create a new appointment (Patient creates their own)
     * No doctor selection - admin/doctor will assign based on motif
     */
    public function store(Request $request)
    {
        // Get the authenticated user's patient profile
        $user = $request->user();
        $patient = Patient::where('utilisateur_id', $user->id)->first();

        if (!$patient) {
            return response()->json([
                'success' => false,
                'message' => 'Patient profile not found'
            ], 404);
        }

        $validated = $request->validate([
            'motif' => 'required|string|max:1000',
            'images.*' => 'nullable|image|mimes:jpeg,jpg,png,gif|max:5120', // max 5MB per image
        ]);

        // Validate max 10 images
        if ($request->hasFile('images') && count($request->file('images')) > 10) {
            return response()->json([
                'success' => false,
                'message' => 'Vous ne pouvez télécharger que 10 images maximum'
            ], 422);
        }

        DB::beginTransaction();

        try {
            // Create appointment without doctor, date, or time (will be assigned later by admin/doctor)
            $appointment = Appointment::create([
                'patient_id' => $patient->id,
                'doctor_id' => null, // No doctor assigned yet
                'appointment_date' => null, // Date will be set when admin confirms
                'appointment_time' => null, // Time will be set when admin confirms
                'status' => 'pending', // Always set to "pending" for patient-created appointments
                'reason' => $validated['motif'],
            ]);

            // Handle image uploads
            if ($request->hasFile('images')) {
                foreach ($request->file('images') as $image) {
                    $path = $image->store('rendez_vous_images', 'public');

                    AppointmentImage::create([
                        'rendez_vous_id' => $appointment->id,
                        'image_path' => $path,
                    ]);
                }
            }

            DB::commit();

            $appointment->load(['images']);

            return response()->json([
                'success' => true,
                'message' => 'Appointment request sent successfully. You will receive a confirmation with the date and time.',
                'data' => new AppointmentResource($appointment)
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                'success' => false,
                'message' => 'Error creating appointment',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get a single appointment with full details (including medical records).
     * Used by the patient DossierArchiveModal.
     */
    public function show(Request $request, $id)
    {
        $user = $request->user();
        $patient = Patient::where('utilisateur_id', $user->id)->first();

        if (!$patient) {
            return response()->json([
                'success' => false,
                'message' => 'Patient profile not found'
            ], 404);
        }

        $appointment = Appointment::where('id', $id)
            ->where('patient_id', $patient->id) // ensure patient owns this
            ->with(['patient.user', 'patient.medicalRecords.doctor.user', 'doctor.user', 'images'])
            ->first();

        if (!$appointment) {
            return response()->json([
                'success' => false,
                'message' => 'Appointment not found'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => new AppointmentResource($appointment),
        ]);
    }

    /**
     * Delete appointment (only if status is "en attente" or "annulé")
     */
    public function destroy(Request $request, $id)
    {
        // Get the authenticated user's patient profile
        $user = $request->user();
        $patient = Patient::where('utilisateur_id', $user->id)->first();

        if (!$patient) {
            return response()->json([
                'success' => false,
                'message' => 'Patient profile not found'
            ], 404);
        }

        $appointment = Appointment::where('id', $id)
            ->where('patient_id', $patient->id) // Ensure patient owns this appointment
            ->first();

        if (!$appointment) {
            return response()->json([
                'success' => false,
                'message' => 'Appointment not found'
            ], 404);
        }

        // Check if appointment can be deleted
        if (!in_array($appointment->status, ['pending', 'cancelled'])) {
            return response()->json([
                'success' => false,
                'message' => 'You can only delete appointments that are pending or cancelled'
            ], 403);
        }

        try {
            $appointment->delete();

            return response()->json([
                'success' => true,
                'message' => 'Appointment deleted successfully'
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error deleting appointment',
                'error' => $e->getMessage()
            ], 500);
        }
    }

}
