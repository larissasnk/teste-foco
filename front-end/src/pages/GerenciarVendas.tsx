import React, {useState, useEffect} from "react";
import axios from "axios";
import MenuLateral from "../components/MenuLateral";
import {Link} from "react-router-dom";
import {FiPlus, FiChevronRight, FiTrash2, FiEdit2} from "react-icons/fi";

// Tipos para os dados
interface Venda {
  id: number;
  total: number;
  taxa: number;
  desconto: number;
  estabelecimento_id: number;
  produtos: Array<{
    id: number;
    nome: string;
    pivot: {
      quantidade: number;
      preco_unitario: number;
    };
  }>;
}

const GerenciarVendas: React.FC = () => {
  // Estados do componente
  const [vendas, setVendas] = useState<Venda[]>([]);
  const [carregando, setCarregando] = useState(false);
  const [mensagem, setMensagem] = useState("");
  const [vendaSelecionada, setVendaSelecionada] = useState<Venda | null>(null);
  const [estabelecimentos, setEstabelecimentos] = useState<Record<number, string>>({});

  const API_URL = "http://172.23.96.1:8989/api/vendas";

  // Carrega vendas ao montar o componente
  useEffect(() => {
    console.log("Carregando lista de vendas...");
    carregarVendas();
  }, []);

  // Busca vendas e estabelecimentos
  const carregarVendas = async () => {
    setCarregando(true);
    try {
      const response = await axios.get(API_URL);
      console.log(`Vendas carregadas: ${response.data.length}`);
      setVendas(response.data);

      // Carrega nomes dos estabelecimentos
      const estabelecimentosMap: Record<number, string> = {};
      for (const venda of response.data) {
        if (!estabelecimentosMap[venda.estabelecimento_id]) {
          const estabelecimentoResponse = await axios.get(
            `http://172.23.96.1:8989/api/estabelecimentos/${venda.estabelecimento_id}`
          );
          estabelecimentosMap[venda.estabelecimento_id] = estabelecimentoResponse.data.nome;
        }
      }
      setEstabelecimentos(estabelecimentosMap);
    } catch (error) {
      console.error("Erro ao carregar vendas:", error);
      setMensagem("Erro ao carregar vendas");
    } finally {
      setCarregando(false);
    }
  };

  // Remove venda
  const excluirVenda = async (id: number) => {
    if (!window.confirm("Tem certeza que deseja excluir esta venda?")) {
      console.log("Exclusão cancelada pelo usuário");
      return;
    }

    try {
      console.log(`Excluindo venda ID: ${id}`);
      await axios.delete(`${API_URL}/${id}`);
      setVendas(vendas.filter(v => v.id !== id));
      setMensagem("Venda excluída com sucesso!");
    } catch (error) {
      console.error("Erro ao excluir venda:", error);
      setMensagem("Erro ao excluir venda");
    }
  };

  // Formata preço para BRL
  const formatarPreco = (preco: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 2
    }).format(preco);
  };

  // Controle do modal de detalhes
  const abrirDetalhesVenda = (venda: Venda) => {
    console.log(`Abrindo detalhes da venda ${venda.id}`);
    setVendaSelecionada(venda);
  };

  const fecharDetalhesVenda = () => {
    console.log("Fechando detalhes da venda");
    setVendaSelecionada(null);
  };

  return (
    <div className="flex h-screen">
      <MenuLateral />

      <div className="flex-1 p-6 bg-gray-100 relative">
        {/* Cabeçalho */}
        <div className="flex justify-between items-center mb-6 bg-white p-4 rounded-lg shadow-lg">
          <div className="flex-1 text-center">
            <h2 className="text-3xl font-semibold text-gray-800 inline-block">Gerenciar Vendas</h2>
          </div>
          <Link to="/realizar-venda">
            <button 
              className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700 transition duration-200"
              onClick={() => console.log("Navegando para realizar venda")}
            >
              <FiPlus className="mr-2" />
              Adicionar
            </button>
          </Link>
        </div>

        {/* Mensagens de feedback */}
        {mensagem && (
          <div className={`mb-4 p-4 text-white rounded-lg text-center ${
            mensagem.includes("Erro") ? "bg-red-500" : "bg-green-500"
          }`}>
            {mensagem}
          </div>
        )}

        {/* Lista de Vendas */}
        <div className="space-y-4">
          {carregando ? (
            <div className="w-full h-64 flex flex-col justify-center items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
              <p className="text-gray-600">Carregando...</p>
            </div>
          ) : vendas.length > 0 ? (
            vendas.map(venda => (
              <div
                key={venda.id}
                className="bg-white p-5 rounded-lg shadow-md border-l-4 border-blue-600 hover:shadow-lg transition-shadow duration-200 cursor-pointer"
                onClick={() => abrirDetalhesVenda(venda)}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-bold text-blue-600">Venda #{venda.id}</h3>
                    <p className="text-gray-600">{estabelecimentos[venda.estabelecimento_id] || "Carregando..."}</p>
                  </div>
                  <div className="flex items-center">
                    <span className="text-lg font-bold mr-4">{formatarPreco(venda.total)}</span>
                    <FiChevronRight className="text-blue-600 text-xl" />
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white p-8 rounded-lg shadow-md text-center">
              <p className="text-gray-600">Nenhuma venda encontrada.</p>
            </div>
          )}
        </div>

        {/* Modal de Detalhes */}
        {vendaSelecionada && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-2xl font-bold text-blue-600">Venda #{vendaSelecionada.id}</h3>
                    <p className="text-gray-600 text-lg">
                      {estabelecimentos[vendaSelecionada.estabelecimento_id] || "Carregando..."}
                    </p>
                  </div>
                  <button 
                    onClick={fecharDetalhesVenda} 
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ✕
                  </button>
                </div>

                {/* Lista de produtos */}
                <div className="border-t border-b border-gray-200 py-4 my-4 max-h-[50vh] overflow-y-auto">
                  <h4 className="font-bold text-lg mb-3 text-center">Produtos</h4>
                  {vendaSelecionada.produtos.map(produto => (
                    <div
                      key={produto.id}
                      className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0"
                    >
                      <div>
                        <p className="font-medium">{produto.nome}</p>
                        <p className="text-sm text-gray-500">Qtd: {produto.pivot.quantidade}</p>
                      </div>
                      <p className="font-bold text-green-600">{formatarPreco(produto.pivot.preco_unitario)}</p>
                    </div>
                  ))}
                </div>

                {/* Resumo financeiro */}
                <div className="space-y-2 mb-6">
                  <div className="flex justify-between">
                    <span>Taxa:</span>
                    <span className="font-bold">{vendaSelecionada.taxa}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Desconto:</span>
                    <span className="font-bold">{vendaSelecionada.desconto}%</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold pt-2 border-t border-gray-200">
                    <span>Total:</span>
                    <span className="text-green-600">{formatarPreco(vendaSelecionada.total)}</span>
                  </div>
                </div>

                {/* Botões de ação */}
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => excluirVenda(vendaSelecionada.id)}
                    className="flex items-center bg-red-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-red-700 transition duration-200"
                  >
                    <FiTrash2 className="mr-2" />
                    Excluir
                  </button>

                  <Link
                    to={`/realizar-venda/${vendaSelecionada.id}`}
                    state={{
                      venda: {
                        ...vendaSelecionada,
                        produtos: vendaSelecionada.produtos.map(p => ({
                          id: p.id,
                          nome: p.nome,
                          preco: p.pivot.preco_unitario,
                          quantidade: p.pivot.quantidade
                        }))
                      }
                    }}
                    className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700 transition duration-200"
                  >
                    <FiEdit2 className="mr-2" />
                    Editar
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GerenciarVendas;