import React, { FC, useEffect, useState } from 'react';
import {
    Alert, Dimensions, Pressable, TextInput, ToastAndroid, TouchableOpacity,
    TouchableWithoutFeedback, Platform
} from 'react-native';
import { StyleSheet, Text, View } from 'react-native';
import Modal from 'react-native-modal';
import global_styles from '../utils/global_styles';
import { ConstantColor } from '../utils/constant_color';
import AutoComplete from '../components/common/AutoComplete';
import AutocompleteInput from 'react-native-autocomplete-input';
import firestore from '@react-native-firebase/firestore';
import { IncomeInterface } from '../interfaces/TransactionInterface';
import { UserInterface } from '../interfaces/user_interface';
import DateTimePicker, { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import Icon from '../utils/customIcons';

const IncomeModal = ({ openedItem, isModalVisible, modalHide }:
    { openedItem: any, isModalVisible: boolean, modalHide: () => void }) => {
    const [earner, setEarner] = useState<UserInterface | undefined>(undefined);
    const [earnAmount, setEarnAmount] = useState('');
    const [employes, setEmployes] = useState([]);
    const [filteredEmployes, setFilteredEmployes] = useState([]);
    const [showEarnDate, setShowEarnDate] = useState(Platform.OS === 'ios');
    const [date, setDate] = useState(new Date(),);
    const [isDateTaken, setIsDateTaken] = useState(false);


    // console.log("date object :", date)
    // DateTimePickerAndroid.open(params: AndroidNativeProps)
    // DateTimePickerAndroid.dismiss(mode: AndroidNativeProps['mode']);

    const findingUser = (query: string) => {
        if (query) {
            let filteredNames = employes.filter((e: any) => {
                return Object.values(e).some((value: any) => {
                    return value.toString().toLowerCase().includes(query);
                });
            });
            setFilteredEmployes(filteredNames);
        } else {
            setFilteredEmployes([]);
        }
    };

    useEffect(() => {
        const loadEmployes = async () => {
            let tempEmployes: any = [];
            let snapshot = await firestore().collection('employes').get();

            snapshot.docs.forEach((elem) => {
                tempEmployes.push(elem.data());
            })

            setEmployes(tempEmployes);
        }
        loadEmployes();
    }, []);

    const minimumDateFinder = () => {
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate());
        return tomorrow;
    }

    const onChangeInvestDate = (e: any, selectedDate: any) => {
        setDate(selectedDate);
        setShowEarnDate(false);
        setIsDateTaken(true);
    }



    const deployInvest = async () => {
        if (earner?.fullName && earnAmount) {
            const createTranssction: IncomeInterface = {
                partner_id: earner.id,
                type: 'income',
                amount: parseInt(earnAmount),
                createdAt: firestore.FieldValue.serverTimestamp(),
                incomeDate: date,
            }
            await firestore().collection('transactions').doc().set(createTranssction)
                .then(() => {
                    modalHide();
                    setEarnAmount('');
                    setEarner(undefined);
                    ToastAndroid.show('Income Updated Successfully!', ToastAndroid.SHORT);
                })
                .catch((error: any) => console.log(error));

            return;

        }
        return Alert.alert('Alert', 'Please Enter valid earner name and amount')
    }


    return (
        // <View style={{ flex: 1 }}>
        <Modal isVisible={isModalVisible}
            onSwipeComplete={modalHide}
            swipeDirection="up"
            customBackdrop={
                <TouchableWithoutFeedback onPress={modalHide}>
                    <View style={{ flex: 1, backgroundColor: 'black', }} />
                </TouchableWithoutFeedback>
            }
            deviceWidth={Dimensions.get('window').width}
            deviceHeight={Dimensions.get('window').height}
            backdropOpacity={0.9}
            backdropColor='black'
            hasBackdrop={true}
        >
            <View style={{ minHeight: 300, backgroundColor: ConstantColor.lightGray, borderRadius: 10, padding: 10, }}>
                <View>
                    <Text style={[global_styles.modalHeader,]}>{openedItem}</Text>
                    <View style={global_styles.greyLine} />
                </View>

                <View style={{ backgroundColor: ConstantColor.white, flex: 1, }}>

                    <View style={{ ...global_styles.paddingVerticalTen, paddingHorizontal: 10, paddingVertical: 20 }}>
                        <View>
                            <Text style={[global_styles.modalHeader,]}>Enter Income Info</Text>
                        </View>
                        <Text></Text>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                            <View style={{ width: '60%' }}>
                                {/* {selectInvestOption == 2 && <Text></Text>} */}
                                <TextInput
                                    placeholderTextColor="#000"
                                    placeholder="income Amount"
                                    onChangeText={(text) => setEarnAmount(text)}
                                    value={earnAmount}
                                    autoCapitalize="none"
                                    style={styles.text_input}
                                    keyboardType='number-pad'
                                />

                                <View style={global_styles.sizedBoxTen}></View>

                                <View style={[styles.autocompleteContainer, { top: 50 }]}>
                                    <AutocompleteInput
                                        data={Array.from(filteredEmployes)}
                                        value={earner?.fullName}
                                        placeholder='Earner name'
                                        placeholderTextColor="#000"
                                        inputContainerStyle={{ paddingHorizontal: 8, }}
                                        selectionColor={'#000'}
                                        onChangeText={(text) => findingUser(text)}
                                        flatListProps={{
                                            keyExtractor: (item: any) => item.id,
                                            renderItem: ({ item, index }) => (
                                                <Pressable key={index}
                                                    onPress={() => {
                                                        setEarner(item);
                                                        setFilteredEmployes([])
                                                    }}
                                                >
                                                    <Text>{item.fullName}</Text>
                                                </Pressable>
                                            ),
                                        }}
                                    />
                                </View>

                            </View>

                            <View style={{ width: '40%', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                <TouchableOpacity
                                    style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}
                                    onPress={() => setShowEarnDate(true)}>

                                    {Platform.OS === 'ios' || (
                                        <Text style={{
                                            color: '#111',
                                            textAlign: 'center',
                                            fontSize: 14,
                                        }}>
                                            {/* {text} */}
                                        </Text>
                                    )}
                                    {showEarnDate && (
                                        <DateTimePicker
                                            testID="dateTimePicker"
                                            value={date}
                                            mode={'date'}
                                            is24Hour={true}
                                            display="default"
                                            minimumDate={minimumDateFinder()}
                                            onChange={(event, selectedDate) => {
                                                onChangeInvestDate(event, selectedDate);
                                            }}
                                            textColor="#fff"
                                            themeVariant="dark"
                                            style={{
                                                width: 'auto',
                                                height: '100%',
                                                backgroundColor: ConstantColor.nevyBlue,
                                            }}>

                                        </DateTimePicker>
                                    )}
                                    <View
                                        style={{
                                            width: '100%',
                                            flexDirection: 'row',
                                            justifyContent: 'center',
                                            display: Platform.OS === 'ios' ? 'none' : 'flex',
                                        }}>

                                        {isDateTaken ? (
                                            <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                                                <Icon
                                                    name="calendar"
                                                    type="font"
                                                    size={20}
                                                    color={'#000'}
                                                />
                                                <Text style={{ fontWeight: 'bold', color: 'black', fontSize: 12 }}>{date.toDateString()}</Text>
                                            </View>
                                        ) : (
                                            <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                                                <Icon
                                                    name="calendar"
                                                    type="font"
                                                    size={20}
                                                    color={'#000'}
                                                />
                                                <Text style={{ fontWeight: 'bold', color: 'black', fontSize: 12 }}>Earning Date</Text>
                                            </View>
                                        )}

                                    </View>
                                </TouchableOpacity>
                            </View>
                        </View>


                    </View>

                    <View style={global_styles.sizedBoxTen}></View>
                    <View style={{ flexDirection: 'row', justifyContent: 'flex-start', marginTop: 'auto' }}>
                        <TouchableOpacity
                            style={[global_styles.borderBox, { backgroundColor: ConstantColor.secondary, }]}
                            onPress={() => deployInvest()}
                        >
                            <Text style={[global_styles.modalHeader,]}>Submit</Text>
                        </TouchableOpacity>
                    </View>
                </View>

            </View>
        </Modal>
        // </View>
    )
}

export default IncomeModal;

const styles = StyleSheet.create({
    text_input: {
        paddingVertical: 5,
        paddingHorizontal: 8,
        fontSize: 14,
        color: '#000',
        width: '100%',
        borderWidth: 1,
        borderColor: '#dbdbdb'
    },
    autocompleteContainer: {
        flex: 1,
        left: 0,
        position: 'absolute',
        right: 0,
        // top: 50,
        zIndex: 1
    }
})