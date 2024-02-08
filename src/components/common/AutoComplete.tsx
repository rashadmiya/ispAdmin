import { StyleSheet, Text, View, TouchableWithoutFeedback, SafeAreaView, Keyboard, TextInput, Pressable } from 'react-native'
import React, { useState } from 'react';
import { ConstantColor } from '../../utils/constant_color';
import { FlatList } from 'react-native';

const AutoComplete = ({ employes }: { employes: any }) => {
    const [investor, setInvestor] = useState('');
    const [filteredInvestor, setFilteredInvestor] = useState([]);

    const onChangeText = (text: string) => {
        setInvestor(text)
        let filteredNames = employes.filter((e: any) => {
            return Object.values(e).some((value: any) => {
                return value.toString().toLowerCase().includes(text);
            });
        });
        setFilteredInvestor(filteredNames);
    }
    return (
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss}>
            <SafeAreaView>
                <Text>search</Text>
                <TextInput
                    placeholderTextColor="black"
                    placeholder="Invest Amount"
                    onChangeText={onChangeText}
                    value={investor}
                    autoCapitalize="none"
                    style={styles.text_input}
                />
                <FlatList
                    data={filteredInvestor}
                    renderItem={({item, index: number}) => {
                        return (
                            <Pressable>
                                <Text>{item.fullName}</Text>
                            </Pressable>
                        )
                    }}
                    keyExtractor={(item: any) => item.id}
                />
            </SafeAreaView>
        </TouchableWithoutFeedback>
    )
}

export default AutoComplete

const styles = StyleSheet.create({
    text_input: {
        paddingVertical: 3,
        paddingHorizontal: 8,
        fontSize: 14,
        color: '#000',
        width: '100%',
        borderWidth: 1,
        backgroundColor: ConstantColor.lightGray
    },
})



// import React, { useEffect, useState } from 'react'
// import { TouchableOpacity } from 'react-native';
// import { SafeAreaView } from 'react-native';
// import { StyleSheet, Text, View } from 'react-native'
// import AutocompleteInput from 'react-native-autocomplete-input';

// type selectedValue = {
//     title: string
// }
// const AutoComplete = ({employes}:{employes:any}) => {
//     const [films, setFilms] = useState(employes);
//     const [filteredFilms, setFilteredFilms] = useState([]);
//     const [selectedValue, setSelectedValue] = useState<selectedValue | null>();


//     const findFilm = (query: any) => {
//         if (query) {
//             const regex = new RegExp(`${query.trim()}`, 'i');
//             setFilteredFilms(
//                 films.filter((film: any) => film.title.search(regex) >= 0)
//             );
//         } else {
//             setFilteredFilms([]);
//         }
//     };

//     return (
//         <SafeAreaView style={{ flex: 1 }}>
//             <View style={styles.container}>
//                 <AutocompleteInput
//                     autoCapitalize="none"
//                     autoCorrect={false}
//                     containerStyle={styles.autocompleteContainer}
//                     data={filteredFilms}
//                     defaultValue={
//                         JSON.stringify(selectedValue) === '{}' ?
//                             '' :
//                             selectedValue?.title
//                     }
//                     onChangeText={(text) => findFilm(text)}
//                     placeholder="Enter the film title"

//                     flatListProps={{
//                         keyExtractor: (item) => item,

//                         renderItem: ({ item }: { item: any }) => (
//                             <TouchableOpacity
//                                 onPress={() => {
//                                     setSelectedValue(item);
//                                     setFilteredFilms([]);
//                                 }}>
//                                 <Text style={styles.itemText}>
//                                     {item.title}
//                                 </Text>
//                             </TouchableOpacity>
//                         )
//                     }}
//                 />


//                 <View style={styles.descriptionContainer}>
//                     {films.length > 0 ? (
//                         <>
//                             <Text style={styles.infoText}>
//                                 Selected Data
//                             </Text>
//                             <Text style={styles.infoText}>
//                                 {JSON.stringify(selectedValue)}
//                             </Text>
//                         </>
//                     ) : (
//                         <Text style={styles.infoText}>
//                             Enter The Film Title
//                         </Text>
//                     )}
//                 </View>


//             </View>
//         </SafeAreaView>
//     );
// }

// export default AutoComplete

// const styles = StyleSheet.create({
//     container: {
//         backgroundColor: '#F5FCFF',
//         flex: 1,
//         padding: 16,
//         marginTop: 40,
//     },
//     autocompleteContainer: {
//         backgroundColor: '#ffffff',
//         borderWidth: 0,
//     },
//     descriptionContainer: {
//         flex: 1,
//         justifyContent: 'center',
//     },
//     itemText: {
//         fontSize: 15,
//         paddingTop: 5,
//         paddingBottom: 5,
//         margin: 2,
//     },
//     infoText: {
//         textAlign: 'center',
//         fontSize: 16,
//     },
// })