import React, {useState, useEffect} from "react";
import {View, Text, StyleSheet, Dimensions, TouchableOpacity, FlatList, ImageBackground, Alert} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import ModalEstabelecimento from "../components/modal/modalEstabelecimento";
import {BlurView} from "expo-blur";
import axios from "axios";

export default function TelaEstabelecimento({navigation}) {
  const [dadosEstabelecimentos, setDadosEstabelecimentos] = useState([]);
  const [modalVisivel, setModalVisivel] = useState(false);
  const [modo, setModo] = useState("adicionar");
  const [estabelecimentoAtual, setEstabelecimentoAtual] = useState(null);
  const [carregando, setCarregando] = useState(false);

  const API_URL = "http://172.23.96.1:8989/api/estabelecimentos";

  // Função para buscar estabelecimentos
  useEffect(() => {
    buscarEstabelecimentos();
  }, []);

  const buscarEstabelecimentos = async () => {
    setCarregando(true);
    console.log("Iniciando busca de estabelecimentos...");
    try {
      const response = await axios.get(API_URL);
      setDadosEstabelecimentos(response.data);
    } catch (error) {
      console.error("Erro ao buscar estabelecimentos:", error);
      Alert.alert("Erro", "Não foi possível carregar os estabelecimentos.");
    } finally {
      setCarregando(false);
      console.log("Busca de estabelecimentos finalizada.");
    }
  };

  // Função para adicionar um novo estabelecimento
  const adicionarEstabelecimento = async (nome, endereco) => {
    console.log("Tentando adicionar estabelecimento:", nome, endereco);

    try {
      const response = await axios.post(API_URL, {nome, endereco});

      console.log("Estabelecimento adicionado com sucesso:", response.data);

      buscarEstabelecimentos();

      Alert.alert("Sucesso", "Estabelecimento adicionado com sucesso!");
    } catch (error) {
      console.error("Erro ao adicionar estabelecimento:", error);
      Alert.alert("Erro", "Não foi possível adicionar o estabelecimento.");
    }
  };

  // Função para atualizar um estabelecimento
  const atualizarEstabelecimento = async (id, nome, endereco) => {
    if (!id || !nome || !endereco) {
      console.error("Erro: Alguns campos estão indefinidos!", {id, nome, endereco});
      Alert.alert("Erro", "Preencha todos os campos antes de atualizar.");
      return;
    }

    console.log("Enviando atualização:", {id, nome, endereco});

    setCarregando(true);

    try {
      await axios.put(`${API_URL}/${id}`, {nome, endereco});

      buscarEstabelecimentos();

      Alert.alert("Sucesso", "Estabelecimento atualizado com sucesso!");
    } catch (error) {
      console.error("Erro ao atualizar estabelecimento:", error.response?.data || error);
      Alert.alert("Erro", "Não foi possível atualizar o estabelecimento.");
    } finally {
      setCarregando(false);
    }
  };

  // Função para excluir um estabelecimento
  const deletarEstabelecimento = async id => {
    Alert.alert("Confirmar Exclusão", "Tem certeza que deseja excluir este estabelecimento?", [
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
            await axios.delete(`${API_URL}/${id}`);

            const novaLista = dadosEstabelecimentos.filter(item => item.id !== id);
            setDadosEstabelecimentos(novaLista);
            console.log("Estabelecimento excluído com sucesso");

            Alert.alert("Sucesso", "Estabelecimento excluído com sucesso!");
          } catch (error) {
            console.error("Erro ao excluir estabelecimento:", error);
            Alert.alert("Erro", "Não foi possível excluir o estabelecimento. Tente novamente.");
          } finally {
            setCarregando(false);
          }
        }
      }
    ]);
  };

  return (
    <ImageBackground source={require("../../assets/background.png")} style={estilos.container}>
      <View style={estilos.boxTopo}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={estilos.botaoVoltar}>
          <Icon name="arrow-back" size={30} color="#244282" />
        </TouchableOpacity>
        <BlurView intensity={50} style={estilos.tituloContainer}>
          <Text style={estilos.titulo}>Lista de Estabelecimentos</Text>
        </BlurView>
      </View>

      <View style={estilos.boxMeio}>
        <View style={estilos.tituloTabela}>
          <Text style={[estilos.textoCabecalhoTabela, {flex: 1}]}>Nome</Text>
          <Text style={[estilos.textoCabecalhoTabela, {flex: 1}]}>Endereço</Text>
          <Text style={[estilos.textoCabecalhoTabela, {flex: 0.5}]}>Ações</Text>
        </View>

        <View style={estilos.containerTabela}>
          {carregando ? (
            <Text style={estilos.textoCarregando}>Carregando...</Text>
          ) : dadosEstabelecimentos.length > 0 ? (
            <FlatList
              data={dadosEstabelecimentos}
              keyExtractor={item => item.id.toString()}
              renderItem={({item}) => (
                <View style={estilos.linhaTabela}>
                  <Text style={[estilos.textoTabela, {flex: 1}]}>{item.nome}</Text>
                  <Text style={[estilos.textoTabela, {flex: 1}]}>{item.endereco}</Text>
                  <View style={[estilos.iconeContainer, {flex: 0.5}]}>
                    <>
                      <TouchableOpacity
                        style={{left: 5}}
                        onPress={() => {
                          console.log("Editando estabelecimento:", item);
                          setEstabelecimentoAtual(item);
                          setModo("editar");
                          setModalVisivel(true);
                        }}
                      >
                        <FontAwesome6 name="edit" size={20} color="#244282" />
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={{right: 5, marginTop: -3}}
                        onPress={() => {
                          console.log("Solicitando exclusão do estabelecimento com ID:", item.id);
                          deletarEstabelecimento(item.id);
                        }}
                      >
                        <MaterialCommunityIcons name="delete-outline" size={27} color="#244282" />
                      </TouchableOpacity>
                    </>
                  </View>
                </View>
              )}
            />
          ) : (
            <Text style={[estilos.textoTabela, {textAlign: "center", paddingVertical: 10}]}>
              Nenhum estabelecimento encontrado.
            </Text>
          )}
        </View>
      </View>

      <View style={estilos.boxInferior}>
        <TouchableOpacity
          style={estilos.botaoAdicionar}
          onPress={() => {
            console.log("Abrindo modal para adicionar estabelecimento.");
            setModo("adicionar");
            setModalVisivel(true);
          }}
        >
          <Text style={estilos.textoBotaoAdicionar}>Adicionar Estabelecimento</Text>
        </TouchableOpacity>
      </View>

      <ModalEstabelecimento
        modalVisivel={modalVisivel}
        setModalVisivel={setModalVisivel}
        adicionarEstabelecimento={adicionarEstabelecimento}
        atualizarEstabelecimento={atualizarEstabelecimento}
        deletarEstabelecimento={deletarEstabelecimento}
        estabelecimento={estabelecimentoAtual}
        modo={modo}
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
  tituloContainer: {
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
    fontFamily: "CoreSansD65Heavy",
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
  textoCabecalhoTabela: {
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
    paddingHorizontal: 1
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
