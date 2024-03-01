import { Alert } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging from '@react-native-firebase/messaging';
import firestore from '@react-native-firebase/firestore';
// import DeviceInfo from 'react-native-device-info'

export async function requestUserPermission() {
    const authStatus = await messaging().requestPermission();
    const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
        console.log('Authorization status:', authStatus);
        GetFCMToken();
    }
}

async function GetFCMToken() {
    let fcmToken = await AsyncStorage.getItem("fcmToken");

    // console.log("length",length.docs.length)

    if (!fcmToken) {
        try {
            let token = await messaging().getToken();
            // const deviceId = await DeviceInfo.getMacAddress();

            if (token) {
                await AsyncStorage.setItem("fcmToken", token);
                await firestore().collection('tokens').add({ token: token })
            }
        } catch (error) {
            console.log(error, "error in fcm token")
        }
    }
}


export const notificationListener = () => {

    messaging().onNotificationOpenedApp(remoteMessage => {
        console.log(
            'Notification caused app to open from background state:',
            remoteMessage.notification,
        );
        // navigation.navigate(remoteMessage.data.type);
    });

    messaging()
        .getInitialNotification()
        .then(remoteMessage => {
            if (remoteMessage) {
                console.log(
                    'Notification caused app to open from quit state:',
                    remoteMessage.notification,
                );
                //   setInitialRoute(remoteMessage.data.type); // e.g. "Settings"
            }
        });

    messaging().onMessage(async remoteMessage => {
        let noti = remoteMessage.notification;
        console.log("notification on foreground state: ", remoteMessage.notification)
        if (noti?.title) {
            Alert.alert(noti.title, noti.body);
        }
    })
}