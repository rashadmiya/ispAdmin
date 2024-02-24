// import DateTimePicker from '@react-native-community/datetimepicker';
// import firestore from '@react-native-firebase/firestore';
// import React, { useState } from 'react';
// import {
//     Dimensions,
//     Platform,
//     StyleSheet, Text,
//     TextInput, ToastAndroid, TouchableOpacity,
//     TouchableWithoutFeedback,
//     View
// } from 'react-native';
// import Modal from 'react-native-modal';
// import { InvestInterface } from '../interfaces/TransactionInterface';
// import { ConstantColor } from '../utils/constant_color';
// import Icon from '../utils/customIcons';
// import global_styles from '../utils/global_styles';

// const UpdateInvestModal = ({ openedItem, isModalVisible, modalHide }:
//     { openedItem?: any, isModalVisible: boolean, modalHide: () => void }) => {
//     const [investAmount, setInvestAmount] = useState('');
//     const [showWithdrawDate, setShowWithdrawDate] = useState(Platform.OS === 'ios');
//     const [date, setDate] = useState({
//         investDate: new Date(),
//         withdrawDate: new Date(),
//     });
//     const [isDateTaken, setIsDateTaken] = useState({
//         investDate: false,
//         withdrowDate: false
//     });


//     const minimumDateFinder = () => {
//         const today = new Date();
//         const tomorrow = new Date(today);
//         tomorrow.setDate(tomorrow.getDate());
//         return tomorrow;
//     }


//     const onChangeWithdrowDate = (e: any, selectedDate: any) => {
//         setDate({ investDate: date.investDate, withdrawDate: selectedDate });
//         setShowWithdrawDate(false);
//         setIsDateTaken({ investDate: isDateTaken.investDate, withdrowDate: true });
//     }


//     const updateInvestment = async (invest: InvestInterface) => {
//         await firestore().collection('transactions').doc(invest.id).update({
//             amount: investAmount || invest.amount,
//             withdrawDate: date.withdrawDate || invest.withdrawDate,
//             id: invest.id,
//         })
//             .then(() => {
//                 setInvestAmount('');
//                 ToastAndroid.show('Invest has been updated', 500);
//             })
//             .catch((err) => {
//                 console.log(`error in update user=>${invest.id} role:`, err.message);
//                 setInvestAmount('');
//                 modalHide();
//             })
//     };


//     return (
//         <Modal isVisible={isModalVisible}
//             onSwipeComplete={modalHide}
//             swipeDirection="up"
//             customBackdrop={
//                 <TouchableWithoutFeedback onPress={modalHide}>
//                     <View style={{ flex: 1, backgroundColor: 'black', }} />
//                 </TouchableWithoutFeedback>
//             }
//             deviceWidth={Dimensions.get('window').width}
//             deviceHeight={Dimensions.get('window').height}
//             backdropOpacity={0.9}
//             backdropColor='black'
//             hasBackdrop={true}
//         >
//             <View style={{ minHeight: 200, backgroundColor: ConstantColor.lightGray, borderRadius: 10, padding: 10, }}>
//                 <View>
//                     <Text style={[global_styles.modalHeader,]}>{`${openedItem?.partner_name}'s Invest`}</Text>
//                     <View style={global_styles.greyLine} />
//                 </View>

//                 <View style={{ backgroundColor: ConstantColor.white, flex: 1, }}>
//                 <View style={global_styles.paddingVerticalTen}>
//                     <Text style={[global_styles.textBlack, global_styles.textCenter]}>Update invest amount and withdraw date</Text>
//                 </View>
//                     <View style={{ ...global_styles.paddingVerticalTen, paddingHorizontal: 10, paddingVertical: 20 }}>

//                         <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
//                             <View style={{ width: '60%' }}>
//                                 <TextInput
//                                     placeholderTextColor="#000"
//                                     placeholder={`previous amount- ${openedItem?.amount}`}
//                                     onChangeText={(text) => setInvestAmount(text)}
//                                     value={investAmount}
//                                     autoCapitalize="none"
//                                     style={styles.text_input}
//                                     keyboardType='number-pad'
//                                 />

//                                 <View style={global_styles.sizedBoxTen}></View>



//                             </View>

//                             <View style={{ width: '40%', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>


//                                 <TouchableOpacity
//                                     style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 6 }}
//                                     onPress={() => setShowWithdrawDate(true)}>

//                                     {Platform.OS === 'ios' || (
//                                         <Text style={{
//                                             color: '#111',
//                                             textAlign: 'center',
//                                             fontSize: 14,
//                                         }}>
//                                             {/* {text} */}
//                                         </Text>
//                                     )}
//                                     {showWithdrawDate && (
//                                         <DateTimePicker
//                                             testID="dateTimePicker"
//                                             value={date.withdrawDate}
//                                             mode={'date'}
//                                             is24Hour={true}
//                                             display="default"
//                                             minimumDate={minimumDateFinder()}
//                                             onChange={(event, selectedDate) => {
//                                                 onChangeWithdrowDate(event, selectedDate);
//                                             }}
//                                             textColor="#fff"
//                                             themeVariant="dark"
//                                             style={{
//                                                 width: 'auto',
//                                                 height: '100%',
//                                                 backgroundColor: ConstantColor.nevyBlue,
//                                             }}>

//                                         </DateTimePicker>
//                                     )}
//                                     <View
//                                         style={{
//                                             width: '100%',
//                                             flexDirection: 'row',
//                                             justifyContent: 'center',
//                                             display: Platform.OS === 'ios' ? 'none' : 'flex',
//                                             // marginTop: 10,
//                                         }}>

//                                         {isDateTaken.withdrowDate ? (
//                                             <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
//                                                 <Icon
//                                                     name="calendar"
//                                                     type="font"
//                                                     size={20}
//                                                     color={'#000'}
//                                                 />
//                                                 <Text style={{ fontWeight: 'bold', color: 'black', fontSize: 12 }}>{date.withdrawDate.toDateString()}</Text>
//                                             </View>
//                                         ) : (
//                                             <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
//                                                 <Icon
//                                                     name="calendar"
//                                                     type="font"
//                                                     size={20}
//                                                     color={'#000'}
//                                                 />
//                                                 <Text style={{ fontWeight: 'bold', color: 'black', fontSize: 12 }}>Withdraw Date</Text>
//                                             </View>
//                                         )}

//                                     </View>
//                                 </TouchableOpacity>
//                             </View>
//                         </View>


//                     </View>

//                     <View style={global_styles.sizedBoxTen}></View>
//                     <View style={{ flexDirection: 'row', justifyContent: 'flex-start', marginTop: 'auto' }}>
//                         <TouchableOpacity
//                             style={[global_styles.borderBox, { backgroundColor: ConstantColor.secondary, }]}
//                             onPress={() => updateInvestment(openedItem)}
//                         >
//                             <Text style={[global_styles.modalHeader,]}>Submit</Text>
//                         </TouchableOpacity>
//                     </View>
//                 </View>

//             </View>
//         </Modal>
//     )
// }

// export default UpdateInvestModal;

// const styles = StyleSheet.create({
//     text_input: {
//         paddingVertical: 5,
//         paddingHorizontal: 8,
//         fontSize: 14,
//         color: '#000',
//         width: '100%',
//         borderWidth: 1,
//         borderColor: '#dbdbdb'
//     },
//     autocompleteContainer: {
//         flex: 1,
//         left: 0,
//         position: 'absolute',
//         right: 0,
//         // top: 50,
//         zIndex: 1
//     }
// })