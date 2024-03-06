import { ScrollView, StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React, { ReactNode, useEffect, useState } from 'react'
import global_styles from '../utils/global_styles'
import { ConstantColor } from '../utils/constant_color'
import HomeAccordion from './common/HomeAccordion'
import { dailyAccountsOptions, fundManagerAccountsOptions } from '../constants/menuItems';
import { FAB } from '@rneui/base'
import FloatingAnimatedActionBtn from './FloatingAnimatedActionBtn'
import { todaysBalance } from '../helper-function/calculateBalance'

const OwnerHome = ({user}:{user:any}) => {
    const [dailyAccountsOpts, setDailyAccountsOpts] = useState(dailyAccountsOptions);
    const [balanceToday, setBalanceToday] = useState<number | undefined>(undefined);

    useEffect(() => {
        let dailyAccountOptns: any = [];
        dailyAccountsOptions.map((elem: any) => {
            // setDailyAccountsOpts((prev) => [...prev, elem]);
            dailyAccountOptns.push(elem);
        });
        setDailyAccountsOpts(dailyAccountOptns);
    }, []);

    const showBalanceFun = async () => {
        let balance = await todaysBalance();
        if (balance) {
            setBalanceToday(balance);
        }
    }

    return (
        <View style={[global_styles.customContainer, { flex: 1 }]}>
            <View style={global_styles.sizedBoxTen}></View>
            <View style={[global_styles.headerWrapper, global_styles.shadow]}>
                <Text
                    style={[global_styles.shadawText, global_styles.textBold, global_styles.textLarge, global_styles.textCenter, global_styles.paddingVerticalTen]}
                >
                    Bijoy Admin</Text>
            </View>

            <View style={global_styles.sizedBoxTen}></View>
            <View style={global_styles.sizedBoxTen}></View>

            <TouchableOpacity onPress={showBalanceFun}
                style={{ ...global_styles.headerWrapper, backgroundColor: ConstantColor.secondary, padding: 12, borderRadius: 50 }}>
                {balanceToday ? (
                    <Text style={[global_styles.textCenter, global_styles.textMedium, global_styles.textBlack, global_styles.shadawText]}>{`Today's Balance: ${balanceToday}-৳`}</Text>
                ) : (
                    <Text style={[global_styles.textCenter, global_styles.textMedium, global_styles.textBlack, global_styles.shadawText]}>Tab to see balance today</Text>
                )}

            </TouchableOpacity>

            <View style={global_styles.sizedBoxTen}></View>
            <View style={global_styles.sizedBoxTen}></View>

            <ScrollView
                style={{ backgroundColor: ConstantColor.white, opacity: 0.8, overflow: 'scroll', }}
                // contentContainerStyle={{ margin: 0, padding: 10, overflow:'scroll' }}
                indicatorStyle='black'
            >

                <View style={{
                    ...global_styles.headerWrapper, padding: 8, borderRadius: 50
                }}>
                    <Text style={[global_styles.textCenter, { color: '#000', fontSize: 20 }]}>Daily Accounts</Text>
                </View>
                <View style={global_styles.sizedBoxTen}></View>


                {user && user.role == 'admin' && dailyAccountsOpts.map((val: any, index) => (
                    <HomeAccordion key={index} value={val} type={val.type} />
                ))}
                {user && user.role == 'fund manager' && fundManagerAccountsOptions.map((val: any, index) => (
                    <HomeAccordion key={index} value={val} type={val.type} />
                ))}
            </ScrollView>

            <View style={{ position:'absolute', right:10, bottom:5}}>
                <FloatingAnimatedActionBtn />
            </View>
        </View>
    )
}

export default OwnerHome

const styles = StyleSheet.create({})