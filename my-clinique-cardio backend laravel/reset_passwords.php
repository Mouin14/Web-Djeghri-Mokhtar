<?php
// Quick script to reset all user passwords to a known value
// Run: php reset_passwords.php

require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use App\Models\User;
use Illuminate\Support\Facades\Hash;

$users = User::all();
echo "Found " . $users->count() . " users\n\n";

foreach ($users as $user) {
    echo "ID: {$user->id} | Email: {$user->email} | Role: {$user->role}\n";
    
    // Reset password to 'password123' using direct DB update to avoid any casting/mutator
    \Illuminate\Support\Facades\DB::table('users')
        ->where('id', $user->id)
        ->update(['mot_de_passe' => Hash::make('password123')]);
    
    echo "  -> Password reset to 'password123'\n";
}

echo "\nDone! All passwords have been reset to: password123\n";
echo "You can now login with any user's email and password: password123\n";
