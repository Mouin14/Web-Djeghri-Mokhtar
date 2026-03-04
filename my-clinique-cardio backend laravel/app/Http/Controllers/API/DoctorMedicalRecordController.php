<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\MedicalRecord;
use App\Models\MedicalRecordAttachment;
use App\Models\Doctor;
use App\Models\Appointment;
use Illuminate\Http\Request;
use App\Http\Resources\MedicalRecordResource;

class DoctorMedicalRecordController extends Controller
{
    /**
     * Get all medical records for a patient (for doctors)
     */
    public function getPatientRecords(Request $request, $patientId)
    {
        // Verify the doctor has access to this patient (has/had an appointment)
        $user = $request->user();
        $doctor = Doctor::where('utilisateur_id', $user->id)->first();

        if (!$doctor) {
            return response()->json([
                'success' => false,
                'message' => 'Doctor profile not found'
            ], 404);
        }

        // Check if doctor has/had appointment with this patient
        $hasAccess = Appointment::where('doctor_id', $doctor->id)
            ->where('patient_id', $patientId)
            ->exists();

        if (!$hasAccess) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized access to this patient'
            ], 403);
        }

        $records = MedicalRecord::where('malade_id', $patientId)
            ->with(['doctor.user', 'attachments'])
            ->orderBy('created_at', 'desc')
            ->get();

        return MedicalRecordResource::collection($records);
    }

    /**
     * Create a new medical record for a patient
     */
    public function store(Request $request, $patientId)
    {
        // Get the authenticated user's doctor record
        $user = $request->user();
        $doctor = Doctor::where('utilisateur_id', $user->id)->first();

        if (!$doctor) {
            return response()->json([
                'success' => false,
                'message' => 'Doctor profile not found'
            ], 404);
        }

        // Check if doctor has/had appointment with this patient
        $hasAccess = Appointment::where('doctor_id', $doctor->id)
            ->where('patient_id', $patientId)
            ->exists();

        if (!$hasAccess) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized access to this patient'
            ], 403);
        }

        $validated = $request->validate([
            'notes' => 'required|string|max:5000',
            'attachments.*' => 'nullable|file|mimes:pdf,jpeg,jpg,png,gif|max:10240', // 10MB max
        ]);

        try {
            // Create the medical record
            $record = MedicalRecord::create([
                'malade_id' => $patientId,
                'medecin_id' => $doctor->id,
                'notes' => $validated['notes'],
            ]);

            // Handle file uploads
            if ($request->hasFile('attachments')) {
                foreach ($request->file('attachments') as $file) {
                    $extension = $file->getClientOriginalExtension();
                    $fileType = in_array(strtolower($extension), ['pdf']) ? 'pdf' : 'image';

                    $path = $file->store('medical_record_attachments', 'public');

                    MedicalRecordAttachment::create([
                        'dossier_medical_id' => $record->id,
                        'file_path' => $path,
                        'file_type' => $fileType,
                        'original_name' => $file->getClientOriginalName(),
                    ]);
                }
            }

            $record->load(['doctor.user', 'attachments']);

            return response()->json([
                'success' => true,
                'message' => 'Medical record created successfully',
                'data' => new MedicalRecordResource($record)
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error creating medical record',
                'error' => $e->getMessage()
            ], 500);
        }
    }

}
