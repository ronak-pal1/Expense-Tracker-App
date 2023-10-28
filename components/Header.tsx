import {useNavigation} from '@react-navigation/native';
import {useContext, useEffect, useState} from 'react';
import {SafeAreaView, Text, View, useColorScheme} from 'react-native';
import {Cog8ToothIcon, UserCircleIcon} from 'react-native-heroicons/outline';
import firestore from '@react-native-firebase/firestore';

const Header = ({username}: {username: string}) => {
  const navigator = useNavigation();
  const colorTheme = useColorScheme();
  const goSettings = () => {
    navigator.navigate('Settings');
  };

  return (
    <SafeAreaView className={colorTheme === 'dark' ? 'bg-black' : 'bg-white'}>
      <View className="ml-5 mt-4 mb-3 flex-row items-center space-x-1">
        <Text className="text-blue-500 text-2xl">OwlSpender</Text>
        <Text className="text-green-400 text-xs">v1.0.0</Text>
      </View>
      <View className="flex-row items-center justify-between px-3 mt-4 mb-5">
        <View className="flex-row items-center space-x-3">
          <UserCircleIcon
            size={40}
            color={colorTheme === 'dark' ? '#9d9c9c' : 'black'}
          />
          <Text
            className={`${
              colorTheme === 'dark' ? 'text-white' : 'text-slate-800'
            } text-xl font-light`}>
            {username}
          </Text>
        </View>
        <Cog8ToothIcon size={30} color="#2248f0" onPress={goSettings} />
      </View>
    </SafeAreaView>
  );
};

export default Header;
