import { Pressable, StyleSheet, Text, View } from 'react-native';
import React, { useState } from 'react';

import Animated, {
    useAnimatedRef,
    useSharedValue,
    useAnimatedStyle,
    runOnUI,
    measure,
    useDerivedValue,
    withTiming,
    SharedValue,
} from 'react-native-reanimated';
import Chevron from './Chevron';
import { NestedItem } from '../../constants/menuItems';
import CustomModal from '../common/CustomModal';
import { DrawerActions, useNavigation } from '@react-navigation/native';

type Props = {
    value: NestedItem;
    parentHeighValue: SharedValue<number>;
};

const NestedAccordion = ({ value, parentHeighValue }: Props) => {
    const [openedItem, setOpenedItem] = useState<string | null>(null);
    const [isModalVisible, setIsModalVisible] = useState(false);

    const navigation = useNavigation();

    const listRef = useAnimatedRef();
    const heightValue = useSharedValue(0);
    const open = useSharedValue(false);
    const progress = useDerivedValue(() =>
        open.value ? withTiming(1) : withTiming(0),
    );

    const heightAnimationStyle = useAnimatedStyle(() => ({
        height: heightValue.value,
    }));

    const modalHide = () => {
        setIsModalVisible(false);
        console.log("fired on tab:", openedItem, isModalVisible)

    }

    return (
        <>
            <View style={styles.container}>
                <Pressable
                    onPress={() => {
                        navigation.dispatch(DrawerActions.closeDrawer())
                        setOpenedItem(value.name);
                        setIsModalVisible(true);
                    }}
                    style={styles.titleContainer}>
                    {openedItem ?
                        <Text style={styles.textTitle}>{`${value.name}...`}</Text>
                        :
                        <Text style={styles.textTitle}>{value.name}</Text>
                    }

                    {value.icon}
                </Pressable>

            </View>
            {openedItem && (<CustomModal openedItem={openedItem} isModalVisible={isModalVisible} modalHide={modalHide} />)}
        </>
    );
};

export default NestedAccordion;

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#E3EDFB',
        marginHorizontal: 10,
        marginVertical: 7,
        // borderRadius: 14,
        borderWidth: .4,
        borderColor: '#0F56B3',
        overflow: 'hidden',
    },
    textTitle: {
        fontSize: 16,
        color: 'black',
    },
    titleContainer: {
        padding: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    contentContainer: {
        position: 'absolute',
        width: '100%',
        top: 0,
    },
    content: {
        padding: 20,
        backgroundColor: '#D6E1F0',
    },
    textContent: {
        fontSize: 14,
        color: 'black',
    },
});


// import { Pressable, StyleSheet, Text, View } from 'react-native';
// import React from 'react';

// import Animated, {
//     useAnimatedRef,
//     useSharedValue,
//     useAnimatedStyle,
//     runOnUI,
//     measure,
//     useDerivedValue,
//     withTiming,
//     SharedValue,
// } from 'react-native-reanimated';
// import Chevron from './Chevron';
// import { NestedItem } from '../../constants/menuItems';

// type Props = {
//     value: NestedItem;
//     parentHeighValue: SharedValue<number>;
// };

// const NestedAccordion = ({ value, parentHeighValue }: Props) => {
//     const listRef = useAnimatedRef();
//     const heightValue = useSharedValue(0);
//     const open = useSharedValue(false);
//     const progress = useDerivedValue(() =>
//         open.value ? withTiming(1) : withTiming(0),
//     );

//     const heightAnimationStyle = useAnimatedStyle(() => ({
//         height: heightValue.value,
//     }));

//     return (
//         <View style={styles.container}>
//             <Pressable
//                 onPress={() => {
//                     if (heightValue.value === 0) {
//                         runOnUI(() => {
//                             'worklet';
//                             heightValue.value = withTiming(measure(listRef)!.height);
//                             parentHeighValue.value = withTiming(
//                                 parentHeighValue.value + measure(listRef)!.height,
//                             );
//                         })();
//                     } else {
//                         runOnUI(() => {
//                             'worklet';
//                             heightValue.value = withTiming(0);
//                             parentHeighValue.value = withTiming(
//                                 parentHeighValue.value - measure(listRef)!.height,
//                             );
//                         })();
//                     }
//                     open.value = !open.value;
//                 }}
//                 style={styles.titleContainer}>
//                 <Text style={styles.textTitle}>{value.name}</Text>
//                 <Chevron progress={progress} />
//             </Pressable>
//             <Animated.View style={heightAnimationStyle}>
//                 <Animated.View style={styles.contentContainer} ref={listRef}>

//                     {value.content.map((v: any, i: number) => {
//                         return (
//                             <View key={i} style={styles.content}>
//                                 <Text style={styles.textContent}>{v}</Text>
//                             </View>
//                         );
//                     })}

//                 </Animated.View>
//             </Animated.View>
//         </View>
//     );
// };

// export default NestedAccordion;

// const styles = StyleSheet.create({
//     container: {
//         backgroundColor: '#E3EDFB',
//         marginHorizontal: 10,
//         marginVertical: 7,
//         // borderRadius: 14,
//         borderWidth: .4,
//         borderColor: '#0F56B3',
//         overflow: 'hidden',
//     },
//     textTitle: {
//         fontSize: 16,
//         color: 'black',
//     },
//     titleContainer: {
//         padding: 10,
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         alignItems: 'center',
//     },
//     contentContainer: {
//         position: 'absolute',
//         width: '100%',
//         top: 0,
//     },
//     content: {
//         padding: 20,
//         backgroundColor: '#D6E1F0',
//     },
//     textContent: {
//         fontSize: 14,
//         color: 'black',
//     },
// });
