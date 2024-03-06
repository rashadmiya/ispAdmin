import DateTimePicker from '@react-native-community/datetimepicker';
import firestore from '@react-native-firebase/firestore';
import { Button, FAB } from '@rneui/base';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    Platform,
    SafeAreaView, ScrollView, StyleSheet, Text,
    TextInput,
    ToastAndroid,
    TouchableOpacity, TouchableWithoutFeedback, View
} from 'react-native';
import Modal from 'react-native-modal';
import { useSelector } from 'react-redux';
import { BorrowInterface } from '../interfaces/TransactionInterface';
import BorrowModal from '../modals/BorrowModal';
import Loader from '../utils/Loder';
import { ConstantColor } from '../utils/constant_color';
import Icon from '../utils/customIcons';
import global_styles from '../utils/global_styles';

interface MonthlyTotal {
    amount: number;
    createdAT: any;
    partner_id: string;
    type: string;
}


const Borrower = () => {
    const user = useSelector((state: any) => state.loggedInUser.value);

    const [isLoading, setIsLoading] = useState(false);
    const [shouldLoadAgain, setShouldLoadAgain] = useState(false);

    const [showModal, setShowModal] = useState(false)
    const [isUpdateModalVisible, setIsUpdateModalVisible] = useState<BorrowInterface | undefined>(undefined);
    const [newBorrowAmount, setNewBorrowAmount] = React.useState('');
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

    // const fetchData = async () => {
    //     const transactionsRef = await db.collection('transactions');
    //     const currentDate = new Date();
    //     const twelveMonthsAgo = new Date();
    //     twelveMonthsAgo.setMonth(currentDate.getMonth() - 12);

    //     const lastTwelveMonthsQuery = transactionsRef
    //         .where('type', '==', 'borrow') // Filter by type "borrow"
    //         .where('createdAt', '>=', twelveMonthsAgo)
    //         .where('createdAt', '<=', currentDate);

    //     lastTwelveMonthsQuery.get().then((querySnapshot) => {
    //         const updatedMonthlyTotals: MonthlyTotals = {};

    //         querySnapshot.forEach((doc) => {
    //             const transactionData = doc.data();

    //             if (!transactionData) return;

    //             const transactionDate = transactionData.createdAt.toDate();
    //             const month = transactionDate.getMonth() + 1;
    //             const year = transactionDate.getFullYear();
    //             const monthYearKey = `${month < 10 ? '0' : ''}${month}-${year}`;

    //             const borrower = transactionData.borrower; // Assuming you have a borrower field in your transaction data

    //             if (!updatedMonthlyTotals[borrower]) {
    //                 updatedMonthlyTotals[borrower] = {
    //                     invest: 0,
    //                     income: 0,
    //                     expense: 0,
    //                     loan_to: 0,
    //                     borrow: 0,
    //                     loss: 0,
    //                 };
    //             }

    //             updatedMonthlyTotals[borrower].borrow += transactionData.amount;
    //         });

    //         setMonthlyTotals(updatedMonthlyTotals);
    //     }).catch((err:any)=>{
    //         console.log("heeeellooo:",err.message)
    //     });
    // };


    const createLastTwelveMonth = async () => {
        setIsLoading(true)
        const transactionsRef = await firestore().collection('transactions');
        const currentDate = new Date();
        const twelveMonthsAgo = new Date();
        twelveMonthsAgo.setMonth(currentDate.getMonth() - 12);

        const lastTwelveMonthsQuery = transactionsRef.where('type', '==', 'borrow')
            .where('createdAt', '>=', twelveMonthsAgo).where('createdAt', '<=', currentDate).orderBy('createdAt', 'desc');

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
        // setIsmodalVisible(undefined);
        setIsUpdateModalVisible(undefined);
    }

    const updateLossInfo = async (borrow: BorrowInterface) => {
        setIsLoading(true)
        await firestore().collection('transactions').doc(borrow.id).update({
            repaymentDate: date.repaymentDate || borrow.repaymentDate,
            amount: newBorrowAmount || borrow.amount,
            id: borrow.id,
        })
            .then(() => {
                setNewBorrowAmount('');
                setIsLoading(false);
                ToastAndroid.show('borrow has been updated', 500);
                setIsUpdateModalVisible(undefined);
                setShouldLoadAgain(true);
            })
            .catch((err) => {
                console.log(`error in update borrow=>${borrow.id}:`, err.message);
                setNewBorrowAmount('');
                setIsLoading(false);
                setIsUpdateModalVisible(undefined)
            })
    };

    const borrowModalHandler = () => {
        setShowModal(false);
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

    const deleteLossTransection = async (elem: BorrowInterface) => {
        await firestore().collection('transactions').doc(elem.id).delete()
            .then(() => {
                ToastAndroid.show('borrow has been deleted', 500);
                setShouldLoadAgain(true)
            })
            .catch((err) => {
                Alert.alert('Warning!', `Error occour while delete borrow =>${elem.id}, Please try again`, [
                    { text: 'Okey', onPress: () => updateLossInfo(elem) }
                ]);
            })
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: ConstantColor.white }}>
            {isLoading && <Loader />}
            <View style={global_styles.customContainer}>

                <View style={global_styles.sizedBoxTen}></View>

                <View style={{}}>
                    <Text style={[global_styles.textMedium, { fontSize: 18 }]}>Manage your borrowers</Text>
                </View>
                <View style={global_styles.sizedBoxTen}></View>
                <View style={global_styles.sizedBoxTen}></View>

                <ScrollView
                    style={{ backgroundColor: ConstantColor.white, opacity: 0.8, overflow: 'scroll', marginBottom: 150 }}
                    indicatorStyle='black'
                >
                    {
                        monthlyTotals.map((elem: any, index) => {
                            let bd = elem.borrowDate.toDate().toDateString();
                            let rd = elem.repaymentDate.toDate().toDateString();
                            return (
                                <View style={global_styles.borderBox} key={index}>
                                    <View style={global_styles.justifyBetweenCenter}>
                                        <Text style={[{ width: '60%', color: 'black', fontSize: 16, fontWeight: 'bold', textAlign: 'left' }]}>Loan From: {elem.partner_name}</Text>
                                        <View style={{ display: user.role == 'admin' ? 'flex' : 'none', flexDirection: 'row', justifyContent: 'space-between', }}>
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
                                                            { text: 'OK', onPress: () => deleteLossTransection(elem) },
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


                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 5 }}>
                                        <View>
                                            <Text style={[{ color: 'black', fontSize: 16, fontWeight: 'bold', }]}>Amount: {elem.amount}৳</Text>
                                            <Text style={[global_styles.textBlack, global_styles.textBold,]}>Borrow Date: {bd}</Text>
                                            <Text style={[global_styles.textBlack, global_styles.textBold,]}>Repayment Date: {rd}</Text>
                                            <Text style={[{ color: 'black', fontWeight: 'bold', }]}>Ref Msg: {elem?.ref|| 'No Message Found'}</Text>
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
                            <Text style={[global_styles.modalHeader,]}>Update Borrow</Text>
                            <View style={global_styles.greyLine} />
                        </View>

                        <View style={{ backgroundColor: ConstantColor.white, flex: 1, }}>
                            <View style={{ ...global_styles.shadow, padding: 5 }}>

                                <View style={global_styles.sizedBoxTen}></View>

                                <Text style={[global_styles.textMedium, global_styles.shadawText]}>{`Update ${isUpdateModalVisible?.partner_name}'s borrow`}</Text>
                                <View style={global_styles.sizedBoxTen}></View>
                                <View style={global_styles.sizedBoxTen}></View>

                                <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                                    <View style={{ width: '60%' }}>
                                        <TextInput
                                            placeholderTextColor="#000"
                                            placeholder="Borrow's Amount"
                                            onChangeText={(text) => setNewBorrowAmount(text)}
                                            value={newBorrowAmount}
                                            autoCapitalize="none"
                                            style={styles.text_input}
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
                                    style={{ backgroundColor: ConstantColor.secondary, opacity: 0.7, borderRadius: 100, borderWidth: 2, borderColor: 'grey', marginTop: 'auto' }}>
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
                    title="Add Borrow"
                    upperCase
                    icon={{ name: 'add', color: 'white' }}
                    color={ConstantColor.febGreen}
                    onPress={() => setShowModal(true)}
                />
            </View>

            <View>
                <BorrowModal isModalVisible={showModal} modalHide={borrowModalHandler} />
            </View>

        </SafeAreaView >
    )
}

export default Borrower;

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
    text_input: {
        paddingVertical: 5,
        paddingHorizontal: 8,
        fontSize: 14,
        color: '#000',
        width: '100%',
        borderWidth: 1,
        borderColor: '#dbdbdb'
    },
})