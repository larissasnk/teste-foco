<?php

namespace App\Http\Controllers;

use App\Models\Venda;
use App\Models\Produto;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class VendaController extends Controller
{
    public function index()
    {
        return response()->json(Venda::with('produtos')->get());
    }

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
            $venda = Venda::create([
                'estabelecimento_id' => $request->estabelecimento_id,
                'taxa' => $request->taxa ?? 0,
                'desconto' => $request->desconto ?? 0,
                'total' => 0,
            ]);

            $totalVenda = 0;
            foreach ($request->produtos as $item) {
                $produto = Produto::findOrFail($item['id']);
                $subtotal = $produto->preco * $item['quantidade'];
                $totalVenda += $subtotal;

                $venda->produtos()->attach($produto->id, [
                    'quantidade' => $item['quantidade'],
                    'preco_unitario' => $produto->preco,
                    'subtotal' => $subtotal,
                ]);
            }

            // Atualiza o total da venda considerando taxa e desconto
            $venda->update(['total' => ($totalVenda + $venda->taxa) - $venda->desconto]);

            DB::commit();
            return response()->json($venda->load('produtos'), 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function show($id)
    {
        return response()->json(Venda::with('produtos')->findOrFail($id));
    }

    public function update(Request $request, $id)
    {
        $venda = Venda::findOrFail($id); // Encontra a venda pelo ID
        $venda->update($request->only(['total', 'taxa', 'desconto'])); // Atualiza os dados

        // Se você estiver atualizando os produtos relacionados, pode fazer algo assim:
        if ($request->has('produtos')) {
            // Lógica para atualizar os produtos associados
        }

        return response()->json($venda, 200); // Retorna a venda atualizada
    }


    public function destroy($id)
    {
        Venda::findOrFail($id)->delete();
        return response()->json(null, 204);
    }
}
