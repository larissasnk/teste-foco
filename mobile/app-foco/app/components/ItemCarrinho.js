import React from "react";
import {View, Text, TouchableOpacity, StyleSheet} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

export default function ItemCarrinho({produto, quantidade, aumentarQuantidade, diminuirQuantidade}) {
  return (
    <View style={estilos.itemProduto}>
      <View style={estilos.cabecalhoProduto}>
        <Text style={estilos.nomeProduto}>{produto.nome}</Text>
        <View style={estilos.controleQuantidade}>
          <TouchableOpacity onPress={() => diminuirQuantidade(produto.id)} style={estilos.botaoQuantidade}>
            <Icon name="remove-circle-outline" size={20} color="#244282" />
          </TouchableOpacity>
          <Text style={estilos.textoQuantidade}>{quantidade}</Text>
          <TouchableOpacity
            onPress={() => aumentarQuantidade(produto.id, produto.estoque)}
            style={estilos.botaoQuantidade}
          >
            <Icon name="add-circle-outline" size={20} color="#244282" />
          </TouchableOpacity>
        </View>
      </View>
      <Text style={estilos.precoUnitario}>
        Valor Unitário: R$ {produto.preco ? parseFloat(produto.preco).toFixed(2) : "0.00"}
      </Text>
      <Text style={estilos.estoqueProduto}>Estoque: {produto.estoque}</Text>
    </View>
  );
}

const estilos = StyleSheet.create({
  itemProduto: {
    marginBottom: 15,
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#fff",
    shadowColor: "#000",
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4
  },
  cabecalhoProduto: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  nomeProduto: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333"
  },
  controleQuantidade: {
    flexDirection: "row",
    alignItems: "center"
  },
  botaoQuantidade: {
    marginHorizontal: 10,
    padding: 10,
    borderRadius: 50
  },
  textoQuantidade: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333"
  },
  precoUnitario: {
    fontSize: 16,
    color: "#333",
    marginTop: 5
  },
  estoqueProduto: {
    fontSize: 14,
    color: "#888",
    marginTop: 5
  }
});
