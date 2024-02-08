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

type uin = {
    id: string
}

const Home = () => {
  const dispatch = useDispatch();
  const [user, setUser] = useState<UserInterface | undefined>(undefined)

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

    }, [])
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: ConstantColor.white }}>
            {/* {user && user.role == 'admin' && (<OwnerHome/>)} */}
            {/* {user && user.role == 'partner' && (<PartnersHome user={user}/>)} */}
            {user && user.role == 'admin' && (<PartnersHome user={user}/>)}
            
        </SafeAreaView>
    )
}

export default Home

const styles = StyleSheet.create({})