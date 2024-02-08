import React, { useState } from 'react';
import {
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  StatusBar,
  View,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  Alert,
  ToastAndroid,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  Dimensions
} from 'react-native';
import auth from '@react-native-firebase/auth';
import { AuthContext } from '../utils/auth_context';
import { ConstantColor } from '../utils/constant_color';
import { LOGIN } from '../utils/constant_route';
import firestore from '@react-native-firebase/firestore';

export default function Register({ navigation }: { navigation: any }) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { signUp } = React.useContext(AuthContext);
  const [loading, setLoading] = useState(false);

  const registerUser = () => {
    if (password !== confirmPassword) {
      Alert.alert("Passwords don't match.");
      return;
    }
    setLoading(true)
    auth()
      .createUserWithEmailAndPassword(email, password)
      .then((response) => {
        const uid = response.user.uid;
        const data = {
          id: uid,
          fullName,
          email,
          phone,
          role:'user',
          incomeRate:0.0,
          sharePercentage:0.0
        };
        firestore().collection('employes').doc(uid).set(data)
          .then(() => {
            ToastAndroid.show('Registration Successfull!', ToastAndroid.SHORT);
            signUp();
          })
          .catch((error: any) => console.log(error));
      })
      .catch((error) => {
        Alert.alert(error);
      });

  };

  const keyboardVerticalOffset = Platform.OS === 'ios' ? 30 : 0

  return (
    <ScrollView
      style={{
        flex: 1,
        backgroundColor: '#252525',
        paddingTop: StatusBar.currentHeight
      }}
      contentContainerStyle={{ display: 'flex', justifyContent: 'center', alignContent: 'center' }}
    >
      <StatusBar translucent backgroundColor="transparent" />
      <View style={{ height: Dimensions.get("window").width / 5 }}>
      </View>
      {loading == false ? (
        <KeyboardAvoidingView
          behavior='padding'
          keyboardVerticalOffset={keyboardVerticalOffset}
          style={{
            flex: 1,
            paddingHorizontal: 20,
            justifyContent: 'center',
            marginHorizontal: 20,
          }}>

          <View
            style={styles.inputWrapper}>
            <TextInput
              style={styles.text_input}
              placeholderTextColor="white"
              placeholder="Full Name"
              onChangeText={(text) => setFullName(text)}
              value={fullName}
              underlineColorAndroid="transparent"
              autoCapitalize="none"
            />
          </View>

          <View
            style={styles.inputWrapper}>
            <TextInput
              style={styles.text_input}
              placeholderTextColor="white"
              placeholder="Email"
              onChangeText={(text) => setEmail(text)}
              value={email}
              underlineColorAndroid="transparent"
              autoCapitalize="none"
            />
          </View>

          <View
            style={styles.inputWrapper}>
            <TextInput
              style={styles.text_input}
              placeholderTextColor="white"
              placeholder="Phone"
              onChangeText={(text) => setPhone(text)}
              value={phone}
              underlineColorAndroid="transparent"
              autoCapitalize="none"
            />
          </View>

          <View
            style={styles.inputWrapper}>
            <TextInput
              style={styles.text_input}
              placeholderTextColor="white"
              placeholder="Password"
              secureTextEntry
              onChangeText={(text) => setPassword(text)}
              value={password}
              underlineColorAndroid="transparent"
              autoCapitalize="none"
            />
          </View>

          <View
            style={styles.inputWrapper}>
            <TextInput
              style={styles.text_input}
              placeholder="Confirm Password"
              secureTextEntry
              onChangeText={(text) => setConfirmPassword(text)}
              value={confirmPassword}
              underlineColorAndroid="transparent"
              autoCapitalize="none"
              placeholderTextColor={'white'}
            />
          </View>

          <View style={{ paddingTop: 20 }}>
            <TouchableOpacity
              style={{
                alignItems: 'center',
                backgroundColor: '#E50914',
                borderRadius: 5,
                padding: 10,
                width: '100%',
                flexDirection: 'row',
                justifyContent: 'center',
              }}
              onPress={() => {
                registerUser();
              }}>
              <Text style={styles.buttonText}>Sign Up</Text>
            </TouchableOpacity>
          </View>
          <View
            style={{
              flexDirection: 'row',
              paddingTop: 30,
              justifyContent: 'center',
            }}>

            <Text style={{ color: 'white' }}>Already have an account ?</Text>

            <TouchableOpacity
              onPress={() => {
                navigation.navigate(LOGIN);
              }}
            >
              <Text style={{ color: '#E50914', paddingHorizontal: 5 }}>
                Login Here
              </Text>
            </TouchableOpacity>

          </View>
        </KeyboardAvoidingView>
      ) : (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <View
            style={{
              height: 100,
              width: 200,
              backgroundColor: ConstantColor.white,
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 10,
            }}>
            <ActivityIndicator
              animating={loading}
              size="large"
              color="#E50914"
            />
          </View>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#252525',
  },
  image: {
    flex: 1,
  },
  but: {
    alignItems: 'center',
    backgroundColor: '#E50914',
    borderRadius: 5,
    padding: 10,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 17,
    color: 'white',
    paddingHorizontal: 10,
  },
  indicator: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 90,
    bottom: 0,
    opacity: 0.8,
    alignItems: "center",
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: 'rgba(81, 81, 81, 0.76)',
    marginVertical: 10,
    paddingHorizontal: 5
  },
  text_input: {
    padding: 5,
    fontSize: 18,
    color: '#fff',
    width: '100%'
  }
});