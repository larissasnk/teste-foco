<?php

namespace App\Http\Controllers;

use App\Models\Produto;
use Illuminate\Http\Request;

class ProdutoController extends Controller
{
    public function index()
    {
        return response()->json(Produto::with('estabelecimento')->get());
    }

    public function store(Request $request)
    {
        $request->validate([
            'estabelecimento_id' => 'required|exists:estabelecimentos,id',
            'nome' => 'required|string|max:255',
            'preco' => 'required|numeric|min:0',
            'estoque' => 'required|integer|min:0', // Validação do estoque
        ]);

        $produto = Produto::create($request->all());
        return response()->json($produto, 201);
    }

    public function show($id)
    {
        return response()->json(Produto::with('estabelecimento')->findOrFail($id));
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'nome' => 'string|max:255',
            'preco' => 'numeric|min:0',
            'estoque' => 'integer|min:0',
        ]);

        $produto = Produto::findOrFail($id);
        $produto->update($request->all());
        return response()->json($produto);
    }

    public function destroy($id)
    {
        Produto::findOrFail($id)->delete();
        return response()->json(null, 204);
    }
}
