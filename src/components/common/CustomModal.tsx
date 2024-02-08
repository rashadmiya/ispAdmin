import React from 'react';
import { View } from 'react-native';
import InvestModal from '../../modals/InvestModal';
import IncomeModal from '../../modals/IncomeModal';
import ExpenseModal from '../../modals/ExpenseModal';
import LossModal from '../../modals/LossModal';
import BorrowModal from '../../modals/BorrowModal';
// type Props = {
//     openedItem: string;
// };
const CustomModal = ({ openedItem, isModalVisible, modalHide }:
    { openedItem: any, isModalVisible: boolean, modalHide: () => void }) => {

    return (
        <View >
            {openedItem == 'Investments' && (<InvestModal openedItem={openedItem} isModalVisible={isModalVisible} modalHide={modalHide}/>)}
            {openedItem == 'Income' && (<IncomeModal openedItem={openedItem} isModalVisible={isModalVisible} modalHide={modalHide}/>)}
            {openedItem == 'Expenses' && (<ExpenseModal openedItem={openedItem} isModalVisible={isModalVisible} modalHide={modalHide}/>)}
            {openedItem == 'Borrows' && (<BorrowModal openedItem={openedItem} isModalVisible={isModalVisible} modalHide={modalHide}/>)}
            {openedItem == 'Losses' && (<LossModal openedItem={openedItem} isModalVisible={isModalVisible} modalHide={modalHide}/>)}
        </View>
    )

}

export default CustomModal

