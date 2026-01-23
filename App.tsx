/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { TicketProvider } from './src/context/TicketContext';
import { AuthProvider } from './src/context/AuthContext';
import {
  SafeAreaView,
  StatusBar, useColorScheme
} from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import HomeScreen from './src/screens/HomeScreen';
import LoginScreen from './src/screens/LoginScreen';
import TravelRequestScreen from './src/screens/TravelRequestScreen';
import DummyScreen from './src/screens/DummyScreen';
import TravelSettlementScreen from './src/screens/TravelSettlementScreen';
import TravelSettlementReport from './src/screens/TravelSettlementReport';
import CreateTicketScreen from './src/screens/CreateTicketScreen';
import AddExpenseScreen from './src/screens/AddExpenseScreen';

export type RootStackParamList = {
  Login: undefined;
  Home: undefined;
  TravelRequest: undefined;
  CreateTicket: undefined;
  Dummy: undefined;
  TravelSettlement: undefined;
  TravelSettlementReport: undefined;
  AddExpense: { eriId: string; expenseName: string; ticketId: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

function App(): React.JSX.Element {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <TicketProvider>
          <NavigationContainer>
            <Stack.Navigator
              initialRouteName="Login"
              screenOptions={{
                headerShown: false,
              }}
            >
              <Stack.Screen name="Login" component={LoginScreen} />
              <Stack.Screen name="Home" component={HomeScreen} />
              <Stack.Screen name="TravelRequest" component={TravelRequestScreen} />
              <Stack.Screen name="CreateTicket" component={CreateTicketScreen} />
              <Stack.Screen name="Dummy" component={DummyScreen} />
              <Stack.Screen name="TravelSettlement" component={TravelSettlementScreen} />
              <Stack.Screen name="TravelSettlementReport" component={TravelSettlementReport} />
              <Stack.Screen name="AddExpense" component={AddExpenseScreen} />
            </Stack.Navigator>
          </NavigationContainer>
        </TicketProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}

export default App;
