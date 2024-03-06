/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react-native/sort-styles */
/* eslint-disable react-native/no-color-literals */
/* eslint-disable react-native/no-unused-styles */
import { useNavigation } from '@react-navigation/native';
import React, { useEffect } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, View, Button, StatusBar } from 'react-native';
import SelectableText from '../components/SelectableText';
import { SelectList } from 'react-native-dropdown-select-list'
import firestore, { firebase } from '@react-native-firebase/firestore';

const ItemDetails = ({ route, navigation }: { route: any, navigation: any }) => {
    const { setOptions } = useNavigation();
    const [selected, setSelected] = React.useState("");
    const [updated, setUpdated] = React.useState(false);

    const data = [
        { key: '1', value: 'Working' },
        { key: '2', value: 'Completed' },
        // {key:'3', value:'Cameras'},
        // {key:'4', value:'Computers', disabled:true},
    ]
    useEffect(() => {
        setOptions({
            headerTitleAlign: 'center',
            headerTitleStyle: { fontSize: 15, color: '#000f0baf' },
            title: 'User details',
            // headerLeft: () => <HeaderBackButton navigate={navigate} />,
            headerStyle: {
                backgroundColor: '#ebebeb',
                shadowColor: 'transparent',
                fontSize: 9,
            },
            headerShadowVisible: false,
        });
    }, [])
    // ←
    const dateModifier = (d: any) => {
        let date = d.toDate();
        date = date.toISOString().substring(0, 10);
        return date;
    }

    let { itemsInfo } = route.params;

    const updateFirebase = async () => {
        setUpdated(true)
        await firestore().collection('registered_users').doc(itemsInfo?.orderId).update({ 'status': selected })
            .then(() => {
                setUpdated(false);
                navigation.navigate('ItemList');
            })
    }


    return (
        <SafeAreaView>
            <StatusBar translucent backgroundColor="transparent" />
            <ScrollView style={styles.page}>

                <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 5, paddingHorizontal: 10, }}>
                    <Text style={styles.textShadow}>{dateModifier(itemsInfo.createdAt)}</Text>
                    <SelectableText head={"Package: "} text={itemsInfo.internet_package} title={"Internet Package"} />
                </View>




                <View style={styles.infoDetail}>
                    {/* Occation data will be bellow */}
                    <View style={styles.shadow}>
                        {/* <Text style={styles.infoHeader}>Occasion</Text> */}
                        <SelectableText head={"Client Name: "} text={itemsInfo.username} title={"Client Name"} />
                    </View>
                    {/* quantity section */}
                    <View style={styles.shadow}>
                        <SelectableText head={"Client Email: "} text={itemsInfo.user_email} title={"Client Email"} />
                    </View>

                    {/* card message section */}
                    <View style={styles.shadow}>
                        <SelectableText head={"Client Phone: "} text={itemsInfo.user_phone} title={"Client Phone"} />
                    </View>
                    <View style={styles.sizedBox} />



                    {/* client details section */}
                    <View style={{ ...styles.shadow, }}>
                        <Text style={[styles.infoHeader, styles.textShadow]}>Client Details</Text>
                        {itemsInfo?.address && <SelectableText head={"Detail Address: "} text={itemsInfo?.address} title={"Address"} />}
                        {itemsInfo?.union && <SelectableText head={"Union: "} text={itemsInfo.union} title={"Union"} />}
                        {itemsInfo?.police_station && <SelectableText head={"Thana: "} text={itemsInfo.police_station} title={"Thana"} />}
                        {itemsInfo?.district && <SelectableText head={"District: "} text={itemsInfo.district} title={"District"} />}

                    </View>

                    <View style={{ ...styles.shadow, padding: 5 }}>
                        <Text style={[styles.infoHeader, styles.textShadow]}>Update Status</Text>
                        <SelectList
                            setSelected={(val: any) => setSelected(val)}
                            data={itemsInfo.status === 'Completed' ? [] : data}
                            save="value"
                            dropdownTextStyles={{ color: 'black' }}
                            dropdownStyles={{ backgroundColor: '#fff' }}
                            placeholder='Loss Sector'
                            boxStyles={{ padding: 0, height: 40, margin: 0, }}
                            inputStyles={{ height: 30, color: 'black' }}
                        />

                        <Text></Text>
                        <Text></Text>
                        <Button
                            color="indianred"
                            title='Update'
                            disabled={itemsInfo.status === 'Completed' || updated}
                            onPress={updateFirebase}
                        />
                    </View>

                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    headerStyle: {
        fontSize: 16,
        fontWeight: '500'
    },

    infoDetail: {
        marginTop: 15,
        // paddingHorizontal: 15
    },

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
    page: {
        margin: 1,
        paddingHorizontal: 10
    },
    shadow: {
        paddingHorizontal: 15,
        paddingVertical: 4,
        shadowColor: "black",
        shadowOffset: { width: 1, height: 1 },
        shadowRadius: 1,
        shadowOpacity: 0.1,
        backgroundColor: "#f2f2f2",
        borderRadius: 10,
        elevation: 1,
        marginBottom: 5
    },
    sizedBox: {
        height: 10,
    },
    textShadow: {
        textShadowColor: 'rgba(0, 0, 0, 0.8)',
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 1,
    },
})

export default ItemDetails