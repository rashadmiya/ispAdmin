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
  ImageBackground,
  ActivityIndicator,
  Alert
} from 'react-native';
import { AuthContext } from '../utils/auth_context';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import Loader from '../utils/Loder';
import { ConstantColor } from '../utils/constant_color';
import { LOGIN, REGISTER } from '../utils/constant_route';

export default function Register({ navigation }: { navigation: any }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const { signIn } = React.useContext(AuthContext);
  const loginUser = () => {
    setLoading(true);
    auth()
      .signInWithEmailAndPassword(email, password)
      .then((response) => {
        signIn();
        setLoading(false);

      })
      .catch((error) => {
        setLoading(false);
        Alert.alert(error.message);
        return;
      });
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: '#252525',
      }}>
      <StatusBar translucent backgroundColor="transparent" />
      {loading == false ? (
        <View
          style={{
            flex: 4,
            padding: 30,
            justifyContent: 'center',
            marginHorizontal: 30,
          }}>
          <View style={{ paddingVertical: 10 }}>
            <View
              style={{
                flexDirection: 'row',
                padding: 5,
                alignItems: 'center',
                borderRadius: 10,
                backgroundColor: 'rgba(81, 81, 81, 0.76)',
              }}>
              <TextInput
                placeholderTextColor="white"
                placeholder="Email"
                onChangeText={(text) => setEmail(text)}
                value={email}
                underlineColorAndroid="transparent"
                autoCapitalize="none"
                style={styles.text_input}
              />
            </View>
          </View>

          <View style={{ paddingVertical: 10 }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                padding: 5,
                borderRadius: 10,
                backgroundColor: 'rgba(81, 81, 81, 0.76)',
              }}>
              <TextInput
                placeholderTextColor="white"
                placeholder="Password"
                secureTextEntry
                onChangeText={(text) => setPassword(text)}
                value={password}
                underlineColorAndroid="transparent"
                autoCapitalize="none"
                style={styles.text_input}
              />
            </View>
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
                loginUser();
              }}>
              <Text style={styles.buttonText}>Log In</Text>
            </TouchableOpacity>
          </View>
          <View
            style={{
              flexDirection: 'row',
              paddingTop: 30,
              justifyContent: 'center',
            }}>
            <Text style={{ color: 'white' }}>Don't have an account ?</Text>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate(REGISTER);
              }}>
              <Text style={{ color: '#E50914', paddingHorizontal: 5 }}>
                Sign Up Here
              </Text>
            </TouchableOpacity>
          </View>
        </View>
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
    </SafeAreaView>
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
    position: 'absolute',
    left: 0,
    right: 0,
    top: 50,
    bottom: 0,
    opacity: 1,
    alignItems: 'center',
  },
  text_input: {
    padding: 5,
    fontSize: 18,
    color: '#fff',
    width: '100%'
  }
});