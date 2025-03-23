import React, {useState} from "react";
import {View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Alert, ImageBackground} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import axios from "axios";

export default function VendaScreen({route, navigation}) {
  const {
    cart: carrinho = [],
    quantities: quantidades = {},
    subtotal: subtotalParam = 0,
    estabelecimentoSelecionado
  } = route.params || {};

  const subtotal = parseFloat(subtotalParam);

  const [taxa, setTaxa] = useState(0);
  const [desconto, setDesconto] = useState(0);
  const [carregando, setCarregando] = useState(false);

  const calcularTotal = () => {
    const valorTaxa = (subtotal * taxa) / 100;
    const valorDesconto = (subtotal * desconto) / 100;
    const total = subtotal + valorTaxa - valorDesconto;
    return total.toFixed(2);
  };

  const finalizarVenda = async () => {
    if (!estabelecimentoSelecionado) {
      Alert.alert("Erro", "Selecione um estabelecimento antes de continuar.");
      return;
    }

    if (carrinho.length === 0 || !carrinho.some(item => item.quantidade > 0)) {
      Alert.alert("Erro", "Adicione pelo menos um produto com 1 unidade ao carrinho.");
      return;
    }

    setCarregando(true);

    const dadosVenda = {
      estabelecimento_id: estabelecimentoSelecionado,
      produtos: carrinho.map(item => ({
        id: item.id,
        quantidade: item.quantidade
      })),
      taxa: taxa,
      desconto: desconto,
      total: calcularTotal()
    };

    try {
      const resposta = await axios.post("http://172.23.96.1:8989/api/vendas", dadosVenda);

      if (resposta.status === 200 || resposta.status === 201) {
        Alert.alert("Venda finalizada!", `Venda registrada com sucesso!\nTotal: R$ ${calcularTotal()}`);
        navigation.navigate("ListaVendas");
      } else {
        Alert.alert("Erro", "Ocorreu um erro ao registrar a venda.");
      }
    } catch (erro) {
      console.error("Erro ao finalizar a venda", erro);
      Alert.alert("Erro", "Ocorreu um erro na comunicação com o servidor.");
    } finally {
      setCarregando(false);
    }
  };

  return (
    <ImageBackground source={require("../../assets/background.png")} style={estilos.container}>
      <ScrollView contentContainerStyle={estilos.scrollContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={estilos.botaoVoltar}>
          <Icon name="arrow-back" size={30} color="#244282" />
        </TouchableOpacity>

        <View style={estilos.cabecalho}>
          <Text style={estilos.textoCabecalho}>Venda</Text>
        </View>

        <View style={estilos.secaoProdutos}>
          {carrinho && carrinho.length > 0 ? (
            carrinho.map((produto, index) => (
              <View key={index} style={estilos.itemProduto}>
                <View style={estilos.cabecalhoProduto}>
                  <Text style={estilos.nomeProduto}>{produto.nome}</Text>
                  <Text style={estilos.precoProduto}>R$ {produto.preco.toFixed(2)}</Text>
                </View>
                <Text style={estilos.textoQuantidade}>Quantidade: {quantidades[produto.id] || 0}</Text>
              </View>
            ))
          ) : (
            <Text style={estilos.textoSemProdutos}>Nenhum produto no carrinho.</Text>
          )}
        </View>

        <View style={estilos.sessao}>
          {/* Exibe o Subtotal */}
          <View style={estilos.secaoSubtotal}>
            <Text style={estilos.textoSubtotal}>Subtotal: R$ {subtotal.toFixed(2)}</Text>
          </View>

          <View style={estilos.secaoTaxaDesconto}>
            <View style={estilos.campoTaxaDesconto}>
              <Text style={estilos.rotuloTaxaDesconto}>Taxa (%):</Text>
              <TextInput
                style={estilos.input}
                placeholder="Taxa"
                keyboardType="numeric"
                value={taxa.toString()}
                onChangeText={texto => setTaxa(parseFloat(texto) || 0)}
              />
            </View>
            <View style={estilos.campoTaxaDesconto}>
              <Text style={estilos.rotuloTaxaDesconto}>Desconto (%):</Text>
              <TextInput
                style={estilos.input}
                placeholder="Desconto"
                keyboardType="numeric"
                value={desconto.toString()}
                onChangeText={texto => setDesconto(parseFloat(texto) || 0)}
              />
            </View>
          </View>

          <View style={estilos.secaoTotal}>
            <Text style={estilos.textoTotal}>Total: R$ {calcularTotal()}</Text>
          </View>
        </View>

        <TouchableOpacity style={estilos.botaoFinalizar} onPress={finalizarVenda} disabled={carregando}>
          <Text style={estilos.textoBotaoFinalizar}>Finalizar Venda</Text>
        </TouchableOpacity>

        {carregando && (
          <View style={estilos.overlayCarregando}>
            <Text style={estilos.textoCarregando}>Carregando...</Text>
          </View>
        )}
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
  botaoVoltar: {
    position: "absolute",
    top: 40,
    left: 20,
    zIndex: 1
  },
  cabecalho: {
    alignItems: "center",
    marginBottom: 20,
    marginTop: 50
  },
  textoCabecalho: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333"
  },
  secaoProdutos: {
    marginBottom: 20
  },
  itemProduto: {
    padding: 15,
    backgroundColor: "#fff",
    marginBottom: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    shadowColor: "#000",
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  cabecalhoProduto: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10
  },
  nomeProduto: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333"
  },
  precoProduto: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#244282"
  },
  textoQuantidade: {
    fontSize: 16,
    color: "#666"
  },
  textoSemProdutos: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginTop: 20
  },
  sessao: {
    padding: 15,
    backgroundColor: "#fff",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    shadowColor: "#000",
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  secaoSubtotal: {
    marginTop: 20,
    padding: 15,
    backgroundColor: "#fff",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd"
  },
  textoSubtotal: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333"
  },
  secaoTaxaDesconto: {
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20
  },
  campoTaxaDesconto: {
    flex: 1,
    marginRight: 10
  },
  rotuloTaxaDesconto: {
    fontSize: 16,
    color: "#333",
    marginBottom: 5
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 10,
    backgroundColor: "#fff",
    fontSize: 16
  },
  secaoTotal: {
    marginTop: 20,
    padding: 15,
    backgroundColor: "#fff",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd"
  },
  textoTotal: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333"
  },
  botaoFinalizar: {
    backgroundColor: "#244282",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
    shadowColor: "#000",
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  textoBotaoFinalizar: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold"
  },
  overlayCarregando: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.8)"
  },
  textoCarregando: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#244282"
  }
});
