<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use App\Http\Resources\AppointmentImageResource;

class AppointmentResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id'                  => $this->id,
            'patient_id'          => $this->patient_id,
            'doctor_id'           => $this->doctor_id,
            'patient_last_name'   => $this->patient->user->nom    ?? '',
            'patient_first_name'  => $this->patient->user->prenom ?? '',
            // Always include contact info (patient views their own data; doctors see it on detail)
            'patient_email'       => $this->patient->user->email   ?? '',
            'patient_phone'       => $this->patient->telephone      ?? '',
            'doctor_last_name'    => $this->doctor ? $this->doctor->user->nom    : 'Not assigned',
            'doctor_first_name'   => $this->doctor ? $this->doctor->user->prenom : '',
            'doctor_specialty'    => $this->doctor ? $this->doctor->specialite   : '',
            'appointment_date'    => $this->appointment_date,
            'appointment_time'    => $this->appointment_time,
            'type'                => $this->type,
            'status'              => $this->status,
            'reason'              => $this->reason,
            'cancellation_reason' => $this->cancellation_reason,
            // images_count: only when the images relation was eager-loaded
            'images_count'        => $this->whenLoaded('images', fn() => $this->images->count()),
            'images'              => AppointmentImageResource::collection($this->whenLoaded('images')),
            // records: only populated when the controller eager-loaded patient.medicalRecords
            // (the show() endpoint does this; the index() endpoint intentionally omits it for performance)
            'records'             => $this->whenLoaded('patient', function () {
                if ($this->patient->relationLoaded('medicalRecords')) {
                    return $this->patient->medicalRecords->map(fn($record) => [
                        'id'                 => $record->id,
                        'notes'              => $record->notes,
                        'created_at'         => $record->created_at->format('d/m/Y H:i'),
                        'doctor_first_name'  => $record->doctor->user->prenom ?? '',
                        'doctor_last_name'   => $record->doctor->user->nom    ?? '',
                        'attachments'        => $record->attachments ?? [],
                    ]);
                }
                return [];
            }),
            'created_at'          => $this->created_at?->format('d/m/Y H:i'),
            'updated_at'          => $this->updated_at,
        ];
    }
}

