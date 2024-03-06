import DateTimePicker from '@react-native-community/datetimepicker';
import firestore from '@react-native-firebase/firestore';
import { Button, FAB } from '@rneui/base';
import React, { useEffect, useState } from 'react';
import { Alert, Platform, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, ToastAndroid, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import Modal from 'react-native-modal';
import { InvestInterface } from '../interfaces/TransactionInterface';
import InvestModal from '../modals/InvestModal';
import Loader from '../utils/Loder';
import { ConstantColor } from '../utils/constant_color';
import global_styles from '../utils/global_styles';
import Icon from '../utils/customIcons';
import { useSelector } from 'react-redux';

interface MonthlyTotal {
    amount: number;
    createdAT: any;
    partner_id: string;
    type: string;
}



const Investments = () => {
    const user = useSelector((state: any) => state.loggedInUser.value);
    const [monthlyTotals, setMonthlyTotals] = useState<MonthlyTotal[]>([]);

    const [isLoading, setIsLoading] = useState(false);
    const [showModal, setShowModal] = useState(false)
    const [isUpdateModalVisible, setIsUpdateModalVisible] = useState<InvestInterface | undefined>(undefined);
    const [investAmount, setInvestAmount] = useState('');
    const [showWithdrawDate, setShowWithdrawDate] = useState(Platform.OS === 'ios');
    const [date, setDate] = useState({
        investDate: new Date(),
        withdrawDate: new Date(),
    });
    const [isDateTaken, setIsDateTaken] = useState({
        investDate: false,
        withdrowDate: false
    });


    const minimumDateFinder = () => {
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate());
        return tomorrow;
    }


    const onChangeWithdrowDate = (e: any, selectedDate: any) => {
        setDate({ investDate: date.investDate, withdrawDate: selectedDate });
        setShowWithdrawDate(false);
        setIsDateTaken({ investDate: isDateTaken.investDate, withdrowDate: true });
    }


    useEffect(() => {
        createLastTwelveMonth();
    }, []);

    const createLastTwelveMonth = async () => {
        setIsLoading(true)
        const transactionsRef = await firestore().collection('transactions');
        const currentDate = new Date();
        const twelveMonthsAgo = new Date();
        twelveMonthsAgo.setMonth(currentDate.getMonth() - 12);

        const lastTwelveMonthsQuery = transactionsRef.where('type', '==', 'invest')
            .where('createdAt', '>=', twelveMonthsAgo).where('createdAt', '<=', currentDate).orderBy('createdAt', 'desc');

        await lastTwelveMonthsQuery.get().then((querySnapshot: any) => {
            const updatedMonthlyTotals: MonthlyTotal[] = [];

            querySnapshot.forEach((doc: any) => {
                const transactionData = doc.data();
                transactionData.id = doc.id;
                if (!transactionData) return setIsLoading(false);

                updatedMonthlyTotals.push(transactionData);
                setIsLoading(false)
            });

            if (!isLoading) {
                setMonthlyTotals(updatedMonthlyTotals);

                // if (updatedMonthlyTotals.length > 1) setActiveMonth(updatedMonthlyTotals.length - 1);
            }
        }).catch((err: any) => {
            console.log("user transaction load error :", err.message);
            setIsLoading(false)
        });
    };

    const hideModal = () => {
        setIsUpdateModalVisible(undefined)
    }


    const updateInvestment = async (invest: InvestInterface) => {
        await firestore().collection('transactions').doc(invest.id).update({
            amount: investAmount || invest.amount,
            withdrawDate: date.withdrawDate || invest.withdrawDate,
            id: invest.id,
        })
            .then(async () => {
                setInvestAmount('');
                setIsUpdateModalVisible(undefined);
                await createLastTwelveMonth();
                ToastAndroid.show('Invest has been updated', 500);
            })
            .catch((err) => {
                console.log(`error in update user=>${invest.id} role:`, err.message);
                setInvestAmount('');
                setIsUpdateModalVisible(undefined);
            })
    };

    const deleteInvestTransaction = async (elem: InvestInterface) => {
        await firestore().collection('transactions').doc(elem.id).delete()
            .then(async () => {
                await createLastTwelveMonth();
                ToastAndroid.show('Invest has been deleted', 500);
            })
            .catch((err) => {
                Alert.alert('Warning!', `Error occour while delete invest=>${elem.id}, Please try again`, [
                    { text: 'Okey', onPress: () => { } }
                ]);
            })
    }


    const investModalHandler = async (afterThen: any) => {
        if (afterThen) {
            await createLastTwelveMonth();
        }
        setShowModal(false);
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: ConstantColor.white }}>
            {isLoading && <Loader />}
            <View style={global_styles.customContainer}>

                <View style={global_styles.sizedBoxTen}></View>

                <View style={{}}>
                    <Text style={[global_styles.textMedium, { fontSize: 18 }]}>Manage your investments</Text>
                </View>
                <View style={global_styles.sizedBoxTen}></View>
                <View style={global_styles.sizedBoxTen}></View>

                <ScrollView
                    style={{ backgroundColor: ConstantColor.white, opacity: 0.8, overflow: 'scroll', marginBottom: 150 }}
                    indicatorStyle='black'
                >
                    {
                        monthlyTotals.map((elem: any, index) => {

                            let idate = elem?.investmentDate?.toDate().toDateString();
                            let wdate = elem?.withdrawDate?.toDate().toDateString();
                            return (
                                <View style={[global_styles.borderBox, { marginBottom: 15 }]}
                                    key={index}>
                                    <View style={global_styles.justifyBetweenCenter}>
                                        <Text style={[{ width: '60%', color: 'black', fontSize: 16, fontWeight: 'bold', textAlign: 'left' }]}>Investor: {elem.partner_name}</Text>
                                        <View style={{ display: user.role == 'admin' ? 'flex' : 'none', flexDirection: 'row', justifyContent: 'space-between', width: 140 }}>
                                            <Button
                                                onPress={() => setIsUpdateModalVisible(elem)}
                                                buttonStyle={{ backgroundColor: '#fff', opacity: 0.7, borderRadius: 100, borderWidth: 2, borderColor: 'grey', padding: 2 }}
                                            >
                                                <Text style={{ color: 'black', fontWeight: '800', fontSize: 14, paddingHorizontal: 5 }}>
                                                    Edit
                                                </Text>
                                            </Button>
                                            <Button
                                                onPress={() => {
                                                    Alert.alert('Warning!', 'You are going to delete a transection, it will be permanently deleted form your account',
                                                        [
                                                            {
                                                                text: 'Cancel',
                                                                onPress: () => { },
                                                                style: 'cancel',
                                                            },
                                                            { text: 'OK', onPress: () => deleteInvestTransaction(elem) },
                                                        ])
                                                }}
                                                buttonStyle={{ backgroundColor: '#fff', opacity: 0.7, borderRadius: 100, borderWidth: 2, borderColor: 'grey', padding: 2 }}
                                            >
                                                <Text style={{ color: 'black', fontWeight: '800', fontSize: 14, paddingHorizontal: 5 }}>
                                                    Delete
                                                </Text>
                                            </Button>
                                        </View>
                                    </View>
                                    {/* <View style={global_styles.sizedBoxTen}></View> */}


                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 5 }}>
                                        <View>
                                            <Text style={[global_styles.textBlack, global_styles.textBold,]}>Investment Date: {idate}</Text>
                                            {wdate && (<Text style={[global_styles.textBlack, global_styles.textBold,]}>Withdraw Date: {wdate}</Text>)}
                                            {elem.investType && (<Text style={[global_styles.textBlack, global_styles.textBold,]}>Type: {elem.investType}</Text>)}
                                            <Text style={[{ color: 'black',fontWeight: 'bold', }]}>Ref Msg: {elem?.ref || 'No Message'}</Text>
                                        </View>
                                        <Text style={[{ color: 'black', fontSize: 16, fontWeight: 'bold', textAlign: 'right' }]}>Amount: {elem.amount}৳</Text>

                                    </View>
                                </View>
                            )
                        })
                    }

                </ScrollView>
                <View style={global_styles.sizedBoxTen}></View>

            </View>


            <View style={{ flex: 1 }}>
                <Modal isVisible={isUpdateModalVisible ? true : false}
                    onSwipeComplete={hideModal}
                    swipeDirection="up"
                    customBackdrop={
                        <TouchableWithoutFeedback onPress={hideModal}>
                            <View style={{ flex: 1, backgroundColor: 'black', }} />
                        </TouchableWithoutFeedback>
                    }
                    backdropOpacity={0.9}
                    backdropColor='black'
                    hasBackdrop={true}
                >
                    <View style={{ minHeight: 200, backgroundColor: ConstantColor.lightGray, borderRadius: 10, padding: 10, }}>
                        <View>
                            <Text style={[global_styles.modalHeader,]}>{`${isUpdateModalVisible?.partner_name}'s Invest`}</Text>
                            <View style={global_styles.greyLine} />
                        </View>

                        <View style={{ backgroundColor: ConstantColor.white, flex: 1, }}>
                            <View style={global_styles.paddingVerticalTen}>
                                <Text style={[global_styles.textBlack, global_styles.textCenter]}>Update invest amount and withdraw date</Text>
                            </View>
                            <View style={{ ...global_styles.paddingVerticalTen, paddingHorizontal: 10, paddingVertical: 20 }}>

                                <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                                    <View style={{ width: '60%' }}>
                                        <TextInput
                                            placeholderTextColor="#000"
                                            placeholder={`previous amount- ${isUpdateModalVisible?.amount}`}
                                            onChangeText={(text) => setInvestAmount(text)}
                                            value={investAmount}
                                            autoCapitalize="none"
                                            style={global_styles.text_input}
                                            keyboardType='number-pad'
                                        />

                                        <View style={global_styles.sizedBoxTen}></View>



                                    </View>

                                    <View style={{ width: '40%', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>


                                        <TouchableOpacity
                                            style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 6 }}
                                            onPress={() => setShowWithdrawDate(true)}>

                                            {Platform.OS === 'ios' || (
                                                <Text style={{
                                                    color: '#111',
                                                    textAlign: 'center',
                                                    fontSize: 14,
                                                }}>
                                                    {/* {text} */}
                                                </Text>
                                            )}
                                            {showWithdrawDate && (
                                                <DateTimePicker
                                                    testID="dateTimePicker"
                                                    value={date.withdrawDate}
                                                    mode={'date'}
                                                    is24Hour={true}
                                                    display="default"
                                                    minimumDate={minimumDateFinder()}
                                                    onChange={(event, selectedDate) => {
                                                        onChangeWithdrowDate(event, selectedDate);
                                                    }}
                                                    textColor="#fff"
                                                    themeVariant="dark"
                                                    style={{
                                                        width: 'auto',
                                                        height: '100%',
                                                        backgroundColor: ConstantColor.nevyBlue,
                                                    }}>

                                                </DateTimePicker>
                                            )}
                                            <View
                                                style={{
                                                    width: '100%',
                                                    flexDirection: 'row',
                                                    justifyContent: 'center',
                                                    display: Platform.OS === 'ios' ? 'none' : 'flex',
                                                    // marginTop: 10,
                                                }}>

                                                {isDateTaken.withdrowDate ? (
                                                    <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                                                        <Icon
                                                            name="calendar"
                                                            type="font"
                                                            size={20}
                                                            color={'#000'}
                                                        />
                                                        <Text style={{ fontWeight: 'bold', color: 'black', fontSize: 12 }}>{date.withdrawDate.toDateString()}</Text>
                                                    </View>
                                                ) : (
                                                    <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                                                        <Icon
                                                            name="calendar"
                                                            type="font"
                                                            size={20}
                                                            color={'#000'}
                                                        />
                                                        <Text style={{ fontWeight: 'bold', color: 'black', fontSize: 12 }}>Withdraw Date</Text>
                                                    </View>
                                                )}

                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                </View>


                            </View>

                            <View style={global_styles.sizedBoxTen}></View>
                            <View style={{ flexDirection: 'row', justifyContent: 'flex-start', marginTop: 'auto' }}>
                                <TouchableOpacity
                                    style={[global_styles.borderBox, { backgroundColor: ConstantColor.secondary, }]}
                                    onPress={() => {
                                        if (isUpdateModalVisible) updateInvestment(isUpdateModalVisible);
                                    }}
                                >
                                    <Text style={[global_styles.modalHeader,]}>Submit</Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                    </View>
                </Modal>
            </View>

            <View style={{ display: user.role == 'admin' ? 'flex' : 'none', position: 'absolute', bottom: 0, padding: 5 }}>
                <FAB
                    visible={true}
                    title="Add Investment"
                    upperCase
                    icon={{ name: 'add', color: 'white' }}
                    color={ConstantColor.febGreen}
                    onPress={() => setShowModal(true)}
                />
            </View>

            <View>
                <InvestModal openedItem={'invest'} isModalVisible={showModal} modalHide={investModalHandler} />
            </View>

        </SafeAreaView >
    )
}

export default Investments

const styles = StyleSheet.create({
    infoHeader: {
        fontSize: 16,
        fontWeight: '800',
        // marginVertical: 5
        marginTop: 10,
        marginBottom: 5,
        borderBottomWidth: 5,
        borderBottomColor: '#fff',
        textDecorationLine: 'underline',
        textDecorationStyle: "solid",
        textDecorationColor: "#000",

    },
})