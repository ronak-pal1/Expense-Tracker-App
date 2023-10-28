import {
  ScrollView,
  Text,
  TextInput,
  ToastAndroid,
  TouchableOpacity,
  View,
  useColorScheme,
} from 'react-native';
import {
  PaperAirplaneIcon,
  PlusCircleIcon,
} from 'react-native-heroicons/outline';
import MonthCard from '../components/MonthCard';
import Header from '../components/Header';
import {useEffect, useState} from 'react';
import auth from '@react-native-firebase/auth';
import LoginScreen from './LoginScreen';
import firestore from '@react-native-firebase/firestore';

const HomeScreen = () => {
  const [user, setUser] = useState(null);
  const [isAddBasketOn, setIsAddBasketOn] = useState(false);
  const [bucketName, setBucketName] = useState('');
  const [balance, setBalance] = useState('');
  const [username, setUsername] = useState('Username');
  const [buckets, setBuckets] = useState([]);
  const colorTheme = useColorScheme();

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(user => {
      setUser(user);
    });

    return subscriber;
  }, []);

  useEffect(() => {
    // for getting all the buckets
    const subscriber = firestore()
      .collection('Users')
      .doc(user?.uid)
      .collection('Buckets')
      .orderBy('timeStamp', 'desc')
      .onSnapshot(doc => {
        const allData = [];

        doc?.docs.map(bucket => {
          allData.push({
            id: bucket.id,
            data: bucket.data(),
          });
        });
        setBuckets(allData);
      });

    // for setting the username
    if (user) {
      const getUsername = async () => {
        await firestore()
          .collection('Users')
          .doc(user?.uid)
          .get()
          .then(info => {
            setUsername(info?._data.username);
          })
          .catch(error => {
            console.log('username not found');
          });
      };

      getUsername();
    } else {
      setUsername('Username');
    }

    return subscriber;
  }, [user]);

  const createBucket = async () => {
    if (bucketName !== '' && balance !== '') {
      await firestore()
        .collection('Users')
        .doc(user?.uid)
        .collection('Buckets')
        .doc(bucketName)
        .set({
          balance: balance,
          spended: 0,
          timeStamp: firestore.FieldValue.serverTimestamp(),
        })
        .catch(error => {
          ToastAndroid.showWithGravity(
            'Can not create a bucket',
            ToastAndroid.SHORT,
            ToastAndroid.TOP,
          );
        });
    }

    setBucketName('');
    setBalance('');
    setIsAddBasketOn(false);
  };

  return (
    <>
      {user ? (
        <>
          <Header username={username} />
          <ScrollView
            className={colorTheme === 'dark' ? 'bg-zinc-900' : 'bg-gray-100'}>
            <View>
              <View className="flex-row items-center justify-between mx-4 mt-4">
                <Text
                  className={`text-2xl ${
                    colorTheme === 'dark' ? 'text-gray-200' : 'text-slate-900'
                  } font-light`}>
                  Buckets
                </Text>
                <TouchableOpacity
                  onPress={() => setIsAddBasketOn(!isAddBasketOn)}>
                  <PlusCircleIcon size={30} color="#2248f0" />
                </TouchableOpacity>
              </View>

              {buckets?.map(bucket => (
                <MonthCard
                  key={bucket.id}
                  label={bucket.id}
                  target={bucket.data.balance}
                  spended={bucket.data.spended}
                  time={'' + bucket.data.timeStamp?.toDate()}
                  userId={user?.uid}
                  username={username}
                />
              ))}
            </View>
          </ScrollView>

          {isAddBasketOn && (
            <View className={colorTheme === 'dark' ? 'bg-black' : 'bg-white'}>
              <Text
                className={`ml-5 mt-2 text-xl font-light${
                  colorTheme === 'dark' ? 'text-gray-200' : 'text-slate-800'
                }`}>
                Add a new basket
              </Text>
              <View className=" p-5 flex-row items-center justify-between">
                <View className="flex-row items-center space-x-2">
                  <TextInput
                    placeholder="Basket Name"
                    className="border border-slate-400 rounded-md w-1/2 pl-2"
                    value={bucketName}
                    onChangeText={text => setBucketName(text)}
                  />
                  <TextInput
                    placeholder="Balance"
                    keyboardType="numeric"
                    className="border border-slate-400 rounded-md w-1/3 pl-2"
                    value={balance}
                    autoComplete="off"
                    onChangeText={text => setBalance(text)}
                  />
                </View>

                <TouchableOpacity onPress={createBucket}>
                  <PaperAirplaneIcon size={30} color="#2248f0" />
                </TouchableOpacity>
              </View>
            </View>
          )}
        </>
      ) : (
        <LoginScreen />
      )}
    </>
  );
};

export default HomeScreen;
