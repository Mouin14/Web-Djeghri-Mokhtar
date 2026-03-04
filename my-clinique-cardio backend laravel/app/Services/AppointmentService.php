<?php

namespace App\Services;

use App\Models\Appointment;
use Illuminate\Database\Eloquent\Collection;

class AppointmentService
{
    /**
     * Get all appointments with relations.
     */
    public function getAll(): Collection
    {
        return Appointment::with(['patient.user', 'doctor.user', 'images'])
            ->orderByRaw('appointment_date IS NULL')
            ->orderBy('appointment_date', 'desc')
            ->orderBy('appointment_time', 'desc')
            ->get();
    }

    /**
     * Create a new appointment.
     */
    public function create(array $data): Appointment
    {
        $this->ensureSlotAvailable($data);
        return Appointment::create($data);
    }

    /**
     * Update an existing appointment.
     */
    public function update(Appointment $rdv, array $data): bool
    {
        $this->ensureSlotAvailable($data, $rdv->id);
        return $rdv->update($data);
    }

    /**
     * Delete an appointment.
     */
    public function delete(Appointment $rdv): ?bool
    {
        return $rdv->delete();
    }

    /**
     * Ensure the doctor's time slot is not already taken.
     */
    protected function ensureSlotAvailable(array $data, ?int $excludeId = null): void
    {
        $medecinId = $data['doctor_id'] ?? null;
        $dateRdv = $data['appointment_date'] ?? null;
        $heureRdv = $data['appointment_time'] ?? null;

        if ($medecinId && $dateRdv && $heureRdv) {
            $exists = Appointment::query()
                ->when($excludeId, fn($q) => $q->where('id', '!=', $excludeId))
                ->where('doctor_id', $medecinId)
                ->whereDate('appointment_date', $dateRdv)
                ->where(function($query) use ($heureRdv) {
                    $query->where('appointment_time', $heureRdv)
                          ->orWhere('appointment_time', $heureRdv . ':00');
                })
                ->whereIn('status', ['pending', 'confirmed'])
                ->exists();

            if ($exists) {
                throw new \Exception('Ce créneau est déjà pris pour ce médecin', 409);
            }
        }
    }
}
