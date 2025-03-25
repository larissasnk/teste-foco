import React, {useState, useEffect} from "react";
import {View, Text, StyleSheet, TouchableOpacity, ScrollView, ImageBackground, Alert} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import {Picker} from "@react-native-picker/picker";
import {BlurView} from "expo-blur";
import ItemCarrinho from "../components/ItemCarrinho";

export default function TelaProdutoVenda({navigation, route}) {
  const {taxa: taxaEditada = 0, desconto: descontoEditado = 0, produtos: produtosVenda, venda} = route.params || {};
  const [quantidades, setQuantidades] = useState({});
  const [carrinho, setCarrinho] = useState([]);
  const [estabelecimentoSelecionado, setEstabelecimentoSelecionado] = useState("");
  const [produtos, setProdutos] = useState([]);
  const [estabelecimentos, setEstabelecimentos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [taxa, setTaxa] = useState(taxaEditada);
  const [desconto, setDesconto] = useState(descontoEditado);

  const URL_API_PRODUTOS = "http://172.23.96.1:8989/api/produtos";
  const URL_API_ESTABELECIMENTOS = "http://172.23.96.1:8989/api/estabelecimentos";

  const isEditarVenda = !!venda;

  useEffect(() => {
    const buscarDados = async () => {
      try {
        console.log("Buscando dados dos produtos e estabelecimentos...");

        const respostaProdutos = await fetch(URL_API_PRODUTOS);
        const dadosProdutos = await respostaProdutos.json();
        setProdutos(dadosProdutos);
        console.log("Produtos carregados:", dadosProdutos);

        const respostaEstabelecimentos = await fetch(URL_API_ESTABELECIMENTOS);
        const dadosEstabelecimentos = await respostaEstabelecimentos.json();
        setEstabelecimentos(dadosEstabelecimentos);
        console.log("Estabelecimentos carregados:", dadosEstabelecimentos);

        if (isEditarVenda) {
          console.log("Editando venda, configurando carrinho...");

          const quantidadesIniciais = {};
          const carrinhoInicial = produtosVenda.map(produto => {
            quantidadesIniciais[produto.id] = produto.quantidade;
            return {
              id: produto.id,
              quantidade: produto.quantidade,
              preco: produto.preco
            };
          });
          setQuantidades(quantidadesIniciais);
          setCarrinho(carrinhoInicial);
          setEstabelecimentoSelecionado(venda.estabelecimento_id);

          console.log("Carrinho inicial:", carrinhoInicial);
        }
      } catch (erro) {
        console.error("Erro ao buscar dados da API", erro);
      } finally {
        setCarregando(false);
        console.log("Carregamento completo.");
      }
    };

    buscarDados();
  }, [produtosVenda, isEditarVenda, venda]);

  const aumentarQuantidade = (produtoId, estoque) => {
    const quantidadeAtual = quantidades[produtoId] || 0;
    if (quantidadeAtual < estoque) {
      setQuantidades(prev => ({...prev, [produtoId]: quantidadeAtual + 1}));
      setCarrinho(prev => {
        const carrinhoAtualizado = [...prev];
        const indiceProduto = carrinhoAtualizado.findIndex(item => item.id === produtoId);
        if (indiceProduto >= 0) {
          carrinhoAtualizado[indiceProduto].quantidade += 1;
        } else {
          carrinhoAtualizado.push({id: produtoId, quantidade: 1});
        }
        console.log("Carrinho atualizado após aumento:", carrinhoAtualizado);
        return carrinhoAtualizado;
      });
      setProdutos(prevProdutos =>
        prevProdutos.map(produto => (produto.id === produtoId ? {...produto, estoque: produto.estoque - 1} : produto))
      );
      console.log(`Quantidade do produto ${produtoId} aumentada para ${quantidadeAtual + 1}`);
    } else {
      Alert.alert("Estoque insuficiente");
      console.log(`Erro: Estoque insuficiente para o produto ${produtoId}`);
    }
  };

  const diminuirQuantidade = produtoId => {
    const quantidadeAtual = quantidades[produtoId] || 0;
    if (quantidadeAtual > 0) {
      setQuantidades(prev => ({...prev, [produtoId]: quantidadeAtual - 1}));
      setCarrinho(prev =>
        prev.map(item => (item.id === produtoId ? {...item, quantidade: item.quantidade - 1} : item))
      );
      setProdutos(prevProdutos =>
        prevProdutos.map(produto => (produto.id === produtoId ? {...produto, estoque: produto.estoque + 1} : produto))
      );
      console.log(`Quantidade do produto ${produtoId} diminuída para ${quantidadeAtual - 1}`);
    }
  };

  const calcularTotal = () => {
    const subtotal = carrinho.reduce((total, item) => {
      const produto = produtos.find(p => p.id === item.id);
      const preco = produto?.preco ? parseFloat(produto.preco) : 0;
      const quantidade = item.quantidade || 0;
      return total + preco * quantidade;
    }, 0);

    const total = subtotal.toFixed(2);
    console.log("Total calculado:", total);
    return total;
  };

  const salvarVenda = () => {
    if (!estabelecimentoSelecionado) {
      Alert.alert("Erro", "Selecione um estabelecimento antes de continuar.");
      console.log("Erro: Estabelecimento não selecionado.");
      return;
    }

    if (carrinho.length === 0 || !carrinho.some(item => item.quantidade > 0)) {
      Alert.alert("Erro", "Adicione pelo menos um produto no carrinho.");
      console.log("Erro: Carrinho vazio.");
      return;
    }

    const dadosVenda = {
      carrinho: carrinho.map(item => {
        const produto = produtos.find(p => p.id === item.id);
        return {
          id: item.id,
          nome: produto?.nome || "Produto Desconhecido",
          preco: produto?.preco ? parseFloat(produto.preco) : 0,
          quantidade: item.quantidade,
          estoque: produto?.estoque || 0
        };
      }),
      quantidade: quantidades,
      subtotal: calcularTotal(),
      estabelecimentoSelecionado,
      taxa,
      desconto,
      produtos,
      vendaId: venda?.id
    };

    console.log("Dados da venda a serem enviados:", dadosVenda);

    navigation.navigate("Venda", dadosVenda);
    console.log("Navegando para a tela de Venda.");
  };

  return (
    <ImageBackground source={require("../../assets/background.png")} style={estilos.container}>
      <ScrollView contentContainerStyle={estilos.scrollContainer}>
        <View style={estilos.cabecalho}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={estilos.botaoVoltar}>
            <Icon name="arrow-back" size={30} color="#244282" />
          </TouchableOpacity>
          <BlurView intensity={50} style={estilos.containerTitulo}>
            <Text style={estilos.textoCabecalho}>{isEditarVenda ? "Editar Venda" : "Realizar Venda"}</Text>
          </BlurView>
        </View>

        <Text style={estilos.textoAjuda}>
          {isEditarVenda
            ? "Edite os produtos do carrinho e finalize a venda na próxima tela."
            : "Escolha o estabelecimento e selecione os produtos do carrinho para finalizar a venda na próxima tela."}
        </Text>

        <BlurView intensity={50} style={estilos.secaoEstabelecimento}>
          <Picker
            selectedValue={estabelecimentoSelecionado}
            onValueChange={itemValue => setEstabelecimentoSelecionado(itemValue)}
            style={estilos.picker}
          >
            <Picker.Item label="Selecione um Estabelecimento" value="" />
            {estabelecimentos.map(estabelecimento => (
              <Picker.Item key={estabelecimento.id} label={estabelecimento.nome} value={estabelecimento.id} />
            ))}
          </Picker>
        </BlurView>

        {carregando ? (
          <Text style={estilos.textoCarregando}>Carregando...</Text>
        ) : (
          <BlurView intensity={50} style={estilos.secaoProduto}>
            {produtos.map(produto => (
              <ItemCarrinho
                key={produto.id}
                produto={produto}
                quantidade={quantidades[produto.id] || 0}
                aumentarQuantidade={aumentarQuantidade}
                diminuirQuantidade={diminuirQuantidade}
              />
            ))}
          </BlurView>
        )}

        <View style={estilos.secaoTotal}>
          <Text style={estilos.textoTotal}>Valor Total: R$ {calcularTotal()}</Text>
        </View>

        <TouchableOpacity style={estilos.botaoSalvar} onPress={salvarVenda}>
          <Text style={estilos.textoBotaoSalvar}>{isEditarVenda ? "Finalizar edição" : "Ir para a Venda"}</Text>
        </TouchableOpacity>
      </ScrollView>
    </ImageBackground>
  );
}

const estilos = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F7F7"
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20
  },
  cabecalho: {
    width: "100%",
    height: 100,
    justifyContent: "center",
    alignItems: "center"
  },
  botaoVoltar: {
    position: "absolute",
    top: 20,
    left: 5
  },
  containerTitulo: {
    alignItems: "center",
    justifyContent: "center",
    padding: 5,
    backgroundColor: "transparent",
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#244282",
    top: 40,
    width: "80%",
    alignSelf: "center"
  },
  textoCabecalho: {
    fontSize: 25,
    fontWeight: "bold",
    color: "#244282"
  },
  textoAjuda: {
    fontSize: 14,
    color: "#555",
    textAlign: "center",
    marginTop: 30,
    fontWeight: "600",
    fontStyle: "italic"
  },
  secaoEstabelecimento: {
    marginTop: 20,
    marginBottom: 20,
    borderRadius: 8,
    borderWidth: 0.5,
    borderColor: "#fff",
    shadowColor: "#000",
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4
  },
  picker: {
    height: 50,
    width: "100%"
  },
  secaoProduto: {
    marginBottom: 20,
    padding: 20,
    borderRadius: 8,
    borderWidth: 0.5,
    borderColor: "#fff",
    shadowColor: "#000",
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4
  },
  secaoTotal: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd"
  },
  textoTotal: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333"
  },
  botaoSalvar: {
    backgroundColor: "#244282",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20
  },
  textoBotaoSalvar: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold"
  },
  textoCarregando: {
    fontSize: 16,
    color: "#244282",
    textAlign: "center",
    marginTop: 20
  }
});
