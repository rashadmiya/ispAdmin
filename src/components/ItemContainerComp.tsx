import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import global_styles from '../utils/global_styles'

type props = {
    employee:any;
    setIsmodalVisible:any;
}
const ItemContainerComp = ({employee, setIsmodalVisible}:props) => {
    return (
        <View style={global_styles.borderBox}>
            <View style={global_styles.justifyBetweenCenter}>
                <Text style={[global_styles.textMedium, global_styles.textBold, { width: '80%' }]}>Name: {employee.fullName}</Text>
                <Text style={[global_styles.textMedium, global_styles.textBold, { width: '80%' }]}>Role: {employee.role}</Text>
            </View>

            <Text style={[global_styles.textMedium, global_styles.textBold, { width: '80%' }]}>Invest: {employee.invest ? employee.invest : 0}৳</Text>

            <View style={{ flexDirection: 'row', justifyContent: 'flex-start', paddingVertical: 5 }}>
                <TouchableOpacity
                    onPress={() => setIsmodalVisible(employee)}
                    style={{ backgroundColor: '#fff', opacity: 0.7, borderRadius: 100, borderWidth: 2, borderColor: 'grey' }}>
                    <Text style={{ color: 'black', fontWeight: '800', fontSize: 14, paddingVertical: 2, paddingHorizontal: 5 }}>
                        Manage User
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default ItemContainerComp

const styles = StyleSheet.create({})