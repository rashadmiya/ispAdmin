import firestore from '@react-native-firebase/firestore';
import { Button, FAB } from '@rneui/base';
import React, { useEffect, useState } from 'react';
import { Dimensions, SafeAreaView, ScrollView, StyleSheet, Text, ToastAndroid, TouchableOpacity, TouchableWithoutFeedback, View, } from 'react-native';
import { SelectList } from 'react-native-dropdown-select-list';
import Modal from 'react-native-modal';
import { UserInterface } from '../interfaces/user_interface';
import BorrowModal from '../modals/BorrowModal';
import Loader from '../utils/Loder';
import { ConstantColor } from '../utils/constant_color';
import global_styles from '../utils/global_styles';

interface FundTransfer {
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
    const [userRole, setUserRole] = React.useState('');
    const [isModalVisible, setIsmodalVisible] = useState<UserInterface | undefined>(undefined);
    const [isLoading, setIsLoading] = useState(false);
    const [showModal, setShowModal] = useState(false)
    const [fundTransfers, setFundTransfers] = useState<FundTransfer[]>([]);

    useEffect(() => {
        // fetchData();
        createLastTwelveMonth();
        return () => {
            setIsLoading(false);
        };
    }, []);



    const createLastTwelveMonth = async () => {
        setIsLoading(true)
        const transactionsRef = await firestore().collection('transactions');
        const currentDate = new Date();
        const twelveMonthsAgo = new Date();
        twelveMonthsAgo.setMonth(currentDate.getMonth() - 12);

        const lastTwelveMonthsQuery = transactionsRef.where('type', '==', 'fund_transfer').where('createdAt', '>=', twelveMonthsAgo).where('createdAt', '<=', currentDate);

        await lastTwelveMonthsQuery.get().then((querySnapshot: any) => {
            const updatedfundTransfers: FundTransfer[] = [];

            querySnapshot.forEach((doc: any) => {
                const transactionData = doc.data();
                // console.log("load data :", doc.data())
                if (!transactionData) return setIsLoading(false);

                const transactionDate = transactionData.createdAt.toDate();
                const month = transactionDate.getMonth() + 1;
                const year = transactionDate.getFullYear();
                const monthYearKey = `${month < 10 ? '0' : ''}${month}-${year}`;

                updatedfundTransfers.push(transactionData);
                setIsLoading(false)
            });

            if (!isLoading) {
                setFundTransfers(updatedfundTransfers);

                // if (updatedfundTransfers.length > 1) setActiveMonth(updatedfundTransfers.length - 1);
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

            <View style={global_styles.customContainer}>

                <View style={global_styles.sizedBoxTen}></View>

                <View style={{}}>
                    <Text style={[global_styles.textMedium, { fontSize: 18 }]}>Manage your fund transfer</Text>
                </View>
                <View style={global_styles.sizedBoxTen}></View>
                <View style={global_styles.sizedBoxTen}></View>

                <ScrollView
                    style={{ backgroundColor: ConstantColor.white, opacity: 0.8, overflow: 'scroll', }}
                    indicatorStyle='black'
                >
                    {
                        fundTransfers.length > 0 && fundTransfers.map((elem: any, index) => {
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
                                                Manage Fund
                                            </Text>
                                        </Button>
                                    </View>
                                </View>
                            )
                        })
                    }
                    {isLoading ? fundTransfers.length <= 0 && (
                        <View style={{ flex: 1, flexDirection:'row', justifyContent: 'center', alignItems: 'center', height: Dimensions.get("screen").height/1.5 }}>
                            <Text style={[global_styles.textMedium, global_styles.textBold, global_styles.textCenter]}>No Fund Transfer Found</Text>
                        </View>
                    ) : (<Loader />)}

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
                            <Text style={[global_styles.modalHeader,]}>Update Fund</Text>
                            <View style={global_styles.greyLine} />
                        </View>

                        <View style={{ backgroundColor: ConstantColor.white, flex: 1, }}>
                            <View style={{ ...global_styles.shadow, padding: 5 }}>

                                <View style={global_styles.sizedBoxTen}></View>
                                <Text style={[global_styles.textMedium, global_styles.shadawText]}>{`Update ${isModalVisible?.fullName}'s fund`}</Text>
                                <View style={global_styles.sizedBoxTen}></View>

                                <SelectList
                                    setSelected={(val: string) => setUserRole(val)}
                                    data={data}
                                    save="value"
                                    dropdownTextStyles={{ color: 'black' }}
                                    dropdownStyles={{ backgroundColor: '#fff' }}
                                    placeholder='Loss Sector'
                                    boxStyles={{ padding: 0, height: 40, margin: 0, }}
                                    inputStyles={{ height: 30, color: 'black' }}
                                    disabledTextStyles={{color:'#000'}}
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
            {/* <View style={{ flexDirection: 'row', justifyContent: 'flex-end', padding: 20 }}>
                <FAB
                    visible={true}
                    title="Add Fund Transfer"
                    upperCase
                    icon={{ name: 'add', color: 'white' }}
                    color={ConstantColor.febGreen}
                    onPress={() => setShowModal(true)}
                />
            </View> */}

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