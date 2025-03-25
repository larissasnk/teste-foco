<?php

namespace App\Http\Controllers;

use App\Models\Venda;
use App\Models\Produto;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class VendaController extends Controller
{
    // Retorna todas as vendas com seus respectivos produtos.
    public function index()
    {
        Log::info('Listando todas as vendas com produtos.');
        return response()->json(Venda::with('produtos')->get());
    }

    // Cria uma nova venda com os produtos e calcula o total.
    public function store(Request $request)
    {
        $request->validate([
            'estabelecimento_id' => 'required|exists:estabelecimentos,id',
            'produtos' => 'required|array',
            'produtos.*.id' => 'required|exists:produtos,id',
            'produtos.*.quantidade' => 'required|integer|min:1',
            'taxa' => 'numeric|min:0',
            'desconto' => 'numeric|min:0',
        ]);
    
        DB::beginTransaction();
        try {
            // Cria a venda
            $venda = Venda::create([
                'estabelecimento_id' => $request->estabelecimento_id,
                'taxa' => $request->taxa ?? 0,
                'desconto' => $request->desconto ?? 0,
                'total' => 0,  // Inicializa o total com 0, ele será atualizado
            ]);

            Log::info('Venda criada com sucesso: ', ['venda' => $venda]);

            $totalVenda = 0;
            foreach ($request->produtos as $item) {
                $produto = Produto::findOrFail($item['id']);
    
                // Verifica se há estoque suficiente
                if ($produto->estoque < $item['quantidade']) {
                    DB::rollBack(); // Cancela a transação se não houver estoque
                    return response()->json(['error' => 'Estoque insuficiente para o produto: ' . $produto->nome], 400);
                }
    
                // Calcula o subtotal do produto
                $subtotal = $produto->preco * $item['quantidade'];
                $totalVenda += $subtotal;
    
                // Associa o produto à venda
                $venda->produtos()->attach($produto->id, [
                    'quantidade' => $item['quantidade'],
                    'preco_unitario' => $produto->preco,
                    'subtotal' => $subtotal,
                ]);
    
                // Atualiza o estoque do produto
                $produto->estoque -= $item['quantidade'];
                $produto->save();
            }
    
            // Calcula a taxa e o desconto
            $valorTaxa = ($totalVenda * $venda->taxa) / 100;
            $valorDesconto = ($totalVenda * $venda->desconto) / 100;
    
            // Atualiza o total da venda com a taxa e o desconto
            $venda->update(['total' => ($totalVenda + $valorTaxa - $valorDesconto)]);
    
            DB::commit();
            return response()->json($venda->load('produtos'), 201);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Erro ao criar venda: ', ['error' => $e->getMessage()]);
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
    
    // Retorna os detalhes de uma venda específica.
    public function show($id)
    {
        Log::info('Buscando venda pelo ID: ' . $id);
        return response()->json(Venda::with('produtos')->findOrFail($id));
    }

    // Atualiza uma venda existente (exemplo: total, taxa, desconto).
    public function update(Request $request, $id)
    {
        $venda = Venda::findOrFail($id); // Encontra a venda pelo ID
        $venda->update($request->only(['total', 'taxa', 'desconto'])); // Atualiza os dados

        Log::info('Venda atualizada: ', ['venda' => $venda]);

        // Se você estiver atualizando os produtos relacionados, pode fazer algo assim:
        if ($request->has('produtos')) {
            // Lógica para atualizar os produtos associados
        }

        return response()->json($venda, 200); // Retorna a venda atualizada
    }

    // Remove uma venda e seus produtos associados.
    public function destroy($id)
    {
        $venda = Venda::find($id);
    
        if (!$venda) {
            return response()->json(['error' => 'Venda não encontrada'], 404);
        }
    
        // Excluir os produtos associados à venda
        $venda->produtos()->detach();
        Log::info('Produtos removidos da venda: ', ['venda_id' => $id]);

        // Excluir a venda
        $venda->delete();
        Log::info('Venda excluída: ', ['venda_id' => $id]);
    
        return response()->json(['message' => 'Venda excluída com sucesso.'], 204);
    }
}

