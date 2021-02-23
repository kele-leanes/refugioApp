import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createStackNavigator} from '@react-navigation/stack';
import {Tables, Orders, Products, Summary} from '../screens';
import {Theme} from '../constants';
import LogoTitle from '../components/LogoTitle';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import BtPrinterSelector from '../components/BtPrinterSelector';

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
      <TablesStack.Screen
        name="Conectar impresora"
        component={BtPrinterSelector}
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

const SummaryStack = createStackNavigator();

function SummaryStackScreen() {
  return (
    <SummaryStack.Navigator>
      <SummaryStack.Screen
        name="Resumen"
        component={Summary}
        options={options}
      />
    </SummaryStack.Navigator>
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
              iconName = 'table-chair';
            } else if (route.name === 'Productos') {
              iconName = 'clipboard-list';
            } else if (route.name === 'Resumen') {
              iconName = 'file-chart';
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
        <Tab.Screen name="Resumen" component={SummaryStackScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
