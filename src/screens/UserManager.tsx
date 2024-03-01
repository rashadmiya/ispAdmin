import React, { useEffect, useState } from 'react'
import { Button, SafeAreaView, ScrollView, StyleSheet, Text, ToastAndroid, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native'
import global_styles from '../utils/global_styles'
import { ConstantColor } from '../utils/constant_color'
import firestore from '@react-native-firebase/firestore';
import { SelectList } from 'react-native-dropdown-select-list'
import Modal from 'react-native-modal';
import { UserInterface } from '../interfaces/user_interface';
import Loader from '../utils/Loder';
import ItemContainerComp from '../components/ItemContainerComp';
const data = [
    { key: '1', value: 'partner' },
    { key: '2', value: 'admin' },
    { key: '3', value: 'employee' },
    // {key:'4', value:'Computers', disabled:true},
];

const UserManager = () => {
    const [employes, setEmployes] = useState([]);
    const [userRole, setUserRole] = React.useState('');
    const [isModalVisible, setIsmodalVisible] = useState<UserInterface | undefined>(undefined);
    const [loading, setLoading] = React.useState(false)


    useEffect(() => {
        const unsubscribe = firestore().collection('employes')
            .onSnapshot((querySnapshot) => {
                const updatedEmployes: any = [];
                querySnapshot.forEach((doc) => {
                    updatedEmployes.push({ id: doc.id, ...doc.data() });
                });
                setEmployes(updatedEmployes)
                setLoading(false);
            });

        return () => {
            unsubscribe();
        };

    }, []);

    const hideModal = () => {
        setIsmodalVisible(undefined)
    }

    const updateUserRole = async (id: string) => {
        setLoading(true)
        await firestore().collection('employes').doc(id).update({ 'role': userRole })
            .then(() => {
                setUserRole('');
                setLoading(false);
                ToastAndroid.show('user role has been updated', 500);
                setIsmodalVisible(undefined);
            })
            .catch((err) => {
                console.log(`error in update user=>${id} role:`, err.message);
                setUserRole('');
                setLoading(false);
                // ToastAndroid.show('user role has been updated', 500);
                setIsmodalVisible(undefined);
            })
    }
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: ConstantColor.white }}>
            {loading && <Loader />}
            <View style={global_styles.customContainer}>

                <View style={global_styles.sizedBoxTen}></View>

                <View style={{}}>
                    <Text style={[global_styles.textMedium, { fontSize: 18 }]}>Manage your partners / employes</Text>
                </View>
                <View style={global_styles.sizedBoxTen}></View>
                <View style={global_styles.sizedBoxTen}></View>

                <ScrollView
                    style={{ backgroundColor: ConstantColor.white, opacity: 0.8, overflow: 'scroll', marginBottom: 150 }}
                    indicatorStyle='black'
                >
                    {
                        employes.map((employee: any, index) => (
                            // <View key={index} style={global_styles.borderBox}>
                            //     <View style={global_styles.justifyBetweenCenter}>
                            //         <Text style={[global_styles.textMedium, global_styles.textBold, { width: '80%' }]}>Name: {employee.fullName}</Text>
                            //         <Text style={[global_styles.textMedium, global_styles.textBold, { width: '80%' }]}>Role: {employee.role}</Text>
                            //     </View>

                            //     <Text style={[global_styles.textMedium, global_styles.textBold, { width: '80%' }]}>Invest: {employee.invest ? employee.invest : 0}৳</Text>

                            //     <View style={{ flexDirection: 'row', justifyContent: 'flex-start', paddingVertical: 5 }}>
                            //         <TouchableOpacity
                            //             onPress={() => setIsmodalVisible(employee)}
                            //             style={{ backgroundColor: '#fff', opacity: 0.7, borderRadius: 100, borderWidth: 2, borderColor: 'grey' }}>
                            //             <Text style={{ color: 'black', fontWeight: '800', fontSize: 14, paddingVertical: 2, paddingHorizontal: 5 }}>
                            //                 Manage User
                            //             </Text>
                            //         </TouchableOpacity>
                            //     </View>
                            // </View>
                            <View key={index}>
                                <ItemContainerComp setIsmodalVisible={setIsmodalVisible} employee={employee} />
                            </View>
                        ))
                    }

                </ScrollView>
                <View style={global_styles.sizedBoxTen}></View>

            </View>
            <View style={{ flex: 1 }}>
                <Modal isVisible={isModalVisible ? true : false}
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
                                {/* <Button
                                    color={ConstantColor.secondary}
                                    title='Update'

                                    // disabled={itemsInfo.status === 'Completed' || updated}
                                    onPress={() => {
                                        if (isModalVisible) updateUserRole(isModalVisible.id)
                                    }}
                                /> */}
                            </View>
                        </View>
                    </View>
                </Modal>
            </View>
        </SafeAreaView>
    )
}

export default UserManager

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