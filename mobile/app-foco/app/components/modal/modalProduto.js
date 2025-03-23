import React, { useState, useEffect } from "react";
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import {Picker} from "@react-native-picker/picker";

const ModalProduto = ({
  modalVisivel,
  setModalVisivel,
  adicionarProduto,
  atualizarProduto,
  produto,
  modo,
  estabelecimentos, 
}) => {
  const [nome, setNome] = useState("");
  const [preco, setPreco] = useState("");
  const [estoque, setEstoque] = useState("");
  const [estabelecimentoId, setEstabelecimentoId] = useState(""); 
  const [erroNome, setErroNome] = useState(false);
  const [erroPreco, setErroPreco] = useState(false);
  const [erroEstoque, setErroEstoque] = useState(false);
  const [erroEstabelecimento, setErroEstabelecimento] = useState(false);

  useEffect(() => {
    if (modo === "editar" && produto) {
      setNome(produto.nome);
      setPreco(produto.preco.toString()); 
      setEstoque(produto.estoque.toString()); 
      setEstabelecimentoId(produto.estabelecimento_id); 
    }
  }, [modo, produto]);

  const salvar = () => {
    const nomeVazio = nome.trim() === "";
    const precoVazio = preco.trim() === "";
    const estoqueVazio = estoque.trim() === "";
    const estabelecimentoVazio = estabelecimentoId === "";

    setErroNome(nomeVazio);
    setErroPreco(precoVazio);
    setErroEstoque(estoqueVazio);
    setErroEstabelecimento(estabelecimentoVazio);

    if (nomeVazio || precoVazio || estoqueVazio || estabelecimentoVazio) {
      Alert.alert("Erro", "Preencha todos os campos corretamente!");
      return;
    }


    const precoNum = parseFloat(preco.replace(",", ".")); 
    const estoqueNum = parseInt(estoque);


    if (isNaN(precoNum)) {
      Alert.alert("Erro", "O preço deve ser um número válido!");
      return;
    }


    if (isNaN(estoqueNum)) {
      Alert.alert("Erro", "O estoque deve ser um número válido!");
      return;
    }

    if (modo === "adicionar") {
      adicionarProduto(nome, precoNum, estoqueNum, estabelecimentoId); 
    } else if (modo === "editar") {
      atualizarProduto(produto.id, nome, precoNum, estoqueNum, estabelecimentoId); 
    }

    setModalVisivel(false);
    setNome("");
    setPreco("");
    setEstoque("");
    setEstabelecimentoId("");
  };

  const cancelar = () => {
    setModalVisivel(false);
    setNome("");
    setPreco("");
    setEstoque("");
    setEstabelecimentoId("");
    setErroNome(false);
    setErroPreco(false);
    setErroEstoque(false);
    setErroEstabelecimento(false);
  };

  return (
    <Modal animationType="slide" transparent={true} visible={modalVisivel} onRequestClose={cancelar}>
      <View style={estilos.containerModal}>
        <View style={estilos.conteudoModal}>
          <Text style={estilos.tituloModal}>{modo === "adicionar" ? "Novo Produto" : "Editar Produto"}</Text>

          <TextInput
            style={[estilos.input, erroNome && estilos.inputErro]}
            placeholder="Nome do Produto"
            value={nome}
            onChangeText={setNome}
          />
          {erroNome && <Text style={estilos.textoErro}>Preencha o nome do produto!</Text>}

          <TextInput
            style={[estilos.input, erroPreco && estilos.inputErro]}
            placeholder="Preço"
            value={preco}
            onChangeText={setPreco}
            keyboardType="numeric"
          />
          {erroPreco && <Text style={estilos.textoErro}>Preencha o preço do produto!</Text>}

          <TextInput
            style={[estilos.input, erroEstoque && estilos.inputErro]}
            placeholder="Estoque"
            value={estoque}
            onChangeText={setEstoque}
            keyboardType="numeric"
          />
          {erroEstoque && <Text style={estilos.textoErro}>Preencha o estoque do produto!</Text>}

          <Picker
            selectedValue={estabelecimentoId}
            onValueChange={(itemValue) => setEstabelecimentoId(itemValue)}
            style={[estilos.input, erroEstabelecimento && estilos.inputErro]}
          >
            <Picker.Item label="Selecione um estabelecimento" value="" />
            {estabelecimentos.map((estabelecimento) => (
              <Picker.Item key={estabelecimento.id} label={estabelecimento.nome} value={estabelecimento.id} />
            ))}
          </Picker>
          {erroEstabelecimento && <Text style={estilos.textoErro}>Selecione um estabelecimento!</Text>}

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
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  conteudoModal: {
    width: "80%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  tituloModal: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  inputErro: {
    borderColor: "red",
  },
  textoErro: {
    color: "red",
    fontSize: 12,
    alignSelf: "flex-start",
    marginBottom: 10,
  },
  botoesModal: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  botaoCancelar: {
    backgroundColor: "#ff4444",
    padding: 10,
    borderRadius: 5,
  },
  botaoSalvar: {
    backgroundColor: "#28a745",
    padding: 10,
    borderRadius: 5,
  },
  textoBotao: {
    color: "#fff",
    fontSize: 16,
  },
});

export default ModalProduto;