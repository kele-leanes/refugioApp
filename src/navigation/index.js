import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createStackNavigator} from '@react-navigation/stack';
import {Tables, Orders, Products} from '../screens';
import {Theme} from '../constants';
import LogoTitle from '../components/LogoTitle';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const Tab = createBottomTabNavigator();

const TablesStack = createStackNavigator();

const options = {
  // headerLeft: () => <LogoTitle />,
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
};

function TablesStackScreen() {
  return (
    <TablesStack.Navigator>
      <TablesStack.Screen name="Mesas" component={Tables} options={options} />
      <TablesStack.Screen
        name="Cargar orden"
        component={Orders}
        options={options}
      />
    </TablesStack.Navigator>
  );
}

const ProductsStack = createStackNavigator();

function ProductsStackScreen() {
  return (
    <ProductsStack.Navigator>
      <ProductsStack.Screen
        name="Productos"
        component={Products}
        options={options}
      />
    </ProductsStack.Navigator>
  );
}

export default function Navigation() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({route}) => ({
          tabBarIcon: ({focused, color, size}) => {
            let iconName;
            if (route.name === 'Mesas') {
              iconName = focused ? 'table-chair' : 'table-chair';
            } else if (route.name === 'Productos') {
              iconName = focused ? 'clipboard-list' : 'clipboard-list';
            }
            return <Icon name={iconName} size={size} color={color} />;
          },
        })}
        tabBarOptions={{
          activeTintColor: Theme.COLORS.WHITE,
          inactiveTintColor: 'grey',
          style: {
            backgroundColor: Theme.COLORS.PRIMARY,
            borderTopColor: Theme.COLORS.PRIMARY,
          },
        }}>
        <Tab.Screen name="Mesas" component={TablesStackScreen} />
        <Tab.Screen name="Productos" component={ProductsStackScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
