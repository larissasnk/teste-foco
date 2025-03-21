<?php

namespace Tests\Feature;

use App\Models\Venda;
use App\Models\Produto;
use App\Models\Estabelecimento;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class VendaTest extends TestCase
{
    use RefreshDatabase;

    public function test_criar_venda()
    {
        $estabelecimento = Estabelecimento::factory()->create(); // Criando um estabelecimento
        $produto = Produto::factory()->create(['preco' => 30]); // Criando um produto com preço
    
        $response = $this->postJson("/api/vendas", [
            'estabelecimento_id' => $estabelecimento->id,
            'produtos' => [
                [
                    'id' => $produto->id,
                    'quantidade' => 2, // Quantidade de 2 para o produto
                ]
            ],
            'taxa' => 5,
            'desconto' => 0,
        ]);
    
        $response->assertStatus(201);
        
        // Agora verificamos o valor calculado do total, considerando taxa e desconto
        $this->assertDatabaseHas('vendas', [
            'estabelecimento_id' => $estabelecimento->id,
            'taxa' => 5,
            'desconto' => 0,
        ]);
    
        // Verifique se o total foi calculado corretamente (Produto * Quantidade + Taxa - Desconto)
        $totalEsperado = (30 * 2) + 5; // Produto de 30, quantidade de 2, e taxa de 5
        $response->assertJsonFragment([
            'total' => $totalEsperado,
        ]);
    }
    
    

    public function test_listar_vendas()
    {
        $venda = Venda::factory()->create(); // Criando uma venda

        $response = $this->getJson("/api/vendas");

        $response->assertStatus(200);
        $response->assertJsonFragment([
            'id' => $venda->id,
        ]);
    }

    public function test_atualizar_venda()
    {
        $venda = Venda::factory()->create(); // Criando uma venda

        $response = $this->putJson("/api/vendas/{$venda->id}", [
            'total' => 100,
            'taxa' => 10,
            'desconto' => 5,
        ]);

        $response->assertStatus(200);
        $this->assertDatabaseHas('vendas', [
            'id' => $venda->id,
            'total' => 100,
            'taxa' => 10,
            'desconto' => 5,
        ]);
    }

    public function test_deletar_venda()
    {
        $venda = Venda::factory()->create(); // Criando uma venda
    
        $response = $this->deleteJson("/api/vendas/{$venda->id}");
    
        // Mudança do status esperado para 204
        $response->assertStatus(204);
    
        $this->assertDatabaseMissing('vendas', [
            'id' => $venda->id,
        ]);
    }

    public function test_adicionar_produto_na_venda()
    {
        $venda = Venda::factory()->create(); // Criação de uma venda usando o factory
        $produto = Produto::factory()->create(); // Criação de um produto usando o factory

        $response = $this->postJson("/api/vendas/{$venda->id}/produtos", [
            'produto_id' => $produto->id,
            'quantidade' => 2,
        ]);

        $response->assertStatus(201);
        $this->assertDatabaseHas('venda_produto', [
            'venda_id' => $venda->id,
            'produto_id' => $produto->id,
            'quantidade' => 2,
        ]);
    }

    public function test_atualizar_produto_na_venda()
    {
        $venda = Venda::factory()->create(); // Criação de uma venda usando o factory
        $produto = Produto::factory()->create(); // Criação de um produto usando o factory

        // Adiciona o produto inicialmente
        $venda->produtos()->attach($produto->id, [
            'quantidade' => 2,
            'preco_unitario' => $produto->preco,
            'subtotal' => $produto->preco * 2,
        ]);

        // Atualiza a quantidade do produto
        $response = $this->putJson("/api/vendas/{$venda->id}/produtos/{$produto->id}", [
            'quantidade' => 3,
        ]);

        $response->assertStatus(200);
        $this->assertDatabaseHas('venda_produto', [
            'venda_id' => $venda->id,
            'produto_id' => $produto->id,
            'quantidade' => 3,
        ]);
    }

    public function test_remover_produto_da_venda()
    {
        $venda = Venda::factory()->create(); // Criação de uma venda usando o factory
        $produto = Produto::factory()->create(); // Criação de um produto usando o factory

        // Adiciona o produto inicialmente
        $venda->produtos()->attach($produto->id, [
            'quantidade' => 2,
            'preco_unitario' => $produto->preco,
            'subtotal' => $produto->preco * 2,
        ]);

        // Remove o produto
        $response = $this->deleteJson("/api/vendas/{$venda->id}/produtos/{$produto->id}");

        $response->assertStatus(200);
        $this->assertDatabaseMissing('venda_produto', [
            'venda_id' => $venda->id,
            'produto_id' => $produto->id,
        ]);
    }
}
