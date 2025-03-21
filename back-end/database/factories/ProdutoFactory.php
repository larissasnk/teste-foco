<?php

namespace Database\Factories;

use App\Models\Produto;
use App\Models\Estabelecimento;
use Illuminate\Database\Eloquent\Factories\Factory;

class ProdutoFactory extends Factory
{
    protected $model = Produto::class;

    public function definition()
    {
        return [
            'estabelecimento_id' => Estabelecimento::factory(),
            'nome' => $this->faker->word(),
            'preco' => $this->faker->randomFloat(2, 10, 100),
            'estoque' => $this->faker->numberBetween(1, 100),
        ];
    }
}
