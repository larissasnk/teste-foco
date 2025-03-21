<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        Schema::create('estabelecimentos', function (Blueprint $table) {
            $table->id();
            $table->string('nome');
            $table->string('endereco'); // Adicionado endereço
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('estabelecimentos');
    }
};
