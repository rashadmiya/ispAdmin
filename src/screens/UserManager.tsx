import firestore from '@react-native-firebase/firestore';
import React, { useEffect, useState } from 'react';
import { Alert, SafeAreaView, ScrollView, StyleSheet, Text, ToastAndroid, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { SelectList } from 'react-native-dropdown-select-list';
import Modal from 'react-native-modal';
import { UserInterface } from '../interfaces/user_interface';
import Loader from '../utils/Loder';
import { ConstantColor } from '../utils/constant_color';
import global_styles from '../utils/global_styles';
import { useSelector } from 'react-redux';
import axios from 'axios';


const data = [
    { key: '1', value: 'partner' },
    { key: '2', value: 'fund manager' },
    { key: '3', value: 'employee' },
    { key: '4', value: 'admin' },
];

const UserManager = () => {

    const user = useSelector((state: any) => state.loggedInUser.value);
    const [employes, setEmployes] = useState([]);
    const [userRole, setUserRole] = React.useState('');
    const [isModalVisible, setIsmodalVisible] = useState<UserInterface | undefined>(undefined);
    const [loading, setLoading] = React.useState(false);

    // const BASE_URL = "http://192.168.0.105:8080";
    const BASE_URL = "https://us-central1-ispadmin-7fb7e.cloudfunctions.net/api";

    const fetchUsers = async () => {
        console.log("fetching users")
        try {
            const response = await axios.get(`${BASE_URL}/user/userList`);
            console.log('Users:', response.data);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    // Call the function where necessary




    useEffect(() => {
        fetchUsers();
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
        if (id !== 'Gebmg2DcZxMKdC5KiQQxjbzdhMJ3') {
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
        } else {
            Alert.alert('Alert!', `MD. Shoriful Islam Tusher is company owner, his role cannot be changed .`)
        }
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
                    style={{ backgroundColor: ConstantColor.white, opacity: 0.8, overflow: 'scroll' }}
                    indicatorStyle='black'
                >
                    {
                        employes.map((employee: any, index) => (
                            <View style={[global_styles.borderBox, { marginBottom: 10 }]} key={index}>
                                <View style={[global_styles.justifyBetweenCenter]}>
                                    <Text style={[global_styles.textMedium, global_styles.textBold, global_styles.textBlack]}>Name: {employee.fullName}</Text>
                                </View>

                                {/* <Text style={[global_styles.textMedium, global_styles.textBold, ]}>Invest: {employee.invest ? employee.invest : 0}৳</Text> */}

                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 5 }}>
                                    <TouchableOpacity
                                        onPress={() => setIsmodalVisible(employee)}
                                        style={{ backgroundColor: '#fff', opacity: 0.7, borderRadius: 100, borderWidth: 2, borderColor: 'grey' }}>
                                        <Text style={{ color: 'black', fontWeight: '800', fontSize: 14, paddingVertical: 2, paddingHorizontal: 5 }}>
                                            Manage User
                                        </Text>
                                    </TouchableOpacity>
                                    <Text style={[global_styles.textMedium, global_styles.textBold, global_styles.textBlack]}>Role: {employee.role}</Text>

                                </View>
                            </View>

                        ))
                    }

                </ScrollView>

            </View>


            {/* <View style={{ flex: 1 }}> */}
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
                                dropdownTextStyles={{ color: 'black', textTransform: 'capitalize' }}
                                dropdownStyles={{ backgroundColor: '#fff' }}
                                // placeholder='Loss Sector'
                                boxStyles={{ padding: 0, height: 40, margin: 0, }}
                                inputStyles={{ height: 30, color: 'black' }}

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
            {/* </View> */}
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