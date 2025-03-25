import React, {useState, useEffect} from "react";
import {useForm} from "react-hook-form";
import {useNavigate, useParams} from "react-router-dom";
import axios from "axios";
import {FaSave, FaArrowLeft} from "react-icons/fa";

// Tipos para os dados
interface Produto {
  id?: number;
  nome: string;
  preco: number;
  estoque: number;
  estabelecimento_id: number;
}

interface Estabelecimento {
  id: number;
  nome: string;
}

const FormProduto: React.FC = () => {
  // Configuração do formulário e estados
  const {register, handleSubmit, setValue, formState: {errors}} = useForm<Produto>();
  const navigate = useNavigate();
  const {id} = useParams();
  const [carregando, setCarregando] = useState(false);
  const [sucesso, setSucesso] = useState(false);
  const [erro, setErro] = useState("");
  const [estabelecimentos, setEstabelecimentos] = useState<Estabelecimento[]>([]);

  const API_URL = "http://172.23.96.1:8989/api";

  // Efeito para carregar dados iniciais
  useEffect(() => {
    console.log(`Modo: ${id ? 'Edição' : 'Cadastro'}`);
    
    // Carrega lista de estabelecimentos
    axios.get(`${API_URL}/estabelecimentos`)
      .then(response => {
        console.log(`Estabelecimentos carregados: ${response.data.length}`);
        setEstabelecimentos(response.data);
      })
      .catch(error => {
        console.error("Erro ao carregar estabelecimentos:", error);
        setErro("Erro ao carregar estabelecimentos");
      });

    if (!id) return;

    // Carrega dados do produto se estiver editando
    setCarregando(true);
    axios.get(`${API_URL}/produtos/${id}`)
      .then(response => {
        console.log("Dados do produto carregados:", response.data);
        setValue("nome", response.data.nome);
        setValue("preco", response.data.preco);
        setValue("estoque", response.data.estoque);
        setValue("estabelecimento_id", response.data.estabelecimento_id);
      })
      .catch(error => {
        console.error("Erro ao carregar produto:", error);
        setErro("Erro ao carregar produto");
      })
      .finally(() => setCarregando(false));
  }, [id, setValue]);

  // Função para enviar o formulário
  const onSubmit = async (data: Produto) => {
    setCarregando(true);
    setErro("");
    setSucesso(false);

    try {
      console.log(id ? "Atualizando produto..." : "Criando novo produto...");
      
      if (id) {
        await axios.put(`${API_URL}/produtos/${id}`, data);
        console.log(`Produto ${id} atualizado com sucesso`);
      } else {
        await axios.post(`${API_URL}/produtos`, data);
        console.log("Novo produto criado com sucesso");
      }
      
      setSucesso(true);
      setTimeout(() => navigate("/gerenciar-produtos"), 1500);
    } catch (error) {
      console.error("Erro ao salvar produto:", error);
      setErro("Erro ao salvar produto. Verifique os dados e tente novamente.");
    } finally {
      setCarregando(false);
    }
  };

  // Mostra loading enquanto carrega (apenas no modo edição)
  if (carregando && id) {
    console.log("Carregando dados do produto...");
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  console.log("Renderizando formulário...");
  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="w-full max-w-lg bg-white p-8 rounded-lg shadow-lg">
        {/* Cabeçalho */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-semibold">
            {id ? "Editar Produto" : "Adicionar Produto"}
          </h2>
          <button
            onClick={() => {
              console.log("Voltando para lista de produtos");
              navigate("/gerenciar-produtos");
            }}
            className="bg-gray-300 text-black px-4 py-2 rounded-lg flex items-center hover:bg-gray-400 transition duration-200"
          >
            <FaArrowLeft className="mr-2" /> Voltar
          </button>
        </div>

        {/* Mensagens de feedback */}
        {sucesso && (
          <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg">
            Produto salvo com sucesso!
          </div>
        )}
        {erro && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
            {erro}
          </div>
        )}

        {/* Formulário */}
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          {/* Campo Estabelecimento */}
          <div className="mb-4">
            <label htmlFor="estabelecimento_id" className="block text-sm font-medium text-gray-700">
              Estabelecimento *
            </label>
            <select
              id="estabelecimento_id"
              {...register("estabelecimento_id", {
                required: "Estabelecimento é obrigatório",
                valueAsNumber: true
              })}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={!!id}
            >
              <option value="">Selecione um estabelecimento</option>
              {estabelecimentos.map(estab => (
                <option key={estab.id} value={estab.id}>
                  {estab.nome}
                </option>
              ))}
            </select>
            {errors.estabelecimento_id && (
              <p className="text-red-500 text-xs mt-1">{errors.estabelecimento_id.message}</p>
            )}
          </div>

          {/* Campo Nome */}
          <div className="mb-4">
            <label htmlFor="nome" className="block text-sm font-medium text-gray-700">
              Nome *
            </label>
            <input
              id="nome"
              {...register("nome", {
                required: "Nome é obrigatório",
              })}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(e) => console.log("Nome alterado:", e.target.value)}
            />
            {errors.nome && <p className="text-red-500 text-xs mt-1">{errors.nome.message}</p>}
          </div>

          {/* Campo Preço */}
          <div className="mb-4">
            <label htmlFor="preco" className="block text-sm font-medium text-gray-700">
              Preço (R$) *
            </label>
            <input
              id="preco"
              type="number"
              min="0"
              step="0.01"
              {...register("preco", {
                required: "Preço é obrigatório",
                min: {value: 0, message: "Não pode ser negativo"},
                valueAsNumber: true
              })}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(e) => console.log("Preço alterado:", e.target.value)}
            />
            {errors.preco && <p className="text-red-500 text-xs mt-1">{errors.preco.message}</p>}
          </div>

          {/* Campo Estoque */}
          <div className="mb-4">
            <label htmlFor="estoque" className="block text-sm font-medium text-gray-700">
              Estoque *
            </label>
            <input
              id="estoque"
              type="number"
              min="0"
              {...register("estoque", {
                required: "Estoque é obrigatório",
                min: {value: 0, message: "Não pode ser negativo"},
                valueAsNumber: true
              })}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(e) => console.log("Estoque alterado:", e.target.value)}
            />
            {errors.estoque && <p className="text-red-500 text-xs mt-1">{errors.estoque.message}</p>}
          </div>

          {/* Botão de submit */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg flex items-center hover:bg-blue-700 transition duration-200"
              disabled={carregando}
              onClick={() => console.log("Submetendo formulário...")}
            >
              {carregando ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                  Salvando...
                </>
              ) : (
                <>
                  <FaSave className="mr-2" />
                  {id ? "Salvar Alterações" : "Adicionar Produto"}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FormProduto;