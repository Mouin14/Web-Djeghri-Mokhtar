<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use App\Models\Appointment;

class UpdateAppointmentRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'patient_id' => 'sometimes|exists:malades,id',
            'doctor_id' => [
                'nullable',
                'exists:medecins,id',
                function ($attribute, $value, $fail) {
                    $status = $this->status ?? Appointment::find($this->route('id'))->status ?? null;
                    if ($status === 'confirmed' && empty($value)) {
                        $fail('Doctor is required for a confirmed appointment.');
                    }
                }
            ],
            'appointment_date' => 'nullable|date',
            'appointment_time' => 'nullable',
            'status' => 'sometimes|in:pending,confirmed,cancelled,completed',
            'reason' => 'sometimes|required|string|max:1000',
        ];
    }
}
