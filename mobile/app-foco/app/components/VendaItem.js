import React, {useState, useEffect} from "react";
import {View, Text, TouchableOpacity, StyleSheet} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import axios from "axios";

export default function VendaItem({venda, abrirModal}) {
  const [nomeEstabelecimento, setNomeEstabelecimento] = useState(null);

  useEffect(() => {
    if (venda && venda.estabelecimento_id) {
      const buscarEstabelecimento = async () => {
        try {
          const resposta = await axios.get(`http://172.23.96.1:8989/api/estabelecimentos/${venda.estabelecimento_id}`);
          setNomeEstabelecimento(resposta.data.nome);
        } catch (erro) {
          console.error("Erro ao buscar o nome do estabelecimento:", erro);
        }
      };

      buscarEstabelecimento();
    }
  }, [venda]);

  const totalFormatado = parseFloat(venda.total).toFixed(2);

  return (
    <TouchableOpacity style={estilos.vendaItem} onPress={() => abrirModal(venda)}>
      <View style={estilos.conteudoVenda}>
        <View style={estilos.infoSuperior}>
          <Text style={estilos.vendaId}>Venda #{venda.id}</Text>
          <Text style={estilos.vendaEstabelecimento}>• {nomeEstabelecimento || "Carregando..."}</Text>
        </View>

        <View style={estilos.infoInferior}>
          <Text style={estilos.vendaTotal}>Total: R$ {totalFormatado}</Text>
          <Icon name="chevron-forward" size={24} color="#244282" style={estilos.icone} />
        </View>
      </View>
    </TouchableOpacity>
  );
}

const estilos = StyleSheet.create({
  vendaItem: {
    backgroundColor: "#fff",
    marginBottom: 15,
    borderRadius: 12,
    padding: 18,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowOffset: {width: 0, height: 3},
    shadowRadius: 5,
    elevation: 4,
    borderLeftWidth: 6,
    borderLeftColor: "#244282"
  },
  conteudoVenda: {
    flexDirection: "column",
    justifyContent: "space-between"
  },
  infoSuperior: {
    flexDirection: "row",
    alignItems: "center"
  },
  vendaId: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#244282"
  },
  vendaEstabelecimento: {
    fontSize: 16,
    color: "#555",
    marginLeft: 6
  },
  infoInferior: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 6
  },
  vendaTotal: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333"
  },
  icone: {
    marginLeft: 10
  }
});
