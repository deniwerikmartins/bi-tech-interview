<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('patients', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('cpf', 14)->unique();
            $table->string('rg', 12);
            $table->date('birth_date');
            $table->enum('biological_sex', ['Masculino', 'Feminino', 'Outro']);
            $table->string('phone', 20);
            $table->string('email')->nullable();
            $table->text('description')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('patients');
    }
};
