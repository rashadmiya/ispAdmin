import React, { useContext, useEffect, useState } from 'react';
import { View, Text, ImageBackground, StyleSheet, StatusBar, TouchableOpacity, ScrollView, Alert } from 'react-native'
import Icon from '../utils/customIcons';
import { ConstantColor } from '../utils/constant_color';
import global_styles from '../utils/global_styles';
import { AuthContext } from '../utils/auth_context';
import { fundManagerMenuItems, ownerMenuItems, partnerMenuItems } from '../constants/menuItems';
import Accordion from '../components/drawer/Drawer_accordion';
import { useDispatch, useSelector } from 'react-redux';
import firestore from '@react-native-firebase/firestore';
import { BORROWERS, USERMANAGER } from '../utils/constant_route';
import { removeUser } from '../redux/slices/login_user';
import { UserInterface } from '../interfaces/user_interface';
import loadUser from '../helper-function/loadLoginUser';

const DrawerMenu = (props: any) => {
  let loginUser: UserInterface = useSelector((state: any) => state.loggedInUser.value);
  const { signOut } = useContext(AuthContext);
  const [drawerItems, setDrawerItems] = useState<any[]>([]);
  const dispatch = useDispatch();

  useEffect(() => {
    const loadDrawerContent = async () => {
      // let snapshot = await firestore().collection('drawer_items').doc('JDwikQCC6Bsgf5VxyBdy').get();
      // let temp = snapshot.data();
      // if (temp) {
      //   setDrawerItems(temp.menuItems)
      // }

      if (!loginUser.role) {
        let user = await loadUser();
        if (user && user.role == 'admin') {
          return setDrawerItems(ownerMenuItems);
        }
        if (user && user.role == 'partner') {
          return setDrawerItems(partnerMenuItems);
        }
        if (user && user.role == 'employee') {
          return setDrawerItems([]);
        }
        if (user && user.role == 'fund manager') {
          return setDrawerItems(fundManagerMenuItems);
        }
      }

      if (loginUser.role == 'admin') {
        return setDrawerItems(ownerMenuItems);
      }
      if (loginUser.role == 'partner') {
        return setDrawerItems(partnerMenuItems);
      }
      if (loginUser && loginUser.role == 'employee') {
        return setDrawerItems([]);
      }
      if (loginUser && loginUser.role == 'fund manager') {
        return setDrawerItems(fundManagerMenuItems);
      }
    }
    loadDrawerContent();
  }, [loginUser]);


  return (
    <View style={{ flex: 1 }}>
      <View style={styles.drawer_hero}>
        <ImageBackground
          source={require('../../assets/bjoy_it.jpeg')}
          style={{ height: '100%', width: '100%', }}
          // resizeMethod='resize'
          resizeMode='cover'
        >

          <TouchableOpacity
            onPress={() => props.navigation.navigate(USERMANAGER)}
            // onPress={() => props.navigation.navigate(BORROWERS)}

            style={{ display: loginUser.role == 'admin' ? 'flex' : 'none', position: 'absolute', top: 5, right: 5, backgroundColor: ConstantColor.febGreen, opacity: 0.7, borderRadius: 100 }}>
            <Text style={{ color: 'white', fontWeight: '800', fontSize: 16, paddingVertical: 4, paddingHorizontal: 10 }}>
              Manage Users
            </Text>
          </TouchableOpacity>


          <View style={{ padding: 10, marginTop: 'auto' }}>
            <Text style={{ color: 'white', fontWeight: 'bold' }}>
              User: {loginUser.fullName}
            </Text>
          </View>
          {/* 
          <View style={{ padding: 10, }}>
            <Text style={{ color: 'white', fontWeight: 'bold' }}>
              Tab to see todays balance
            </Text>
          </View> */}
        </ImageBackground>
      </View>


      <ScrollView contentContainerStyle={{ margin: 10, }}>
        <View style={global_styles.sizedBoxTen} ></View>
        {drawerItems.map((val: any, index) => (
          <Accordion key={index} value={val} type={val.type} />
        ))}
      </ScrollView>

      <TouchableOpacity
        onPress={() => {
          Alert.alert('Alert', 'This action will sign you out, make sure by pressing confirm',
            [{ text: 'Cancel' }, {
              text: 'Confirm', onPress: async () => {
                dispatch(removeUser({}));
                await signOut();

              }
            }])
        }}
        style={[styles.drawerItem, { marginTop: 'auto', alignSelf: 'center', marginBottom: 20, backgroundColor: ConstantColor.febGreen }]}>
        <Icon type="ant" style={{ color: 'gray' }} name="logout" size={20} />
        <Text style={[styles.drawerItemName, global_styles.shadawText]}>Logout</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  drawer_hero: {
    height: '30%',
    width: '100%',
    // alignSelf: 'center',
    backgroundColor: 'blue',
    position: 'relative',
    marginTop: StatusBar.currentHeight
  },
  drawerItem: {
    padding: 5,
    width: '90%',
    marginBottom: 10,
    flexDirection: 'row',
    backgroundColor: ConstantColor.white,
    borderTopLeftRadius: 15,
    borderBottomRightRadius: 20

  },
  drawerItemName: {
    paddingLeft: 5,
    textAlignVertical: 'center',
    color: '#000',
    fontWeight: '400'
  },
})

export default DrawerMenu