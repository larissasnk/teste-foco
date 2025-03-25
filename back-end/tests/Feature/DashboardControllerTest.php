<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class DashboardControllerTest extends TestCase
{
    use RefreshDatabase;

    public function testTotais()
    {
        \App\Models\Estabelecimento::factory()->count(3)->create();
        \App\Models\Produto::factory()->count(5)->create();
        \App\Models\Venda::factory()->count(2)->create();

        $response = $this->getJson('/api/dashboard/totais');

        $response->assertStatus(200);

        $response->assertJsonStructure([
            'vendas',
            'produtos',
            'estabelecimentos',
            'produtosVendidos',
        ]);
    }
}
