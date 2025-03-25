import React, {useState, useEffect} from "react";
import axios from "axios";
import MenuLateral from "../components/MenuLateral";
import {Link} from "react-router-dom";
import {FiPlus, FiEdit2, FiTrash2} from "react-icons/fi";

// Interface para os dados de um estabelecimento
interface Estabelecimento {
  id: number;
  nome: string;
  endereco: string;
}

const GerenciarEstabelecimento: React.FC = () => {
  const [dadosEstabelecimentos, setDadosEstabelecimentos] = useState<Estabelecimento[]>([]);
  const [carregando, setCarregando] = useState<boolean>(false);
  const [mensagem, setMensagem] = useState<string>("");

  const API_URL = "http://172.23.96.1:8989/api/estabelecimentos";

  // Função para buscar os dados dos estabelecimentos
  useEffect(() => {
    console.log("Componente GerenciarEstabelecimento montado - iniciando busca de dados");
    fetchEstabelecimentos();
  }, []);

  // Função principal para buscar os dados dos estabelecimentos
  const fetchEstabelecimentos = async () => {
    console.log("Iniciando fetchEstabelecimentos");
    setCarregando(true);
    try {
      console.log(`Fazendo requisição GET para: ${API_URL}`);
      const response = await axios.get(API_URL);
      console.log("Resposta recebida:", response.data);
      setDadosEstabelecimentos(response.data);
      console.log(`Total de estabelecimentos carregados: ${response.data.length}`);
    } catch (error) {
      console.error("Erro ao buscar estabelecimentos:", error);
      setMensagem("Erro ao carregar dados");
    } finally {
      console.log("Finalizando fetchEstabelecimentos");
      setCarregando(false);
    }
  };

   // Função para excluir um estabelecimento
  const excluirEstabelecimento = async (id: number) => {
    console.log(`Iniciando exclusão do estabelecimento ID: ${id}`);
    const confirmar = window.confirm("Tem certeza que deseja excluir este estabelecimento?");
    
    if (confirmar) {
      try {
        console.log(`Confirmada exclusão - fazendo requisição DELETE para: ${API_URL}/${id}`);
        await axios.delete(`${API_URL}/${id}`);
        console.log(`Estabelecimento ID: ${id} excluído com sucesso`);
        fetchEstabelecimentos();
        setMensagem("Estabelecimento excluído com sucesso!");
      } catch (error) {
        console.error(`Erro ao excluir estabelecimento ID: ${id}`, error);
        setMensagem("Erro ao excluir estabelecimento");
      }
    } else {
      console.log("Exclusão cancelada pelo usuário");
    }
  };

  // Log quando os dados dos estabelecimentos são atualizados
  useEffect(() => {
    if (dadosEstabelecimentos.length > 0) {
      console.log("Dados dos estabelecimentos atualizados:", dadosEstabelecimentos);
    }
  }, [dadosEstabelecimentos]);

  // Log quando a mensagem de estado é atualizada
  useEffect(() => {
    if (mensagem) {
      console.log("Mensagem atualizada:", mensagem);
    }
  }, [mensagem]);

  return (
    <div className="flex h-screen">
      <MenuLateral />

      <div className="flex-1 p-6 bg-gray-100 relative">
        {/* Container do título e botão lado a lado */}
        <div className="flex justify-between items-center mb-6 bg-white p-4 rounded-lg shadow-lg">
          <div className="flex-1 text-center">
            <h2 className="text-3xl font-semibold text-gray-800 inline-block">Lista de Estabelecimentos</h2>
          </div>
          <Link to="/adicionar-estabelecimento">
            <button 
              className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700 transition duration-200"
              onClick={() => console.log("Navegando para adicionar novo estabelecimento")}
            >
              <FiPlus className="mr-2" />
              Adicionar
            </button>
          </Link>
        </div>

        {/* Mensagem de feedback */}
        {mensagem && (
          <div
            className={`mb-4 p-4 text-white rounded-lg text-center ${
              mensagem.includes("Erro") ? "bg-red-500" : "bg-green-500"
            }`}
          >
            {mensagem}
          </div>
        )}

        {/* Tabela */}
        <div className="overflow-x-auto bg-white shadow-lg rounded-lg">
          {!carregando ? (
            <table className="min-w-full table-auto">
              <thead className="bg-blue-600 text-white">
                <tr>
                  <th className="px-6 py-3 text-left">Nome</th>
                  <th className="px-6 py-3 text-left">Endereço</th>
                  <th className="px-6 py-3 text-center">Ações</th>
                </tr>
              </thead>
              <tbody>
                {dadosEstabelecimentos.map(item => (
                  <tr key={item.id} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-4">{item.nome}</td>
                    <td className="px-6 py-4">{item.endereco}</td>
                    <td className="px-6 py-4 text-center space-x-4">
                      <Link to={`/editar-estabelecimento/${item.id}`}>
                        <button
                          className="p-2 text-blue-600 hover:text-white hover:bg-blue-600 rounded-md transition-colors duration-200 border border-blue-100 hover:border-blue-600"
                          title="Editar"
                          onClick={() => console.log(`Editando estabelecimento ID: ${item.id}`)}
                        >
                          <FiEdit2 size={18} />
                        </button>
                      </Link>
                      <button
                        onClick={() => excluirEstabelecimento(item.id)}
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
          ) : (
            <div className="w-full h-64 flex flex-col justify-center items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
            <p className="text-gray-600 font italic">Carregando...</p>
          </div>
        )}
      </div>
      </div>
    </div>
  );
};

export default GerenciarEstabelecimento;