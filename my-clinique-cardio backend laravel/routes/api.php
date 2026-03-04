<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\API\DoctorController;
use App\Http\Controllers\API\PatientController;
use App\Http\Controllers\API\AppointmentsController;
use App\Http\Controllers\API\PatientAppointmentsController;
use App\Http\Controllers\API\DoctorAppointmentsController;
use App\Http\Controllers\API\DoctorMedicalRecordController;
use App\Http\Controllers\API\DoctorProfileController;
use App\Http\Controllers\API\AdminProfileController;
use App\Http\Controllers\API\PatientProfileController;
use App\Http\Controllers\API\PatientRegistrationController;
use App\Http\Controllers\API\PatientSearchController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// Public routes (no authentication required)
Route::post('/login', [AuthController::class, 'login']);
Route::post('/patient/register', [\App\Http\Controllers\API\PatientRegistrationController::class, 'register']);

// Protected routes (authentication required - session based)
Route::middleware('auth')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);

    // Dashboard stats for all authenticated users
    Route::get('/dashboard/stats', [DashboardController::class, 'stats']);
});

// ============================================
// ADMIN ROUTES (Session-based Authentication)
// ============================================

// Protected admin routes (requires admin authentication)
Route::middleware(['admin'])->group(function () {
    // Doctor Management (admin only)
    Route::get('/admin/medecins', [DoctorController::class, 'index']);
    Route::post('/admin/medecins', [DoctorController::class, 'store']);
    Route::get('/admin/medecins/{id}', [DoctorController::class, 'show']);
    Route::put('/admin/medecins/{id}', [DoctorController::class, 'update']);
    Route::delete('/admin/medecins/{id}', [DoctorController::class, 'destroy']);

    // Patient Management (admin only)
    Route::get('/admin/patients', [PatientController::class, 'index']);
    Route::post('/admin/patients', [PatientController::class, 'store']);
    Route::get('/admin/patients/{id}', [PatientController::class, 'show']);
    Route::put('/admin/patients/{id}', [PatientController::class, 'update']);
    Route::delete('/admin/patients/{id}', [PatientController::class, 'destroy']);

    // Appointment Management (admin only)
    Route::get('/admin/rendez-vous', [AppointmentsController::class, 'index']);
    Route::post('/admin/rendez-vous', [AppointmentsController::class, 'store']);
    Route::get('/admin/rendez-vous/{id}', [AppointmentsController::class, 'show']);
    Route::put('/admin/rendez-vous/{id}', [AppointmentsController::class, 'update']);
    Route::delete('/admin/rendez-vous/{id}', [AppointmentsController::class, 'destroy']);

    // Helper routes for dropdowns
    Route::get('/admin/select/patients', [AppointmentsController::class, 'getPatients']);
    Route::get('/admin/select/doctors', [AppointmentsController::class, 'getDoctors']);

    // Admin profile
    Route::get('/admin/profile', [AdminProfileController::class, 'show']);
    Route::put('/admin/profile', [AdminProfileController::class, 'update']);
});

// ============================================
// PATIENT ROUTES (Session-based Authentication)
// ============================================
Route::middleware(['auth'])->group(function () {
    // Patient's own appointments
    Route::get('/patient/appointments', [PatientAppointmentsController::class, 'index']);
    Route::post('/patient/appointments', [PatientAppointmentsController::class, 'store']);
    Route::get('/patient/appointments/{id}', [PatientAppointmentsController::class, 'show']);   // ← added
    Route::delete('/patient/appointments/{id}', [PatientAppointmentsController::class, 'destroy']);

    // Patient profile management
    Route::get('/patient/profile', [PatientProfileController::class, 'show']);
    Route::put('/patient/profile', [PatientProfileController::class, 'update']);
});

// ============================================
// DOCTOR ROUTES (Session-based Authentication)
// ============================================
Route::middleware(['auth'])->group(function () {
    // Pending requests (waiting list)
    Route::get('/doctor/pending-requests', [DoctorAppointmentsController::class, 'getPendingRequests']);
    Route::get('/doctor/pending-requests/{id}', [DoctorAppointmentsController::class, 'getRequestDetails']);
    Route::post('/doctor/pending-requests/{id}/accept', [DoctorAppointmentsController::class, 'acceptRequest']);

    // Doctor's own appointments
    Route::get('/doctor/appointments', [DoctorAppointmentsController::class, 'getMyAppointments']);
    Route::get('/doctor/appointments/{id}', [DoctorAppointmentsController::class, 'getAppointmentDetails']);
    Route::post('/doctor/appointments/{id}/cancel', [DoctorAppointmentsController::class, 'cancelAppointment']);

    // Doctor profile
    Route::get('/doctor/profile', [DoctorProfileController::class, 'show']);
    Route::put('/doctor/profile', [DoctorProfileController::class, 'update']);

    // Patient search (doctor & admin)
    Route::get('/patients/search', [PatientSearchController::class, 'search']);
    Route::get('/patients/{id}/overview', [PatientSearchController::class, 'overview']);

    // Doctor's medical records management
    Route::get('/doctor/patients/{patientId}/medical-records', [DoctorMedicalRecordController::class, 'getPatientRecords']);
    Route::post('/doctor/patients/{patientId}/medical-records', [DoctorMedicalRecordController::class, 'store']);
});
