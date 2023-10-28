import firestore from '@react-native-firebase/firestore';
import {useNavigation} from '@react-navigation/native';
import {Text, ToastAndroid, TouchableOpacity, View} from 'react-native';
import {
  ChevronDoubleRightIcon,
  TrashIcon,
} from 'react-native-heroicons/outline';
import LinearGradient from 'react-native-linear-gradient';

const MonthCard = ({
  label,
  target,
  spended,
  time,
  userId,
  username,
}: {
  label: String;
  target: Number;
  spended: Number;
  time: String;
  userId: String;
  username: String;
}) => {
  let color;
  let isGradient = false;
  const navigation = useNavigation();

  // calculating the color of the buckets

  if (Number(spended) <= Number(target) / 2) {
    color = '#4ade80';
  } else if (
    Number(spended) > Number(target) / 2 &&
    Number(spended) < Number(target)
  ) {
    isGradient = true;
  } else if (Number(spended) >= Number(target)) {
    color = '#ef4444';
  }

  const clickFun = () => {
    navigation.navigate('Expense', {
      label: label,
      target: target,
      time: time,
      userId: userId,
      username: username,
    });
  };

  const removeBucket = () => {
    firestore()
      .collection('Users')
      .doc(userId)
      .collection('Buckets')
      .doc(label)
      .delete()
      .then(() => {
        ToastAndroid.showWithGravity(
          'Deleted the bucket',
          ToastAndroid.SHORT,
          ToastAndroid.TOP,
        );
      })
      .catch(error => {
        ToastAndroid.showWithGravity(
          'Can not delete the bucket',
          ToastAndroid.SHORT,
          ToastAndroid.TOP,
        );
      });
  };

  return (
    <View className="flex-row items-center ml-2">
      <TouchableOpacity onPress={removeBucket}>
        <TrashIcon size={25} color="#ff0000" />
      </TouchableOpacity>
      <TouchableOpacity onPress={clickFun} className="flex-1">
        <LinearGradient
          className={`mx-4 my-5 rounded-md p-2 py-4 shadow-lg`}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 0}}
          colors={isGradient ? ['#4ade80', '#ef4444'] : [color, color]}>
          <View>
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center space-x-2">
                <Text className="text-xl text-slate-800 font-bold">
                  {label}
                </Text>
                <Text className="text-xs text-slate-800 font-light">
                  {time}
                </Text>
              </View>

              <ChevronDoubleRightIcon size={25} color="#242323" />
            </View>
            <View className="flex-row items-center space-x-4 mt-6 border-b border-b-gray-500 pb-3">
              <Text className="text-xl">
                <Text className="text-gray-700 font-light">Balance:</Text>{' '}
                <Text className="text-slate-700 font-semibold">₹{target}</Text>
              </Text>

              <Text className="text-xl">
                <Text className="text-gray-700 font-light">Spened:</Text>{' '}
                <Text className="text-slate-700 font-semibold">₹{spended}</Text>
              </Text>
            </View>

            <View className="flex-row items-center justify-between">
              <View>
                <Text className="text-xl mt-3">
                  <Text className="text-gray-700 font-light">Remaining:</Text>{' '}
                  <Text className="text-slate-700 font-semibold">
                    ₹{target - spended}
                  </Text>
                </Text>
              </View>
            </View>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
};

export default MonthCard;
