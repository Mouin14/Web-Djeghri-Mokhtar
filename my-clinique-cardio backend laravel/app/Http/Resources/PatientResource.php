<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PatientResource extends JsonResource
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
            'full_name' => ($this->user->nom ?? '') . ' ' . ($this->user->prenom ?? ''),
            'date_naissance' => $this->date_naissance,
            'sexe' => $this->sexe,
            'telephone' => $this->telephone,
            'adresse' => $this->adresse,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
