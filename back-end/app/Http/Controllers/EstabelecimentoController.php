<?php

namespace App\Http\Controllers;

use App\Models\Estabelecimento;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;


class EstabelecimentoController extends Controller
{
    public function index()
    {
        return response()->json(Estabelecimento::all());
    }

    public function store(Request $request)
    {
        $request->validate([
            'nome' => 'required|string|max:255',
            'endereco' => 'required|string|max:255', // Validação do endereço
        ]);

        $estabelecimento = Estabelecimento::create($request->all());
        return response()->json($estabelecimento, 201);
    }

    public function show($id)
    {
        return response()->json(Estabelecimento::findOrFail($id));
    }

    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'nome' => 'required|string|max:255',
            'endereco' => 'required|string|max:255',
        ]);
    
        // Log para verificar os dados recebidos
        Log::info('Recebendo atualização:', $validated);
    
        $estabelecimento = Estabelecimento::findOrFail($id);
        $estabelecimento->update($validated);
    
        return response()->json($estabelecimento);
    }
    

    public function destroy($id)
    {
        Estabelecimento::findOrFail($id)->delete();
        return response()->json(null, 204);
    }
}
