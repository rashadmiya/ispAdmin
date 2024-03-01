import { StyleSheet, Text, View, TouchableOpacity, Animated, TouchableWithoutFeedback } from 'react-native'
import React, { useRef, useState } from 'react'
import { ConstantColor } from '../utils/constant_color';
import Icon from '../utils/customIcons';
import global_styles from '../utils/global_styles';
import NoticeModal from '../modals/NoticeModal';
import ProjectsModal from '../modals/ProjectsModal';
import ProposalsModal from '../modals/ProposalsModal';

const FloatingAnimatedActionBtn = () => {
    const [isOpened, setIsOpen] = useState(false);
    const animation = useRef(new Animated.Value(0)).current;
    const [modalFor, setModalFor] = useState<string | undefined>('');

    const rotation = {
        transform: [
            {
                rotate: animation.interpolate({
                    inputRange: [0, 1],
                    outputRange: ["0deg", "360deg"]
                })
            },
        ]
    }

    const getAnimatedStyle = (translateY: any) => ({
        transform: [
            { scale: animation },
            {
                translateY: animation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, translateY]
                })
            }
        ]
    })

    const handlePress = () => {
        const toValue = isOpened ? 0 : 1;
        Animated.spring(animation, {
            toValue,
            friction: 5,
            useNativeDriver: true,
        }).start();
        setIsOpen(!isOpened);
    }

    const handlePressOut = () => {
        setIsOpen(false);
    }

    const hideModal = () => {
        setModalFor(undefined);
        handlePress();
    }

    return (
        <View style={styles.container}>

            <TouchableOpacity onPress={() => setModalFor('projects')}>
                <Animated.View style={[styles.secondaryBtn, getAnimatedStyle(-80)]}>
                    {/* <Icon type='ant' name='plus' size={30} color='white' /> */}
                    <Text style={global_styles.textWhite}>Add Project</Text>
                </Animated.View>
            </TouchableOpacity>


            <TouchableOpacity onPress={() => setModalFor('proposals')}>
                <Animated.View style={[styles.secondaryBtn, getAnimatedStyle(-140)]}>
                    <Text style={global_styles.textWhite}>Add Proposals</Text>
                </Animated.View>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setModalFor('notice')}>
                <Animated.View style={[styles.secondaryBtn, getAnimatedStyle(-200)]}>
                    <Text style={global_styles.textWhite}>Add Notice</Text>
                </Animated.View>
            </TouchableOpacity>

            <TouchableOpacity onPress={handlePress} onBlur={handlePressOut} onPressOut={handlePressOut}>
                <Animated.View style={[styles.plusBtn, styles.menu, rotation]}>
                    <Icon type='ant' name='plus' size={30} color='white' />
                </Animated.View>
            </TouchableOpacity>

            <NoticeModal modalFor={modalFor} isModalVisible={modalFor == 'notice'} modalHide={hideModal} />
            <ProjectsModal modalFor={modalFor} isModalVisible={modalFor == 'projects'} modalHide={hideModal} />
            <ProposalsModal modalFor={modalFor} isModalVisible={modalFor == 'proposals'} modalHide={hideModal} />
        </View>
    )
}


export default FloatingAnimatedActionBtn

const styles = StyleSheet.create({
    container: {
        // position: 'absolute',
        // bottom: 10,
        // right: 30,
    },
    plusBtn: {
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#F02A4B',
        shadowOffset: {
            width: 0,
            height: 10
        }
    },
    menu: {
        backgroundColor: ConstantColor.secondary,
    },
    secondaryBtn: {
        width: 140,
        height: 40,
        backgroundColor: ConstantColor.secondary,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        right: 0,
        zIndex: -1
    }
})