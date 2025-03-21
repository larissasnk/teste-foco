<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\Pivot;

class VendaProduto extends Pivot
{
    use HasFactory;

    protected $table = 'venda_produto';
    protected $fillable = ['venda_id', 'produto_id', 'quantidade', 'preco_unitario', 'subtotal'];
}
