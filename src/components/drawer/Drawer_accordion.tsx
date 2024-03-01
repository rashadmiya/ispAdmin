import { Pressable, StyleSheet, Text, View, Image } from 'react-native';
import React from 'react';
import { Category } from '../../constants/menuItems';
import Animated, {
    useAnimatedRef,
    useSharedValue,
    useAnimatedStyle,
    runOnUI,
    measure,
    useDerivedValue,
    withTiming,
} from 'react-native-reanimated';
import Chevron from './Chevron';
import NestedAccordion from './Accordion_nested';
import { useNavigation } from '@react-navigation/native';
import { INVESTMENTS, LOANTO, NOTICES, PROJECTS, PROPOSALS, USERMANAGER } from '../../utils/constant_route';
import { useSelector } from 'react-redux';
import { UserInterface } from '../../interfaces/user_interface';

type Props = {
    value: any;
    type: string;
};

const Accordion = ({ value, type }: Props) => {
    let notices = useSelector((state: any) => state.notice.value);
    let loginUser: UserInterface = useSelector((state: any) => state.loggedInUser.value);
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

    const findUnredNotice = () => {
        let unredNotice = notices.filter((notice: any) => !notice.viewer.includes(loginUser.id));
        return unredNotice;
    }

    findUnredNotice()

    return (
        <View style={styles.container}>
            <Pressable
                onPress={() => {
                    if (type !== 'nested') {
                        switch (value?.name) {
                            case 'Supper Categories':
                                return navigation.navigate(INVESTMENTS);
                                break;
                            case 'Categories':
                                return navigation.navigate(INVESTMENTS);
                                break;
                            case 'Sub Categories':
                                return navigation.navigate(INVESTMENTS);
                                break;
                            case 'Fund Manager':
                                // return navigation.navigate(INVESTMENTS);
                                break;
                            case 'Persons':
                                return navigation.navigate(USERMANAGER);
                                break;
                            case 'Notice':
                                return navigation.navigate(NOTICES);
                                break;

                            case 'Proposals':
                                return navigation.navigate(PROPOSALS);
                                break;
                            case 'Investors':
                                return navigation.navigate(INVESTMENTS);
                                break;
                            case 'Projects':
                                return navigation.navigate(PROJECTS);
                                break;
                            default:
                                break;
                        }
                    }
                    if (heightValue.value === 0) {
                        runOnUI(() => {
                            'worklet';
                            heightValue.value = withTiming(measure(listRef)!.height);
                        })();
                    } else {
                        heightValue.value = withTiming(0);
                    }
                    open.value = !open.value;
                }}
                style={styles.titleContainer}>

                {value.name == "Notice" && findUnredNotice().length > 0 ? 
                <Text style={[styles.textTitle,{color:'red'}]}>{`${value.name} ${findUnredNotice().length}`}</Text>
                :
                <Text style={styles.textTitle}>{value.name}</Text>
                }

                {
                    type == 'nested' ?
                        (<Chevron progress={progress} />) : (<View >
                            <Image source={require('../../../assets/cv.png')}
                                style={{ height: 30, width: 30, transform: [{ rotate: `-90deg` }] }} />
                        </View>)
                }

            </Pressable>
            <Animated.View style={heightAnimationStyle}>
                <Animated.View style={styles.contentContainer} ref={listRef}>
                    {type === 'regular' &&
                        // value.content.map((v: any, i: number) => {
                        //     return (
                        //         <View key={i} style={styles.content}>
                        //             <Text style={styles.textContent}>{v}</Text>
                        //         </View>
                        //     );
                        // })
                        (
                            <View style={styles.content}>
                                <Text style={styles.textContent}>{value.name}</Text>
                            </View>
                        )
                    }
                    {type === 'nested' && (
                        <>
                            {value.innerContent.map((val: any, ind: number) => {
                                return (
                                    <NestedAccordion
                                        value={val}
                                        key={ind}
                                        parentHeighValue={heightValue}
                                    />
                                );
                            })}
                        </>
                    )}
                </Animated.View>
            </Animated.View>
        </View>
    );
};

export default Accordion;

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#E3EDFB',
        // marginHorizontal: 10,
        marginVertical: 2,
        // borderRadius: 14,
        borderWidth: .5,
        borderColor: '#0F56B3',
        overflow: 'hidden',
    },
    textTitle: {
        fontSize: 16,
        color: 'black',
        fontWeight: 'bold'
    },
    titleContainer: {
        padding: 5,
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
        padding: 10,
        backgroundColor: '#D6E1F0',
    },
    textContent: {
        fontSize: 14,
        color: 'black',
        fontWeight: 'bold'
    },
});
