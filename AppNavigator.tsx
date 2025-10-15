import React from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import ProfileScreen from '../screens/ProfileScreen';
import CreateLookScreen from '../screens/CreateLookScreen';
import MyLooksScreen from '../screens/MyLooksScreen';
import LookDetailScreen from '../screens/LookDetailScreen';

export type RootStackParamList = {
  Tabs: undefined;
  LookDetail: { lookId: string };
};

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator<RootStackParamList>();

const TabNavigator = () => (
  <Tab.Navigator
    screenOptions={{
      headerShown: false,
      tabBarActiveTintColor: '#d17ca7',
      tabBarInactiveTintColor: '#c3c3c3',
      tabBarStyle: {
        backgroundColor: '#ffffff',
        borderTopColor: '#f0e9e6',
        height: 70,
        paddingBottom: 12,
        paddingTop: 10,
      },
    }}
  >
    <Tab.Screen
      name="Perfil"
      component={ProfileScreen}
      options={{
        tabBarIcon: ({ color, size }) => <Feather name="user" size={size} color={color} />,
      }}
    />
    <Tab.Screen
      name="Crear look"
      component={CreateLookScreen}
      options={{
        tabBarIcon: ({ color, size }) => <MaterialCommunityIcons name="palette-outline" size={size} color={color} />,
      }}
    />
    <Tab.Screen
      name="Mis looks"
      component={MyLooksScreen}
      options={{
        tabBarIcon: ({ color, size }) => <Feather name="heart" size={size} color={color} />,
      }}
    />
  </Tab.Navigator>
);

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: '#fdf8f5',
  },
};

const AppNavigator = () => (
  <NavigationContainer theme={theme}>
    <Stack.Navigator>
      <Stack.Screen name="Tabs" component={TabNavigator} options={{ headerShown: false }} />
      <Stack.Screen
        name="LookDetail"
        component={LookDetailScreen}
        options={{
          title: 'Detalle del look',
          headerStyle: { backgroundColor: '#fdf8f5' },
          headerShadowVisible: false,
        }}
      />
    </Stack.Navigator>
  </NavigationContainer>
);

export default AppNavigator;