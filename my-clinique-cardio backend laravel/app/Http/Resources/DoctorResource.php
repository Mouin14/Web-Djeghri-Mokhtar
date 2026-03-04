<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class DoctorResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'user_id' => $this->utilisateur_id,
            'nom' => $this->user->nom ?? '',
            'prenom' => $this->user->prenom ?? '',
            'email' => $this->user->email ?? '',
            'full_name' => 'Dr. ' . ($this->user->prenom ?? '') . ' ' . ($this->user->nom ?? ''),
            'specialite' => $this->specialite,
            'telephone' => $this->telephone,
            'numero_ordre' => $this->numero_ordre,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
