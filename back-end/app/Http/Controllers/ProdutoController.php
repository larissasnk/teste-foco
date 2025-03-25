<?php

namespace App\Http\Controllers;

use App\Models\Produto;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class ProdutoController extends Controller
{
    // Retorna todos os produtos com seus respectivos estabelecimentos.
    public function index()
    {
        Log::info('Listando todos os produtos.');
        return response()->json(Produto::with('estabelecimento')->get());
    }

    // Cria um novo produto com os dados fornecidos.
    public function store(Request $request)
    {
        // Valida os dados recebidos.
        $request->validate([
            'estabelecimento_id' => 'required|exists:estabelecimentos,id',
            'nome' => 'required|string|max:255',
            'preco' => 'required|numeric|min:0',
            'estoque' => 'required|integer|min:0',
        ]);

        // Cria o produto e registra no log.
        $produto = Produto::create($request->all());
        Log::info('Produto criado com sucesso: ', ['produto' => $produto]);

        // Retorna o produto criado.
        return response()->json($produto, 201);
    }

    // Retorna um produto específico pelo ID.
    public function show($id)
    {
        Log::info('Buscando produto pelo ID: ' . $id);
        return response()->json(Produto::with('estabelecimento')->findOrFail($id));
    }

    // Atualiza os dados de um produto existente.
    public function update(Request $request, $id)
    {
        // Valida os dados de atualização.
        $request->validate([
            'nome' => 'string|max:255',
            'preco' => 'numeric|min:0',
            'estoque' => 'integer|min:0',
        ]);

        // Encontra o produto e o atualiza.
        $produto = Produto::findOrFail($id);
        $produto->update($request->all());

        // Registra no log a atualização do produto.
        Log::info('Produto atualizado: ', ['produto' => $produto]);

        return response()->json($produto);
    }

    // Remove um produto do banco.
    public function destroy($id)
    {
        // Deleta o produto e registra no log.
        $produto = Produto::findOrFail($id);
        $produto->delete();
        Log::info('Produto removido: ', ['produto' => $produto]);

        return response()->json(null, 204);
    }
}
