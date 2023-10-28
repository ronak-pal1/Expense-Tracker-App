import firestore from '@react-native-firebase/firestore';
import {useNavigation} from '@react-navigation/native';
import {useState} from 'react';
import {
  Text,
  TextInput,
  ToastAndroid,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  CheckIcon,
  ChevronDoubleRightIcon,
  PencilSquareIcon,
  TrashIcon,
  XMarkIcon,
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
  const [isBucketUpdate, setIsBucketUpdate] = useState(false);
  const [updatedBalance, setUpdatedBalance] = useState(target);

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

  const gotToExpense = () => {
    navigation.navigate('Expense', {
      label: label,
      target: target,
      time: time,
      userId: userId,
      username: username,
    });
  };

  const removeDoc = async id => {
    await firestore()
      .collection('Users')
      .doc(userId)
      .collection('Buckets')
      .doc(label)
      .collection('bucketItems')
      .doc(id)
      .delete();
  };

  const removeBucket = () => {
    firestore()
      .collection('Users')
      .doc(userId)
      .collection('Buckets')
      .doc(label)
      .collection('bucketItems')
      .get()
      .then(doc => {
        doc.docs.map(item => {
          removeDoc(item.id);
        });
      })
      .then(() => {
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
      });
  };

  const updateBucket = () => {
    firestore()
      .collection('Users')
      .doc(userId)
      .collection('Buckets')
      .doc(label)
      .update({
        balance: updatedBalance,
      })
      .then(() => {
        ToastAndroid.showWithGravity(
          'balance updated successfully',
          ToastAndroid.SHORT,
          ToastAndroid.TOP,
        );

        setIsBucketUpdate(false);
      })
      .catch(error => {
        ToastAndroid.showWithGravity(
          'Can not update balance',
          ToastAndroid.SHORT,
          ToastAndroid.TOP,
        );

        console.log(error);
      });
  };

  return (
    <View className="flex-row items-center ml-2">
      <View className="space-y-7">
        <TouchableOpacity onPress={() => setIsBucketUpdate(!isBucketUpdate)}>
          <PencilSquareIcon size={20} color="#2248f0" />
        </TouchableOpacity>
        <TouchableOpacity onPress={removeBucket}>
          <TrashIcon size={20} color="#ff0000" />
        </TouchableOpacity>
      </View>
      <View className="flex-1">
        <TouchableOpacity onPress={gotToExpense}>
          <LinearGradient
            className={`mx-4 my-5 rounded-md p-2 py-4 shadow-lg`}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 0}}
            colors={isGradient ? ['#4ade80', '#ef4444'] : [color, color]}>
            <View>
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center space-x-2">
                  <Text className="text-sm text-slate-800 font-bold">
                    {label}
                  </Text>
                  <Text className="text-[10px] text-slate-800 font-light">
                    {time}
                  </Text>
                </View>

                <ChevronDoubleRightIcon size={20} color="#242323" />
              </View>
              <View className="flex-row items-center space-x-4 mt-4 border-b border-b-gray-500 pb-2">
                <Text className="text-sm">
                  <Text className="text-gray-700 font-light">Balance:</Text>{' '}
                  <Text className="text-slate-700 font-semibold">
                    ₹{target}
                  </Text>
                </Text>

                <Text className="text-sm">
                  <Text className="text-gray-700 font-light">Spened:</Text>{' '}
                  <Text className="text-slate-700 font-semibold">
                    ₹{spended}
                  </Text>
                </Text>
              </View>

              <View className="flex-row items-center justify-between">
                <View>
                  <Text className="text-sm mt-2">
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

        {isBucketUpdate && (
          <View className="flex-row items-center space-x-3 mx-4 pb-2 border-b-[0.5px] border-gray-50">
            <View className="flex-row items-center">
              <TextInput
                placeholder="Balance"
                className="border border-slate-400 rounded-md w-3/4 pl-2 py-1"
                value={updatedBalance}
                onChangeText={text => setUpdatedBalance(text)}
              />
            </View>

            <TouchableOpacity onPress={updateBucket}>
              <CheckIcon size={20} color="#2248f0" />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setIsBucketUpdate(false)}>
              <XMarkIcon size={20} color="#ef3535" />
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
};

export default MonthCard;
