<?php

namespace App\Docs;

/**
 * @OA\Tag(
 *     name="VendaProdutos",
 *     description="Operações com produtos de vendas"
 * )
 */
class VendaProdutoDocs
{
    /**
     * @OA\Post(
     *     path="/vendas/{venda_id}/produtos",
     *     tags={"VendaProdutos"},
     *     summary="Adicionar produto à venda",
     *     description="Adiciona um produto a uma venda existente",
     *     @OA\Parameter(
     *         name="venda_id",
     *         in="path",
     *         required=true,
     *         description="ID da venda",
     *         example=1
     *     ),
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"produto_id", "quantidade"},
     *             @OA\Property(property="produto_id", type="integer", example=1),
     *             @OA\Property(property="quantidade", type="integer", example=2)
     *         )
     *     ),
     *     @OA\Response(
     *         response=201,
     *         description="Produto adicionado à venda",
     *         @OA\JsonContent(
     *             example={
     *                 "id": 1,
     *                 "estabelecimento_id": 1,
     *                 "total": 100.00,
     *                 "produtos": {
     *                     {
     *                         "id": 1,
     *                         "nome": "Produto A",
     *                         "pivot": {
     *                             "quantidade": 2,
     *                             "preco_unitario": 50.00,
     *                             "subtotal": 100.00
     *                         }
     *                     }
     *                 }
     *             }
     *         )
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Venda ou produto não encontrado"
     *     )
     * )
     */
    public function adicionarProduto() {}

    /**
     * @OA\Put(
     *     path="/vendas/{venda_id}/produtos/{produto_id}",
     *     tags={"VendaProdutos"},
     *     summary="Atualizar produto na venda",
     *     description="Atualiza a quantidade de um produto em uma venda",
     *     @OA\Parameter(
     *         name="venda_id",
     *         in="path",
     *         required=true,
     *         description="ID da venda",
     *         example=1
     *     ),
     *     @OA\Parameter(
     *         name="produto_id",
     *         in="path",
     *         required=true,
     *         description="ID do produto",
     *         example=1
     *     ),
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"quantidade"},
     *             @OA\Property(property="quantidade", type="integer", example=3)
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Produto atualizado na venda",
     *         @OA\JsonContent(
     *             example={
     *                 "id": 1,
     *                 "estabelecimento_id": 1,
     *                 "total": 150.00,
     *                 "produtos": {
     *                     {
     *                         "id": 1,
     *                         "nome": "Produto A",
     *                         "pivot": {
     *                             "quantidade": 3,
     *                             "preco_unitario": 50.00,
     *                             "subtotal": 150.00
     *                         }
     *                     }
     *                 }
     *             }
     *         )
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Venda ou produto não encontrado"
     *     )
     * )
     */
    public function atualizarProduto() {}

    /**
     * @OA\Delete(
     *     path="/vendas/{venda_id}/produtos/{produto_id}",
     *     tags={"VendaProdutos"},
     *     summary="Remover produto da venda",
     *     description="Remove um produto de uma venda existente",
     *     @OA\Parameter(
     *         name="venda_id",
     *         in="path",
     *         required=true,
     *         description="ID da venda",
     *         example=1
     *     ),
     *     @OA\Parameter(
     *         name="produto_id",
     *         in="path",
     *         required=true,
     *         description="ID do produto",
     *         example=1
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Produto removido da venda",
     *         @OA\JsonContent(
     *             example={
     *                 "id": 1,
     *                 "estabelecimento_id": 1,
     *                 "total": 0.00,
     *                 "produtos": {}
     *             }
     *         )
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Venda ou produto não encontrado"
     *     )
     * )
     */
    public function removerProduto() {}
}