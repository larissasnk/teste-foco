<?php

namespace Database\Factories;

use App\Models\Venda;
use App\Models\Estabelecimento;
use Illuminate\Database\Eloquent\Factories\Factory;

class VendaFactory extends Factory
{
    protected $model = Venda::class;

    public function definition()
    {
        return [
            'estabelecimento_id' => Estabelecimento::factory(),
            'total' => 0,
            'taxa' => $this->faker->randomFloat(2, 0, 5),
            'desconto' => $this->faker->randomFloat(2, 0, 5),
        ];
    }
}
