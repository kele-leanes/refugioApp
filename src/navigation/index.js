import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createStackNavigator} from '@react-navigation/stack';
import {Tables, Orders, Products} from '../screens';
import {Pressable, Text} from 'react-native';
import SQLite from 'react-native-sqlite-storage';

const db = SQLite.openDatabase({
  name: 'SQLite.db',
  location: 'default',
  createFromLocation: '~SQLite.db',
});

const Tab = createBottomTabNavigator();

const TablesStack = createStackNavigator();

function TablesStackScreen() {
  return (
    <TablesStack.Navigator>
      <TablesStack.Screen name="Mesas" component={Tables} />
    </TablesStack.Navigator>
  );
}

const OrdersStack = createStackNavigator();

function OrdersStackScreen() {
  return (
    <OrdersStack.Navigator>
      <OrdersStack.Screen name="Ordenes" component={Orders} />
    </OrdersStack.Navigator>
  );
}

export default function Navigation() {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="Mesas" component={TablesStackScreen} />
        <Tab.Screen name="Ordenes" component={OrdersStackScreen} />
        {/* <Tab.Screen name="Productos" component={Products} /> */}
      </Tab.Navigator>
    </NavigationContainer>
  );
}
