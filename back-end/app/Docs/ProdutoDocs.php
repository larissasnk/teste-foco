<?php

namespace App\Docs;

/**
 * @OA\Tag(
 *     name="Produtos",
 *     description="Operações com produtos"
 * )
 */
class ProdutoDocs
{
    /**
     * @OA\Get(
     *     path="/produtos",
     *     tags={"Produtos"},
     *     summary="Listar todos os produtos",
     *     description="Retorna todos os produtos cadastrados",
     *     @OA\Response(
     *         response=200,
     *         description="Lista de produtos",
     *         @OA\JsonContent(
     *             example={
     *                 {
     *                     "id": 1,
     *                     "estabelecimento_id": 1,
     *                     "nome": "Notebook Dell",
     *                     "preco": 4599.90,
     *                     "estoque": 15,
     *                     "created_at": "2023-01-01T00:00:00.000000Z"
     *                 },
     *                 {
     *                     "id": 2,
     *                     "estabelecimento_id": 1,
     *                     "nome": "Mouse sem fio",
     *                     "preco": 89.90,
     *                     "estoque": 30,
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
     *     path="/produtos",
     *     tags={"Produtos"},
     *     summary="Criar novo produto",
     *     description="Cadastra um novo produto no sistema",
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"estabelecimento_id", "nome", "preco", "estoque"},
     *             @OA\Property(property="estabelecimento_id", type="integer", example=1),
     *             @OA\Property(property="nome", type="string", example="Teclado Mecânico"),
     *             @OA\Property(property="preco", type="number", format="float", example=199.90),
     *             @OA\Property(property="estoque", type="integer", example=20),
     *             @OA\Property(property="descricao", type="string", example="Teclado mecânico RGB", nullable=true)
     *         )
     *     ),
     *     @OA\Response(
     *         response=201,
     *         description="Produto criado com sucesso",
     *         @OA\JsonContent(
     *             example={
     *                 "id": 3,
     *                 "estabelecimento_id": 1,
     *                 "nome": "Teclado Mecânico",
     *                 "preco": 199.90,
     *                 "estoque": 20,
     *                 "descricao": "Teclado mecânico RGB",
     *                 "created_at": "2023-01-01T00:00:00.000000Z"
     *             }
     *         )
     *     ),
     *     @OA\Response(
     *         response=422,
     *         description="Dados inválidos"
     *     )
     * )
     */
    public function store() {}

    /**
     * @OA\Get(
     *     path="/produtos/{id}",
     *     tags={"Produtos"},
     *     summary="Obter detalhes de um produto",
     *     description="Retorna os detalhes de um produto específico",
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         description="ID do produto",
     *         example=1
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Detalhes do produto",
     *         @OA\JsonContent(
     *             example={
     *                 "id": 1,
     *                 "estabelecimento_id": 1,
     *                 "nome": "Notebook Dell",
     *                 "preco": 4599.90,
     *                 "estoque": 15,
     *                 "descricao": null,
     *                 "created_at": "2023-01-01T00:00:00.000000Z",
     *                 "updated_at": "2023-01-01T00:00:00.000000Z"
     *             }
     *         )
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Produto não encontrado"
     *     )
     * )
     */
    public function show() {}

    /**
     * @OA\Put(
     *     path="/produtos/{id}",
     *     tags={"Produtos"},
     *     summary="Atualizar produto",
     *     description="Atualiza os dados de um produto existente",
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         description="ID do produto",
     *         example=1
     *     ),
     *     @OA\RequestBody(
     *         required=true,
     *         description="Dados para atualização",
     *         @OA\JsonContent(
     *             @OA\Property(property="nome", type="string", example="Notebook Dell Atualizado"),
     *             @OA\Property(property="preco", type="number", format="float", example=3999.90),
     *             @OA\Property(property="estoque", type="integer", example=10),
     *             @OA\Property(property="descricao", type="string", example="Notebook Dell i5 16GB RAM", nullable=true)
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Produto atualizado",
     *         @OA\JsonContent(
     *             example={
     *                 "id": 1,
     *                 "estabelecimento_id": 1,
     *                 "nome": "Notebook Dell Atualizado",
     *                 "preco": 3999.90,
     *                 "estoque": 10,
     *                 "descricao": "Notebook Dell i5 16GB RAM",
     *                 "updated_at": "2023-01-02T00:00:00.000000Z"
     *             }
     *         )
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Produto não encontrado"
     *     )
     * )
     */
    public function update() {}

    /**
     * @OA\Delete(
     *     path="/produtos/{id}",
     *     tags={"Produtos"},
     *     summary="Remover produto",
     *     description="Remove um produto do sistema",
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         description="ID do produto",
     *         example=1
     *     ),
     *     @OA\Response(
     *         response=204,
     *         description="Produto removido"
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Produto não encontrado"
     *     )
     * )
     */
    public function destroy() {}
}