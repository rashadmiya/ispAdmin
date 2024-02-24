import React, { useEffect, useState } from 'react'
import { SafeAreaView, ScrollView, StyleSheet, Text, ToastAndroid, TouchableOpacity, TouchableWithoutFeedback, View, } from 'react-native'
import global_styles from '../utils/global_styles'
import { ConstantColor } from '../utils/constant_color'
import firestore from '@react-native-firebase/firestore';
import { SelectList } from 'react-native-dropdown-select-list'
import Modal from 'react-native-modal';
import { UserInterface } from '../interfaces/user_interface';
import Loader from '../utils/Loder';
import ItemContainerComp from '../components/ItemContainerComp';
import db from '../constants/database';
import { FAB, Button } from '@rneui/base';
import BorrowModal from '../modals/BorrowModal';

interface MonthlyTotal {
    amount: number;
    createdAT: any;
    partner_id: string;
    type: string;
}

const data = [
    { key: '1', value: 'Partner' },
    { key: '2', value: 'employee' },
    // {key:'3', value:'Cameras'},
    // {key:'4', value:'Computers', disabled:true},
];

const FundTransfers = () => {
    const [employes, setEmployes] = useState([]);
    const [userRole, setUserRole] = React.useState('');
    const [isModalVisible, setIsmodalVisible] = useState<UserInterface | undefined>(undefined);
    const [isLoading, setIsLoading] = useState(false);
    const [showModal, setShowModal] = useState(false)



    const [monthlyTotals, setMonthlyTotals] = useState<MonthlyTotal[]>([]);

    useEffect(() => {
        // fetchData();
        createLastTwelveMonth()
    }, []);

    

    const createLastTwelveMonth = async () => {
        setIsLoading(true)
        const transactionsRef = await firestore().collection('transactions');
        const currentDate = new Date();
        const twelveMonthsAgo = new Date();
        twelveMonthsAgo.setMonth(currentDate.getMonth() - 12);

        const lastTwelveMonthsQuery = transactionsRef.where('type', '==', 'loss').where('createdAt', '>=', twelveMonthsAgo).where('createdAt', '<=', currentDate);

        await lastTwelveMonthsQuery.get().then((querySnapshot: any) => {
            const updatedMonthlyTotals: MonthlyTotal[] = [];

            querySnapshot.forEach((doc: any) => {
                const transactionData = doc.data();
                // console.log("load data :", doc.data())
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
        setIsmodalVisible(undefined)
    }

    const updateUserRole = async (id: string) => {
        setIsLoading(true)
        await firestore().collection('employes').doc(id).update({ 'role': userRole })
            .then(() => {
                setUserRole('');
                setIsLoading(false);
                ToastAndroid.show('user role has been updated', 500);
                setIsmodalVisible(undefined);
            })
            .catch((err) => {
                console.log(`error in update user=>${id} role:`, err.message);
                setUserRole('');
                setIsLoading(false);
                // ToastAndroid.show('user role has been updated', 500);
                setIsmodalVisible(undefined);
            })
    };

    const borrowModalHandler = () => {
        setShowModal(false);
    }

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
                    style={{ backgroundColor: ConstantColor.white, opacity: 0.8, overflow: 'scroll', marginBottom: 150 }}
                    indicatorStyle='black'
                >
                    {
                        monthlyTotals.map((elem: any, index) => {
                            // let bd = elem.borrowDate.toDate().toDateString();
                            let lOdate = elem.dateOfLoss.toDate().toDateString();
                            return (
                                <View style={global_styles.borderBox} key={index}>
                                    <View style={global_styles.justifyBetweenCenter}>
                                        <Text style={[{ width: '50%', color: 'black', fontSize: 16, fontWeight: 'bold', textAlign: 'left' }]}>Name: {elem.partner_name}</Text>
                                        <Text style={[{ width: '50%', color: 'black', fontSize: 16, fontWeight: 'bold', textAlign: 'right' }]}>Amount: {elem.amount}৳</Text>
                                    </View>
                                    <View style={global_styles.sizedBoxTen}></View>


                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 5 }}>
                                        <View>
                                            {/* <Text style={[global_styles.textBlack, global_styles.textBold,]}>Borrow Date: {bd}</Text> */}
                                            <Text style={[global_styles.textBlack, global_styles.textBold,]}>Date: {lOdate}</Text>
                                        </View>
                                        <Button
                                            // onPress={() => setIsmodalVisible(employee)}
                                            buttonStyle={{ backgroundColor: '#fff', opacity: 0.7, borderRadius: 100, borderWidth: 2, borderColor: 'grey' }}
                                            // style={{ backgroundColor: '#fff', opacity: 0.7, borderRadius: 100, borderWidth: 2, borderColor: 'grey' }}
                                        >
                                            <Text style={{ color: 'black', fontWeight: '800', fontSize: 14, paddingHorizontal: 5 }}>
                                                Manage User
                                            </Text>
                                        </Button>
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
                    isVisible={isModalVisible ? true : false}
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
                                <Text style={[global_styles.textMedium, global_styles.shadawText]}>{`Update ${isModalVisible?.fullName}'s role`}</Text>
                                <View style={global_styles.sizedBoxTen}></View>

                                <SelectList
                                    setSelected={(val: string) => setUserRole(val)}
                                    data={data}
                                    save="value"
                                />
                                <Text></Text>

                                <TouchableOpacity
                                    onPress={() => {
                                        if (isModalVisible) updateUserRole(isModalVisible.id)
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
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', padding: 20 }}>
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

export default FundTransfers;

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