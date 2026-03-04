<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreAppointmentRequest;
use App\Http\Requests\UpdateAppointmentRequest;
use App\Http\Resources\DoctorResource;
use App\Http\Resources\PatientResource;
use App\Http\Resources\AppointmentResource;
use App\Models\Patient;
use App\Models\Doctor;
use App\Models\Appointment;
use App\Services\AppointmentService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class AppointmentsController extends Controller
{
    protected $service;

    public function __construct(AppointmentService $service)
    {
        $this->service = $service;
    }

    /**
     * Display a listing of appointments
     */
    public function index(): AnonymousResourceCollection
    {
        $appointments = $this->service->getAll();
        return AppointmentResource::collection($appointments);
    }

    /**
     * Create a new appointment (Admin only)
     */
    public function store(StoreAppointmentRequest $request): JsonResponse
    {
        try {
            $appointment = $this->service->create($request->validated());
            $appointment->load(['patient.user', 'doctor.user']);

            return response()->json([
                'success' => true,
                'message' => 'Appointment created successfully',
                'data' => new AppointmentResource($appointment)
            ], 201);

        } catch (\Exception $e) {
            $code = $e->getCode();
            if (!is_numeric($code) || $code < 100 || $code > 599) {
                $code = 500;
            }

            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
                'code' => $e->getCode()
            ], $code);
        }
    }

    /**
     * Display a specific appointment
     */
    public function show($id): JsonResponse
    {
        $appointment = Appointment::with(['patient.user', 'doctor.user', 'images'])->find($id);

        if (!$appointment) {
            return response()->json([
                'success' => false,
                'message' => 'Appointment not found'
            ], 404);
        }

        // We can still use the resource here
        return response()->json([
            'success' => true,
            'data' => new AppointmentResource($appointment)
        ], 200);
    }

    /**
     * Update an appointment
     */
    public function update(UpdateAppointmentRequest $request, $id): JsonResponse
    {
        try {
            $appointment = Appointment::findOrFail($id);
            $this->service->update($appointment, $request->validated());
            $appointment->load(['patient.user', 'doctor.user']);

            return response()->json([
                'success' => true,
                'message' => 'Appointment updated successfully',
                'data' => new AppointmentResource($appointment)
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
                'code' => $e->getCode()
            ], $e->getCode() ?: 500);
        }
    }

    /**
     * Delete an appointment
     */
    public function destroy($id): JsonResponse
    {
        try {
            $appointment = Appointment::findOrFail($id);
            $this->service->delete($appointment);

            return response()->json([
                'success' => true,
                'message' => 'Appointment deleted successfully'
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error during deletion',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get list of patients for dropdown
     */
    public function getPatients()
    {
        $patients = Patient::with('user')->get();
        return PatientResource::collection($patients);
    }

    /**
     * Get list of doctors for dropdown
     */
    public function getDoctors()
    {
        $doctors = Doctor::with('user')->get();
        return DoctorResource::collection($doctors);
    }
}
