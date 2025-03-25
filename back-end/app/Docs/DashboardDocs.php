<?php

namespace App\Docs;

/**
 * @OA\Tag(
 *     name="Dashboard",
 *     description="Operações de dashboard e relatórios"
 * )
 */
class DashboardDocs
{
    /**
     * @OA\Get(
     *     path="/dashboard/totais",
     *     tags={"Dashboard"},
     *     summary="Obter totais do sistema",
     *     description="Retorna os totais de vendas, produtos, estabelecimentos e produtos vendidos",
     *     @OA\Response(
     *         response=200,
     *         description="Totais obtidos com sucesso",
     *         @OA\JsonContent(
     *             example={
     *                 "vendas": 42,
     *                 "produtos": 15,
     *                 "estabelecimentos": 3,
     *                 "produtosVendidos": 128
     *             }
     *         )
     *     ),
     *     @OA\Response(
     *         response=500,
     *         description="Erro interno do servidor",
     *         @OA\JsonContent(
     *             example={
     *                 "error": "Erro ao recuperar totais."
     *             }
     *         )
     *     )
     * )
     */
    public function totais() {}
}