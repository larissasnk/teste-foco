import React, {useState, useEffect, useCallback} from "react";
import axios from "axios";
import MenuLateral from "../components/MenuLateral";
import {Link, useParams, useLocation} from "react-router-dom";
import {FiShoppingCart, FiDollarSign, FiArrowLeft, FiPlus, FiMinus, FiTrash2} from "react-icons/fi";

// Tipos para os dados
interface Produto {
  id: number;
  nome: string;
  preco: number;
  estoque: number;
}

interface Estabelecimento {
  id: number;
  nome: string;
}

interface ItemCarrinho {
  id: number;
  nome: string;
  preco: number;
  quantidade: number;
}

interface VendaParaEdicao {
  id: number;
  estabelecimento_id: number;
  produtos: Array<{
    id: number;
    nome: string;
    preco: number;
    quantidade: number;
  }>;
  taxa: number;
  desconto: number;
  total: number;
}

const RealizarVenda: React.FC = () => {
  const {id} = useParams<{id?: string}>();
  const location = useLocation();
  const [modoEdicao, setModoEdicao] = useState(false);
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [estabelecimentos, setEstabelecimentos] = useState<Estabelecimento[]>([]);
  const [estabelecimentoSelecionado, setEstabelecimentoSelecionado] = useState<number | null>(null);
  const [carrinho, setCarrinho] = useState<ItemCarrinho[]>([]);
  const [taxa, setTaxa] = useState(0);
  const [desconto, setDesconto] = useState(0);
  const [carregando, setCarregando] = useState(true);
  const [mensagem, setMensagem] = useState("");

  const API_URL = "http://172.23.96.1:8989/api";

  // Carrega dados de uma venda existente para edição
  const carregarVendaParaEdicao = useCallback(async () => {
    try {
      setCarregando(true);
      let venda: VendaParaEdicao | undefined;

      // Verifica se veio pelo state de navegação
      if (location.state?.venda) {
        venda = location.state.venda;
        console.log("Venda carregada do state:", venda);
      } 
      // Se não, busca da API usando o ID
      else if (id) {
        const response = await axios.get<VendaParaEdicao>(`${API_URL}/vendas/${id}`);
        venda = response.data;
        console.log("Venda carregada da API:", venda);
      }

      if (venda) {
        setEstabelecimentoSelecionado(venda.estabelecimento_id);
        setTaxa(venda.taxa);
        setDesconto(venda.desconto);

        // Preenche o carrinho com os produtos da venda
        const produtosCarrinho = venda.produtos.map(p => ({
          id: p.id,
          nome: p.nome,
          preco: p.preco,
          quantidade: p.quantidade
        }));
        setCarrinho(produtosCarrinho);
        console.log("Carrinho preenchido:", produtosCarrinho);
      }
    } catch (error) {
      console.error("Erro ao carregar venda para edição:", error);
      setMensagem("Erro ao carregar venda para edição");
    } finally {
      setCarregando(false);
    }
  }, [id, location.state]);

  // Carrega produtos e estabelecimentos
  const carregarDados = useCallback(async () => {
    try {
      setCarregando(true);
      console.log("Carregando produtos e estabelecimentos...");
      
      const [resProdutos, resEstabelecimentos] = await Promise.all([
        axios.get<Produto[]>(`${API_URL}/produtos`),
        axios.get<Estabelecimento[]>(`${API_URL}/estabelecimentos`)
      ]);

      setProdutos(resProdutos.data);
      setEstabelecimentos(resEstabelecimentos.data);
      console.log(`Dados carregados: ${resProdutos.data.length} produtos, ${resEstabelecimentos.data.length} estabelecimentos`);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
      setMensagem("Erro ao carregar dados");
    } finally {
      setCarregando(false);
    }
  }, []);

  // Efeito para carregar tudo ao montar o componente
  useEffect(() => {
    const inicializar = async () => {
      await carregarDados();
      
      if (id || location.state?.venda) {
        setModoEdicao(true);
        await carregarVendaParaEdicao();
      }
    };

    inicializar();
  }, [carregarDados, carregarVendaParaEdicao, id, location.state]);

  // Adiciona produto ao carrinho
  const adicionarProduto = (produto: Produto) => {
    const produtoCompleto = produtos.find(p => p.id === produto.id);
    if (!produtoCompleto) return;

    setCarrinho(prev => {
      const itemExistente = prev.find(item => item.id === produto.id);
      const qtdNoCarrinho = itemExistente?.quantidade || 0;

      if (qtdNoCarrinho < produtoCompleto.estoque) {
        if (itemExistente) {
          return prev.map(item => 
            item.id === produto.id 
              ? {...item, quantidade: item.quantidade + 1} 
              : item
          );
        } else {
          return [...prev, {
            id: produto.id,
            nome: produto.nome,
            preco: produto.preco,
            quantidade: 1
          }];
        }
      } else {
        setMensagem("Limite do estoque atingido");
        return prev;
      }
    });
  };

  // Remove uma unidade do produto do carrinho
  const removerProduto = (produtoId: number) => {
    setCarrinho(prev => {
      const item = prev.find(i => i.id === produtoId);
      if (!item) return prev;

      if (item.quantidade > 1) {
        return prev.map(i => 
          i.id === produtoId 
            ? {...i, quantidade: i.quantidade - 1} 
            : i
        );
      } else {
        return prev.filter(i => i.id !== produtoId);
      }
    });
  };

  // Remove completamente o item do carrinho
  const removerItemCarrinho = (produtoId: number) => {
    setCarrinho(prev => prev.filter(i => i.id !== produtoId));
  };

  // Cálculos financeiros
  const calcularSubtotal = () => carrinho.reduce((total, item) => total + item.preco * item.quantidade, 0);
  const calcularTotal = () => {
    const subtotal = calcularSubtotal();
    return subtotal + (subtotal * taxa) / 100 - (subtotal * desconto) / 100;
  };

  // Formata valor para moeda
  const formatarPreco = (valor: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 2
    }).format(valor);
  };

  // Handlers de formulário
  const handleEstabelecimentoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setEstabelecimentoSelecionado(Number(e.target.value));
  };

  const handleTaxaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTaxa(Number(e.target.value));
  };

  const handleDescontoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDesconto(Number(e.target.value));
  };

  // Finaliza a venda (cria ou atualiza)
  const finalizarVenda = async () => {
    if (!estabelecimentoSelecionado) {
      setMensagem("Selecione um estabelecimento");
      return;
    }

    if (carrinho.length === 0) {
      setMensagem("Adicione produtos ao carrinho");
      return;
    }

    try {
      setCarregando(true);
      const dadosVenda = {
        estabelecimento_id: estabelecimentoSelecionado,
        produtos: carrinho.map(item => ({
          id: item.id,
          quantidade: item.quantidade
        })),
        taxa,
        desconto,
        total: calcularTotal()
      };

      if (modoEdicao && id) {
        console.log("Atualizando venda existente...");
        await axios.put(`${API_URL}/vendas/${id}`, dadosVenda);
        setMensagem("Venda atualizada com sucesso!");
      } else {
        console.log("Criando nova venda...");
        await axios.post(`${API_URL}/vendas`, dadosVenda);
        setMensagem("Venda realizada com sucesso!");
      }

      // Limpa o formulário após sucesso
      setCarrinho([]);
      setTaxa(0);
      setDesconto(0);
      setEstabelecimentoSelecionado(null);
      
      // Recarrega os dados para atualizar estoques
      await carregarDados();
    } catch (error) {
      console.error("Erro ao finalizar venda:", error);
      setMensagem("Erro ao finalizar venda");
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="flex h-screen">
      <MenuLateral />

      <div className="flex-1 p-6 bg-gray-100 relative">
        {/* Cabeçalho */}
        <div className="flex justify-between items-center mb-6 bg-white p-4 rounded-lg shadow-lg">
          <div className="flex-1 text-center">
            <h2 className="text-3xl font-semibold text-gray-800">
              {modoEdicao ? "Editar Venda" : "Realizar Venda"}
            </h2>
          </div>

          <Link
            to="/gerenciar-vendas"
            className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700"
            onClick={() => console.log("Voltando para gerenciar vendas")}
          >
            <FiArrowLeft className="mr-2" />
            Voltar
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

        {/* Corpo principal */}
        <div className="flex justify-center w-full gap-8">
          {/* Seção de produtos */}
          <div className="w-[340px] bg-white p-4 rounded-lg shadow-md">
            <div className="mb-6">
              <label className="block text-gray-700 mb-2 font-medium">Estabelecimento:</label>
              <select
                value={estabelecimentoSelecionado || ""}
                onChange={handleEstabelecimentoChange}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="">Selecione um estabelecimento</option>
                {estabelecimentos.map(estab => (
                  <option key={estab.id} value={estab.id}>
                    {estab.nome}
                  </option>
                ))}
              </select>
            </div>

            <h3 className="text-xl font-bold text-gray-800 mb-4">Produtos Disponíveis</h3>

            {carregando ? (
              <div className="w-full h-64 flex flex-col justify-center items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
                <p className="text-gray-600">Carregando produtos...</p>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {produtos.map(produto => (
                  <div key={produto.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md">
                    <h4 className="font-bold text-gray-800">{produto.nome}</h4>
                    <p className="text-gray-600">Preço: {formatarPreco(produto.preco)}</p>
                    <p className="text-gray-600">Estoque: {produto.estoque}</p>

                    <div className="flex justify-between items-center mt-3">
                      <button
                        onClick={() => removerProduto(produto.id)}
                        disabled={!carrinho.some(item => item.id === produto.id)}
                        className={`px-2 py-1 rounded-md ${
                          carrinho.some(item => item.id === produto.id)
                            ? "bg-red-500 text-white hover:bg-red-600"
                            : "bg-gray-200 text-gray-500 cursor-not-allowed"
                        }`}
                      >
                        <FiMinus />
                      </button>

                      <span className="text-gray-700 font-medium">
                        {carrinho.find(item => item.id === produto.id)?.quantidade || 0}
                      </span>

                      <button
                        onClick={() => adicionarProduto(produto)}
                        disabled={(carrinho.find(item => item.id === produto.id)?.quantidade || 0) >= produto.estoque}
                        className={`px-2 py-1 rounded-md ${
                          (carrinho.find(item => item.id === produto.id)?.quantidade || 0) < produto.estoque
                            ? "bg-green-500 text-white hover:bg-green-600"
                            : "bg-gray-200 text-gray-500 cursor-not-allowed"
                        }`}
                      >
                        <FiPlus />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Seção do carrinho */}
          <div className="w-1/3 bg-white p-4 rounded-lg shadow-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-800">Carrinho</h3>
              <FiShoppingCart className="text-blue-600 text-xl" />
            </div>

            {carrinho.length === 0 ? (
              <p className="text-gray-500 text-center py-4">Nenhum produto no carrinho</p>
            ) : (
              <>
                <div className="space-y-3 mb-4 max-h-[300px] overflow-y-auto">
                  {carrinho.map(item => (
                    <div key={item.id} className="border-b border-gray-100 pb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">{item.nome}</p>
                          <p className="text-sm text-gray-500">
                            {item.quantidade} × {formatarPreco(item.preco)}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="font-bold">{formatarPreco(item.preco * item.quantidade)}</span>
                          <button
                            onClick={() => removerItemCarrinho(item.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <FiTrash2 />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-3 mb-4">
                  <div>
                    <label className="block text-gray-700 mb-1">Taxa (%)</label>
                    <input
                      type="number"
                      value={taxa}
                      onChange={handleTaxaChange}
                      className="w-full p-2 border border-gray-300 rounded-md"
                      min="0"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-1">Desconto (%)</label>
                    <input
                      type="number"
                      value={desconto}
                      onChange={handleDescontoChange}
                      className="w-full p-2 border border-gray-300 rounded-md"
                      min="0"
                    />
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>{formatarPreco(calcularSubtotal())}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Taxa ({taxa}%):</span>
                    <span>{formatarPreco((calcularSubtotal() * taxa) / 100)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Desconto ({desconto}%):</span>
                    <span>-{formatarPreco((calcularSubtotal() * desconto) / 100)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg pt-2 border-t border-gray-200">
                    <span>Total:</span>
                    <span className="text-green-600">{formatarPreco(calcularTotal())}</span>
                  </div>
                </div>

                <button
                  onClick={finalizarVenda}
                  disabled={carregando || carrinho.length === 0 || !estabelecimentoSelecionado}
                  className={`w-full py-3 rounded-lg text-white font-bold flex items-center justify-center ${
                    carregando || carrinho.length === 0 || !estabelecimentoSelecionado
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-green-600 hover:bg-green-700"
                  }`}
                >
                  {carregando ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-3"></div>
                      Processando...
                    </>
                  ) : (
                    <>
                      <FiDollarSign className="mr-2" />
                      {modoEdicao ? "Atualizar Venda" : "Finalizar Venda"}
                    </>
                  )}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RealizarVenda;