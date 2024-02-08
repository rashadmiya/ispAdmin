import { StyleSheet, Text, View,SafeAreaView, StatusBar } from 'react-native'
import React from 'react'
import ListItem from './src/screens/ListItem'
import Stack_Navigator from './src/screen_navigator/Stack_Navigator'
import DrawerNavigator from './src/screen_navigator/Drawer_navigator'

const App = () => {
  return (
    <SafeAreaView style={{flex:1,}}>
      <StatusBar barStyle={"dark-content"} backgroundColor={"#fff"} translucent />
      <DrawerNavigator/>
    </SafeAreaView>
  )
}

export default App

const styles = StyleSheet.create({})