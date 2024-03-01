import React, { useState } from 'react';
import { Text, View, TouchableOpacity, StyleSheet, ToastAndroid } from 'react-native';
// import Clipboard from '@react-native-community/clipboard';

const SelectableText = ({ title,head, text }:{title:string,head:string, text:string}) => {
  const [isSelected, setIsSelected] = useState(false);

  const handlePress = () => {
    setIsSelected(!isSelected);
    handleCopy();
  };

  const handleCopy = () => {
    // Clipboard.setString(text);
    setIsSelected(false);
 

      // ToastAndroid.showWithGravityAndOffset(
      //   `${title} is coppied`,
      //   ToastAndroid.SHORT,
      //   ToastAndroid.BOTTOM,
      //   25,
      //   50,
      // );

  };

  return (
    <View >
      <View style={{ display: 'flex', flexDirection: 'row', backgroundColor: isSelected ? '#82CAFA' : 'transparent'}}>
        <Text style={{ ...styles.infoText, paddingRight: 2 }}>{head}</Text>
        <TouchableOpacity onPress={handlePress} >
          <Text selectable={true} style={{...styles.infoText, marginRight: text && text.length > 30 ? 40 : 0}}>
            {text}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SelectableText;

const styles = StyleSheet.create({
  infoText: {
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 22,
    alignSelf: 'stretch',
    textShadowColor: 'rgba(0, 0, 0, 0.6)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 1,
  },
})
