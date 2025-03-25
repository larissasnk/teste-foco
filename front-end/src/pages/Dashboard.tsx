import React, { useState, useEffect } from 'react';
import { FiShoppingBag, FiMapPin, FiDollarSign, FiPackage } from 'react-icons/fi';
import axios from "axios";
import MenuLateral from "../components/MenuLateral";

const Dashboard: React.FC = () => {
  // Definindo o estado local
  const [totais, setTotais] = useState({
    vendas: 0,
    produtos: 0,
    estabelecimentos: 0,
    produtosVendidos: 0
  });
  const [carregando, setCarregando] = useState(true);

  const API_URL = "http://localhost:8989/api"; 

  // Função para carregar os totais da API
  useEffect(() => {
    const carregarTotais = async () => {
      try {
        console.log("Iniciando carregamento dos totais...");
        const resposta = await axios.get(`${API_URL}/dashboard/totais`);
        setTotais(resposta.data);
        console.log("Totais carregados com sucesso:", resposta.data);
      } catch (error) {
        console.error("Erro ao carregar os totais:", error);
      } finally {
        setCarregando(false); 
        console.log("Carregamento dos totais finalizado.");
      }
    };

    carregarTotais();
  }, []); 

  // Se os dados ainda estiverem sendo carregados, exibe uma tela de carregamento
  if (carregando) {
    return (
      <div className="flex min-h-screen">
        <MenuLateral />
        <div className="flex items-center justify-center flex-1">
          <div className="w-full h-64 flex flex-col justify-center items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
            <p className="text-gray-600">Carregando...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <MenuLateral />
      
      <div className="flex-1 flex flex-col items-center pt-16 p-6">
        {/* Container principal com sombra e borda */}
        <div className="w-full max-w-6xl bg-white/60 p-8 rounded-xl backdrop-blur-sm border border-white/20 shadow-lg">
          <h1 className="text-2xl font-semibold text-gray-700 mb-8">Visão Geral</h1>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Card de Total de Vendas */}
            <div className="bg-white rounded-lg shadow-lg p-6 flex items-center transition-all hover:shadow-xl hover:-translate-y-1">
              <div className="bg-blue-100/80 p-4 rounded-full mr-4">
                <FiDollarSign className="text-blue-600 text-2xl" />
              </div>
              <div>
                <h3 className="text-gray-500 text-sm">Total de Vendas</h3>
                <p className="text-xl font-semibold text-gray-700">{totais.vendas}</p>
              </div>
            </div>
  
            {/* Card de Produtos */}
            <div className="bg-white rounded-lg shadow-lg p-6 flex items-center transition-all hover:shadow-xl hover:-translate-y-1">
              <div className="bg-green-100/80 p-4 rounded-full mr-4">
                <FiPackage className="text-green-600 text-2xl" />
              </div>
              <div>
                <h3 className="text-gray-500 text-sm">Produtos Cadastrados</h3>
                <p className="text-xl font-semibold text-gray-700">{totais.produtos}</p>
              </div>
            </div>
  
            {/* Card de Estabelecimentos */}
            <div className="bg-white rounded-lg shadow-lg p-6 flex items-center transition-all hover:shadow-xl hover:-translate-y-1">
              <div className="bg-purple-100/80 p-4 rounded-full mr-4">
                <FiMapPin className="text-purple-600 text-2xl" />
              </div>
              <div>
                <h3 className="text-gray-500 text-sm">Estabelecimentos</h3>
                <p className="text-xl font-semibold text-gray-700">{totais.estabelecimentos}</p>
              </div>
            </div>
  
            {/* Card de Produtos Vendidos */}
            <div className="bg-white rounded-lg shadow-lg p-6 flex items-center transition-all hover:shadow-xl hover:-translate-y-1">
              <div className="bg-orange-100/80 p-4 rounded-full mr-4">
                <FiShoppingBag className="text-orange-600 text-2xl" />
              </div>
              <div>
                <h3 className="text-gray-500 text-sm">Produtos Vendidos</h3>
                <p className="text-xl font-semibold text-gray-700">{totais.produtosVendidos}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
