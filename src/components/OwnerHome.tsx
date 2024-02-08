import { ScrollView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import global_styles from '../utils/global_styles'
import { ConstantColor } from '../utils/constant_color'
import HomeAccordion from './common/HomeAccordion'
import { dailyAccountsOptions } from '../constants/menuItems'

const OwnerHome = () => {
    return (
        <View style={global_styles.customContainer}>
            <View style={global_styles.sizedBoxTen}></View>
            <View style={{ ...global_styles.headerWrapper, backgroundColor: "#3DED97", borderRadius: 15 }}>
                <Text style={{ textAlign: 'center', fontSize: 25, fontWeight: 'bold' }}>Bijoy Admin</Text>
            </View>

            <View style={global_styles.sizedBoxTen}></View>
            <View style={global_styles.sizedBoxTen}></View>

            <View style={{ ...global_styles.headerWrapper, backgroundColor: "#99EDC3", padding: 12, borderRadius: 50 }}>
                <Text style={[global_styles.textCenter, global_styles.textMedium]}>Tab to see balance today</Text>
            </View>
            <View style={global_styles.sizedBoxTen}></View>
            <View style={global_styles.sizedBoxTen}></View>

            <ScrollView
                style={{ backgroundColor: ConstantColor.white, opacity: 0.8, overflow: 'scroll', marginBottom: 150 }}
                // contentContainerStyle={{ margin: 0, padding: 10, overflow:'scroll' }}
                indicatorStyle='black'
            >

                <View style={{
                    ...global_styles.headerWrapper, padding: 8, borderRadius: 50
                }}>
                    <Text style={[global_styles.textCenter, { color: '#000', fontSize: 20 }]}>Daily Accounts</Text>
                </View>
                <View style={global_styles.sizedBoxTen}></View>


                {dailyAccountsOptions.map((val: any, index) => (
                    <HomeAccordion key={index} value={val} type={val.type} />
                ))}
            </ScrollView>
            <View style={global_styles.sizedBoxTen}></View>
        </View>
    )
}

export default OwnerHome

const styles = StyleSheet.create({})