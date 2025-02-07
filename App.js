import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import Main from './View/screens/Main';import Settings from './View/screens/Settings';
import UpdatePassword from './View/screens/UpdatePassword'
import Login from './View/screens/Login';
import StudentReg from './View/screens/StudentReg';
import StudentSet from './View/screens/StudentSet';
import RoomList from './View/screens/RoomList';

const Stack = createNativeStackNavigator();
const Tabs = createBottomTabNavigator();

const TabNavigator = ({route }) => {
  const { username } = route.params;
  return (
    <Tabs.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          return <Ionicons name={route.name === 'Ana Menu' ? "home-outline" :  route.name === 'Oda Durum' ? "list-outline" : "settings-outline" } color={color} size={size} />
        },
      })}
    >
      <Tabs.Screen name="Ana Menu" component={Main} />
      <Tabs.Screen name="Oda Durum" component={RoomList}/>
      <Tabs.Screen name="Ayarlar">
        {() => <Settings username={username} />}
      </Tabs.Screen>
    </Tabs.Navigator>
  );
}

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Ana ekran" component={TabNavigator} options={{ headerShown: false }} />
        <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
        <Stack.Screen name="StudentReg" component={StudentReg} />
        <Stack.Screen name="Settings" component={Settings} />
        <Stack.Screen name="UpdatePassword" component={UpdatePassword} />
        <Stack.Screen name="StudentSet" component={StudentSet}/>
        <Stack.Screen name="RoomList" component={RoomList}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
