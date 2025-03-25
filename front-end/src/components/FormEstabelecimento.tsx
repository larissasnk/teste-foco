import React, {useEffect, useState} from "react";
import {useForm} from "react-hook-form";
import {useNavigate, useParams} from "react-router-dom";
import axios from "axios";
import {FaSave, FaArrowLeft} from "react-icons/fa";

// Tipo do estabelecimento
interface Estabelecimento {
  id?: number;
  nome: string;
  endereco: string;
}

const FormEstabelecimento: React.FC = () => {

  const {register, handleSubmit, setValue, formState: {errors}} = useForm<Estabelecimento>();
  

  const navigate = useNavigate();
  const {id} = useParams<{id?: string}>();


  const [estabelecimento, setEstabelecimento] = useState<Estabelecimento | null>(null);
  const [carregando, setCarregando] = useState(false);
  const [sucesso, setSucesso] = useState(false);
  const [erro, setErro] = useState<string | null>(null);


  const API_URL = "http://172.23.96.1:8989/api/estabelecimentos";

   // Busca estabelecimento na API
  useEffect(() => {
    console.log(`Modo: ${id ? 'Edição' : 'Criação'}`);
    
    const buscarEstabelecimento = async () => {
      if (!id) return;
      setCarregando(true);
      console.log(`Buscando estabelecimento ID: ${id}`);
      try {
        const response = await axios.get(`${API_URL}/${id}`);
        console.log('Dados recebidos:', response.data);
        setEstabelecimento(response.data);
        setValue("nome", response.data.nome);
        setValue("endereco", response.data.endereco);
      } catch (err) {
        console.error('Erro na busca:', err);
        setErro("Erro ao carregar dados");
      } finally {
        setCarregando(false);
      }
    };
  
    if (id) buscarEstabelecimento();
  }, [id, setValue]); // Adicione todas as dependências usadas


  // Envia formulário
  const onSubmit = async (data: Estabelecimento) => {
    setCarregando(true);
    console.log('Enviando dados:', data);
    try {
      if (id) {
        console.log(`Atualizando ID: ${id}`);
        await axios.put(`${API_URL}/${id}`, data);
      } else {
        console.log('Criando novo');
        await axios.post(API_URL, data);
      }
      setSucesso(true);
      navigate("/gerenciar-estabelecimento");
    } catch (err) {
      console.error('Erro no envio:', err);
      setErro("Erro ao salvar");
    } finally {
      setCarregando(false);
    }
  };

  // Mostra loading se estiver carregando
  if (!estabelecimento && id) {
    console.log('Carregando dados...');
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  // Formulário principal
  console.log('Renderizando formulário');
  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="w-full max-w-lg bg-white p-8 rounded-lg shadow-lg">
        {/* Cabeçalho */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-semibold">{id ? "Editar" : "Adicionar"}</h2>
          <button
            onClick={() => {
              console.log('Voltando para lista');
              navigate("/gerenciar-estabelecimento");
            }}
            className="bg-gray-300 text-black px-4 py-2 rounded-lg flex items-center hover:bg-gray-400"
          >
            <FaArrowLeft className="mr-2" /> Voltar
          </button>
        </div>

        {/* Mensagens */}
        {sucesso && <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg">Salvo!</div>}
        {erro && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">{erro}</div>}

        {/* Campos do formulário */}
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Nome</label>
            <input
              {...register("nome", {required: "Obrigatório"})}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md"
              placeholder="Nome"
              onChange={(e) => console.log('Nome alterado:', e.target.value)}
            />
            {errors.nome && <p className="text-red-500 text-xs mt-1">{errors.nome.message}</p>}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Endereço</label>
            <input
              {...register("endereco", {required: "Obrigatório"})}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md"
              placeholder="Endereço"
              onChange={(e) => console.log('Endereço alterado:', e.target.value)}
            />
            {errors.endereco && <p className="text-red-500 text-xs mt-1">{errors.endereco.message}</p>}
          </div>

          {/* Botão de submit */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg flex items-center hover:bg-blue-700"
              disabled={carregando}
            >
              {carregando ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                  Salvando...
                </>
              ) : (
                <>
                  <FaSave className="mr-2" />
                  {id ? "Salvar" : "Adicionar"}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FormEstabelecimento;