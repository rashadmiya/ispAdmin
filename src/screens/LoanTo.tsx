import DateTimePicker from '@react-native-community/datetimepicker';
import firestore from '@react-native-firebase/firestore';
import { Button, FAB } from '@rneui/base';
import React, { useEffect, useState } from 'react';
import {
    Alert, Dimensions, Platform, SafeAreaView, ScrollView, StyleSheet, Text,
    TextInput,
    ToastAndroid, TouchableOpacity,
    TouchableWithoutFeedback, View
} from 'react-native';
import Modal from 'react-native-modal';
import { LoanToInterface } from '../interfaces/TransactionInterface';
import LoanToModal from '../modals/LoanToModal';
import Loader from '../utils/Loder';
import { ConstantColor } from '../utils/constant_color';
import Icon from '../utils/customIcons';
import global_styles from '../utils/global_styles';
import { useSelector } from 'react-redux';

interface MonthlyTotal {
    amount: number;
    createdAT: any;
    partner_id: string;
    type: string;
}


const LoanTo = () => {
    const user = useSelector((state: any) => state.loggedInUser.value);

    const [isLoading, setIsLoading] = useState(false);
    const [shouldLoadAgain, setShouldLoadAgain] = useState(false);

    const [showModal, setShowModal] = useState(false)
    const [isUpdateModalVisible, setIsUpdateModalVisible] = useState<LoanToInterface | undefined>(undefined);
    const [newLoanToAmount, setNewLoanToAmount] = React.useState('');
    const [showRepaymentDate, setShowRepaymentDate] = useState(Platform.OS === 'ios');
    const [date, setDate] = useState({
        lendDate: new Date(),
        repaymentDate: new Date(),
    });
    const [isDateTaken, setIsDateTaken] = useState({
        lendDate: false,
        repaymentDate: false
    });


    const [monthlyTotals, setMonthlyTotals] = useState<MonthlyTotal[]>([]);

    useEffect(() => {
        createLastTwelveMonth();
    }, [shouldLoadAgain]);



    const createLastTwelveMonth = async () => {
        setIsLoading(true)
        const transactionsRef = await firestore().collection('transactions');
        const currentDate = new Date();
        const twelveMonthsAgo = new Date();
        twelveMonthsAgo.setMonth(currentDate.getMonth() - 12);

        const lastTwelveMonthsQuery = transactionsRef.where('type', '==', 'loan_to').where('createdAt', '>=', twelveMonthsAgo).where('createdAt', '<=', currentDate);

        await lastTwelveMonthsQuery.get().then((querySnapshot: any) => {
            const updatedMonthlyTotals: MonthlyTotal[] = [];

            querySnapshot.forEach((doc: any) => {
                const transactionData = doc.data();
                transactionData.id = doc.id;
                if (!transactionData) return setIsLoading(false);

                const transactionDate = transactionData.createdAt.toDate();
                const month = transactionDate.getMonth() + 1;
                const year = transactionDate.getFullYear();
                const monthYearKey = `${month < 10 ? '0' : ''}${month}-${year}`;

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
        setIsUpdateModalVisible(undefined);
    }

    const updateLossInfo = async (loan: LoanToInterface) => {
        setIsLoading(true)
        await firestore().collection('transactions').doc(loan.id).update({
            repaymentDate: date.repaymentDate || loan.repaymentDate,
            amount: newLoanToAmount || loan.amount,
            id: loan.id,
        })
            .then(() => {
                setNewLoanToAmount('');
                setIsLoading(false);
                setIsUpdateModalVisible(undefined)
                ToastAndroid.show('loan has been updated', 500);
                setShouldLoadAgain(true);
            })
            .catch((err) => {
                console.log(`error in update user=>${loan.id}:`, err.message);
                setNewLoanToAmount('');
                setIsLoading(false);
                setIsUpdateModalVisible(undefined)
            })
    };



    const deleteLossTransection = async (elem: LoanToInterface) => {
        await firestore().collection('transactions').doc(elem.id).delete()
            .then(() => {
                ToastAndroid.show('loan has been deleted', 500);
                setShouldLoadAgain(true);
            })
            .catch((err) => {
                Alert.alert('Warning!', `Error occour while delete loan To=>${elem.id}, Please try again`, [
                    { text: 'Okey', onPress: () => updateLossInfo(elem) }
                ]);
            })
    }

    const minimumDateFinder = () => {
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate());
        return tomorrow;
    }

    const onChangeWithdrowDate = (e: any, selectedDate: any) => {
        setDate({ lendDate: date.lendDate, repaymentDate: selectedDate });
        setShowRepaymentDate(false);
        setIsDateTaken({ lendDate: isDateTaken.lendDate, repaymentDate: true });
    }

    const loanToModalHandler = (afterThen: any) => {
        if (afterThen) {
            shouldLoadAgain ? setShouldLoadAgain(false) : setShouldLoadAgain(true);
        }
        setShowModal(false);
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: ConstantColor.white }}>
            {isLoading ? monthlyTotals.length <= 0 && (
                <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', height: Dimensions.get("screen").height / 1.5 }}>
                    <Text style={[global_styles.textMedium, global_styles.textBold, global_styles.textCenter]}>No Fund Transfer Found</Text>
                </View>
            ) : (<Loader />)}
            <View style={global_styles.customContainer}>

                <View style={global_styles.sizedBoxTen}></View>

                <View style={{}}>
                    <Text style={[global_styles.textMedium, { fontSize: 18 }]}>Manage your loans</Text>
                </View>
                <View style={global_styles.sizedBoxTen}></View>
                <View style={global_styles.sizedBoxTen}></View>

                <ScrollView
                    style={{ backgroundColor: ConstantColor.white, opacity: 0.8, overflow: 'scroll', marginBottom: 90 }}
                    indicatorStyle='black'
                >
                    {
                        monthlyTotals.map((elem: any, index) => {
                            let bd = elem.borrowDate.toDate().toDateString();
                            let rd = elem.repaymentDate.toDate().toDateString();
                            return (
                                <View style={global_styles.borderBox} key={index}>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                        <Text style={[{ width: '60%', color: 'black', fontSize: 16, fontWeight: 'bold', textAlign: 'left' }]}>Borrower: {elem.borrower}</Text>
                                        <View style={{ display: user.role == 'admin' ? 'flex' : 'none', flexDirection: 'row', justifyContent: 'space-between', }}>
                                            <Button
                                                onPress={() => setIsUpdateModalVisible(elem)}
                                                buttonStyle={{ backgroundColor: '#fff', opacity: 0.7, borderRadius: 100, borderWidth: 2, borderColor: 'grey', padding: 1, marginRight: 2 }}
                                            >
                                                <Icon type="material" name="edit" size={20} style={{ color: 'gray' }} />
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
                                                            { text: 'OK', onPress: () => deleteLossTransection(elem) },
                                                        ])
                                                }}
                                                buttonStyle={{ backgroundColor: '#fff', opacity: 0.7, borderRadius: 100, borderWidth: 2, borderColor: 'grey', padding: 1 }}
                                            >
                                                <Icon type="material" name="delete-outline" size={20} style={{ color: 'red' }} />
                                            </Button>
                                        </View>
                                    </View>


                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 5 }}>
                                        <View>
                                            <Text style={[{ color: 'black', fontSize: 16, fontWeight: 'bold', }]}>Amount: {elem.amount}৳</Text>
                                            <Text style={{ color: 'black', fontWeight: '500', fontSize: 13 }}>Borrow Date: {bd}</Text>
                                            <Text style={{ color: 'black', fontWeight: '500', fontSize: 13 }}>Repayment Date: {rd}</Text>
                                            <View style={{ flexDirection: 'row', }}>
                                                <Text style={{ color: 'black', fontWeight: '500', fontSize: 13 }}>Witness: </Text>
                                                {elem.witness.map((w: any, index: number) => (
                                                    <Text key={index} style={{ color: 'black', width: 'auto' }}>{w},</Text>
                                                ))}
                                            </View>
                                            <Text style={{ color: 'black', fontWeight: '500', fontSize: 13 }}>Ref Msg: {elem?.reference || 'No Message'}</Text>
                                            {elem.entryBy && <Text style={[global_styles.textBlack, global_styles.textBold,]}
                                            >Insert By: {elem.entryBy || 'Clerk not found'}</Text>
                                            }
                                        </View>

                                    </View>
                                </View>
                            )
                        })
                    }

                </ScrollView>
                <View style={global_styles.sizedBoxTen}></View>

            </View>


            <View style={{ flex: 1 }}>
                <Modal
                    isVisible={isUpdateModalVisible ? true : false}
                    onSwipeComplete={hideModal}
                    swipeDirection="up"
                    customBackdrop={
                        <TouchableWithoutFeedback onPress={hideModal}>
                            <View style={{ flex: 1, backgroundColor: 'black' }} />
                        </TouchableWithoutFeedback>
                    }
                >
                    <View style={{ minHeight: 200, backgroundColor: ConstantColor.lightGray, borderRadius: 10, padding: 10, }}>
                        <View>
                            <Text style={[global_styles.modalHeader,]}>Update User</Text>
                            <View style={global_styles.greyLine} />
                        </View>

                        <View style={{ backgroundColor: ConstantColor.white, flex: 1, }}>
                            <View style={{ ...global_styles.shadow, padding: 5 }}>

                                <View style={global_styles.sizedBoxTen}></View>
                                <Text style={[global_styles.textMedium, global_styles.shadawText]}>{`Update ${isUpdateModalVisible?.borrower}'s loan`}</Text>
                                <View style={global_styles.sizedBoxTen}></View>


                                <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                                    <View style={{ width: '60%' }}>
                                        <TextInput
                                            placeholderTextColor="#000"
                                            placeholder="New Loan Amount"
                                            onChangeText={(text) => setNewLoanToAmount(text)}
                                            value={newLoanToAmount}
                                            autoCapitalize="none"
                                            style={global_styles.text_input}
                                            keyboardType='number-pad'
                                        />
                                    </View>

                                    <View style={{ width: '40%', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                                        <TouchableOpacity
                                            style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 6 }}
                                            onPress={() => setShowRepaymentDate(true)}>

                                            {Platform.OS === 'ios' || (
                                                <Text style={{
                                                    color: '#111',
                                                    textAlign: 'center',
                                                    fontSize: 14,
                                                }}>
                                                    {/* {text} */}
                                                </Text>
                                            )}
                                            {showRepaymentDate && (
                                                <DateTimePicker
                                                    testID="dateTimePicker"
                                                    value={date.repaymentDate}
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

                                                {isDateTaken.repaymentDate ? (
                                                    <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                                                        <Icon
                                                            name="calendar"
                                                            type="font"
                                                            size={20}
                                                            color={'#000'}
                                                        />
                                                        <Text style={{ fontWeight: 'bold', color: 'black', fontSize: 12 }}>{date.repaymentDate.toDateString()}</Text>
                                                    </View>
                                                ) : (
                                                    <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                                                        <Icon
                                                            name="calendar"
                                                            type="font"
                                                            size={20}
                                                            color={'#000'}
                                                        />
                                                        <Text style={{ fontWeight: 'bold', color: 'black', fontSize: 12 }}>Repayment Date</Text>
                                                    </View>
                                                )}

                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                                <View style={global_styles.sizedBoxTen}></View>

                                <TouchableOpacity
                                    onPress={() => {
                                        if (isUpdateModalVisible) updateLossInfo(isUpdateModalVisible)
                                    }}
                                    style={{ backgroundColor: ConstantColor.secondary, opacity: 0.7, borderRadius: 100, borderWidth: 2, borderColor: 'grey' }}>
                                    <Text style={{ color: 'black', fontWeight: '800', fontSize: 14, paddingVertical: 8, paddingHorizontal: 5, textAlign: 'center' }}>
                                        Update
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>
            </View>
            <View style={{ display: user.role == 'admin' ? 'flex' : 'none', position: 'absolute', bottom: 0, padding: 5 }}>
                <FAB
                    visible={true}
                    title="Add Loan To"
                    upperCase
                    icon={{ name: 'add', color: 'white' }}
                    color={ConstantColor.febGreen}
                    onPress={() => setShowModal(true)}
                />
            </View>

            <View>
                <LoanToModal openedItem={'loanTo'} isModalVisible={showModal} modalHide={loanToModalHandler} />
            </View>

        </SafeAreaView >
    )
}

export default LoanTo;

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