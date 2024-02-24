import { StyleSheet, Text, View, SafeAreaView, ScrollView, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import global_styles from '../utils/global_styles'
import { ConstantColor } from '../utils/constant_color'
import { dailyAccountsOptions, menuItems } from '../constants/menuItems'
import Accordion from '../components/drawer/Drawer_accordion'
import HomeAccordion from '../components/common/HomeAccordion'
import auth from '@react-native-firebase/auth'
import firestore from '@react-native-firebase/firestore';
import { addUser } from '../redux/slices/login_user'
import { useDispatch } from 'react-redux'
import OwnerHome from '../components/OwnerHome'
import { UserInterface } from '../interfaces/user_interface'
import PartnersHome from '../components/PartnersHome'
import { addLossConstant } from '../redux/slices/loss_constant'
import { addExpenseConstant } from '../redux/slices/expense_constant'


const Home = () => {
  const dispatch = useDispatch();
  const [user, setUser] = useState<UserInterface>()

    useEffect(() => {
        const loadDrawerContent = async () => {
            let currentUser = auth().currentUser;
            let snapshot = await firestore().collection('employes').doc(currentUser?.uid).get();
            let user = snapshot.data() as UserInterface;
            if (user) {
                dispatch(addUser(user));
                setUser(user)
            }
            console.log('called load user firebase function')
        }
        loadDrawerContent();
        loadExpenseConstant();
        loadLossConstant();

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
        console.log('called loadLossConstant firebase function')
    }
    
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: ConstantColor.white }}>
            {user && user.role == 'admin' && (<OwnerHome/>)}
            {/* {user && user.role == 'partner' && (<PartnersHome user={user}/>)} */}
            {/* {user && user.role == 'admin' && (<PartnersHome user={user}/>)} */}
            
        </SafeAreaView>
    )
}

export default Home

const styles = StyleSheet.create({})