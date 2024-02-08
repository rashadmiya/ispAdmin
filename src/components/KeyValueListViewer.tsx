import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import global_styles from '../utils/global_styles'
import { ConstantColor } from '../utils/constant_color'

type props ={
    title:string;
    amount: number;
}
const KeyValueListViewer = ({title, amount}:props) => {
    return (
        <View style={[global_styles.justifyBetweenCenter, global_styles.paddingHorizontalTen, {marginBottom:10}]}>
            <View style={styles.key}>
                <Text style={styles.keyText}>{title}</Text>
            </View>
            <View style={styles.value}>
                <Text style={styles.keyText}>{amount} ৳</Text>
            </View>
        </View>
    )
}

export default KeyValueListViewer

const styles = StyleSheet.create({
    key:{
        width: '40%',
        borderWidth:.5,
        backgroundColor: ConstantColor.lightGray
    },
    value:{
        width: '55%',
        borderWidth:.5,
        backgroundColor: ConstantColor.lightGray
    },
    keyText:{
        fontSize: 16,
        color:'#000',
        fontWeight:'bold',
        textAlign:'center',
        padding: 8,
        textTransform:'capitalize'
    }
})