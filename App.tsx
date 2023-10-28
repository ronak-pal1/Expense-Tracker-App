import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React, {useLayoutEffect} from 'react';
import {StatusBar, Text, View, useColorScheme} from 'react-native';
import HomeScreen from './screens/HomeScreen';
import changeNavigationBarColor from 'react-native-navigation-bar-color';
import ExpenseScreen from './screens/ExpenseScreen';
import SettingsScreen from './screens/SettingsScreen';
import LoginScreen from './screens/LoginScreen';

// ./gradlew assemblerelease --> to create a release app
const Stack = createNativeStackNavigator();

function App(): JSX.Element {
  const colorTheme = useColorScheme();

  changeNavigationBarColor(colorTheme === 'dark' ? '#1a1818' : 'white', false);

  return (
    <NavigationContainer>
      <StatusBar
        backgroundColor={colorTheme === 'dark' ? 'black' : 'white'}
        barStyle={colorTheme === 'dark' ? 'light-content' : 'dark-content'}
      />
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Expense"
          component={ExpenseScreen}
          options={{headerShown: false}}
        />

        <Stack.Screen
          name="Settings"
          component={SettingsScreen}
          options={{headerShown: false}}
        />

        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{headerShown: false}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
