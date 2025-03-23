import React, {useState, useEffect} from "react";
import {View, Text, StyleSheet, TouchableOpacity, ScrollView, ImageBackground, Alert} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import {Picker} from "@react-native-picker/picker";
import {BlurView} from "expo-blur";
import ItemCarrinho from "../components/ItemCarrinho";

export default function TelaProdutoVenda({navigation, route}) {
  const {taxa, desconto, produtos: produtosVenda, venda} = route.params || {};
  const [quantidades, setQuantidades] = useState({});
  const [carrinho, setCarrinho] = useState([]);
  const [estabelecimentoSelecionado, setEstabelecimentoSelecionado] = useState("");
  const [produtos, setProdutos] = useState([]);
  const [estabelecimentos, setEstabelecimentos] = useState([]);
  const [carregando, setCarregando] = useState(true);

  const URL_API_PRODUTOS = "http://172.23.96.1:8989/api/produtos";
  const URL_API_ESTABELECIMENTOS = "http://172.23.96.1:8989/api/estabelecimentos";

  const isEditarVenda = !!venda;

  useEffect(() => {
    const buscarDados = async () => {
      try {
        const respostaProdutos = await fetch(URL_API_PRODUTOS);
        const dadosProdutos = await respostaProdutos.json();
        setProdutos(dadosProdutos);

        const respostaEstabelecimentos = await fetch(URL_API_ESTABELECIMENTOS);
        const dadosEstabelecimentos = await respostaEstabelecimentos.json();
        setEstabelecimentos(dadosEstabelecimentos);

        if (isEditarVenda) {
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
        }
      } catch (erro) {
        console.error("Erro ao buscar dados da API", erro);
      } finally {
        setCarregando(false); 
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
        return carrinhoAtualizado;
      });
      setProdutos(prevProdutos =>
        prevProdutos.map(produto => (produto.id === produtoId ? {...produto, estoque: produto.estoque - 1} : produto))
      );
    } else {
      Alert.alert("Estoque insuficiente");
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
    }
  };

  const calcularTotal = () => {
    const subtotal = carrinho.reduce((total, item) => {
      const produto = produtos.find(p => p.id === item.id);
      const preco = produto?.preco ? parseFloat(produto.preco) : 0;
      const quantidade = item.quantidade || 0;
      return total + preco * quantidade;
    }, 0);

    const totalImposto = (subtotal * (taxa || 0)) / 100;
    const totalDesconto = (subtotal * (desconto || 0)) / 100;
    const total = subtotal + totalImposto - totalDesconto;
    return total.toFixed(2);
  };

  const salvarVenda = () => {
    if (!estabelecimentoSelecionado) {
      Alert.alert("Erro", "Selecione um estabelecimento antes de continuar.");
      return;
    }

    if (carrinho.length === 0 || !carrinho.some(item => item.quantidade > 0)) {
      Alert.alert("Erro", "Adicione pelo menos um produto no carrinho.");
      return;
    }

    const dadosVenda = {
      cart: carrinho.map(item => {
        const produto = produtos.find(p => p.id === item.id);
        return {
          id: item.id,
          nome: produto?.nome || "Produto Desconhecido",
          preco: produto?.preco ? parseFloat(produto.preco) : 0,
          quantidade: item.quantidade
        };
      }),
      quantities: quantidades,
      subtotal: calcularTotal(),
      estabelecimentoSelecionado
    };

    console.log("Dados passados para VendaScreen:", dadosVenda);

    navigation.navigate("Venda", dadosVenda);
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
