<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Appointment;
use App\Models\Doctor;
use App\Models\Patient;
use Illuminate\Http\Request;
use App\Http\Resources\AppointmentResource;

class DoctorAppointmentsController extends Controller
{
    /**
     * Get all pending requests (no doctor assigned)
     */
    public function getPendingRequests()
    {
        $requests = Appointment::whereNull('doctor_id')
            ->where('status', 'pending')
            ->with(['patient.user'])
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => AppointmentResource::collection($requests),
        ]);
    }

    /**
     * Get appointment details with images
     */
    public function getRequestDetails($id)
    {
        $appointment = Appointment::with(['patient.user', 'images'])->find($id);

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
     * Doctor accepts a request and assigns themselves
     */
    public function acceptRequest(Request $request, $id)
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

        $appointment = Appointment::find($id);

        if (!$appointment) {
            return response()->json([
                'success' => false,
                'message' => 'Appointment not found'
            ], 404);
        }

        // Check if appointment is still available
        if ($appointment->doctor_id !== null) {
            return response()->json([
                'success' => false,
                'message' => 'This appointment has already been assigned'
            ], 409);
        }

        $validated = $request->validate([
            'appointment_date' => 'required|date',
            'appointment_time' => 'required',
        ]);

        // Check if doctor has conflict at this time
        $exists = Appointment::where('doctor_id', $doctor->id)
            ->where('appointment_date', $validated['appointment_date'])
            ->where('appointment_time', $validated['appointment_time'])
            ->whereIn('status', ['pending', 'confirmed'])
            ->exists();

        if ($exists) {
            return response()->json([
                'success' => false,
                'message' => 'You already have an appointment at this time'
            ], 409);
        }

        try {
            $appointment->update([
                'doctor_id' => $doctor->id,
                'appointment_date' => $validated['appointment_date'],
                'appointment_time' => $validated['appointment_time'],
                'status' => 'confirmed',
            ]);

            $appointment->load(['patient.user', 'doctor.user']);

            return response()->json([
                'success' => true,
                'message' => 'Appointment accepted successfully',
                'data' => new AppointmentResource($appointment)
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error during acceptance',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get doctor's own appointments
     */
    public function getMyAppointments(Request $request)
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

        $appointments = Appointment::where('doctor_id', $doctor->id)
            ->with(['patient.user', 'images'])
            ->whereNotNull('appointment_date')
            ->orderBy('appointment_date', 'desc')
            ->orderBy('appointment_time', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => AppointmentResource::collection($appointments),
        ]);
    }

    /**
     * Doctor cancels a pending (unassigned) request with a mandatory reason
     */
    public function cancelAppointment(Request $request, $id)
    {
        $user = $request->user();
        $doctor = Doctor::where('utilisateur_id', $user->id)->first();

        if (!$doctor) {
            return response()->json(['success' => false, 'message' => 'Doctor profile not found'], 404);
        }

        // Allow cancelling pending requests that have no doctor assigned yet
        $appointment = Appointment::where('id', $id)
            ->whereNull('doctor_id')
            ->where('status', 'pending')
            ->first();

        if (!$appointment) {
            return response()->json(['success' => false, 'message' => 'Appointment not found or not cancellable'], 404);
        }

        $validated = $request->validate([
            'cancellation_reason' => 'required|string|max:1000',
        ]);

        $appointment->update([
            'status' => 'cancelled',
            'cancellation_reason' => $validated['cancellation_reason'],
        ]);

        $appointment->load(['patient.user', 'doctor.user', 'images']);

        return response()->json([
            'success' => true,
            'message' => 'Appointment cancelled successfully',
            'data' => new AppointmentResource($appointment),
        ]);
    }

    /**
     * Get full details for doctor's own appointment
     */
    public function getAppointmentDetails(Request $request, $id)
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

        $appointment = Appointment::with(['patient.user', 'images'])
            ->where('id', $id)
            ->where('doctor_id', $doctor->id)
            ->first();

        if (!$appointment) {
            return response()->json([
                'success' => false,
                'message' => 'Appointment not found or not authorized'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => new AppointmentResource($appointment),
        ]);
    }
}
