import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createStackNavigator} from '@react-navigation/stack';
import {Tables, Orders, Products} from '../screens';
import {Theme} from '../constants';
import LogoTitle from '../components/LogoTitle';

const Tab = createBottomTabNavigator();

const TablesStack = createStackNavigator();

function TablesStackScreen() {
  return (
    <TablesStack.Navigator>
      <TablesStack.Screen
        name="Mesas"
        component={Tables}
        options={{
          headerLeft: () => <LogoTitle />,
          headerRightContainerStyle: {paddingRight: 20},
          headerLeftContainerStyle: {paddingLeft: 20},
          headerTitleAlign: 'center',
          headerStyle: {
            backgroundColor: Theme.COLORS.PRIMARY,
            height: 80,
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontFamily: Theme.FONT.FAMILY,
            fontSize: 40,
          },
        }}
      />
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
