import React, { useEffect, useState, useRef } from 'react';
import {
    ActivityIndicator, FlatList, Pressable, ScrollView,
    StyleSheet, Text, TouchableOpacity, View, Alert
} from 'react-native'
import global_styles from '../utils/global_styles'
import { ConstantColor } from '../utils/constant_color';
import { UserInterface } from '../interfaces/user_interface';
import KeyValueListViewer from './KeyValueListViewer';
import db from '../constants/database';
import monthNameGenerator from '../helper-function/monthNameGenerator';
import firestore from '@react-native-firebase/firestore';
import Loader from '../utils/Loder';
import { todaysBalance, totallInvest, userInvest } from '../helper-function/calculateBalance';
import Icon from '../utils/customIcons';

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
    const [parnerProfit, setPartnerProfit] = useState<number | undefined>(undefined);
    const [parnerShare, setPartnerShare] = useState<number | undefined>(undefined);
    const [incomeRate, setIncomeRate] = useState<number | undefined>(undefined);


    // useEffect(()=>{
    //     if (monthlyTotals) {
    //         scrollToIndex(activeMonth)
    //     }
    // },[monthlyTotals]);


    useEffect(() => {
        // createLastTwelveMonth();
        console.log("is run main useEffect on change another")
        const currentDate = new Date();
        const twelveMonthsAgo = new Date();
        twelveMonthsAgo.setMonth(currentDate.getMonth() - 12);

        const query = firestore().collection('transactions').where('createdAt', '>=', twelveMonthsAgo).where('createdAt', '<=', currentDate);
        const unsubscribe = query.onSnapshot((snapshot) => {
            const updatedMonthlyTotals: MonthlyTotal[] = [];
            snapshot.forEach((doc: any) => {
                const transactionData = doc.data();
                // console.log("load data :", doc.data());
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
                        updatedMonthlyTotals[monthlyTotalIndex].data.invest += parseInt(transactionData.amount);
                        break;
                    case "income":
                        updatedMonthlyTotals[monthlyTotalIndex].data.income += parseInt(transactionData.amount);
                        break;
                    case "expense":
                        updatedMonthlyTotals[monthlyTotalIndex].data.expense += parseInt(transactionData.amount);
                        break;
                    case "borrow":
                        updatedMonthlyTotals[monthlyTotalIndex].data.borrow += parseInt(transactionData.amount);
                        break;
                    case "loan_to":
                        updatedMonthlyTotals[monthlyTotalIndex].data.loan_to += parseInt(transactionData.amount);
                        break;
                    case "loss":
                        updatedMonthlyTotals[monthlyTotalIndex].data.loss += parseInt(transactionData.amount);
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

        // Unsubscribe from snapshot listener when component unmounts
        return () => unsubscribe();

    }, []);

    useEffect(() => {
        incomeRateFun();
    }, [activeMonth])

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

        // const lastTwelveMonthsQuery = transactionsRef.where('partner_id', '==',user.id).where('createdAt', '>=', twelveMonthsAgo).where('createdAt', '<=', currentDate);
        const lastTwelveMonthsQuery = transactionsRef.where('createdAt', '>=', twelveMonthsAgo).where('createdAt', '<=', currentDate);

        await lastTwelveMonthsQuery.get().then((querySnapshot: any) => {
            const updatedMonthlyTotals: MonthlyTotal[] = [];
            let length = querySnapshot.size
            // setActiveMonth(length - 1);
            querySnapshot.forEach((doc: any) => {
                const transactionData = doc.data();
                // console.log("load data :", doc.data())
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
        }).catch((err: any) => {
            console.log("user transaction load error :", err.message)
        });
    };

    const showProfitFun = async () => {
        // let balance = await todaysBalance(); // i have use revenueBalance for lowest api call, if problem occour i have to uncomment and use
        // let totalInvest = await totallInvest();
        // let partnerInvest = await userInvest(user.id);
        // let partnerShar = (partnerInvest / totalInvest) * 100;
        let revenueBalance = monthlyTotals[activeMonth]?.data?.income - (monthlyTotals[activeMonth]?.data.loss + monthlyTotals[activeMonth]?.data.expense);


        if (revenueBalance) {
            setPartnerProfit(Math.floor(revenueBalance));
        } else {
            Alert.alert('Cautions!', `your income less from your expenses`)
        }

    }

    const incomeRateFun = async () => {
        let revenueBalance = monthlyTotals[activeMonth]?.data?.income - (monthlyTotals[activeMonth]?.data.loss + monthlyTotals[activeMonth]?.data.expense);
        // let profit = await todaysBalance();
        let invest = await totallInvest();
        // let incomeRates = (profit / invest) * 100;
        let incomeRates = 100 * (revenueBalance / invest);

        if (incomeRates) {
            setIncomeRate(Math.round(incomeRates));
        }
    }

    const partnerShareFun = async () => {
        let totalInvest = await totallInvest();
        let partnerInvest = await userInvest(user.id);
        let partnerShar = (partnerInvest / totalInvest) * 100;
        if (partnerShar) {
            setPartnerShare(Math.floor(partnerShar));
        }
    }

    const prevMonth = () => {
        if (activeMonth > 0) {
            setActiveMonth(activeMonth - 1);
        }
    }

    const nextMonth = () => {
        if (activeMonth < monthlyTotals.length - 1) {
            setActiveMonth(activeMonth + 1);
        }

    }

    return (
        <View style={[global_styles.customContainer, { flex: 1 }]}>
            {isLoading && <Loader />}
            <>
                {/* <View style={global_styles.sizedBoxTen}></View>
                <View style={[global_styles.headerWrapper, global_styles.shadow]}>
                    <Text
                        style={[global_styles.shadawText, global_styles.textBold, global_styles.textLarge, global_styles.textCenter, global_styles.paddingVerticalTen]}
                    >
                        {user.fullName} AC
                    </Text>
                </View> */}
                <View style={{ width: "100%", alignItems: 'center' }}>
                    <TouchableOpacity onPress={() => {
                        parnerShare ? null : partnerShareFun();
                    }}
                        style={{ width: '50%', backgroundColor: '#99EDC3', padding: 12, borderRadius: 50 }}>
                        {parnerShare ? (
                            <Text style={[global_styles.textCenter, global_styles.textMedium, global_styles.textBlack]}>{`Your Share: ${parnerShare} %`}</Text>
                        ) : (
                            <Text style={[global_styles.textCenter, global_styles.textMedium, global_styles.textBlack]}>Tab to see your share</Text>
                        )}
                    </TouchableOpacity>
                </View>

                <View style={global_styles.sizedBoxTen}></View>


                <TouchableOpacity onPress={() => {
                    parnerProfit ? null : showProfitFun();
                }}
                    style={{ ...global_styles.headerWrapper, backgroundColor: "#99EDC3", padding: 12, borderRadius: 50 }}>
                    {parnerProfit ? (
                        <Text style={[global_styles.textCenter, global_styles.textMedium, global_styles.textBlack, global_styles.shadawText]}>{`Profit of  ${monthNameGenerator(monthlyTotals[monthlyTotals.length - 1].month)}: ${parnerProfit} ৳`}</Text>
                    ) : (
                        <Text style={[global_styles.textCenter, global_styles.textMedium, global_styles.textBlack, global_styles.shadawText]}>Tab to see profit</Text>
                    )}
                </TouchableOpacity>

                <View style={global_styles.sizedBoxTen}></View>

                <View style={{ ...global_styles.headerWrapper, padding: 8, borderRadius: 50 }}>
                    <Text style={[global_styles.textCenter, { color: '#000', fontSize: 20 }]}>Daily Accounts</Text>
                </View>
                <View style={global_styles.sizedBoxTen}></View>

                {/* <FlatList
                    data={monthlyTotals}
                    renderItem={({ item, index }) => {
                        return (
                            <Pressable key={item.month}
                                onPress={() => {
                                    setActiveMonth(index);
                                }}
                                style={{ borderWidth: .3, backgroundColor: activeMonth == index ? ConstantColor.secondary : 'transparent', height: 35 }}
                            >
                                <Text style={{ fontSize: 14, fontWeight: 'bold', color: activeMonth == index ? 'white' : 'black', padding: 5 }}>{monthNameGenerator(item.month)}</Text>
                            </Pressable>
                        )
                    }}
                    keyExtractor={(item, index) => index.toString()}
                    // inverted // To display items in reverse order
                    horizontal={true}
                    scrollEnabled
                    showsHorizontalScrollIndicator={true}
                    indicatorStyle='black'
                    alwaysBounceHorizontal
                    ref={flatListRef}
                    persistentScrollbar={true}
                    onScrollToIndexFailed={onScrollToIndexFailed}
                /> */}

                {monthlyTotals.length > 0 && (
                    <View style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                            <Icon type='ant' name='doubleleft' size={25} color='black' style={styles.iconStyle} onPress={prevMonth} />
                            <Text style={{ fontWeight: 'bold', color: 'black', paddingHorizontal: 20 }}>{monthNameGenerator(monthlyTotals[activeMonth]?.month)}</Text>
                            <Icon type='ant' name='doubleright' size={25} color='black' style={styles.iconStyle} onPress={nextMonth} />
                        </View>
                    </View>
                )}

                <ScrollView
                    style={{ backgroundColor: ConstantColor.white, opacity: 0.8, overflow: 'scroll', }}
                    indicatorStyle='black'
                >

                    <View style={[global_styles.paddingVerticalTen,]}>
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

                <View style={{ width: "100%", alignItems: 'center', }}>
                    <View style={{ backgroundColor: ConstantColor.lightGray, paddingVertical: 5, paddingHorizontal: 10, borderWidth: 2, borderRadius: 20 }}>
                        {incomeRate && (
                            <Text style={[global_styles.textCenter, global_styles.textMedium, global_styles.textBlack]}>{`Income Rate: ${incomeRate} %`}</Text>
                        )}
                    </View>
                </View>
            </>
        </View>
    )
}

export default PartnersHome

const styles = StyleSheet.create({
    iconStyle: {
        paddingHorizontal: 10,
        paddingVertical: 5
    }
})