import firestore from '@react-native-firebase/firestore';
import React, { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSelector } from 'react-redux';
import { UserInterface } from '../interfaces/user_interface';
import Loader from '../utils/Loder';
import { ConstantColor } from '../utils/constant_color';
import global_styles from '../utils/global_styles';


const Projects = () => {
  let loginUser: UserInterface = useSelector((state: any) => state.loggedInUser.value);

    const [notices, setNotices] = useState([]);
    const [loading, setLoading] = React.useState(false)

    useEffect(() => {
        setLoading(true);
        const unsubscribe = firestore().collection('projects')
            .orderBy('createdAt', 'desc')
            .limit(5)
            .onSnapshot((querySnapshot) => {
                const updatedNotices: any = [];
                querySnapshot.forEach((doc) => {
                    updatedNotices.push({ id: doc.id, ...doc.data() });
                });
                setNotices(updatedNotices);
                setLoading(false);
            });

        return () => {
            unsubscribe();
        };
    }, []);


    const updateUserRole = async (notic:any) => {
        let viewer =  notic.viewer || [];
        viewer.push(loginUser.id);
        console.log(notic.id,viewer)
        
        await firestore().collection('projects').doc(notic.id).update({'viewer':viewer})
            .then(() => {
                setLoading(false);
                // ToastAndroid.show('user role has been updated', 500);
            })
            .catch((err) => {
                console.log(`error in update notice=>${notic.id} viewer:`, err.message);
                setLoading(false);
            })
    }
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: ConstantColor.white }}>
            {loading && <Loader />}
            <View style={global_styles.customContainer}>

                <View style={global_styles.sizedBoxTen}></View>

                <View style={{}}>
                    <Text style={[global_styles.textMedium, { fontSize: 18 }]}>Projects</Text>
                </View>
                <View style={global_styles.sizedBoxTen}></View>
                <View style={global_styles.sizedBoxTen}></View>

                <ScrollView
                    style={{ backgroundColor: ConstantColor.white, opacity: 0.8, overflow: 'scroll', marginBottom: 150 }}
                    indicatorStyle='black'
                >
                    {
                       notices.length > 0 ? notices.map((notice: any, index) => (
                            
                            <View key={index} style={global_styles.borderBox}>
                                <View style={global_styles.justifyBetweenCenter}>
                                    <Text style={[global_styles.textMedium, global_styles.textBold,]}>Title: {notice.noticeTitle}</Text>
                                    {/* <TouchableOpacity
                                        onPress={() => updateUserRole(notice)}
                                        
                                        style={{ display: notice?.viewer.includes(loginUser.id) ? 'none' : 'flex', 
                                            backgroundColor: '#fff', opacity: 0.7, borderRadius: 100, borderWidth: 2, borderColor: 'grey' }}>
                                        <Text style={{ color: 'red', fontWeight: '800', fontSize: 14, paddingVertical: 2, paddingHorizontal: 5 }}>
                                            Mark As Read
                                        </Text>
                                    </TouchableOpacity> */}
                                </View>

                                <Text style={[global_styles.textMedium, global_styles.textBold,]}>Notice Msg: {notice.noticeMsg}</Text>


                            </View>

                        )):(
                            <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
                                <Text style={[global_styles.textMedium, global_styles.textBold,global_styles.textCenter]}>No Projects Found</Text>
                            </View>
                        )
                    }

                </ScrollView>
                <View style={global_styles.sizedBoxTen}></View>
            </View>
        </SafeAreaView>
    )
}

export default Projects

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