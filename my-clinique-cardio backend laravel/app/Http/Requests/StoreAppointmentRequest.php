<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreAppointmentRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true; // Logic can be added here once auth is integrated
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'patient_id' => 'required|exists:malades,id',
            'doctor_id' => [
                'required_if:status,confirmed',
                'nullable',
                'exists:medecins,id',
            ],
            'appointment_date' => [
                'required_if:status,confirmed',
                'nullable',
                'date',
            ],
            'appointment_time' => [
                'required_if:status,confirmed',
                'nullable',
            ],
            'status' => 'required|in:pending,confirmed,cancelled,completed',
            'reason' => 'required|string|max:1000',
        ];
    }
}
