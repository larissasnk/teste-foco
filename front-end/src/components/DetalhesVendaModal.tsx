import React from "react";
import {FiX} from "react-icons/fi";
import axios from "axios";
import {FiTrash2, FiEdit2} from "react-icons/fi";

// Tipos para os dados da venda
interface DetalhesVendaModalProps {
  visivel: boolean;
  venda: {
    id: number;
    data: string;
    total: number;
    estabelecimento_id: number;
    produtos: Array<{
      id: number;
      nome: string;
      pivot: {
        quantidade: number;
        preco_unitario: number;
      };
    }>;
    taxa: number;
    desconto: number;
  };
  fecharModal: () => void;
  atualizarVendas: () => void;
}

const DetalhesVendaModal: React.FC<DetalhesVendaModalProps> = ({
  visivel,
  venda,
  fecharModal,
  atualizarVendas
}) => {
  // Não renderiza se não estiver visível
  if (!visivel) return null;

  // Formata data para o padrão brasileiro
  const formatarData = (dataString: string) => {
    const data = new Date(dataString);
    return data.toLocaleDateString('pt-BR');
  };

  // Formata valores para moeda brasileira
  const formatarMoeda = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  };

  // Calcula subtotal dos produtos
  const calcularSubtotal = () => {
    return venda.produtos.reduce((total, produto) => {
      return total + (produto.pivot.quantidade * produto.pivot.preco_unitario);
    }, 0);
  };

  // Exclui a venda
  const handleExcluir = async () => {
    if (!window.confirm("Tem certeza que deseja excluir esta venda?")) {
      console.log("Exclusão cancelada pelo usuário");
      return;
    }

    try {
      console.log(`Excluindo venda ID: ${venda.id}`);
      await axios.delete(`http://172.23.96.1:8989/api/vendas/${venda.id}`);
      console.log("Venda excluída com sucesso");
      
      atualizarVendas();
      fecharModal();
    } catch (error) {
      console.error("Erro ao excluir venda:", error);
    }
  };

  // Abre tela de edição
  const handleEditar = () => {
    console.log(`Editando venda ID: ${venda.id}`);
    fecharModal();
    // Navegação para edição seria implementada aqui
  };

  console.log(`Renderizando modal da venda ${venda.id}`);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Cabeçalho */}
        <div className="flex justify-between items-center p-4 border-b sticky top-0 bg-white z-10">
          <h2 className="text-2xl font-semibold text-gray-800">
            Detalhes da Venda #{venda.id}
          </h2>
          <button
            onClick={fecharModal}
            className="text-gray-500 hover:text-gray-700 transition-colors"
            aria-label="Fechar modal"
          >
            <FiX size={24} />
          </button>
        </div>

        {/* Corpo principal */}
        <div className="p-6">
          {/* Seção de informações */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-gray-700 mb-2">Informações</h3>
              <div className="space-y-2">
                <p><span className="font-medium">Data:</span> {formatarData(venda.data)}</p>
                <p><span className="font-medium">Estabelecimento:</span> {venda.estabelecimento_id}</p>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-gray-700 mb-2">Valores</h3>
              <div className="space-y-2">
                <p><span className="font-medium">Subtotal:</span> {formatarMoeda(calcularSubtotal())}</p>
                <p><span className="font-medium">Taxa:</span> {formatarMoeda(venda.taxa)}</p>
                <p><span className="font-medium">Desconto:</span> {formatarMoeda(venda.desconto)}</p>
                <p className="text-xl font-bold text-blue-600">
                  <span className="font-medium">Total:</span> {formatarMoeda(venda.total)}
                </p>
              </div>
            </div>
          </div>

          {/* Lista de produtos */}
          <div className="mb-8">
            <h3 className="text-lg font-medium text-gray-700 mb-4">Produtos</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="py-2 px-4 border-b text-left">Produto</th>
                    <th className="py-2 px-4 border-b text-center">Quantidade</th>
                    <th className="py-2 px-4 border-b text-right">Preço Unitário</th>
                    <th className="py-2 px-4 border-b text-right">Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {venda.produtos.map((produto) => (
                    <tr key={produto.id} className="hover:bg-gray-50">
                      <td className="py-3 px-4 border-b">{produto.nome}</td>
                      <td className="py-3 px-4 border-b text-center">{produto.pivot.quantidade}</td>
                      <td className="py-3 px-4 border-b text-right">{formatarMoeda(produto.pivot.preco_unitario)}</td>
                      <td className="py-3 px-4 border-b text-right">
                        {formatarMoeda(produto.pivot.quantidade * produto.pivot.preco_unitario)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Botões de ação */}
          <div className="flex justify-end space-x-4 pt-4 border-t">
            <button
              onClick={handleExcluir}
              className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <FiTrash2 className="mr-2" />
              Excluir Venda
            </button>
            <button
              onClick={handleEditar}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <FiEdit2 className="mr-2" />
              Editar Venda
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetalhesVendaModal;