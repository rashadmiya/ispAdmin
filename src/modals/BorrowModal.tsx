import DateTimePicker from '@react-native-community/datetimepicker';
import firestore from '@react-native-firebase/firestore';
import React, { useEffect, useState } from 'react';
import {
    Alert, Dimensions,
    Platform,
    Pressable,
    StyleSheet, Text,
    TextInput, ToastAndroid, TouchableOpacity,
    TouchableWithoutFeedback,
    View
} from 'react-native';
import AutocompleteInput from 'react-native-autocomplete-input';
import Modal from 'react-native-modal';
import { useSelector } from 'react-redux';
import { BorrowInterface } from '../interfaces/TransactionInterface';
import { UserInterface } from '../interfaces/user_interface';
import { ConstantColor } from '../utils/constant_color';
import Icon from '../utils/customIcons';
import global_styles from '../utils/global_styles';

const BorrowModal = ({ isModalVisible, modalHide }: { isModalVisible: boolean, modalHide: (afterThen?:any) => void,}) => {
    const loginUser = useSelector((state: any) => state.loggedInUser.value);
    const [lender, setLender] = useState<UserInterface | undefined>(undefined);
    const [lendAmount, setLendAmount] = useState('');
    const [ref, setRef] = useState('');
    const [employes, setEmployes] = useState([]);
    const [filteredEmployes, setFilteredEmployes] = useState([]);
    const [showLendDate, setShowLendDate] = useState(Platform.OS === 'ios');
    const [showRepaymentDate, setShowRepaymentDate] = useState(Platform.OS === 'ios');
    const [date, setDate] = useState({
        lendDate: new Date(),
        repaymentDate: new Date(),
    });
    const [isDateTaken, setIsDateTaken] = useState({
        lendDate: false,
        repaymentDate: false
    });


    // console.log("date object :", date)
    // DateTimePickerAndroid.open(params: AndroidNativeProps)
    // DateTimePickerAndroid.dismiss(mode: AndroidNativeProps['mode']);

    const findingUser = (query: string) => {
        if (query) {
            let filteredNames = employes.filter((e: any) => {
                return Object.values(e).some((value: any) => {
                    return value.toString().toLowerCase().includes(query.toLowerCase());
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
        setDate({ lendDate: selectedDate, repaymentDate: date.repaymentDate });
        setShowLendDate(false);
        setIsDateTaken({ lendDate: true, repaymentDate: isDateTaken.repaymentDate });
    }

    const onChangeWithdrowDate = (e: any, selectedDate: any) => {
        setDate({ lendDate: date.lendDate, repaymentDate: selectedDate });
        setShowRepaymentDate(false);
        setIsDateTaken({ lendDate: isDateTaken.lendDate, repaymentDate: true });
    }


    const deployInvest = async () => {
        if (lender?.fullName && lendAmount) {
            const createTranssction: BorrowInterface = {
                partner_name: lender.fullName,
                partner_id: lender.id,
                type: 'borrow',
                amount: parseInt(lendAmount),
                createdAt: firestore.FieldValue.serverTimestamp(),
                borrowDate: date.lendDate,
                repaymentDate: isDateTaken.repaymentDate ? date.repaymentDate : null,
                reference: ref,
                entryBy: loginUser.fullName,
            }
            await firestore().collection('transactions').doc().set(createTranssction)
                .then(() => {
                    let afterThen = true;
                    modalHide(afterThen);
                    setLendAmount('');
                    setLender(undefined);
                    ToastAndroid.show('Borrows Created Successfull!', ToastAndroid.SHORT);

                })
                .catch((error: any) => console.log(error));

            return;

        }
        return Alert.alert('Alert', 'Please enter valid lender name and amount')
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
                    <Text style={[global_styles.modalHeader,]}>Add New Borrow</Text>
                    <View style={global_styles.greyLine} />
                </View>

                <View style={{ backgroundColor: ConstantColor.white, flex: 1, }}>

                    <View style={{ ...global_styles.paddingVerticalTen, paddingHorizontal: 10, paddingVertical: 20 }}>
                        <View>
                            <Text style={[global_styles.modalHeader,]}>Enter Borrows Info</Text>
                        </View>
                        <Text></Text>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                            <View style={{ width: '60%' }}>
                                {/* {selectInvestOption == 2 && <Text></Text>} */}
                                <TextInput
                                    placeholderTextColor="#000"
                                    placeholder="Borrow's Amount"
                                    onChangeText={(text) => setLendAmount(text)}
                                    value={lendAmount}
                                    autoCapitalize="none"
                                    style={styles.text_input}
                                    keyboardType='number-pad'
                                />

                                <View style={global_styles.sizedBoxTen}></View>

                                <View style={[styles.autocompleteContainer, { top: 50 }]}>
                                    <AutocompleteInput
                                        data={Array.from(filteredEmployes)}
                                        value={lender?.fullName}
                                        placeholder={`Lender's Name`}
                                        placeholderTextColor="#000"
                                        inputContainerStyle={{ paddingHorizontal: 8, }}
                                        selectionColor={'#000'}
                                        style={{color:'black'}}

                                        onChangeText={(text) => findingUser(text)}
                                        listContainerStyle={{zIndex:999}}
                                        containerStyle={{zIndex:99999}}
                                        flatListProps={{
                                            keyExtractor: (item: any) => item.id,
                                            renderItem: ({ item, index }) => (
                                                <Pressable key={index}
                                                    onPress={() => {
                                                        setLender(item);
                                                        setFilteredEmployes([])
                                                    }}
                                                >
                                                    <Text style={{color:'black', padding:5}}>{item.fullName}</Text>
                                                </Pressable>
                                            ),
                                        }}
                                    />
                                </View>

                                <TextInput
                                    placeholderTextColor="#000"
                                    placeholder="Borrow's Ref"
                                    onChangeText={(text) => setRef(text)}
                                    value={ref}
                                    autoCapitalize="none"
                                    style={[styles.text_input,{marginTop:50}]}
                                />

                                <View style={global_styles.sizedBoxTen}></View>
                            </View>

                            <View style={{ width: '40%', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                                <TouchableOpacity
                                    style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}
                                    onPress={() => setShowLendDate(true)}>

                                    {Platform.OS === 'ios' || (
                                        <Text style={{
                                            color: '#111',
                                            textAlign: 'center',
                                            fontSize: 14,
                                        }}>
                                            {/* {text} */}
                                        </Text>
                                    )}
                                    {showLendDate && (
                                        <DateTimePicker
                                            testID="dateTimePicker"
                                            value={date.lendDate}
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

                                        {isDateTaken.lendDate ? (
                                            <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                                                <Icon
                                                    name="calendar"
                                                    type="font"
                                                    size={20}
                                                    color={'#000'}
                                                />
                                                <Text style={{ fontWeight: 'bold', color: 'black', fontSize: 12 }}>{date.lendDate.toDateString()}</Text>
                                            </View>
                                        ) : (
                                            <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                                                <Icon
                                                    name="calendar"
                                                    type="font"
                                                    size={20}
                                                    color={'#000'}
                                                />
                                                <Text style={{ fontWeight: 'bold', color: 'black', fontSize: 12 }}>Date of Borrow</Text>
                                            </View>
                                        )}

                                    </View>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 6 }}
                                    onPress={() => setShowRepaymentDate(true)}>

                                    {Platform.OS === 'ios' || (
                                        <Text style={{
                                            color: '#111',
                                            textAlign: 'center',
                                            fontSize: 14,
                                        }}>
                                            {/* {text} */}
                                        </Text>
                                    )}
                                    {showRepaymentDate && (
                                        <DateTimePicker
                                            testID="dateTimePicker"
                                            value={date.repaymentDate}
                                            mode={'date'}
                                            is24Hour={true}
                                            display="default"
                                            minimumDate={minimumDateFinder()}
                                            onChange={(event, selectedDate) => {
                                                onChangeWithdrowDate(event, selectedDate);
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
                                            // marginTop: 10,
                                        }}>

                                        {isDateTaken.repaymentDate ? (
                                            <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                                                <Icon
                                                    name="calendar"
                                                    type="font"
                                                    size={20}
                                                    color={'#000'}
                                                />
                                                <Text style={{ fontWeight: 'bold', color: 'black', fontSize: 12 }}>{date.repaymentDate.toDateString()}</Text>
                                            </View>
                                        ) : (
                                            <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                                                <Icon
                                                    name="calendar"
                                                    type="font"
                                                    size={20}
                                                    color={'#000'}
                                                />
                                                <Text style={{ fontWeight: 'bold', color: 'black', fontSize: 12 }}>Repayment Date</Text>
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

export default BorrowModal;

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