import { Pressable, StyleSheet, Text, View } from 'react-native';
import React, { useState, ReactNode } from 'react';

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
// import { NestedItem } from '../../constants/menuItems';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import OwnerRouteManager from '../OwnerRouteManager';
import { BORROWERS, EXPENSES, FUNDTRANSFER, INCOME, INVESTMENTS, LOANTO, LOSSES } from '../../utils/constant_route';


type Props = {
    value: NestedItem;
    parentHeighValue: SharedValue<number>;
};
type NestedItem = {
    name: string;
    onPress: any;
    icon: ReactNode;
    parent: string;
};
interface openItem {
    name: string,
    parent: string,
}

const NestedHomeAccordion = ({ value, parentHeighValue }: Props) => {
    const [openedItem, setOpenedItem] = useState<openItem | null>(null);
    const [isModalVisible, setIsModalVisible] = useState(false);

    const navigation: any = useNavigation();

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
        setOpenedItem({ name: '', parent: '' });
        setIsModalVisible(false);

    }


    return (
        <>
            <View style={styles.container}>
                <Pressable
                    onPress={() => {
                        if (value.name == 'add') {
                            setOpenedItem({ name: value.name, parent: value.parent });
                            // navigation.dispatch(DrawerActions.closeDrawer())
                            setIsModalVisible(true);

                        } else {
                            switch (value?.parent) {
                                case 'invest':
                                    return navigation.navigate(INVESTMENTS);
                                    break;
                                case 'income':
                                    return navigation.navigate(INCOME);
                                    break;
                                case 'borrow':
                                    return navigation.navigate(BORROWERS);
                                    break;
                                case 'expense':
                                    return navigation.navigate(EXPENSES);
                                    break;
                                case 'loss':
                                    return navigation.navigate(LOSSES);
                                    break;
                                case 'foundTransfer':
                                    return navigation.navigate(FUNDTRANSFER);
                                    break;
                                case 'loanTo':
                                    return navigation.navigate(LOANTO);
                                    break;
                                default:
                                    break;
                            }

                        };
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
            {openedItem && (<OwnerRouteManager openedItem={openedItem} isModalVisible={isModalVisible} modalHide={modalHide} />)}
        </>
    );
};

export default NestedHomeAccordion;

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