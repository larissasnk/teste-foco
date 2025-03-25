<?php

namespace App\Http\Controllers;

use App\Models\Estabelecimento;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class EstabelecimentoController extends Controller
{
    // Retorna todos os estabelecimentos cadastrados no banco de dados.
    public function index()
    {
        Log::info('Listando todos os estabelecimentos.');
        return response()->json(Estabelecimento::all());
    }

    // Cria um novo estabelecimento no banco com os dados enviados.
    public function store(Request $request)
    {
        $request->validate([
            'nome' => 'required|string|max:255',
            'endereco' => 'required|string|max:255',
        ]);

        Log::info('Criando novo estabelecimento com os dados:', $request->all());

        $estabelecimento = Estabelecimento::create($request->all());

        Log::info('Novo estabelecimento criado:', ['estabelecimento' => $estabelecimento]);

        return response()->json($estabelecimento, 201);
    }

    // Retorna um estabelecimento específico com base no ID fornecido.
    public function show($id)
    {
        Log::info('Consultando estabelecimento com ID:', ['id' => $id]);
        return response()->json(Estabelecimento::findOrFail($id));
    }

    // Atualiza as informações de um estabelecimento existente com base no ID.
    public function update(Request $request, $id)
    {
        // Validação dos dados de atualização recebidos.
        $validated = $request->validate([
            'nome' => 'required|string|max:255',
            'endereco' => 'required|string|max:255',
        ]);

        Log::info('Recebendo atualização de estabelecimento com ID:', ['id' => $id, 'dados' => $validated]);

        $estabelecimento = Estabelecimento::findOrFail($id);
        $estabelecimento->update($validated);

        Log::info('Estabelecimento atualizado com sucesso:', ['estabelecimento' => $estabelecimento]);

        return response()->json($estabelecimento);
    }

    // Remove um estabelecimento do banco de dados com base no ID.
    public function destroy($id)
    {
        Log::info('Removendo estabelecimento com ID:', ['id' => $id]);
        Estabelecimento::findOrFail($id)->delete();

        Log::info('Estabelecimento removido com sucesso.', ['id' => $id]);

        return response()->json(null, 204);
    }
}
