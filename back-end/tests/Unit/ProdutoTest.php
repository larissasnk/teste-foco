<?php

// tests/Feature/ProdutoTest.php
namespace Tests\Feature;

use App\Models\Produto;
use App\Models\Estabelecimento;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ProdutoTest extends TestCase
{
    use RefreshDatabase;

    public function test_criar_produto()
    {
        $estabelecimento = Estabelecimento::factory()->create();

        $response = $this->postJson('/api/produtos', [
            'estabelecimento_id' => $estabelecimento->id,
            'nome' => 'Produto Teste',
            'preco' => 99.99,
            'estoque' => 50,
        ]);

        $response->assertStatus(201);
        $response->assertJson(['nome' => 'Produto Teste']);
    }

    public function test_listar_produtos()
    {
        Produto::factory()->count(3)->create();

        $response = $this->getJson('/api/produtos');

        $response->assertStatus(200);
        $response->assertJsonCount(3);
    }

    public function test_visualizar_produto()
    {
        $produto = Produto::factory()->create();

        $response = $this->getJson("/api/produtos/{$produto->id}");

        $response->assertStatus(200);
        $response->assertJson(['id' => $produto->id]);
    }

    public function test_atualizar_produto()
    {
        $produto = Produto::factory()->create();

        $response = $this->putJson("/api/produtos/{$produto->id}", [
            'nome' => 'Produto Atualizado',
            'preco' => 120.00,
            'estoque' => 100,
        ]);

        $response->assertStatus(200);
        $response->assertJson(['nome' => 'Produto Atualizado']);
    }

    public function test_excluir_produto()
    {
        $produto = Produto::factory()->create();

        $response = $this->deleteJson("/api/produtos/{$produto->id}");

        $response->assertStatus(204);
        $this->assertDatabaseMissing('produtos', ['id' => $produto->id]);
    }
}
