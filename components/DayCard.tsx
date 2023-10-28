import firestore from '@react-native-firebase/firestore';
import {useState} from 'react';
import {
  Text,
  TextInput,
  ToastAndroid,
  TouchableOpacity,
  View,
  useColorScheme,
} from 'react-native';
import {
  CheckIcon,
  PencilSquareIcon,
  TrashIcon,
  XMarkIcon,
} from 'react-native-heroicons/outline';

const DayCard = ({
  label,
  time,
  amount,
  index,
  id,
  userId,
  bucketLabel,
}: {
  label: string;
  time: string;
  amount: string;
  index: Number;
  id: string;
  userId: string;
  bucketLabel: string;
}) => {
  const colorTheme = useColorScheme();
  const [changedLabel, setChangedLabel] = useState(label);
  const [changedAmount, setChangedAmount] = useState(amount);
  const [showUpdateSection, setShowUpdateSection] = useState(false);

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

  const updateCard = () => {
    firestore()
      .collection('Users')
      .doc(userId)
      .collection('Buckets')
      .doc(bucketLabel)
      .collection('bucketItems')
      .doc(id)
      .update({
        amount: changedAmount,
        label: changedLabel,
      })
      .then(() => {
        ToastAndroid.showWithGravity(
          'Successfully updated',
          ToastAndroid.SHORT,
          ToastAndroid.TOP,
        );
      })
      .catch(error => {
        ToastAndroid.showWithGravity(
          'Cannot update the item',
          ToastAndroid.SHORT,
          ToastAndroid.TOP,
        );
      });

    setShowUpdateSection(false);
  };

  return (
    <View className="flex-row items-center">
      <Text
        className={`ml-1 text-base ${
          colorTheme === 'dark' ? 'text-gray-200' : 'text-slate-700'
        } font-light`}>
        {String(index)}
      </Text>
      <View className="flex-1">
        {showUpdateSection && (
          <View className=" p-1 flex-row items-center justify-between">
            <View className="flex-row items-center space-x-2">
              <TextInput
                placeholder="Particulars"
                className="border border-slate-400 rounded-md w-1/2 pl-2 py-1"
                value={changedLabel}
                onChangeText={text => setChangedLabel(text)}
              />
              <TextInput
                placeholder="Amount"
                keyboardType="numeric"
                className="border border-slate-400 rounded-md w-1/3 pl-2 py-1"
                value={changedAmount}
                autoComplete="off"
                onChangeText={text => setChangedAmount(text)}
              />
            </View>

            <TouchableOpacity onPress={updateCard}>
              <CheckIcon size={20} color="#2248f0" />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setShowUpdateSection(false)}>
              <XMarkIcon size={20} color="#ef3535" />
            </TouchableOpacity>
          </View>
        )}

        <View className="bg-green-400 mx-2 my-5 px-3 py-4 rounded-md">
          <Text className="text-slate-600 text-xs">{time}</Text>
          <View className="flex-row items-center justify-between">
            <Text className="text-sm pt-1 text-black font-semibold">
              {label}
            </Text>

            <View className="flex-row space-x-5 items-center">
              <Text className="text-slate-700 font-semibold text-sm">
                ₹{amount}
              </Text>
              <TouchableOpacity
                onPress={() => setShowUpdateSection(!showUpdateSection)}>
                <PencilSquareIcon size={20} color="#2248f0" />
              </TouchableOpacity>
              <TouchableOpacity onPress={removeCard}>
                <TrashIcon size={20} color="#ff0000" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};
export default DayCard;
