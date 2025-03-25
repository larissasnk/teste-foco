<?php

namespace App\Http\Controllers;

use App\Models\Venda;
use App\Models\Produto;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class VendaProdutoController extends Controller
{
    // Adiciona um produto à venda.
    public function adicionarProduto(Request $request, $venda_id)
    {
        $request->validate([
            'produto_id' => 'required|exists:produtos,id',
            'quantidade' => 'required|integer|min:1',
        ]);

        DB::beginTransaction();
        try {
            $venda = Venda::findOrFail($venda_id);
            $produto = Produto::findOrFail($request->produto_id);
            $subtotal = $produto->preco * $request->quantidade;

            Log::info('Adicionando produto à venda: ', ['venda_id' => $venda_id, 'produto_id' => $produto->id, 'quantidade' => $request->quantidade]);

            $venda->produtos()->attach($produto->id, [
                'quantidade' => $request->quantidade,
                'preco_unitario' => $produto->preco,
                'subtotal' => $subtotal,
            ]);

            // Atualiza o total da venda
            $venda->update(['total' => ($venda->total + $subtotal)]);

            DB::commit();
            return response()->json($venda->load('produtos'), 201);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Erro ao adicionar produto à venda: ', ['error' => $e->getMessage()]);
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    // Atualiza as informações de um produto na venda.
    public function atualizarProduto(Request $request, $venda_id, $produto_id)
    {
        $request->validate([
            'quantidade' => 'required|integer|min:1',
        ]);

        DB::beginTransaction();
        try {
            $venda = Venda::findOrFail($venda_id);
            $produto = Produto::findOrFail($produto_id);

            // Verifica se o produto já está na venda
            $produtoVenda = $venda->produtos()->where('produto_id', $produto_id)->first();
            if (!$produtoVenda) {
                return response()->json(['error' => 'Produto não encontrado na venda.'], 404);
            }

            // Atualiza subtotal e total da venda
            $subtotalAnterior = $produtoVenda->pivot->subtotal;
            $subtotalNovo = $produto->preco * $request->quantidade;
            $diferenca = $subtotalNovo - $subtotalAnterior;

            Log::info('Atualizando produto na venda: ', ['venda_id' => $venda_id, 'produto_id' => $produto_id, 'quantidade' => $request->quantidade]);

            $venda->produtos()->updateExistingPivot($produto_id, [
                'quantidade' => $request->quantidade,
                'subtotal' => $subtotalNovo,
            ]);

            $venda->update(['total' => ($venda->total + $diferenca)]);

            DB::commit();
            return response()->json($venda->load('produtos'));
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Erro ao atualizar produto na venda: ', ['error' => $e->getMessage()]);
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    // Remove um produto da venda.
    public function removerProduto($venda_id, $produto_id)
    {
        DB::beginTransaction();
        try {
            $venda = Venda::findOrFail($venda_id);
            $produtoVenda = $venda->produtos()->where('produto_id', $produto_id)->first();

            if (!$produtoVenda) {
                return response()->json(['error' => 'Produto não encontrado na venda.'], 404);
            }

            // Subtrai o subtotal do total da venda antes de remover o produto
            $subtotal = $produtoVenda->pivot->subtotal;
            $venda->update(['total' => ($venda->total - $subtotal)]);

            Log::info('Removendo produto da venda: ', ['venda_id' => $venda_id, 'produto_id' => $produto_id]);

            // Remove o produto da venda
            $venda->produtos()->detach($produto_id);

            DB::commit();
            return response()->json($venda->load('produtos'));
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Erro ao remover produto da venda: ', ['error' => $e->getMessage()]);
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}
