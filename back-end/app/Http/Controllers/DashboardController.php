<?php

namespace App\Http\Controllers;

use App\Models\Venda;
use App\Models\Produto;
use App\Models\Estabelecimento;
use App\Models\ProdutoVenda;
use App\Models\VendaProduto;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class DashboardController extends Controller
{
    // Método que retorna os totais de vendas, produtos, estabelecimentos e produtos vendidos
    public function totais()
    {
        try {
            // Contagem dos totais
            $vendas = Venda::count(); // Contagem das vendas
            $produtos = Produto::count(); // Contagem dos produtos
            $estabelecimentos = Estabelecimento::count(); // Contagem dos estabelecimentos
            $produtosVendidos = VendaProduto::sum('quantidade'); // Somatório de produtos vendidos

            // Log para rastrear a recuperação dos totais
            Log::info('Totais de dashboard recuperados', [
                'vendas' => $vendas,
                'produtos' => $produtos,
                'estabelecimentos' => $estabelecimentos,
                'produtosVendidos' => $produtosVendidos
            ]);

            // Retorna os totais como resposta JSON
            return response()->json([
                'vendas' => $vendas,
                'produtos' => $produtos,
                'estabelecimentos' => $estabelecimentos,
                'produtosVendidos' => $produtosVendidos
            ]);
        } catch (\Exception $e) {
            // Log de erro em caso de falha na execução
            Log::error('Erro ao recuperar totais do dashboard', ['error' => $e->getMessage()]);
            return response()->json(['error' => 'Erro ao recuperar totais.'], 500);
        }
    }
}
