import auth from '@react-native-firebase/auth';
import {useNavigation} from '@react-navigation/native';
import {
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
  useColorScheme,
} from 'react-native';
import {ArrowLeftIcon} from 'react-native-heroicons/outline';
import {SafeAreaView} from 'react-native-safe-area-context';

const SettingsScreen = () => {
  const navigator = useNavigation();
  const colorTheme = useColorScheme();

  const logout = () => {
    auth()
      .signOut()
      .then(() => {
        ToastAndroid.showWithGravity(
          'Logged out successfully',
          ToastAndroid.SHORT,
          ToastAndroid.TOP,
        );

        navigator.goBack();
      })
      .catch(error => {
        ToastAndroid.showWithGravity(
          'Can not Logout',
          ToastAndroid.SHORT,
          ToastAndroid.TOP,
        );
      });
  };

  return (
    <SafeAreaView
      className={`bg-zinc-900 ${
        colorTheme === 'dark' ? 'bg-zinc-900' : 'bg-gray-100'
      } flex-1`}>
      <View>
        <View
          className={` ${
            colorTheme === 'dark' ? 'bg-black' : 'bg-white'
          } py-3 px-4 flex-row items-center space-x-5 mb-3`}>
          <TouchableOpacity onPress={() => navigator.goBack()}>
            <ArrowLeftIcon
              size={20}
              color={colorTheme === 'dark' ? 'white' : 'black'}
            />
          </TouchableOpacity>
          <Text
            className={`text-lg  ${
              colorTheme === 'dark' ? 'text-gray-100' : 'text-black'
            }`}>
            Settings
          </Text>
        </View>
        <View>
          <TouchableOpacity onPress={logout}>
            <View
              className={`px-4 bg-black ${
                colorTheme === 'dark' ? 'bg-black' : 'bg-white'
              } py-3`}>
              <Text className="text-base text-red-600">Logout</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default SettingsScreen;
