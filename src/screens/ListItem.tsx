/* eslint-disable react-native/sort-styles */
/* eslint-disable react-native/no-color-literals */
/* eslint-disable react-native/no-inline-styles */

import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, FlatList, StyleSheet, Text, Pressable, StatusBar, ActivityIndicator } from 'react-native';
import firestore, { firebase } from '@react-native-firebase/firestore';
import { ITEMDETAILS } from '../utils/constant_route';



const ItemList = ({ navigation }:{navigation:any}) => {
    const [loading, setLoading] = useState(false);
    const [startAfter, setStartAfter] = useState(0);
    const [orderData, setOrderData] = useState([]);
    const [loadPerPage, setLoadPerPage] = useState(10)
    const imageSize = 70;
    const spacing = 20;


    useEffect(() => {
        getData();
    }, [loadPerPage]);

    const getData = async () => {
        setLoading(true);
        firestore()
            .collection('registered_users')
            .orderBy("createdAt", "desc")
            .limit(loadPerPage)
            .onSnapshot((queryResult => {
                // console.log("doc :",queryResult)

                const orderData:any = [];
                queryResult.docs.forEach(doc => {
                    // console.log("doc :", doc.id)
                    let order = doc.data();
                    order.orderId = doc.id;
                    orderData.push(order);
                });
                setOrderData(orderData);
                setStartAfter(orderData.length)
                setLoading(false);
            }), (err => {
                console.log(err);
                setLoading(false)
            }))
    }


    const getMoreData = async () => {
        if (!loading) {
            // const orders = await loadMoreData(startAfter, loadPerPage);
            // setStartAfter(orders.lastIndex);
            // setOrderData([...orderData, ...orders.orderData]);
            // orders.orderData.length == 0 ? setLoading(true) : setLoading(false);
            setLoadPerPage(prevLimit => prevLimit + 10)
        }
    }

    const ListGenerator = (item:any, index:number) => {
        return (
            <Pressable
                onPress={async () => {
                    navigation.navigate(ITEMDETAILS, { itemsInfo: item });
                }}
                style={{
                    ...styles.shadow,
                    flexDirection: 'row',
                    paddingHorizontal: 8,
                    paddingVertical: 4,
                    borderWidth: 1,
                    borderColor: item?.status == "Completed" ? "#ebebeb" : "red",
                    backgroundColor: item?.status == "Completed" ? "#ebebeb" : "#D3D3D3"
                }}
                key={index}
            >
                <View style={{ width: '100%' }}>
                    <Text style={{ ...styles.itemHeader, ...styles.textShadow }}>Client: {item?.username}</Text>
                    <Text style={{ ...styles.textShadow, fontSize: 14, }}>Address: {item?.address}</Text>
                    <Text style={{ ...styles.textShadow, fontSize: 14, color: item?.status == "Completed" ? "green" : "red" }}>Status: {item?.status ? item?.status : ""}</Text>

                </View>
            </Pressable>
        )
    }


    return (
        // eslint-disable-next-line react-native/no-inline-styles
        <SafeAreaView style={{ flex: 1,}}>
            <View style={styles.page}>
                <View style={[styles.infoHeader, styles.shadow, { margin: 0, borderRadius: 0 }]}>
                    <Text style={{ ...styles.textShadow, color: '#000', textAlign: 'center' }}>Newly registered users</Text>
                </View>


                <FlatList
                    data={orderData}
                    renderItem={({ item, index }) => ListGenerator(item, index)}
                    scrollIndicatorInsets={{ right: 1 }}
                    showsVerticalScrollIndicator={false}
                    onEndReached={() => getMoreData()}
                    onEndReachedThreshold={0.01}
                    scrollEventThrottle={150}
                    ListFooterComponent={
                        <View style={{ height: imageSize }}>
                            {loading && (
                                <ActivityIndicator color={"blue"} size={"large"} />)}
                        </View>
                    }
                />
            </View>
        </SafeAreaView>
    );

};

const styles = StyleSheet.create({
    page: {
        flex: 1,
        backgroundColor: "#635e6e",
    },
    itemHeader: {
        fontSize: 16,
        marginVertical: 3,
        textTransform: 'capitalize',
    },

    infoHeader: {
        fontSize: 16,
        fontWeight: '800',
        marginBottom: 5,
        borderBottomWidth: 5,
        borderBottomColor: '#fff',
        textDecorationLine: 'underline',
        textDecorationStyle: "solid",
        textDecorationColor: "#000",
        backgroundColor: '#fff',
        paddingVertical: 5,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20
    },
    textShadow: {
        textShadowColor: 'rgba(0, 0, 0, 0.8)',
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 1,
    },
    shadow: {
        margin: 8,
        shadowOffset: { width: 1, height: 1 },
        backgroundColor: "#f2f2f2",
        borderRadius: 20,
        elevation: 1,
        borderWidth: 1,
        overflow: 'hidden',
        shadowColor: 'black',
        shadowRadius: 10,
        shadowOpacity: 1,
    },
});

export default ItemList;