<?php

namespace Tests\Unit;

use Tests\TestCase;
use App\Models\Estabelecimento;
use Illuminate\Foundation\Testing\RefreshDatabase;

class EstabelecimentoTest extends TestCase
{
    use RefreshDatabase;

    public function test_criar_estabelecimento()
    {
        $response = $this->postJson('/api/estabelecimentos', [
            'nome' => 'Loja ABC',
            'endereco' => 'Rua X, 123',
        ]);

        $response->assertStatus(201)
                 ->assertJson(['nome' => 'Loja ABC', 'endereco' => 'Rua X, 123']);
    }

    public function test_listar_estabelecimentos()
    {
        Estabelecimento::factory()->create(['nome' => 'Loja XYZ']);
        $response = $this->getJson('/api/estabelecimentos');

        $response->assertStatus(200)
                 ->assertJsonFragment(['nome' => 'Loja XYZ']);
    }

    public function test_visualizar_estabelecimento()
    {
        $estabelecimento = Estabelecimento::factory()->create();
        $response = $this->getJson("/api/estabelecimentos/{$estabelecimento->id}");

        $response->assertStatus(200)
                 ->assertJson(['id' => $estabelecimento->id]);
    }

    public function test_atualizar_estabelecimento()
    {
        $estabelecimento = Estabelecimento::factory()->create();
        $response = $this->putJson("/api/estabelecimentos/{$estabelecimento->id}", [
            'nome' => 'Loja Atualizada',
            'endereco' => 'Rua Atualizada, 456',
        ]);

        $response->assertStatus(200)
                 ->assertJson(['nome' => 'Loja Atualizada', 'endereco' => 'Rua Atualizada, 456']);
    }

    public function test_excluir_estabelecimento()
    {
        $estabelecimento = Estabelecimento::factory()->create();
        $response = $this->deleteJson("/api/estabelecimentos/{$estabelecimento->id}");

        $response->assertStatus(204);
        $this->assertDatabaseMissing('estabelecimentos', ['id' => $estabelecimento->id]);
    }
}
