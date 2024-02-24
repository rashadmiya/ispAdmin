import { ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { ReactNode, useEffect, useState } from 'react'
import global_styles from '../utils/global_styles'
import { ConstantColor } from '../utils/constant_color'
import HomeAccordion from './common/HomeAccordion'
import { dailyAccountsOptions } from '../constants/menuItems';

interface dailyAccount {
    name: string,
    type: string,
    onPres: () => void,
    icon: Element,
    innerContent: any,
}

const OwnerHome = () => {
    const [dailyAccountsOpts, setDailyAccountsOpts] = useState(dailyAccountsOptions);

    useEffect(() => {
        let dAo: any = [];
        dailyAccountsOptions.map((elem: any) => {
            // setDailyAccountsOpts((prev) => [...prev, elem]);
            dAo.push(elem);
        });
        setDailyAccountsOpts(dAo);
    }, [])

    return (
        <View style={global_styles.customContainer}>
            <View style={global_styles.sizedBoxTen}></View>
            <View style={[global_styles.headerWrapper, global_styles.shadow]}>
                <Text
                    style={[global_styles.shadawText, global_styles.textBold, global_styles.textLarge, global_styles.textCenter, global_styles.paddingVerticalTen]}
                >
                    Bijoy Admin</Text>
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


                {dailyAccountsOpts.map((val: any, index) => (
                    <HomeAccordion key={index} value={val} type={val.type} />
                ))}
            </ScrollView>
            <View style={global_styles.sizedBoxTen}></View>
        </View>
    )
}

export default OwnerHome

const styles = StyleSheet.create({})