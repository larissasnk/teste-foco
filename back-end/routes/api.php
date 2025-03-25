<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\EstabelecimentoController;
use App\Http\Controllers\ProdutoController;
use App\Http\Controllers\VendaController;
use App\Http\Controllers\VendaProdutoController;
use App\Http\Controllers\DashboardController;

// Produtos
Route::resource('produtos', ProdutoController::class);

// Estabelecimentos
Route::resource('estabelecimentos', EstabelecimentoController::class);

// Vendas
Route::resource('vendas', VendaController::class);

// Vendas -> Produtos
Route::prefix('vendas/{venda_id}')->group(function () {
    Route::post('produtos', [VendaProdutoController::class, 'adicionarProduto']);
    Route::put('produtos/{produto_id}', [VendaProdutoController::class, 'atualizarProduto']);
    Route::delete('produtos/{produto_id}', [VendaProdutoController::class, 'removerProduto']);
});

// Dashboard
Route::get('/dashboard/totais', [DashboardController::class, 'totais']);
