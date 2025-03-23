import React from "react";
import {View, Text, StyleSheet, Image, Dimensions, ImageBackground, TouchableOpacity} from "react-native";
import logo from "../../assets/logo-foco.png";
import ButtonCustom from "../components/ButtonCustom";
import {useFonts} from "expo-font";

export default function HomeScreen({navigation}) {
  const [fontsLoaded] = useFonts({
    CoreSansD65Heavy: require("../../assets/fonts/CoreSansD65Heavy.otf")
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <ImageBackground source={require("../../assets/background.png")} style={styles.container}>
      <View style={styles.boxTop}>
        <Image style={styles.logo} source={logo} resizeMode="contain" />
        <View style={styles.textsContainer}>
          <Text style={styles.title}>Foco</Text>
          <Text style={styles.subtitle}>Serviços</Text>
        </View>
      </View>
      <Image source={require("../../assets/linha.png")} style={styles.lineImage} />
      <View style={styles.boxMid}>
        <ButtonCustom title="Gerenciar Estabelecimentos" onPress={() => navigation.navigate("Estabelecimento")} />
        <ButtonCustom title="Gerenciar Produtos" onPress={() => navigation.navigate("Produto")} />
        <ButtonCustom title="Gerenciar Vendas" onPress={() => navigation.navigate("ListaVendas")} />

        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("ProdutoVenda")}>
          <Text style={styles.buttonText}>Realizar Venda</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.boxBottom}></View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 0
  },
  boxTop: {
    width: "100%",
    height: Dimensions.get("window").height / 3,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1
  },
  textsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 10
  },
  lineImage: {
    width: 290,
    height: 60,
    position: "absolute",
    top: 233,
    left: 64
  },
  title: {
    fontFamily: "CoreSansD65Heavy",
    fontSize: 45,
    color: "#244282",
    marginRight: 5,
    textShadowColor: "#fff",
    textShadowOffset: {width: 1, height: 1},
    textShadowRadius: 5
  },
  subtitle: {
    fontFamily: "CoreSansD65Heavy",
    fontSize: 45,
    color: "#f2cb31",
    textShadowColor: "#000", 
    textShadowOffset: {width: 1, height: 1},
    textShadowRadius: 5
  },
  boxMid: {
    width: "100%",
    height: Dimensions.get("window").height / 2.4,
    justifyContent: "center",
    alignItems: "center",
    top: 30
  },
  boxBottom: {
    width: "100%",
    height: Dimensions.get("window").height / 4,
    justifyContent: "center",
    alignItems: "center"
  },
  logo: {
    width: "100%",
    height: 165,
    aspectRatio: 1
  },
  button: {
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    width: "75%",
    height: 50,
    marginBottom: 17,
    shadowColor: "#000", 
    shadowOffset: {width: 0, height: 4}, 
    shadowOpacity: 0.3, 
    shadowRadius: 10, 
    elevation: 5, 
    marginTop: 60
  },
  buttonText: {
    color: "#244282",
    fontSize: 16,
    fontWeight: "bold"
  }
});
