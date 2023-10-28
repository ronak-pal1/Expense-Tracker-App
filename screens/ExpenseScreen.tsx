import {
  ScrollView,
  Text,
  TextInput,
  ToastAndroid,
  TouchableOpacity,
  View,
  useColorScheme,
} from 'react-native';
import DayCard from '../components/DayCard';
import {PaperAirplaneIcon} from 'react-native-heroicons/outline';
import Header from '../components/Header';
import {useEffect, useState} from 'react';
import firestore from '@react-native-firebase/firestore';

const ExpenseScreen = ({route}: {route: any}) => {
  // for fetching from navigation -> route.params.label

  const [label, setLabel] = useState('');
  const [amount, setAmount] = useState('');
  const [bucketItems, setBucketItems] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const colorTheme = useColorScheme();

  useEffect(() => {
    const subscriber = firestore()
      .collection('Users')
      .doc(route.params.userId)
      .collection('Buckets')
      .doc(route.params.label)
      .collection('bucketItems')
      .orderBy('timeStamp', 'desc')
      .onSnapshot(doc => {
        const allItems = [];

        doc.docs.map(item => {
          allItems.push({
            id: item.id,
            data: item.data(),
          });
        });

        setBucketItems(allItems);
      });

    return subscriber;
  }, []);

  useEffect(() => {
    let total = 0;
    bucketItems.map(item => {
      total += Number(item?.data.amount);
    });

    setTotalAmount(total);

    firestore()
      .collection('Users')
      .doc(route.params.userId)
      .collection('Buckets')
      .doc(route.params.label)
      .update({
        spended: total,
      })
      .catch(error => {
        ToastAndroid.showWithGravity(
          'Something went wrong',
          ToastAndroid.SHORT,
          ToastAndroid.TOP,
        );
      });
  }, [bucketItems]);

  const createItem = async () => {
    if (label !== '' && amount !== '') {
      await firestore()
        .collection('Users')
        .doc(route.params.userId)
        .collection('Buckets')
        .doc(route.params.label)
        .collection('bucketItems')
        .add({
          label: label,
          amount: amount,
          timeStamp: firestore.FieldValue.serverTimestamp(),
        })
        .catch(error => {
          ToastAndroid.showWithGravity(
            'Can not add item in bucket',
            ToastAndroid.SHORT,
            ToastAndroid.TOP,
          );
        });
    }

    setLabel('');
    setAmount('');
  };

  return (
    <>
      <Header username={route.params.username} />
      <View
        className={`flex-1 bg-slate-50 ${
          colorTheme === 'dark' ? 'bg-zinc-900' : 'bg-gray-100'
        }`}>
        <View className="flex-row items-center justify-between mx-4 mb-3 mt-4">
          <Text
            className={`text-2xl ${
              colorTheme === 'dark' ? 'text-gray-200' : 'text-slate-900'
            } font-light`}>
            {route.params.label}
          </Text>
          <Text
            className={`${
              colorTheme === 'dark' ? 'text-gray-400' : 'text-slate-600'
            } font-extralight`}>
            {route.params.time}
          </Text>
        </View>

        <ScrollView className="">
          {bucketItems?.map((item, index) => (
            <DayCard
              index={bucketItems?.length - index}
              key={item?.id}
              id={item?.id}
              label={item?.data.label}
              amount={item?.data.amount}
              time={'' + item?.data.timeStamp?.toDate()}
              userId={route.params.userId}
              bucketLabel={route.params.label}
            />
          ))}
        </ScrollView>

        <View className={colorTheme === 'dark' ? 'bg-black' : 'bg-white'}>
          <View
            className={`flex-row items-center justify-end pr-5 pb-1 border-b  ${
              colorTheme === 'dark' ? 'border-gray-200' : 'border-slate-400'
            }`}>
            <Text
              className={`ml-5 mt-2 text-xl font-light  ${
                colorTheme === 'dark' ? 'text-gray-200' : 'text-slate-800'
              }`}>
              Total: <Text className="font-medium">₹{totalAmount}</Text>
            </Text>
            <Text
              className={`ml-5 mt-2 text-xl font-ligh ${
                colorTheme === 'dark' ? 'text-gray-200' : 'text-slate-800'
              }`}>
              Balance:{' '}
              <Text className="font-medium">₹{route.params.target}</Text>
            </Text>
          </View>

          <Text
            className={`ml-5 mt-2 text-xl font-light ${
              colorTheme === 'dark' ? 'text-gray-200' : 'text-slate-800'
            }`}>
            Add Expense
          </Text>
          <View className=" p-5 flex-row items-center justify-between">
            <View className="flex-row items-center space-x-2">
              <TextInput
                placeholder="Label"
                className="border border-slate-400 rounded-md w-1/2 pl-2"
                value={label}
                onChangeText={text => setLabel(text)}
              />
              <TextInput
                placeholder="Amount"
                keyboardType="numeric"
                className="border border-slate-400 rounded-md w-1/3 pl-2"
                value={amount}
                autoComplete="off"
                onChangeText={text => setAmount(text)}
              />
            </View>

            <TouchableOpacity onPress={createItem}>
              <PaperAirplaneIcon size={30} color="#2248f0" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </>
  );
};

export default ExpenseScreen;
