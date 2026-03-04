<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('consultations', function (Blueprint $table) {
            $table->id();
            //Liens vers les rdv
            $table->foreignId('rendez_vous_id')->constrained('rendez_vous')->onDelete('cascade');
            $table->foreignId('medecin_id')->constrained('medecins')->cascadeOnDelete();
            $table->foreignId('malade_id')->constrained('malades')->cascadeOnDelete();
            //Date et heure de la consultation
            $table->date('date_consult')->nullable();
            $table->time('heure_consult')->nullable();
            //INfos medicales
            $table->text('motif')->nullable();
            $table->text('diagnostic')->nullable();
            $table->text('notes')->nullable();
            $table->text('prescription')->nullable();
            //statut éventuel(optionnel)
            $table->string('statut')->default('en attente');
            //Timestamps
            $table->timestamps();
            

            });
            
        

        }
        public function down() :void 
        {
            Shema::dropIFExists('consltations');
        }


        

        
        
    

    

 

   
 

 };
 

