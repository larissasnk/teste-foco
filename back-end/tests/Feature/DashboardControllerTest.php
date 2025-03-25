<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class DashboardControllerTest extends TestCase
{
    use RefreshDatabase;

    public function testTotais()
    {
        // Criando dados fictícios para o teste
        \App\Models\Estabelecimento::factory()->count(3)->create();
        \App\Models\Produto::factory()->count(5)->create();
        \App\Models\Venda::factory()->count(2)->create();

        // Fazendo a requisição para o endpoint de totais
        $response = $this->getJson('/api/dashboard/totais');

        // Verifique se a resposta tem o status 200
        $response->assertStatus(200);

        // Verifique se os dados retornados estão com a estrutura correta
        $response->assertJsonStructure([
            'vendas',
            'produtos',
            'estabelecimentos',
            'produtosVendidos',
        ]);
    }
}
