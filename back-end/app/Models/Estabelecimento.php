<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Estabelecimento extends Model
{
    use HasFactory;

    protected $fillable = ['nome', 'endereco']; // Adicionado endereço

    public function produtos()
    {
        return $this->hasMany(Produto::class);
    }

    public function vendas()
    {
        return $this->hasMany(Venda::class);
    }
}
