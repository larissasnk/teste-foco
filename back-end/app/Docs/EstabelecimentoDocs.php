<?php

namespace App\Docs;

/**
 * @OA\Tag(
 *     name="Estabelecimentos",
 *     description="Operações com estabelecimentos"
 * )
 */
class EstabelecimentoDocs
{
    /**
     * @OA\Get(
     *     path="/estabelecimentos",
     *     tags={"Estabelecimentos"},
     *     summary="Listar todos os estabelecimentos",
     *     description="Retorna todos os estabelecimentos cadastrados",
     *     @OA\Response(
     *         response=200,
     *         description="Lista de estabelecimentos",
     *         @OA\JsonContent(
     *             example={
     *                 {
     *                     "id": 1,
     *                     "nome": "Restaurante do Zé",
     *                     "endereco": "Rua das Flores, 123",
     *                     "created_at": "2023-01-01T00:00:00.000000Z"
     *                 },
     *                 {
     *                     "id": 2,
     *                     "nome": "Mercado Bom Preço",
     *                     "endereco": "Avenida Principal, 456",
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
     *     path="/estabelecimentos",
     *     tags={"Estabelecimentos"},
     *     summary="Criar novo estabelecimento",
     *     description="Cadastra um novo estabelecimento no sistema",
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"nome", "endereco"},
     *             @OA\Property(property="nome", type="string", example="Loja de Eletrônicos"),
     *             @OA\Property(property="endereco", type="string", example="Rua Tecnológica, 789")
     *         )
     *     ),
     *     @OA\Response(
     *         response=201,
     *         description="Estabelecimento criado com sucesso",
     *         @OA\JsonContent(
     *             example={
     *                 "id": 3,
     *                 "nome": "Loja de Eletrônicos",
     *                 "endereco": "Rua Tecnológica, 789",
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
     *     path="/estabelecimentos/{id}",
     *     tags={"Estabelecimentos"},
     *     summary="Obter detalhes de um estabelecimento",
     *     description="Retorna os detalhes de um estabelecimento específico",
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         description="ID do estabelecimento",
     *         example=1
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Detalhes do estabelecimento",
     *         @OA\JsonContent(
     *             example={
     *                 "id": 1,
     *                 "nome": "Restaurante do Zé",
     *                 "endereco": "Rua das Flores, 123",
     *                 "created_at": "2023-01-01T00:00:00.000000Z",
     *                 "updated_at": "2023-01-01T00:00:00.000000Z"
     *             }
     *         )
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Estabelecimento não encontrado"
     *     )
     * )
     */
    public function show() {}

    /**
     * @OA\Put(
     *     path="/estabelecimentos/{id}",
     *     tags={"Estabelecimentos"},
     *     summary="Atualizar estabelecimento",
     *     description="Atualiza os dados de um estabelecimento existente",
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         description="ID do estabelecimento",
     *         example=1
     *     ),
     *     @OA\RequestBody(
     *         required=true,
     *         description="Dados para atualização",
     *         @OA\JsonContent(
     *             @OA\Property(property="nome", type="string", example="Restaurante do Zé Atualizado"),
     *             @OA\Property(property="endereco", type="string", example="Rua das Flores, 123 - Novo Endereço")
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Estabelecimento atualizado",
     *         @OA\JsonContent(
     *             example={
     *                 "id": 1,
     *                 "nome": "Restaurante do Zé Atualizado",
     *                 "endereco": "Rua das Flores, 123 - Novo Endereço",
     *                 "updated_at": "2023-01-02T00:00:00.000000Z"
     *             }
     *         )
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Estabelecimento não encontrado"
     *     )
     * )
     */
    public function update() {}

    /**
     * @OA\Delete(
     *     path="/estabelecimentos/{id}",
     *     tags={"Estabelecimentos"},
     *     summary="Remover estabelecimento",
     *     description="Remove um estabelecimento do sistema",
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         description="ID do estabelecimento",
     *         example=1
     *     ),
     *     @OA\Response(
     *         response=204,
     *         description="Estabelecimento removido"
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Estabelecimento não encontrado"
     *     )
     * )
     */
    public function destroy() {}
}