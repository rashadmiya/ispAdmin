import { StyleSheet, Text, View, SafeAreaView, ScrollView, FlatList, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import global_styles from '../utils/global_styles'
import { ConstantColor } from '../utils/constant_color'
import { dailyAccountsOptions, } from '../constants/menuItems'
import Accordion from '../components/drawer/Drawer_accordion'
import HomeAccordion from '../components/common/HomeAccordion'
import auth from '@react-native-firebase/auth'
import firestore from '@react-native-firebase/firestore';
import { addUser } from '../redux/slices/login_user'
import { useDispatch, useSelector } from 'react-redux'
import OwnerHome from '../components/OwnerHome'
import { UserInterface } from '../interfaces/user_interface'
import PartnersHome from '../components/PartnersHome'
import { addLossConstant } from '../redux/slices/loss_constant'
import { addExpenseConstant } from '../redux/slices/expense_constant'
import ItemList from './ListItem'
import Notices from './Notices'
import { addNotice } from '../redux/slices/notice_slice'


const Home = ({ navigation }: { navigation: any }) => {
    const dispatch = useDispatch();
    const [user, setUser] = useState<UserInterface>();
    const [activeScreen, setActiveScreen] = useState('home')
    const loginUser = useSelector((state: any) => state.loggedInUser.value);

    useEffect( () => {
        let currentUser =  auth().currentUser;
        const unsubscribe = firestore().collection('employes')
            .doc(currentUser?.uid)
            .onSnapshot((querySnapshot) => {
                let user = querySnapshot.data() as UserInterface;
                if (user) {
                    dispatch(addUser(user));
                    setUser(user)
                }else{
                    setUser(loginUser)
                }
            });

        const unsubscribeNotice = firestore().collection('notices')
            .orderBy('createdAt', 'desc')
            .limit(5)
            .onSnapshot((querySnapshot) => {
                const updatedNotices: any = [];
                querySnapshot.forEach((doc) => {
                    updatedNotices.push({ id: doc.id, ...doc.data() });
                });
                dispatch(addNotice(updatedNotices));
            });
        loadExpenseConstant();
        loadLossConstant();
        return () => {
            unsubscribe();
            unsubscribeNotice();

        };


    }, []);

    const loadExpenseConstant = async () => {
        let tempExpenseConstant: any = [];
        let snapshot = await firestore().collection('expense_constant').get();

        snapshot.docs.forEach((elem) => {
            tempExpenseConstant = elem.data().items;
        })

        // setEmployes(tempEmployes);
        if (tempExpenseConstant) {
            dispatch(addExpenseConstant(tempExpenseConstant));
        }
        console.log('called loadExpenseConstant firebase function')
    }

    const loadLossConstant = async () => {
        let tempLossConstant: any = [];
        let snapshot = await firestore().collection('loss_constant').get();

        snapshot.docs.forEach((elem) => {
            tempLossConstant = elem.data().items;
        })

        // setEmployes(tempEmployes);
        if (tempLossConstant) {
            dispatch(addLossConstant(tempLossConstant));
        }
        // console.log('called loadLossConstant firebase function', user)
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: ConstantColor.white }}>
            {/* {user && user.role == 'admin' || 'fund manager' && activeScreen == 'home' && (<OwnerHome user={user} />)}
            {user && user.role == 'admin' || user && user.role =='fund manager' && activeScreen == 'accounts' && (<PartnersHome user={user} />)} */}
            {user && user.role == 'admin' && activeScreen == 'home' && (<OwnerHome user={user} />)}
            {user && user.role == 'admin' && activeScreen == 'accounts' && (<PartnersHome user={user} />)}
            {user && user.role == 'fund manager' && activeScreen == 'home' && (<OwnerHome user={user} />)}
            {user && user.role == 'fund manager' && activeScreen == 'accounts' && (<PartnersHome user={user} />)}
            {user && user.role == 'partner' && (<PartnersHome user={user} />)}
            {user && user.role == 'employee' && (<ItemList navigation={navigation} />)}

            {
                user && user.role == 'admin' && (
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', position: 'relative', bottom: 0 }}>
                        <TouchableOpacity
                            onPress={() => setActiveScreen('home')}
                            style={[styles.tab, { backgroundColor: activeScreen == 'home' ? ConstantColor.secondary : ConstantColor.success }]}>
                            <Text style={[global_styles.textWhite, global_styles.textBold, global_styles.textCenter, {
                                color: activeScreen == 'home' ? 'black' : 'white'
                            }]}>Home</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => setActiveScreen('accounts')}
                            style={[styles.tab, { backgroundColor: activeScreen == 'accounts' ? ConstantColor.secondary : ConstantColor.success }]}>
                            <Text style={[global_styles.textWhite, global_styles.textBold, global_styles.textCenter, {
                                color: activeScreen == 'accounts' ? 'black' : 'white'
                            }]}>Accounts</Text>
                        </TouchableOpacity>
                    </View>
                )
            }

            {
                user && user.role == 'fund manager' && (
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', position: 'relative', bottom: 0 }}>
                        <TouchableOpacity
                            onPress={() => setActiveScreen('home')}
                            style={[styles.tab, { backgroundColor: activeScreen == 'home' ? ConstantColor.secondary : ConstantColor.success }]}>
                            <Text style={[global_styles.textWhite, global_styles.textBold, global_styles.textCenter, {
                                color: activeScreen == 'home' ? 'black' : 'white'
                            }]}>Home</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => setActiveScreen('accounts')}
                            style={[styles.tab, { backgroundColor: activeScreen == 'accounts' ? ConstantColor.secondary : ConstantColor.success }]}>
                            <Text style={[global_styles.textWhite, global_styles.textBold, global_styles.textCenter, {
                                color: activeScreen == 'accounts' ? 'black' : 'white'
                            }]}>Accounts</Text>
                        </TouchableOpacity>
                    </View>
                )
            }
        </SafeAreaView>
    )
}

export default Home

const styles = StyleSheet.create({
    tab: {
        backgroundColor: ConstantColor.secondary,
        color: 'white',
        width: '49%',
        padding: 10,
    }
})