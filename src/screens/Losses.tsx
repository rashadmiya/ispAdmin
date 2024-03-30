import React, { useEffect, useState } from 'react'
import { Alert, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, ToastAndroid, TouchableOpacity, TouchableWithoutFeedback, View, } from 'react-native'
import global_styles from '../utils/global_styles'
import { ConstantColor } from '../utils/constant_color'
import firestore from '@react-native-firebase/firestore';
import { SelectList } from 'react-native-dropdown-select-list'
import Modal from 'react-native-modal';
import { UserInterface } from '../interfaces/user_interface';
import Loader from '../utils/Loder';
import { FAB, Button, Icon } from '@rneui/base';
import LossModal from '../modals/LossModal';
import { LossInterface } from '../interfaces/TransactionInterface';
import { useSelector } from 'react-redux';

interface MonthlyTotal {
    amount: number;
    createdAT: any;
    partner_id: string;
    type: string;
}


const Losses = () => {
    const reduxLossConstant = useSelector((state: any) => state.lossConstant.value);
    const user = useSelector((state: any) => state.loggedInUser.value);
    const [lossReason, setLossReason] = React.useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [shouldLoadAgain, setShouldLoadAgain] = useState(false);
    const [showModal, setShowModal] = useState(false)
    const [isUpdateModalVisible, setIsUpdateModalVisible] = useState<LossInterface | undefined>(undefined);
    const [newLossAmount, setNewLossAmount] = useState('');

    const [monthlyTotals, setMonthlyTotals] = useState<MonthlyTotal[]>([]);

    // useEffect(() => {
    //     setIsLoading(true);
    //     const currentDate = new Date();
    //     const twelveMonthsAgo = new Date();
    //     twelveMonthsAgo.setMonth(currentDate.getMonth() - 12);

    //     const query = firestore().collection('transactions')
    //         .where('createdAt', '>=', twelveMonthsAgo).where('createdAt', '<=', currentDate);
    //     // query.where('type', '==', 'loss')
    //     const unsubscribe = query.where('type', '==', 'loss').onSnapshot((snapshot) => {
    //         const updatedMonthlyTotals: MonthlyTotal[] = [];
    //         snapshot.forEach((doc: any) => {
    //             const transactionData = doc.data();
    //             if (!transactionData) return;
    //             transactionData.id = doc.id;

    //             updatedMonthlyTotals.push(transactionData);
    //             setIsLoading(false)
    //         });

    //         if (!isLoading) {
    //             setMonthlyTotals(updatedMonthlyTotals);
    //         }
    //     });

    //     // Unsubscribe from snapshot listener when component unmounts
    //     return () => unsubscribe();
    // }, []);

    useEffect(() => {
        createLastTwelveMonth();
    }, [shouldLoadAgain])


    const createLastTwelveMonth = async () => {
        console.log("load again call")
        setIsLoading(true)
        const transactionsRef = await firestore().collection('transactions');
        const currentDate = new Date();
        const twelveMonthsAgo = new Date();
        twelveMonthsAgo.setMonth(currentDate.getMonth() - 12);

        const lastTwelveMonthsQuery = transactionsRef.where('type', '==', 'loss')
            .where('createdAt', '>=', twelveMonthsAgo).where('createdAt', '<=', currentDate).orderBy('createdAt', 'desc');

        await lastTwelveMonthsQuery.get().then((querySnapshot: any) => {
            const updatedMonthlyTotals: MonthlyTotal[] = [];

            querySnapshot.forEach((doc: any) => {
                const transactionData = doc.data();
                transactionData.id = doc.id;
                // console.log("load data :", doc.data())
                if (!transactionData) return setIsLoading(false);

                updatedMonthlyTotals.push(transactionData);
                setIsLoading(false)
            });

            if (!isLoading) {
                setMonthlyTotals(updatedMonthlyTotals);
            }
        }).catch((err: any) => {
            console.log("user transaction load error :", err.message);
            setIsLoading(false)
        });
    };

    const hideModal = () => {
        setIsUpdateModalVisible(undefined);
    }

    const updateLossInfo = async (loss: LossInterface) => {
        setIsLoading(true)
        await firestore().collection('transactions').doc(loss.id).update({
            lossReason: lossReason || loss.lossReason,
            type: loss.type,
            amount: newLossAmount || loss.amount,
            createdAt: loss.createdAt,
            dateOfLoss: loss.dateOfLoss,
            id: loss.id,
        })
            .then(async () => {
                setLossReason('');
                setIsLoading(false);
                ToastAndroid.show('loss has been updated', 500);
                setIsUpdateModalVisible(undefined);
                await createLastTwelveMonth();
            })
            .catch((err) => {
                console.log(`error in update user=>${loss.id} role:`, err.message);
                setLossReason('');
                setIsLoading(false);
                // ToastAndroid.show('user role has been updated', 500);
                // setIsmodalVisible(undefined);
                setIsUpdateModalVisible(undefined)
            })
    };



    const deleteLossTransection = async (elem: LossInterface) => {
        await firestore().collection('transactions').doc(elem.id).delete()
            .then(() => {
                ToastAndroid.show('loss has been deleted', 500);
                createLastTwelveMonth();
            })
            .catch((err) => {
                Alert.alert('Warning!', `Error occour while delete loss=>${elem.id}, Please try again`, [
                    { text: 'Okey', onPress: () => updateLossInfo(elem) }
                ]);
            })
    }

    const lossModalHandler = (afterThen: any) => {
        if (afterThen) {
            shouldLoadAgain ? setShouldLoadAgain(false) : setShouldLoadAgain(true);
        }
        setShowModal(false);
    }

    // const submitInvest = async (lossBy: string, lossAmount: string, date: any, setLossAmount: any, setLossBy: any) => {
    //     if (lossBy && lossAmount) {
    //         const createTranssction: LossInterface = {
    //             lossReason: lossBy,
    //             type: 'loss',
    //             amount: parseInt(lossAmount),
    //             createdAt: firestore.FieldValue.serverTimestamp(),
    //             dateOfLoss: date,
    //         }
    //         await firestore().collection('transactions').doc().set(createTranssction)
    //             .then(async () => {
    //                 await createLastTwelveMonth();
    //                 setLossAmount('');
    //                 setLossBy('');
    //                 setShowModal(false);
    //                 ToastAndroid.show('Income Updated Successfully!', ToastAndroid.SHORT);
    //             })
    //             .catch((error: any) => console.log(error));

    //         return;

    //     }
    //     return Alert.alert('Alert', 'Please Enter valid name and amount')
    // }


    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: ConstantColor.white }}>
            {isLoading && <Loader />}
            <View style={global_styles.customContainer}>

                <View style={global_styles.sizedBoxTen}></View>

                <View style={{}}>
                    <Text style={[global_styles.textMedium, { fontSize: 18 }]}>Manage your losses</Text>
                </View>
                <View style={global_styles.sizedBoxTen}></View>
                <View style={global_styles.sizedBoxTen}></View>

                <ScrollView
                    style={{ backgroundColor: ConstantColor.white, opacity: 0.8, overflow: 'scroll', marginBottom: 90 }}
                    indicatorStyle='black'
                >
                    {
                        monthlyTotals.map((elem: any, index) => {
                            let lOdate = elem.dateOfLoss.toDate().toDateString();
                            return (
                                <View style={[global_styles.borderBox, { marginBottom: 5 }]} key={index}>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                        <Text style={[{ width: '50%', color: 'black', fontSize: 16, fontWeight: 'bold', textAlign: 'left' }]}>Loss From: {elem?.lossReason}</Text>
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

                                    <View style={{ paddingVertical: 5 }}>
                                        <Text style={[{ color: 'black', fontSize: 16, fontWeight: 'bold' }]}>Amount: {elem.amount}৳</Text>
                                        <Text style={{ color: 'black', fontWeight: '500', fontSize: 13 }}>Date: {lOdate}</Text>
                                        <Text style={{ color: 'black', fontWeight: '500', fontSize: 13 }}>Ref Msg: {elem?.reference || 'No Message'}</Text>
                                        {elem.entryBy && <Text style={[global_styles.textBlack, global_styles.textBold,]}
                                        >Entry By: {elem.entryBy || 'Clerk not found'}</Text>
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
                            <Text style={[global_styles.modalHeader,]}>Update Loss Info</Text>
                            <View style={global_styles.greyLine} />
                        </View>

                        <View style={{ backgroundColor: ConstantColor.white, flex: 1, }}>
                            <View style={{ ...global_styles.shadow, padding: 5 }}>

                                <View style={global_styles.sizedBoxTen}></View>
                                <Text style={[global_styles.textMedium, global_styles.shadawText]}>{`Update ${isUpdateModalVisible?.lossReason}'s`}</Text>
                                <View style={global_styles.sizedBoxTen}></View>
                                <TextInput
                                    placeholderTextColor="#000"
                                    placeholder="Enter Loss Amount"
                                    onChangeText={(text) => setNewLossAmount(text)}
                                    value={newLossAmount}
                                    autoCapitalize="none"
                                    style={styles.text_input}
                                    keyboardType='number-pad'
                                />

                                <View style={global_styles.sizedBoxTen}></View>
                                <SelectList
                                    setSelected={(val: string) => setLossReason(val)}
                                    data={reduxLossConstant}
                                    save="value"
                                    dropdownStyles={{ backgroundColor: '#fff' }}
                                    placeholder='Change Loss Sector'
                                    boxStyles={{ padding: 0, height: 40, margin: 0 }}
                                    inputStyles={{ height: 30, color: 'black' }}
                                    dropdownTextStyles={{ color: 'black' }}
                                />
                                <Text></Text>

                                <TouchableOpacity
                                    onPress={() => {
                                        if (isUpdateModalVisible) updateLossInfo(isUpdateModalVisible);
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

            <View style={{
                display: user.role == 'admin' ? 'flex' : 'none', position: 'absolute', bottom: 0, padding: 5
            }}>
                <FAB
                    visible={true}
                    title="Add Loss"
                    upperCase
                    icon={{ name: 'add', color: 'white' }}
                    color={ConstantColor.febGreen}
                    onPress={() => setShowModal(true)}
                />
            </View>

            <View>
                <LossModal openedItem={'loss'} isModalVisible={showModal} modalHide={lossModalHandler} />
            </View>

        </SafeAreaView >
    )
}

export default Losses;

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