<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        Schema::create('produtos', function (Blueprint $table) {
            $table->id();
            $table->foreignId('estabelecimento_id')->constrained()->onDelete('cascade'); // Relacionamento com Estabelecimento
            $table->string('nome');
            $table->decimal('preco', 10, 2); // Preço do produto
            $table->integer('estoque')->default(0); // Controle de estoque
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('produtos');
    }
};
