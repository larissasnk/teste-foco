<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Produto extends Model
{
    use HasFactory;

    protected $fillable = ['estabelecimento_id', 'nome', 'preco', 'estoque']; // Adicionando estoque

    public function estabelecimento()
    {
        return $this->belongsTo(Estabelecimento::class);
    }
}
