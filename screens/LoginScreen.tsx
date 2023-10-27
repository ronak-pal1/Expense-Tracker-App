import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {useState} from 'react';
import {
  Image,
  Text,
  TextInput,
  ToastAndroid,
  TouchableOpacity,
  View,
  useColorScheme,
} from 'react-native';
import {EyeIcon, EyeSlashIcon} from 'react-native-heroicons/outline';
import {SafeAreaView} from 'react-native-safe-area-context';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [islogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const colorTheme = useColorScheme();
  const [hidePassword, setHidePassword] = useState(true);

  const signup = () => {
    auth()
      .createUserWithEmailAndPassword(email, password)
      .then(u => {
        // console.log('User account created & singed in');
        ToastAndroid.showWithGravity(
          'New User is created successfully',
          ToastAndroid.SHORT,
          ToastAndroid.TOP,
        );

        firestore()
          .collection('Users')
          .doc(u?.user.uid)
          .set({
            username: username,
          })
          .catch(error => {
            console.error(error);
          });
      })
      .catch(error => {
        if (error.code === 'auth/email-already-in-use') {
          // console.log('That email address is already in use!');

          ToastAndroid.showWithGravity(
            'Email address is already in use!',
            ToastAndroid.SHORT,
            ToastAndroid.TOP,
          );
        } else if (error.code === 'auth/invalid-email') {
          ToastAndroid.showWithGravity(
            'Email address is invalid',
            ToastAndroid.SHORT,
            ToastAndroid.TOP,
          );
        } else {
          ToastAndroid.showWithGravity(
            'Can not create a new user',
            ToastAndroid.SHORT,
            ToastAndroid.TOP,
          );
        }
      });
  };

  const login = () => {
    auth()
      .signInWithEmailAndPassword(email, password)
      .then(() => {
        // console.log('User is logged in');

        ToastAndroid.showWithGravity(
          'Logged in successfully',
          ToastAndroid.SHORT,
          ToastAndroid.TOP,
        );
      })
      .catch(error => {
        if (error.code === 'auth/invalid-login') {
          ToastAndroid.showWithGravity(
            'Invalid login credentials',
            ToastAndroid.SHORT,
            ToastAndroid.TOP,
          );
        } else {
          ToastAndroid.showWithGravity(
            'Can not login',
            ToastAndroid.SHORT,
            ToastAndroid.TOP,
          );
        }
      });
  };

  return (
    <SafeAreaView
      className={`flex-1 justify-center items-center ${
        colorTheme === 'dark' ? 'bg-zinc-900' : 'bg-gray-100'
      }`}>
      <View className="space-y-5 items-center">
        <Image
          source={require('../assets/OwlSpend.jpg')}
          className="w-20 h-20 rounded-full"
        />

        <View className="space-y-6 items-center">
          {!islogin && (
            <TextInput
              placeholder="Username"
              className="border border-gray-600 w-60 p-3 rounded-md"
              value={username}
              autoComplete="username"
              onChangeText={text => setUsername(text)}
            />
          )}

          <TextInput
            placeholder="Email"
            className="border border-gray-600 w-60 p-3 rounded-md"
            value={email}
            autoComplete="email"
            onChangeText={text => setEmail(text)}
          />
          <View className="flex-row items-center space-x-3 rounded-md border border-gray-600 px-1">
            <TextInput
              placeholder="Password"
              className=" w-60 p-3 rounded-md"
              value={password}
              autoComplete="password"
              secureTextEntry={hidePassword}
              onChangeText={text => setPassword(text)}
            />
            <TouchableOpacity onPress={() => setHidePassword(!hidePassword)}>
              {hidePassword ? (
                <EyeSlashIcon color={colorTheme === 'dark' ? '#fff' : '#000'} />
              ) : (
                <EyeIcon color={colorTheme === 'dark' ? '#fff' : '#000'} />
              )}
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity onPress={islogin ? login : signup}>
          <View
            className={`border  ${
              colorTheme === 'dark' ? 'border-gray-50' : 'border-gray-800'
            } p-2 rounded-md items-center justify-center w-28`}>
            <Text
              className={`text-xl ${
                colorTheme === 'dark' ? 'text-gray-100' : 'text-black'
              }`}>
              {islogin ? 'Login' : 'Signup'}
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setIsLogin(!islogin)}>
          <Text className="text-blue-700 font-light">
            {islogin ? 'Create a new user' : 'Login with previous account'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default LoginScreen;
