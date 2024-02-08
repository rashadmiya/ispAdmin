import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import auth from '@react-native-firebase/auth';

const ListItem = () => {
  useEffect(()=>{
    const current_user = auth().currentUser;
    console.log("current user :",current_user);
  },[])
  return (
    <View>
      <Text>ListItem</Text>
    </View>
  )
}

export default ListItem

const styles = StyleSheet.create({})