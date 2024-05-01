import firestore from '@react-native-firebase/firestore';
import { Button, FAB } from '@rneui/base';
import React, { useEffect, useState } from 'react';
import { Alert, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, ToastAndroid, TouchableOpacity, TouchableWithoutFeedback, View, } from 'react-native';
import { SelectList } from 'react-native-dropdown-select-list';
import Modal from 'react-native-modal';
import { useSelector } from 'react-redux';
import { IncomeInterface } from '../interfaces/TransactionInterface';
import IncomeModal from '../modals/IncomeModal';
import Loader from '../utils/Loder';
import { ConstantColor } from '../utils/constant_color';
import global_styles from '../utils/global_styles';
import Icon from '../utils/customIcons';

interface MonthlyTotal {
    amount: number;
    createdAT: any;
    partner_id: string;
    type: string;
}


const Income = () => {
    const reduxIncomeConstant = useSelector((state: any) => state.lossConstant.value);
    const loggedInUser = useSelector((state: any) => state.loggedInUser.value);
    const [incomeFrom, setIncomeFrom] = React.useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showModal, setShowModal] = useState(false)
    const [isUpdateModalVisible, setIsUpdateModalVisible] = useState<IncomeInterface | undefined>(undefined);
    const [newIncomeAmount, setNewIncomeAmount] = useState('');


    const [monthlyTotals, setMonthlyTotals] = useState<MonthlyTotal[]>([]);

    useEffect(() => {
        createLastTwelveMonth();
    }, []);



    const createLastTwelveMonth = async () => {
        setIsLoading(true)
        const transactionsRef = await firestore().collection('transactions');
        const currentDate = new Date();
        const twelveMonthsAgo = new Date();
        twelveMonthsAgo.setMonth(currentDate.getMonth() - 12);

        const lastTwelveMonthsQuery = transactionsRef.where('type', '==', 'income')
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
        setIsUpdateModalVisible(undefined);
    }

    const updateIncomeInfo = async (income: IncomeInterface) => {
        setIsLoading(true)
        await firestore().collection('transactions').doc(income.id).update({
            amount: newIncomeAmount || income.amount,
            incomeFrom: incomeFrom,
            id: income.id,
        })
            .then(async () => {
                setNewIncomeAmount('');
                setIsLoading(false);
                await createLastTwelveMonth();
                ToastAndroid.show('Income has been updated', 500);
                setIsUpdateModalVisible(undefined)
            })
            .catch((err) => {
                console.log(`error in update income=>${income.id}:`, err.message);
                setNewIncomeAmount('');
                setIsLoading(false);
                setIsUpdateModalVisible(undefined)
            })
    };



    const deleteIncomeTransaction = async (elem: IncomeInterface) => {
        await firestore().collection('transactions').doc(elem.id).delete()
            .then(async () => {
                await createLastTwelveMonth();
                ToastAndroid.show('loss has been deleted', 500);

            })
            .catch((err) => {
                Alert.alert('Warning!', `Error occour while delete income=>${elem.id}, Please try again`, [
                    { text: 'Okey', onPress: () => { } }
                ]);
            })
    }

    const incomeModalHandler = async (afterThen: any) => {
        if (afterThen) {
            await createLastTwelveMonth()
        }
        setShowModal(false);
    }


    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: ConstantColor.white }}>
            {isLoading && <Loader />}
            <View style={global_styles.customContainer}>

                <View style={global_styles.sizedBoxTen}></View>

                <View style={{}}>
                    <Text style={[global_styles.textMedium, { fontSize: 18 }]}>Manage your income</Text>
                </View>
                <View style={global_styles.sizedBoxTen}></View>
                <View style={global_styles.sizedBoxTen}></View>

                <ScrollView
                    style={{ backgroundColor: ConstantColor.white, opacity: 0.8, overflow: 'scroll', marginBottom: 80 }}
                    indicatorStyle='black'
                >
                    {
                        monthlyTotals.map((elem: any, index) => {
                            // let bd = elem.borrowDate.toDate().toDateString();
                            let incomeDate = elem.incomeDate.toDate().toDateString();
                            return (
                                <View style={global_styles.borderBox} key={index}>
                                    <View style={global_styles.justifyBetweenCenter}>
                                        <Text style={[{ width: '60%', color: 'black', fontSize: 16, fontWeight: 'bold', textAlign: 'left' }]}>Earn From: {elem.incomeFrom}</Text>
                                        <View style={{ display: loggedInUser.role == 'admin' ? 'flex' : 'none', flexDirection: 'row', justifyContent: 'space-between' }}>
                                            <Button
                                                onPress={() => setIsUpdateModalVisible(elem)}
                                                buttonStyle={{ backgroundColor: '#fff', marginRight: 1, opacity: 0.7, borderRadius: 100, borderWidth: 2, borderColor: 'grey', padding: 1 }}
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
                                                            { text: 'OK', onPress: () => deleteIncomeTransaction(elem) },
                                                        ])
                                                }}
                                                buttonStyle={{ backgroundColor: '#fff', opacity: 0.7, borderRadius: 100, borderWidth: 2, borderColor: 'grey', padding: 1 }}
                                            >
                                                <Icon type="material" name="delete-outline" size={20} style={{ color: 'red' }} />

                                            </Button>
                                        </View>
                                    </View>

                                    <View style={{ paddingVertical: 5 }}>
                                        <Text style={[{ color: 'black', fontSize: 16, fontWeight: 'bold' }]}>Amount: {elem.amount}৳</Text>
                                        <Text style={{ color: 'black', fontWeight: '500', fontSize: 13 }}>Income Date: {incomeDate}</Text>
                                        <Text style={{ color: 'black', fontWeight: '500', fontSize: 13 }}>Ref Msg: {elem?.reference || 'No Message'}</Text>
                                        {elem.entryBy && <Text style={[global_styles.textBlack, global_styles.textBold,]}
                                        >Insert By: {elem.entryBy || 'Clerk not found'}</Text>
                                        }
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
                    <View style={{ minHeight: 300, backgroundColor: ConstantColor.lightGray, borderRadius: 10, padding: 10, }}>
                        <View>
                            <Text style={[global_styles.modalHeader, global_styles.textBlack]}>Update Income Info</Text>
                            <View style={global_styles.greyLine} />
                        </View>

                        <View style={{ backgroundColor: ConstantColor.white, flex: 1, }}>
                            <View style={{ ...global_styles.shadow, padding: 5 }}>

                                <View style={global_styles.sizedBoxTen}></View>
                                <Text style={[global_styles.textMedium, global_styles.textBlack]}>{`Update ${isUpdateModalVisible?.incomeFrom}'s info`}</Text>
                                <View style={global_styles.sizedBoxTen}></View>
                                <TextInput
                                    placeholderTextColor="#000"
                                    placeholder="Update Income Amount"
                                    onChangeText={(text) => setNewIncomeAmount(text)}
                                    value={newIncomeAmount}
                                    autoCapitalize="none"
                                    style={global_styles.text_input}
                                    keyboardType='number-pad'
                                />

                                <View style={global_styles.sizedBoxTen}></View>
                                <SelectList
                                    setSelected={(val: string) => setIncomeFrom(val)}
                                    data={reduxIncomeConstant}
                                    save="value"
                                    dropdownStyles={{ backgroundColor: '#fff' }}
                                    placeholder='Change Loss Sector'
                                    boxStyles={{ padding: 0, height: 40, margin: 0 }}
                                    inputStyles={{ height: 30, color: 'black' }}
                                    dropdownTextStyles={{ color: 'black' }}
                                    disabledTextStyles={{color:'#000'}}
                                />
                                <Text></Text>

                                <TouchableOpacity
                                    onPress={() => {
                                        if (isUpdateModalVisible) updateIncomeInfo(isUpdateModalVisible);
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
            <View style={{ display: loggedInUser.role == 'admin' ? 'flex' : 'none', position: 'absolute', bottom: 0, padding: 5 }}>
                <FAB
                    visible={true}
                    title="Add Income"
                    upperCase
                    icon={{ name: 'add', color: 'white' }}
                    color={ConstantColor.febGreen}
                    onPress={() => setShowModal(true)}
                />
            </View>

            <View>
                <IncomeModal openedItem={'income'} isModalVisible={showModal} modalHide={incomeModalHandler} />
            </View>

        </SafeAreaView >
    )
}

export default Income;

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