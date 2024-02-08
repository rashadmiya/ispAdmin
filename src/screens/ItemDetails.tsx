import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import auth from '@react-native-firebase/auth';

const ItemDetails = () => {

  useEffect(()=>{
    const current_user = auth().currentUser;
    console.log("current user :",current_user);
  },[])
  return (
    <View>
      <Text>ItemDetails</Text>
    </View>
  )
}

export default ItemDetails

const styles = StyleSheet.create({})