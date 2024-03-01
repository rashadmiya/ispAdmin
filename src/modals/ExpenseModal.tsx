import React, { FC, useEffect, useState } from 'react';
import {
    Alert, Dimensions, Pressable, TextInput, ToastAndroid, TouchableOpacity,
    TouchableWithoutFeedback, Platform
} from 'react-native';
import { StyleSheet, Text, View } from 'react-native';
import Modal from 'react-native-modal';
import global_styles from '../utils/global_styles';
import { ConstantColor } from '../utils/constant_color';
import AutocompleteInput from 'react-native-autocomplete-input';
import firestore from '@react-native-firebase/firestore';
import { ExpenditureInterface } from '../interfaces/TransactionInterface';
import { UserInterface } from '../interfaces/user_interface';
import DateTimePicker, { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import Icon from '../utils/customIcons';
import { SelectList } from 'react-native-dropdown-select-list';
import { useSelector } from 'react-redux';

interface EInterface {
    name: string;
}

const ExpenseModal = ({ openedItem, isModalVisible, modalHide }:
    { openedItem: any, isModalVisible: boolean, modalHide: (afterThen?:any) => void }) => {
        
    const reduxExpenseConstant = useSelector((state: any) => state.expenseConstant.value);
    const [expenseTo, setExpenseTo] = useState('');
    const [expenseAmount, setExpenseAmount] = useState('');
    const [showExpenseDate, setShowExpenseDate] = useState(Platform.OS === 'ios');
    const [date, setDate] = useState(new Date(),);
    const [isDateTaken, setIsDateTaken] = useState(false);
    const [isNewExpense, setIsNewExpense] = useState(false);


    const minimumDateFinder = () => {
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate());
        return tomorrow;
    }

    const onChangeInvestDate = (e: any, selectedDate: any) => {
        setDate(selectedDate);
        setShowExpenseDate(false);
        setIsDateTaken(true);
    }



    const deployInvest = async () => {
        if (expenseTo && expenseAmount) {
            const createTranssction: ExpenditureInterface = {
                // partner_name: spendthrift.fullName,
                // partner_id: spendthrift.id,
                expenseTo: expenseTo,
                type: 'expense',
                amount: parseInt(expenseAmount),
                createdAt: firestore.FieldValue.serverTimestamp(),
                expenseDate: date,
            }
            await firestore().collection('transactions').doc().set(createTranssction)
                .then(() => {
                    let afterThen = true;
                    modalHide(afterThen);
                    setExpenseAmount('');
                    setExpenseTo('');
                    ToastAndroid.show('Expense Updated Successfully!', ToastAndroid.SHORT);
                })
                .catch((error: any) => console.log(error));

            return;

        }
        return Alert.alert('Alert', 'Please Enter valid name and amount')
    }


    return (
        // <View style={{ flex: 1 }}>
        <Modal isVisible={isModalVisible}
            onSwipeComplete={modalHide}
            swipeDirection="up"
            customBackdrop={
                <TouchableWithoutFeedback onPress={() => {
                    modalHide();
                    setExpenseTo('');
                    setExpenseAmount('');
                }}>
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
                            <Text style={[global_styles.modalHeader,]}>Enter Expenditure Info</Text>
                        </View>
                        <Text></Text>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                            <View style={{ width: '60%' }}>
                                {/* {selectInvestOption == 2 && <Text></Text>} */}
                                <TextInput
                                    placeholderTextColor="#000"
                                    placeholder="Expense Amount"
                                    onChangeText={(text) => setExpenseAmount(text)}
                                    value={expenseAmount}
                                    autoCapitalize="none"
                                    style={styles.text_input}
                                    keyboardType='number-pad'
                                />

                                <View style={global_styles.sizedBoxTen}></View>

                                <View style={[styles.autocompleteContainer, { top: 50 }]}>

                                    {isNewExpense ? (
                                        <>
                                            <TextInput
                                                placeholderTextColor="#000"
                                                placeholder="Enter Expense Sector"
                                                onChangeText={(text) => setExpenseTo(text)}
                                                value={expenseTo}
                                                autoCapitalize="none"
                                                style={styles.text_input}
                                                keyboardType='number-pad'
                                            /></>
                                    ) : (
                                        <>
                                            <SelectList
                                                setSelected={(val: string) => {
                                                    if (val == 'Add New') {
                                                        setIsNewExpense(true);
                                                    } else {
                                                        setExpenseTo(val);
                                                    }
                                                }}
                                                data={reduxExpenseConstant}
                                                save="value"
                                                dropdownStyles={{ backgroundColor: '#fff' }}
                                                placeholder='Expense Sector'
                                                boxStyles={{ padding: 0, height: 40, margin: 0 }}
                                                inputStyles={{ height: 30, }}
                                                dropdownTextStyles={{ color: 'black' }}
                                            /></>
                                    )}
                                </View>

                            </View>

                            <View style={{ width: '40%', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                <TouchableOpacity
                                    style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}
                                    onPress={() => setShowExpenseDate(true)}>

                                    {Platform.OS === 'ios' || (
                                        <Text style={{
                                            color: '#111',
                                            textAlign: 'center',
                                            fontSize: 14,
                                        }}>
                                            {/* {text} */}
                                        </Text>
                                    )}
                                    {showExpenseDate && (
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

export default ExpenseModal;

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