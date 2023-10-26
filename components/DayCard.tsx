import firestore from '@react-native-firebase/firestore';
import {
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
  useColorScheme,
} from 'react-native';
import {PencilSquareIcon, TrashIcon} from 'react-native-heroicons/outline';

const DayCard = ({
  label,
  time,
  amount,
  index,
  id,
  userId,
  bucketLabel,
}: {
  label: String;
  time: String;
  amount: String;
  index: Number;
  id: String;
  userId: String;
  bucketLabel: String;
}) => {
  const colorTheme = useColorScheme();

  const removeCard = () => {
    firestore()
      .collection('Users')
      .doc(userId)
      .collection('Buckets')
      .doc(bucketLabel)
      .collection('bucketItems')
      .doc(id)
      .delete()
      .then(() => {
        ToastAndroid.showWithGravity(
          'Successfully deleted',
          ToastAndroid.SHORT,
          ToastAndroid.TOP,
        );
      })
      .catch(error => {
        ToastAndroid.showWithGravity(
          'Cannot delete the item',
          ToastAndroid.SHORT,
          ToastAndroid.TOP,
        );
      });
  };

  return (
    <View className="flex-row items-center">
      <Text
        className={`ml-2 text-xl ${
          colorTheme === 'dark' ? 'text-gray-200' : 'text-slate-700'
        } font-light`}>
        {String(index)}
      </Text>
      <View className="bg-green-400 mx-4 my-5 px-3 py-4 rounded-md flex-1 flex-row items-center justify-between">
        <View className="">
          <Text className="text-slate-600">{time}</Text>
          <Text className="text-base pt-1 text-black font-semibold">
            {label}
          </Text>
        </View>

        <View className="flex-row space-x-5 items-center">
          <Text className="text-slate-700 font-semibold text-xl">
            ₹{amount}
          </Text>
          <PencilSquareIcon size={23} color="#605c5c" />
          <TouchableOpacity onPress={removeCard}>
            <TrashIcon size={23} color="#ff0000" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};
export default DayCard;
