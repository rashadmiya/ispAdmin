import { StyleSheet, Text, View,SafeAreaView, StatusBar } from 'react-native'
import React from 'react'
import ListItem from './src/screens/ListItem'
import Stack_Navigator from './src/screen_navigator/Stack_Navigator'
import DrawerNavigator from './src/screen_navigator/Drawer_navigator'
import { SafeAreaProvider } from 'react-native-safe-area-context';
const App = () => {
  return (
    <SafeAreaProvider style={{flex:1,}}>
      <StatusBar barStyle={"dark-content"} backgroundColor={"#fff"} translucent />
      <DrawerNavigator/>
    </SafeAreaProvider>
  )
}

export default App

const styles = StyleSheet.create({})