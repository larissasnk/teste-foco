<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Venda extends Model
{
    use HasFactory;

    protected $fillable = ['estabelecimento_id', 'total', 'taxa', 'desconto'];

    public function estabelecimento()
    {
        return $this->belongsTo(Estabelecimento::class);
    }

    public function produtos()
    {
        return $this->belongsToMany(Produto::class, 'venda_produto')
            ->withPivot('quantidade', 'preco_unitario', 'subtotal')
            ->withTimestamps();
    }

    public function calcularTotal()
    {
        $subtotal = $this->produtos->sum('pivot.subtotal');
        $total = ($subtotal + $this->taxa) - $this->desconto;
        $this->update(['total' => $total]);
    }
}
