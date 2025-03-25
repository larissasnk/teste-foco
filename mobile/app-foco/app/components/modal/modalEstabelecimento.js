import React, {useState, useEffect} from "react";
import {Modal, View, Text, TextInput, TouchableOpacity, StyleSheet, Alert} from "react-native";

const ModalEstabelecimento = ({
  modalVisivel,
  setModalVisivel,
  adicionarEstabelecimento,
  atualizarEstabelecimento,
  deletarEstabelecimento,
  estabelecimento,
  modo
}) => {
  const [nome, setNome] = useState("");
  const [endereco, setEndereco] = useState("");
  const [erroNome, setErroNome] = useState(false);
  const [erroEndereco, setErroEndereco] = useState(false);

  useEffect(() => {
    if (modo === "editar" && estabelecimento) {
      setNome(estabelecimento.nome);
      setEndereco(estabelecimento.endereco);
      console.log("Modal para edição - Estabelecimento:", estabelecimento);
    } else {
      setNome("");
      setEndereco("");
      console.log("Modal para adicionar um novo estabelecimento.");
    }
  }, [modo, estabelecimento]);

  const salvar = () => {
    console.log("Tentando salvar estabelecimento:", nome, endereco);

    const nomeVazio = nome.trim() === "";
    const enderecoVazio = endereco.trim() === "";

    setErroNome(nomeVazio);
    setErroEndereco(enderecoVazio);

    if (nomeVazio || enderecoVazio) {
      Alert.alert("Erro", "Preencha todos os campos corretamente!");
      console.log("Erro: campos vazios.");
      return;
    }

    // Se estiver no modo de adicionar, chama a função de adicionar, caso contrário, atualiza
    if (modo === "adicionar") {
      console.log("Modo adicionar: Enviando dados para adicionar.");
      adicionarEstabelecimento(nome, endereco);
    } else if (modo === "editar") {
      console.log("Modo editar: Enviando dados para atualização.");
      atualizarEstabelecimento(estabelecimento.id, nome, endereco);
    }

    // Após salvar, fecha o modal e limpa os campos
    setModalVisivel(false);
    setNome("");
    setEndereco("");
    console.log("Modal fechado e campos resetados.");
  };

  const cancelar = () => {
    console.log("Cancelar ação no modal.");
    setModalVisivel(false);
    setNome("");
    setEndereco("");
    setErroNome(false);
    setErroEndereco(false);
  };

  return (
    <Modal animationType="slide" transparent={true} visible={modalVisivel} onRequestClose={cancelar}>
      <View style={estilos.containerModal}>
        <View style={estilos.conteudoModal}>
          <Text style={estilos.tituloModal}>
            {modo === "adicionar" ? "Novo Estabelecimento" : "Editar Estabelecimento"}
          </Text>

          <TextInput
            style={[estilos.input, erroNome && estilos.inputErro]}
            placeholder="Nome do Estabelecimento"
            value={nome}
            onChangeText={setNome}
          />
          {erroNome && <Text style={estilos.textoErro}>Preencha o nome do estabelecimento!</Text>}

          <TextInput
            style={[estilos.input, erroEndereco && estilos.inputErro]}
            placeholder="Endereço"
            value={endereco}
            onChangeText={setEndereco}
          />
          {erroEndereco && <Text style={estilos.textoErro}>Preencha o endereço do estabelecimento!</Text>}

          <View style={estilos.botoesModal}>
            <TouchableOpacity style={estilos.botaoCancelar} onPress={cancelar}>
              <Text style={estilos.textoBotao}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={estilos.botaoSalvar} onPress={salvar}>
              <Text style={estilos.textoBotao}>{modo === "adicionar" ? "Salvar" : "Atualizar"}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const estilos = StyleSheet.create({
  containerModal: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)"
  },
  conteudoModal: {
    width: "80%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    alignItems: "center"
  },
  tituloModal: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#244282"
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    marginBottom: 10,
    borderRadius: 5
  },
  inputErro: {
    borderColor: "red" // Borda vermelha para indicar erro
  },
  textoErro: {
    color: "red",
    fontSize: 12,
    alignSelf: "flex-start",
    marginBottom: 10
  },
  botoesModal: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 10
  },
  botaoCancelar: {
    backgroundColor: "#ff4444",
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginRight: 5
  },
  botaoSalvar: {
    backgroundColor: "#28a745",
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginLeft: 5
  },
  textoBotao: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center"
  }
});

export default ModalEstabelecimento;
