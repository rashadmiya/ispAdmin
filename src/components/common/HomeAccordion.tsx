import { Pressable, StyleSheet, Text, View } from 'react-native';
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
import Chevron from '../drawer/Chevron';
import NestedAccordion from '../drawer/Accordion_nested';

type Props = {
    value: any;
    type: string;
};

const HomeAccordion = ({ value, type }: Props) => {
    const listRef = useAnimatedRef();
    const heightValue = useSharedValue(0);
    const open = useSharedValue(false);
    const progress = useDerivedValue(() =>
        open.value ? withTiming(1) : withTiming(0),
    );

    const heightAnimationStyle = useAnimatedStyle(() => ({
        height: heightValue.value,
    }));

    return (
        <View style={styles.container}>
            <Pressable
                onPress={() => {
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
                <Text style={styles.textTitle}>{value.name}</Text>
                <Chevron progress={progress} />
            </Pressable>
            <Animated.View style={heightAnimationStyle}>
                <Animated.View style={styles.contentContainer} ref={listRef}>
                    {type === 'regular' &&
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

export default HomeAccordion;

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#E3EDFB',
        // marginHorizontal: 10,
        marginVertical: 5,
        borderRadius: 14,
        borderWidth: .5,
        borderColor: '#0F56B3',
        overflow: 'hidden',
    },
    textTitle: {
        fontSize: 16,
        color: 'black',
        fontWeight:'bold'
    },
    titleContainer: {
        padding: 12,
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
