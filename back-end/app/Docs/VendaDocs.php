<?php

namespace App\Docs;

/**
 * @OA\Tag(
 *     name="Vendas",
 *     description="Operações com vendas"
 * )
 */
class VendaDocs
{
    /**
     * @OA\Get(
     *     path="/vendas",
     *     tags={"Vendas"},
     *     summary="Listar todas as vendas",
     *     @OA\Response(
     *         response=200,
     *         description="OK",
     *         @OA\JsonContent(
     *             example={
     *                 {
     *                     "id": 1,
     *                     "estabelecimento_id": 1,
     *                     "total": 150.50,
     *                     "created_at": "2023-01-01T00:00:00.000000Z"
     *                 }
     *             }
     *         )
     *     )
     * )
     */
    public function index() {}

    /**
     * @OA\Post(
     *     path="/vendas",
     *     tags={"Vendas"},
     *     summary="Criar nova venda",
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             example={
     *                 "estabelecimento_id": 1,
     *                 "produtos": {
     *                     {"id": 1, "quantidade": 2},
     *                     {"id": 2, "quantidade": 1}
     *                 }
     *             }
     *         )
     *     ),
     *     @OA\Response(
     *         response=201,
     *         description="Venda criada",
     *         @OA\JsonContent(
     *             example={
     *                 "id": 1,
     *                 "estabelecimento_id": 1,
     *                 "total": 150.50,
     *                 "created_at": "2023-01-01T00:00:00.000000Z"
     *             }
     *         )
     *     )
     * )
     */
    public function store() {}

    /**
     * @OA\Get(
     *     path="/vendas/{id}",
     *     tags={"Vendas"},
     *     summary="Obter venda específica",
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         example=1
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="OK",
     *         @OA\JsonContent(
     *             example={
     *                 "id": 1,
     *                 "estabelecimento_id": 1,
     *                 "total": 150.50,
     *                 "created_at": "2023-01-01T00:00:00.000000Z",
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
     *     )
     * )
     */
    public function show() {}

    /**
     * @OA\Put(
     *     path="/vendas/{id}",
     *     tags={"Vendas"},
     *     summary="Atualizar venda",
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         example=1
     *     ),
     *     @OA\RequestBody(
     *         @OA\JsonContent(
     *             example={
     *                 "total": 160.00,
     *                 "taxa": 10,
     *                 "desconto": 5
     *             }
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Venda atualizada",
     *         @OA\JsonContent(
     *             example={
     *                 "id": 1,
     *                 "estabelecimento_id": 1,
     *                 "total": 160.00,
     *                 "taxa": 10,
     *                 "desconto": 5,
     *                 "updated_at": "2023-01-02T00:00:00.000000Z"
     *             }
     *         )
     *     )
     * )
     */
    public function update() {}

    /**
     * @OA\Delete(
     *     path="/vendas/{id}",
     *     tags={"Vendas"},
     *     summary="Remover venda",
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         example=1
     *     ),
     *     @OA\Response(
     *         response=204,
     *         description="Venda removida"
     *     )
     * )
     */
    public function destroy() {}
}