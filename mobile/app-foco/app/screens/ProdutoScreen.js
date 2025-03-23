import React, {useState, useEffect} from "react";
import {View, Text, StyleSheet, Dimensions, TouchableOpacity, FlatList, ImageBackground, Alert} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import ModalProduto from "../components/modal/modalProduto";
import axios from "axios";
import {BlurView} from "expo-blur";

const URL_API = "http://172.23.96.1:8989/api/produtos";
const URL_ESTABELECIMENTOS = "http://172.23.96.1:8989/api/estabelecimentos";

export default function TelaProduto({navigation}) {
  const [produtos, setProdutos] = useState([]);
  const [estabelecimentos, setEstabelecimentos] = useState([]);
  const [modalVisivel, setModalVisivel] = useState(false);
  const [modo, setModo] = useState("adicionar");
  const [produtoAtual, setProdutoAtual] = useState(null);
  const [carregando, setCarregando] = useState(false);

  useEffect(() => {
    buscarProdutos();
    buscarEstabelecimentos();
  }, []);

  const buscarProdutos = async () => {
    setCarregando(true);
    try {
      const resposta = await axios.get(URL_API);
      setProdutos(resposta.data);
    } catch (erro) {
      console.error("Erro ao buscar produtos", erro);
      Alert.alert("Erro", "Não foi possível carregar os produtos.");
    } finally {
      setCarregando(false);
    }
  };

  const buscarEstabelecimentos = async () => {
    try {
      const resposta = await axios.get(URL_ESTABELECIMENTOS);
      setEstabelecimentos(resposta.data);
    } catch (erro) {
      console.error("Erro ao buscar estabelecimentos", erro);
      Alert.alert("Erro", "Não foi possível carregar os estabelecimentos.");
    }
  };

  const adicionarProduto = async (nome, preco, estoque, estabelecimentoId) => {
    setCarregando(true);
    try {
      const resposta = await axios.post(URL_API, {nome, preco, estoque, estabelecimento_id: estabelecimentoId});
      setProdutos([...produtos, resposta.data]);
      setModalVisivel(false);
      Alert.alert("Sucesso", "Produto adicionado com sucesso!");
    } catch (erro) {
      console.error("Erro ao adicionar produto", erro);
      Alert.alert("Erro", "Não foi possível adicionar o produto.");
    } finally {
      setCarregando(false);
    }
  };

  const atualizarProduto = async (id, nome, preco, estoque, estabelecimentoId) => {
    setCarregando(true);
    try {
      const resposta = await axios.put(`${URL_API}/${id}`, {
        nome,
        preco,
        estoque,
        estabelecimento_id: estabelecimentoId
      });
      const novaLista = produtos.map(item => (item.id === id ? resposta.data : item));
      setProdutos(novaLista);
      setModalVisivel(false);
      Alert.alert("Sucesso", "Produto atualizado com sucesso!");
    } catch (erro) {
      console.error("Erro ao atualizar produto", erro);
      Alert.alert("Erro", "Não foi possível atualizar o produto.");
    } finally {
      setCarregando(false);
    }
  };

  const deletarProduto = async id => {
    Alert.alert("Confirmar Exclusão", "Tem certeza que deseja excluir este produto?", [
      {
        text: "Cancelar",
        style: "cancel"
      },
      {
        text: "Excluir",
        style: "destructive",
        onPress: async () => {
          setCarregando(true);
          try {
            await axios.delete(`${URL_API}/${id}`);
            const novaLista = produtos.filter(item => item.id !== id);
            setProdutos(novaLista);
            Alert.alert("Sucesso", "Produto excluído com sucesso!");
          } catch (erro) {
            console.error("Erro ao excluir produto", erro);
            Alert.alert("Erro", "Não foi possível excluir o produto.");
          } finally {
            setCarregando(false);
          }
        }
      }
    ]);
  };

  const editarProduto = item => {
    setProdutoAtual(item);
    setModo("editar");
    setModalVisivel(true);
  };

  return (
    <ImageBackground source={require("../../assets/background.png")} style={estilos.container}>
      <View style={estilos.boxTopo}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={estilos.botaoVoltar}>
          <Icon name="arrow-back" size={30} color="#244282" />
        </TouchableOpacity>
        <BlurView intensity={50} style={estilos.containerTitulo}>
          <Text style={estilos.titulo}>Listagem de Produtos</Text>
        </BlurView>
      </View>

      <View style={estilos.boxMeio}>
        <View style={estilos.tituloTabela}>
          <Text style={[estilos.textoHeaderTabela, {flex: 1}]}>Nome</Text>
          <Text style={[estilos.textoHeaderTabela, {flex: 1}]}>Preço</Text>
          <Text style={[estilos.textoHeaderTabela, {flex: 1}]}>Estoque</Text>
          <Text style={[estilos.textoHeaderTabela, {flex: 0.5}]}>Ações</Text>
        </View>

        <View style={estilos.containerTabela}>
          {carregando ? (
            <Text style={estilos.textoCarregando}>Carregando...</Text>
          ) : produtos.length > 0 ? (
            <FlatList
              data={produtos}
              keyExtractor={item => item.id.toString()}
              renderItem={({item}) => (
                <View style={estilos.linhaTabela}>
                  <Text style={[estilos.textoTabela, {flex: 1}]}>{item.nome}</Text>
                  <Text style={[estilos.textoTabela, {flex: 1}]}>{item.preco}</Text>
                  <Text style={[estilos.textoTabela, {flex: 1}]}>{item.estoque}</Text>
                  <View style={[estilos.iconeContainer, {flex: 0.5}]}>
                    <TouchableOpacity style={{right: 5}} onPress={() => editarProduto(item)}>
                      <FontAwesome6 name="edit" size={20} color="#244282" />
                    </TouchableOpacity>
                    <TouchableOpacity style={{marginTop: -3}} onPress={() => deletarProduto(item.id)}>
                      <MaterialCommunityIcons name="delete-outline" size={27} color="#244282" />
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            />
          ) : (
            <Text style={[estilos.textoTabela, {textAlign: "center", paddingVertical: 10}]}>
              Nenhum produto encontrado.
            </Text>
          )}
        </View>
      </View>

      <View style={estilos.boxInferior}>
        <TouchableOpacity
          style={estilos.botaoAdicionar}
          onPress={() => {
            setModo("adicionar");
            setModalVisivel(true);
          }}
        >
          <Text style={estilos.textoBotaoAdicionar}>Adicionar Produto</Text>
        </TouchableOpacity>
      </View>

      <ModalProduto
        modalVisivel={modalVisivel}
        setModalVisivel={setModalVisivel}
        adicionarProduto={adicionarProduto}
        atualizarProduto={atualizarProduto}
        produto={produtoAtual}
        modo={modo}
        estabelecimentos={estabelecimentos}
      />
    </ImageBackground>
  );
}

const estilos = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1
  },
  boxTopo: {
    width: "100%",
    height: Dimensions.get("window").height * 0.15,
    justifyContent: "flex-end",
    alignItems: "center",
    paddingBottom: 10
  },
  botaoVoltar: {
    position: "absolute",
    top: 20,
    left: 20
  },
  containerTitulo: {
    alignItems: "center",
    justifyContent: "center",
    padding: 5,
    backgroundColor: "transparent",
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#244282",
    top: 10,
    width: "80%",
    alignSelf: "center"
  },
  titulo: {
    fontSize: 25,
    fontWeight: "bold"
  },
  boxMeio: {
    width: "100%",
    height: Dimensions.get("window").height * 0.7,
    justifyContent: "flex-start",
    alignItems: "center",
    paddingTop: 10,
    top: 30
  },
  tituloTabela: {
    flexDirection: "row",
    width: "90%",
    backgroundColor: "#244282",
    padding: 10,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    justifyContent: "space-between"
  },
  textoHeaderTabela: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center"
  },
  containerTabela: {
    width: "90%",
    backgroundColor: "#fff",
    padding: 5,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    flex: 1
  },
  linhaTabela: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 2,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd"
  },
  textoTabela: {
    fontSize: 17,
    color: "#244282",
    textAlign: "center",
    fontStyle: "italic"
  },
  iconeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 5
  },
  boxInferior: {
    width: "100%",
    height: Dimensions.get("window").height * 0.15,
    justifyContent: "center",
    alignItems: "center",
    top: 16
  },
  botaoAdicionar: {
    backgroundColor: "#244282",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10
  },
  textoCarregando: {
    fontSize: 18,
    color: "#244282",
    textAlign: "center",
    marginTop: 20,
    fontStyle: "italic"
  },
  textoBotaoAdicionar: {
    color: "#fff",
    fontSize: 18,
    fontFamily: "CoreSansD65Heavy"
  }
});
