import React from "react";
import {NavigationContainer} from "@react-navigation/native";
import {createStackNavigator} from "@react-navigation/stack";

// Importando as telas
import HomeScreen from "./app/screens/HomeScreen";
import EstabelecimentoScreen from "./app/screens/EstabelecimentoScreen";
import ProdutoScreen from "./app/screens/ProdutoScreen";
import VendaScreen from "./app/screens/VendaScreen";
import ProdutoVendaScreen from "./app/screens/ProdutoVendaScreen";
import ListaVendaScreen from "./app/screens/ListaVendaScreen";

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} options={{headerShown: false}} />
        <Stack.Screen name="Estabelecimento" component={EstabelecimentoScreen} options={{headerShown: false}} />
        <Stack.Screen name="Produto" component={ProdutoScreen} options={{headerShown: false}} />
        <Stack.Screen name="Venda" component={VendaScreen} options={{headerShown: false}} />
        <Stack.Screen name="ProdutoVenda" component={ProdutoVendaScreen} options={{headerShown: false}} />
        <Stack.Screen name="ListaVendas" component={ListaVendaScreen} options={{headerShown: false}} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
