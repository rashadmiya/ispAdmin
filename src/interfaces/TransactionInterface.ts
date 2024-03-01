import firestore,{FirebaseFirestoreTypes} from '@react-native-firebase/firestore';
let timestrams = firestore.Timestamp

export type InvestInterface = {
    partner_name: string,
    partner_id: string,
    type: string,
    amount: number,
    createdAt: any,
    investmentDate: any,
    withdrawDate: any,
    id?:string,
    investType:string
}

export type IncomeInterface = {
    partner_name?: string,
    partner_id?: string,
    type: string,
    amount: number,
    createdAt: any,
    incomeDate: any,
    incomeFrom: string,
    id?:string,
}

export type ExpenditureInterface = {
    // partner_name: string,
    // partner_id: string,
    type: string,
    amount: number,
    createdAt: any,
    expenseDate: any,
    expenseTo: string,
    id?:string,
}
export type LossInterface = {
    // partner_name: string,
    // partner_id: string,
    lossReason: string,
    type: string,
    amount: number,
    createdAt: any,
    dateOfLoss: any,
    id?:string,
}

export type BorrowInterface = {
    partner_name: string,
    partner_id: string,
    type: string,
    amount: number,
    createdAt: any,
    borrowDate: any,
    repaymentDate: any,
    id?:string,
}

export type LoanToInterface = {
    borrower: string,
    borrower_id: string,
    type: string,
    amount: number,
    createdAt: any,
    borrowDate: any,
    repaymentDate: any,
    conditions?: string,
    witness?: string[],
    id?:string,
}