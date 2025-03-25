import React, {useState, useEffect} from "react";
import axios from "axios";
import MenuLateral from "../components/MenuLateral";
import {Link} from "react-router-dom";
import {FiPlus, FiEdit2, FiTrash2} from "react-icons/fi";

interface Produto {
  id: number;
  nome: string;
  preco: number;
  estoque: number;
}

const GerenciarProdutos: React.FC = () => {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [carregando, setCarregando] = useState(false);
  const [mensagem, setMensagem] = useState("");

  const API_URL = "http://172.23.96.1:8989/api/produtos";

  // Carrega produtos ao montar componente
  useEffect(() => {
    console.log("Carregando lista de produtos");
    carregarProdutos();
  }, []);

  // Busca produtos na API
  const carregarProdutos = async () => {
    setCarregando(true);
    try {
      const response = await axios.get(API_URL);
      console.log("Produtos carregados:", response.data.length);
      setProdutos(response.data);
    } catch (error) {
      console.error("Erro ao carregar produtos:", error);
      setMensagem("Erro ao carregar produtos");
    } finally {
      setCarregando(false);
    }
  };

  // Remove produto da API e estado
  const excluirProduto = async (id: number) => {
    if (!window.confirm("Tem certeza que deseja excluir este produto?")) return;
    
    try {
      await axios.delete(`${API_URL}/${id}`);
      console.log(`Produto ${id} excluído`);
      setProdutos(produtos.filter(p => p.id !== id));
      setMensagem("Produto excluído com sucesso!");
    } catch (error) {
      console.error("Erro ao excluir produto:", error);
      setMensagem("Erro ao excluir produto");
    }
  };

  // Formata preço para moeda brasileira
  const formatarPreco = (preco: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0
    }).format(preco);
  };

  return (
    <div className="flex h-screen">
      <MenuLateral />

      <div className="flex-1 p-6 bg-gray-100 relative">
        {/* Cabeçalho */}
        <div className="flex justify-between items-center mb-6 bg-white p-4 rounded-lg shadow-lg">
          <div className="flex-1 text-center">
            <h2 className="text-3xl font-semibold text-gray-800 inline-block">Lista de Produtos</h2>
          </div>
          <Link to="/adicionar-produto">
            <button 
              className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700 transition duration-200"
              onClick={() => console.log("Navegando para adicionar produto")}
            >
              <FiPlus className="mr-2" />
              Adicionar
            </button>
          </Link>
        </div>

        {/* Mensagens */}
        {mensagem && (
          <div className={`mb-4 p-4 text-white rounded-lg text-center ${
            mensagem.includes("Erro") ? "bg-red-500" : "bg-green-500"
          }`}>
            {mensagem}
          </div>
        )}

        {/* Tabela */}
        <div className="overflow-x-auto bg-white shadow-lg rounded-lg">
          {carregando ? (
            <div className="w-full h-64 flex flex-col justify-center items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
              <p className="text-gray-600">Carregando...</p>
            </div>
          ) : (
            <table className="min-w-full table-auto">
              <thead className="bg-blue-600 text-white">
                <tr>
                  <th className="px-6 py-3 text-left">Nome</th>
                  <th className="px-6 py-3 text-left">Preço</th>
                  <th className="px-6 py-3 text-left">Estoque</th>
                  <th className="px-6 py-3 text-center">Ações</th>
                </tr>
              </thead>
              <tbody>
                {produtos.map(produto => (
                  <tr key={produto.id} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-4">{produto.nome}</td>
                    <td className="px-6 py-4">{formatarPreco(produto.preco)}</td>
                    <td className="px-6 py-4">{produto.estoque}</td>
                    <td className="px-6 py-4 text-center space-x-4">
                      <Link to={`/editar-produto/${produto.id}`}>
                        <button
                          className="p-2 text-blue-600 hover:text-white hover:bg-blue-600 rounded-md transition-colors duration-200 border border-blue-100 hover:border-blue-600"
                          title="Editar"
                          onClick={() => console.log(`Editando produto ${produto.id}`)}
                        >
                          <FiEdit2 size={18} />
                        </button>
                      </Link>
                      <button
                        onClick={() => excluirProduto(produto.id)}
                        className="p-2 text-red-600 hover:text-white hover:bg-red-600 rounded-md transition-colors duration-200 border border-red-100 hover:border-red-600"
                        title="Excluir"
                      >
                        <FiTrash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default GerenciarProdutos;