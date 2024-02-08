import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Icon from '../utils/customIcons';
import { useNavigation } from '@react-navigation/native';

const HeaderBackArrow = () => {
  const { goBack } = useNavigation()
  return (
    <View>
      <Icon type="ion" name="arrow-back-circle-outline" size={25} color='black' 
      style={{ paddingVertical: 5,}}
      onPress={() => goBack()} />
    </View>
  )
}

export default HeaderBackArrow
