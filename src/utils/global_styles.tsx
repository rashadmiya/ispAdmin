import { StyleSheet, Dimensions } from "react-native";
import { ConstantColor } from "./constant_color";

const global_styles = StyleSheet.create({
    customContainer: {
        padding: 10,
    },
    borderBox: {
        padding: 5,
        borderWidth:1,
        borderColor: '#dbdbdb',
        marginBottom:5,
    },
    justifyBetweenCenter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    columnCenter: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    },
    modalInner: {
        flex: 1,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
    },
    popUp: {
        backgroundColor: '#fff',
        width: Dimensions.get('window').width - 50,
        borderRadius: 15,
    },
    blackCurvedBtn: {
        justifyContent: 'center',
        alignSelf: 'center',
        backgroundColor: ConstantColor.blueshBlack,
        borderBottomRightRadius: 20,
        borderTopLeftRadius: 20
    },
    curveBtnLabel: {
        fontSize: 11,
        textAlignVertical: 'center',
        textAlign: 'center',
        width: '100%',
        color: '#fff',
    },
    shadow: {
        paddingHorizontal: 15,
        paddingVertical: 4,
        shadowColor: "black",
        shadowOffset: { width: 1, height: 1 },
        shadowRadius: 1,
        shadowOpacity: 0.1,
        backgroundColor: "#f2f2f2",
        borderRadius: 10,
        elevation: 1,
        marginBottom: 5
    },
    shadawText: {
        // textShadowOffset: { width: -1, height: 0 },
        textShadowColor: 'rgba(0, 0, 0, 0.8)',
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 1,
    },
    textBlack: {
        color: '#000'
    },
    textWhite: {
        color: '#fff',
    },
    textRed: {
        color: 'red'
    },
    textBold: {
        fontWeight: 'bold'
    },
    textSemiBold: {
        fontWeight: '800'
    },
    textLite: {
        fontWeight: '400'
    },
    textCenter: {
        textAlign: 'center'
    },
    textMedium: {
        fontSize: 16,
    },
    textLarge:{
        fontSize:20
    },
    modalHeader: {
        fontSize: 16,
        fontWeight:'bold',
        color:'black',
        textAlign:'center'
    },
    paddingVerticalTen: {
        paddingVertical: 10
    },
    paddingHorizontalTen: {
        paddingHorizontal: 10
    },
    greyLine: {
        height: 0.6,
        backgroundColor: ConstantColor.grey,
    },
    headerWrapper: {
        width: '100%',
        padding: 15,
    },
    sizedBoxTen:{
        height:10,
    },
    text_input: {
        paddingVertical: 5,
        paddingHorizontal: 8,
        fontSize: 14,
        color: '#000',
        width: '100%',
        borderWidth: 1,
        borderColor: '#dbdbdb'
    },
});

export default global_styles;