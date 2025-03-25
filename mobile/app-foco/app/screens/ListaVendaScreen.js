import React, {useState, useEffect} from "react";
import {View, Text, StyleSheet, TouchableOpacity, ScrollView, ImageBackground} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import {BlurView} from "expo-blur";
import axios from "axios";
import DetalhesVendaModal from "../components/modal/DetalhesVendaModal";
import VendaItem from "../components/VendaItem";

export default function ListaVendasScreen({navigation}) {
  const [modalVisivel, setModalVisivel] = useState(false);
  const [vendaSelecionada, setVendaSelecionada] = useState(null);
  const [vendas, setVendas] = useState([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const buscarVendas = async () => {
      try {
        const resposta = await axios.get("http://172.23.96.1:8989/api/vendas/");
        setVendas(resposta.data);
      } catch (erro) {
        console.error("Erro ao carregar vendas:", erro);
      } finally {
        setCarregando(false);
      }
    };
    buscarVendas();
  }, []);

  

  const abrirModal = venda => {
    setVendaSelecionada(venda);
    setModalVisivel(true);
  };

  const fecharModal = () => {
    setModalVisivel(false);
    setVendaSelecionada(null);
  };

  const atualizarVendas = async () => {
    try {
      const resposta = await axios.get("http://172.23.96.1:8989/api/vendas/");
      setVendas(resposta.data);
    } catch (erro) {
      console.error("Erro ao carregar vendas:", erro);
    }
  };

  return (
    <ImageBackground source={require("../../assets/background.png")} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.boxTopo}>
          <TouchableOpacity onPress={() => navigation.navigate("Home")} style={styles.botaoVoltar}>
            <Icon name="arrow-back" size={30} color="#244282" />
          </TouchableOpacity>

          <BlurView intensity={50} style={styles.tituloContainer}>
            <Text style={styles.titulo}>Listagem de Vendas</Text>
          </BlurView>
        </View>

        <View style={styles.secaoVendas}>
          {carregando ? (
            <Text style={styles.textoCarregando}>Carregando...</Text>
          ) : vendas.length > 0 ? (
            vendas.map(venda => <VendaItem key={venda.id} venda={venda} abrirModal={abrirModal} />)
          ) : (
            <Text style={styles.texto}>Nenhuma venda encontrada.</Text>
          )}
        </View>
      </ScrollView>

      <DetalhesVendaModal
        visivel={modalVisivel}
        venda={vendaSelecionada}
        fecharModal={fecharModal}
        navigation={navigation}
        atualizarVendas={atualizarVendas} 
      />
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20
  },
  boxTopo: {
    width: "100%",
    height: 100,
    justifyContent: "flex-end",
    alignItems: "center",
    paddingBottom: 10
  },
  botaoVoltar: {
    position: "absolute",
    top: 20,
    left: 10
  },
  tituloContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 5,
    backgroundColor: "transparent",
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#244282",
    top: 35,
    width: "80%",
    alignSelf: "center"
  },
  titulo: {
    fontSize: 25,
    fontWeight: "bold"
  },
  secaoVendas: {
    marginBottom: 20,
    marginTop: 65
  },
  texto: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 20
  },
  textoCarregando: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 20,
    color: "#244282"
  }
});
