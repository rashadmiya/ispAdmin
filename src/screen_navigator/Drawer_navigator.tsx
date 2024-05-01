import { View, Text, Alert } from 'react-native'
import React, { useEffect, useState } from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import Stack_Navigator from './Stack_Navigator';
import DrawerMenu from './DrawerMenu';
import auth from '@react-native-firebase/auth';
import AuthStackNavigator from './AuthStack_Navigator';
import { HOME } from '../utils/constant_route';
import { AuthContext } from '../utils/auth_context';

const DrawerNavigator = () => {

  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();

  const Drawer = createDrawerNavigator();

  const authContext = React.useMemo(() => ({
    signIn: async () => {
      try {
        const subscriber = await auth().onAuthStateChanged(onAuthStateChanged);
      } catch (error:any) {
        Alert.alert(error);
        return;
      }
    },
    signOut: async () => {
      setInitializing(true)
      const subscriber = await auth().signOut();
      setUser(undefined)
    },
    signUp: async () => {
      const subscriber = await auth().onAuthStateChanged(onAuthStateChanged);
    }
  }), []);

  function onAuthStateChanged(user: any) {
    setUser(user);
    if (initializing) setInitializing(false);
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  if (initializing) return null;
  //for auth

  return (
    <AuthContext.Provider value={authContext}>
      <NavigationContainer>
      {user ? (
        <Drawer.Navigator drawerContent={props => <DrawerMenu {...props} />}
          screenOptions={{ lazy: true }}
        >
          <Drawer.Screen name={'appDrawer'} component={Stack_Navigator}
            options={{
              drawerType: 'slide',
              headerShown: false
            }}
          ></Drawer.Screen>
        </Drawer.Navigator>
      ) : (
        <AuthStackNavigator />
      )}

    </NavigationContainer>
    </AuthContext.Provider>
  )
}

export default DrawerNavigator