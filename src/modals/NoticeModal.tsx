import firestore from '@react-native-firebase/firestore';
import React, { useState } from 'react';
import {
    Alert, Dimensions,
    StyleSheet, Text,
    TextInput, ToastAndroid, TouchableOpacity,
    TouchableWithoutFeedback,
    View
} from 'react-native';
import Modal from 'react-native-modal';
import { useSelector } from 'react-redux';
import { ConstantColor } from '../utils/constant_color';
import global_styles from '../utils/global_styles';

const NoticeModal = ({isModalVisible, modalHide }:
    {isModalVisible: boolean, modalHide: () => void }) => {

    const [noticeTitle, setNoticeTitle] = useState('');
    const [noticeDetails, setNoticeDetails] = useState('');
    const [date, setDate] = useState(new Date(),);

    const createNotice = async () => {
        if (noticeTitle && noticeDetails) {
            const createNotice = {
                noticeTitle: noticeTitle,
                noticeMsg: noticeDetails,
                createdAt: firestore.FieldValue.serverTimestamp(),
                viewer: [],
                // dateOfLoss: date,
            }
            await firestore().collection('notices').doc().set(createNotice)
                .then(() => {
                    modalHide();
                    setNoticeTitle('');
                    setNoticeDetails('');
                    ToastAndroid.show('Notice Created Successfully!', ToastAndroid.LONG);
                })
                .catch((error: any) => console.log(error));

            return;

        }
        return Alert.alert('Alert', 'Please Enter valid title and msg')
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
                    <Text style={[global_styles.modalHeader,]}>Notice</Text>
                    <View style={global_styles.greyLine} />
                </View>

                <View style={{ backgroundColor: ConstantColor.white, flex: 1, }}>

                    <View style={{ ...global_styles.paddingVerticalTen, paddingHorizontal: 10, paddingVertical: 20 }}>
                        <View>
                            <Text style={[global_styles.modalHeader,]}>{`Enter Notice Info`}</Text>
                        </View>
                        <Text></Text>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                            <View style={{ width: '100%' }}>
                                {/* {selectInvestOption == 2 && <Text></Text>} */}
                                <TextInput
                                    placeholderTextColor="#000"
                                    placeholder="Notice Title"
                                    onChangeText={(text) => setNoticeTitle(text)}
                                    value={noticeTitle}
                                    autoCapitalize="none"
                                    style={styles.text_input}
                                />

                                <View style={global_styles.sizedBoxTen}></View>
                                <TextInput
                                    multiline
                                    numberOfLines={4} // Adjust this as needed
                                    placeholderTextColor="#000"
                                    style={[styles.text_input,{textAlignVertical:'top'}]}
                                    placeholder="Enter notice text here"
                                    value={noticeDetails}
                                    onChangeText={(text) => setNoticeDetails(text)}
                                />
                            </View>

                        </View>


                    </View>

                    <View style={global_styles.sizedBoxTen}></View>
                    <View style={{ flexDirection: 'row', justifyContent: 'flex-start', marginTop: 'auto' }}>
                        <TouchableOpacity
                            style={[global_styles.borderBox, { backgroundColor: ConstantColor.secondary, }]}
                            onPress={() => createNotice()}
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

export default NoticeModal;

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

})