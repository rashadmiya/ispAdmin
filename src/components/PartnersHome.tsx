import React, { useEffect, useState, useRef } from 'react';
import { ActivityIndicator, FlatList, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import global_styles from '../utils/global_styles'
import { ConstantColor } from '../utils/constant_color';
import { UserInterface } from '../interfaces/user_interface';
import KeyValueListViewer from './KeyValueListViewer';
import db from '../constants/database';
import monthNameGenerator from '../helper-function/monthNameGenerator';
import firestore from '@react-native-firebase/firestore';
import Loader from '../utils/Loder';

// Define the type of the monthlyTotals object
interface MonthlyTotals {
    [key: string]: {
        invest: number;
        income: number;
        expense: number;
        loan_to: number;
        borrow: number;
        loss: number;
    };
}

interface AT {
    month: string,
    transaction: {}
}
interface MonthlyTotal {
    month: string;
    data: {
        invest: number;
        income: number;
        expense: number;
        loan_to: number;
        borrow: number;
        loss: number;
    };
}

const PartnersHome = ({ user }: { user: UserInterface }) => {
    const [transactions, setTransactions] = useState({ invest: 0, income: 0, expense: 0, loan_to: 0, borrow: 0, loss: 0 })
    const [isLoading, setIsLoading] = useState(false)
    const [monthlyTotals, setMonthlyTotals] = useState<MonthlyTotal[]>([]);
    const [activeMonth, setActiveMonth] = useState(0);
    const flatListRef = useRef<FlatList>(null);

    useEffect(() => {
        createLastTwelveMonth();
        if (monthlyTotals) {
            scrollToIndex(activeMonth)
        }
    }, []);

    const scrollToIndex = (index: number) => {
        const wait = new Promise(resolve => setTimeout(resolve, 500));
        wait.then(() => {
            if (flatListRef.current && monthlyTotals.length > index) {
                flatListRef.current.scrollToIndex({ animated: true, index });
            }
        });

    };
    const onScrollToIndexFailed = (info: any) => {
        console.log("scroll faild:", info)
        const wait = new Promise(resolve => setTimeout(resolve, 500));
        wait.then(() => {
            flatListRef.current?.scrollToIndex({ index: info.index, animated: true });
        });
    }

    const createLastTwelveMonth = async () => {
        setIsLoading(true)
        const transactionsRef = await firestore().collection('transactions');
        const currentDate = new Date();
        const twelveMonthsAgo = new Date();
        twelveMonthsAgo.setMonth(currentDate.getMonth() - 12);

        const lastTwelveMonthsQuery = transactionsRef.where('createdAt', '>=', twelveMonthsAgo).where('createdAt', '<=', currentDate);

        await lastTwelveMonthsQuery.get().then((querySnapshot: any) => {
            const updatedMonthlyTotals: MonthlyTotal[] = [];

            querySnapshot.forEach((doc: any) => {
                const transactionData = doc.data();

                if (!transactionData) return;

                const transactionDate = transactionData.createdAt.toDate();
                const month = transactionDate.getMonth() + 1;
                const year = transactionDate.getFullYear();
                const monthYearKey = `${month < 10 ? '0' : ''}${month}-${year}`;

                const existingIndex = updatedMonthlyTotals.findIndex((total) => total.month === monthYearKey);
                if (existingIndex === -1) {
                    updatedMonthlyTotals.push({
                        month: monthYearKey,
                        data: {
                            invest: 0,
                            income: 0,
                            expense: 0,
                            loan_to: 0,
                            borrow: 0,
                            loss: 0,
                        },
                    });
                }

                const monthlyTotalIndex = updatedMonthlyTotals.findIndex((total) => total.month === monthYearKey);
                switch (transactionData.type) {
                    case "invest":
                        updatedMonthlyTotals[monthlyTotalIndex].data.invest += transactionData.amount;
                        break;
                    case "income":
                        updatedMonthlyTotals[monthlyTotalIndex].data.income += transactionData.amount;
                        break;
                    case "expense":
                        updatedMonthlyTotals[monthlyTotalIndex].data.expense += transactionData.amount;
                        break;
                    case "borrow":
                        updatedMonthlyTotals[monthlyTotalIndex].data.borrow += transactionData.amount;
                        break;
                    case "loan_to":
                        updatedMonthlyTotals[monthlyTotalIndex].data.loan_to += transactionData.amount;
                        break;
                    case "loss":
                        updatedMonthlyTotals[monthlyTotalIndex].data.loss += transactionData.amount;
                        break;
                    // Add more cases as needed
                }
                setIsLoading(false)
            });

            if (!isLoading) {
                setMonthlyTotals(updatedMonthlyTotals);

                if (updatedMonthlyTotals.length > 1) setActiveMonth(updatedMonthlyTotals.length - 1);
            }
        });
    };


    return (
        <View style={global_styles.customContainer}>
            {isLoading && <Loader />}
            <>
                <View style={global_styles.sizedBoxTen}></View>
                <View style={[global_styles.headerWrapper, global_styles.shadow]}>
                    <Text
                        style={[global_styles.shadawText, global_styles.textBold, global_styles.textLarge, global_styles.textCenter, global_styles.paddingVerticalTen]}
                    >
                        {user.fullName} AC
                    </Text>
                </View>

                <View style={global_styles.sizedBoxTen}></View>
                <View style={global_styles.sizedBoxTen}></View>

                <View style={{ ...global_styles.headerWrapper, backgroundColor: ConstantColor.secondary, padding: 12, borderRadius: 50 }}>
                    <Text style={[global_styles.textCenter, global_styles.textMedium, global_styles.textWhite]}>Tab to see your profit</Text>
                </View>
                <View style={global_styles.sizedBoxTen}></View>

                <View style={{ ...global_styles.headerWrapper, padding: 8, borderRadius: 50 }}>
                    <Text style={[global_styles.textCenter, { color: '#000', fontSize: 20 }]}>Daily Accounts</Text>
                </View>
                <View style={global_styles.sizedBoxTen}></View>

                <FlatList
                    data={monthlyTotals}
                    renderItem={({ item, index }) => {
                        return (
                            <Pressable key={item.month}
                                onPress={() => {
                                    setActiveMonth(index);
                                }}
                                style={{ paddingVertical: 3, paddingHorizontal: 5, borderWidth: .3, backgroundColor: activeMonth == index ? ConstantColor.secondary : 'transparent' }}
                            >
                                <Text style={{ fontSize: 14, fontWeight: 'bold', color: activeMonth == index ? 'white' : 'black', padding: 5 }}>{monthNameGenerator(item.month)}</Text>
                            </Pressable>
                        )
                    }}
                    keyExtractor={(item, index) => index.toString()}
                    inverted // To display items in reverse order
                    horizontal={true}
                    scrollEnabled
                    showsHorizontalScrollIndicator={true}
                    indicatorStyle='black'
                    alwaysBounceHorizontal
                    style={[global_styles.paddingVerticalTen]}
                    ref={flatListRef}
                    persistentScrollbar={true}
                    // onScrollToIndexFailed={info => {
                    //     const wait = new Promise(resolve => setTimeout(resolve, 500));
                    //     wait.then(() => {
                    //       flatListRef.current?.scrollToIndex({ index: info.index, animated: true });
                    //     });
                    //   }}
                    onScrollToIndexFailed={onScrollToIndexFailed}
                />
                <View style={global_styles.sizedBoxTen}></View>

                <ScrollView
                    style={{ backgroundColor: ConstantColor.white, opacity: 0.8, overflow: 'scroll', marginBottom: 150 }}
                    indicatorStyle='black'
                >

                    <View style={[global_styles.paddingVerticalTen, global_styles.justifyBetweenCenter]}>
                        {
                            monthlyTotals[activeMonth]?.month ?
                                <Text style={[global_styles.shadawText, global_styles.textCenter, global_styles.textBold]}>{monthNameGenerator(monthlyTotals[activeMonth].month)} Account Details :</Text>
                                :
                                <Text style={[global_styles.textBold, global_styles.textCenter]}></Text>
                        }

                    </View>
                    {monthlyTotals[0] ? (
                        <View>
                            <KeyValueListViewer title='invest' amount={monthlyTotals[activeMonth].data.invest} />
                            <KeyValueListViewer title='income' amount={monthlyTotals[activeMonth].data.income} />
                            <KeyValueListViewer title='expense' amount={monthlyTotals[activeMonth].data.expense} />
                            <KeyValueListViewer title='loan to' amount={monthlyTotals[activeMonth].data.loan_to} />
                            <KeyValueListViewer title='borrow' amount={monthlyTotals[activeMonth].data.borrow} />
                            <KeyValueListViewer title='loss' amount={monthlyTotals[activeMonth].data.loss} />
                        </View>
                    ) : (
                        <View style={global_styles.sizedBoxTen}>
                            <ActivityIndicator color={'black'} size={'large'} />
                        </View>

                    )}
                </ScrollView>
                <View style={global_styles.sizedBoxTen}></View>
            </>
        </View>
    )
}

export default PartnersHome

const styles = StyleSheet.create({})