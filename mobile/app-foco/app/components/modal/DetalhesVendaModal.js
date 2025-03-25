import React, {useState, useEffect} from "react";
import {View, Text, TouchableOpacity, Modal, StyleSheet, ScrollView, Alert} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import axios from "axios";

export default function DetalhesVendaModal({visivel, venda, fecharModal, navigation, atualizarVendas}) {
  const [nomeEstabelecimento, setNomeEstabelecimento] = useState(null);

  // Buscar o nome do estabelecimento a partir do id
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

 const excluirVenda = async () => {
   Alert.alert(
     "Confirmar Exclusão",
     "Tem certeza que deseja excluir esta venda?",
     [
       {
         text: "Cancelar",
         style: "cancel"
       },
       {
         text: "Excluir",
         style: "destructive",
         onPress: async () => {
           try {
             // Deleta a venda
             await axios.delete(`http://172.23.96.1:8989/api/vendas/${venda.id}`);

             // Fecha o modal
             fecharModal();

             // Atualiza a lista de vendas
             if (atualizarVendas) {
               atualizarVendas();
             }

             // Exibe o alert de sucesso
             Alert.alert("Sucesso", "Venda excluída com sucesso.");
           } catch (erro) {
             console.error("Erro ao excluir a venda:", erro);
             Alert.alert("Erro", "Não foi possível excluir a venda.");
           }
         }
       }
     ],
     {cancelable: true}
   );
 };


  if (!venda) return null;

  return (
    <Modal visible={visivel} animationType="slide" transparent={true}>
      <TouchableOpacity style={estilos.modalContainer} activeOpacity={1} onPress={fecharModal}>
        <View style={estilos.modalConteudo}>
          <TouchableOpacity onPress={fecharModal} style={estilos.botaoFechar}>
            <Icon name="close" size={28} color="#244282" />
          </TouchableOpacity>

          <Text style={estilos.modalTitulo}>Venda #{venda.id}</Text>
          <Text style={estilos.modalSubtitulo}>{nomeEstabelecimento || "Carregando..."}</Text>

          <ScrollView style={estilos.scrollArea} showsVerticalScrollIndicator={false}>
            <Text style={estilos.tituloProdutos}>Produtos</Text>

            {venda.produtos.map(produto => (
              <View key={produto.id} style={estilos.itemProduto}>
                <View style={estilos.produtoInfo}>
                  <Text style={estilos.produtoNome}>{produto.nome}</Text>
                  <Text style={estilos.produtoQuantidade}>Qtd: {produto.pivot.quantidade}</Text>
                </View>
                <Text style={estilos.produtoPreco}>R$ {parseFloat(produto.pivot.preco_unitario).toFixed(2)}</Text>
              </View>
            ))}

            <View style={estilos.resumoVenda}>
              <View style={estilos.resumoLinha}>
                <Text style={estilos.textoResumo}>
                  Taxa: <Text style={estilos.destaque}>{venda.taxa}%</Text>
                </Text>
                <Text style={estilos.textoResumo}>
                  Desconto: <Text style={estilos.destaque}>{venda.desconto}%</Text>
                </Text>
              </View>

              <Text style={estilos.totalVenda}>
                Total: <Text style={estilos.totalValor}>R$ {parseFloat(venda.total).toFixed(2)}</Text>
              </Text>
            </View>
          </ScrollView>

          <View style={estilos.botaoContainer}>
            <TouchableOpacity style={estilos.botaoExcluir} onPress={excluirVenda}>
              <Text style={estilos.textoBotao}>Excluir</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={estilos.botaoEditar}
              onPress={() => {
                fecharModal();
                navigation.navigate("ProdutoVenda", {
                  venda: venda,
                  produtos: venda.produtos.map(p => ({
                    ...p,
                    quantidade: p.pivot.quantidade,
                    preco: p.pivot.preco_unitario
                  })),
                  taxa: venda.taxa,
                  desconto: venda.desconto
                });
              }}
            >
              <Text style={estilos.textoBotao}>Editar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

const estilos = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.6)"
  },
  modalConteudo: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 20,
    elevation: 5,
    maxHeight: "80%"
  },
  modalTitulo: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#244282",
    textAlign: "center",
    marginBottom: 5
  },
  modalSubtitulo: {
    fontSize: 18,
    fontWeight: "600",
    color: "#555",
    textAlign: "center",
    marginBottom: 15
  },
  tituloProdutos: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
    textAlign: "center"
  },
  botaoFechar: {
    position: "absolute",
    top: 15,
    right: 15,
    padding: 5
  },
  scrollArea: {
    maxHeight: 300
  },
  itemProduto: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd"
  },
  produtoInfo: {
    flexDirection: "column"
  },
  produtoNome: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333"
  },
  produtoQuantidade: {
    fontSize: 14,
    color: "#666"
  },
  produtoPreco: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#27AE60"
  },
  resumoVenda: {
    marginTop: 15
  },
  resumoLinha: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 30
  },
  textoResumo: {
    fontSize: 16,
    color: "#333",
    marginBottom: 5
  },
  destaque: {
    fontWeight: "bold",
    color: "#244282"
  },
  totalVenda: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
    marginTop: 10,
    textAlign: "center"
  },
  totalValor: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#27AE60"
  },
  botaoContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15
  },
  botaoEditar: {
    backgroundColor: "#244282",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    width: "48%"
  },
  botaoExcluir: {
    backgroundColor: "#E74C3C",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    width: "48%"
  },
  textoBotao: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold"
  }
});
