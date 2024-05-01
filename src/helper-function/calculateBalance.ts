
import firestore from '@react-native-firebase/firestore';
interface MonthlyTotal {
    month: string;
    data: {
        invest: number;
        income: number;
        expense: number;
        loan_to: number;
        borrow: number;
        loss: number;
    };
}
export const todaysBalance = async () => {
    const transactionsRef = await firestore().collection('transactions');
    const currentDate = new Date();
    const twelveMonthsAgo = new Date();
    twelveMonthsAgo.setMonth(currentDate.getMonth() - 12);
    const lastTwelveMonthsQuery = transactionsRef.where('createdAt', '>=', twelveMonthsAgo).where('createdAt', '<=', currentDate);

    const querySnapshot = await lastTwelveMonthsQuery.get();
    const updatedMonthlyTotals: MonthlyTotal[] = [];

    querySnapshot.forEach((doc: any) => {
        const transactionData = doc.data();
        if (!transactionData) return;

        const transactionDate = transactionData.createdAt.toDate();
        const month = transactionDate.getMonth() + 1;
        const year = transactionDate.getFullYear();
        const monthYearKey = `${month < 10 ? '0' : ''}${month}-${year}`;

        const existingIndex = updatedMonthlyTotals.findIndex((total) => total.month === monthYearKey);
        if (existingIndex === -1) {
            updatedMonthlyTotals.push({
                month: monthYearKey,
                data: {
                    invest: 0,
                    income: 0,
                    expense: 0,
                    loan_to: 0,
                    borrow: 0,
                    loss: 0,
                },
            });
        }

        const monthlyTotalIndex = updatedMonthlyTotals.findIndex((total) => total.month === monthYearKey);
        switch (transactionData.type) {
            case "invest":
                updatedMonthlyTotals[monthlyTotalIndex].data.invest += transactionData.amount;
                break;
            case "income":
                updatedMonthlyTotals[monthlyTotalIndex].data.income += transactionData.amount;
                break;
            case "expense":
                updatedMonthlyTotals[monthlyTotalIndex].data.expense += transactionData.amount;
                break;
            case "borrow":
                updatedMonthlyTotals[monthlyTotalIndex].data.borrow += transactionData.amount;
                break;
            case "loan_to":
                updatedMonthlyTotals[monthlyTotalIndex].data.loan_to += transactionData.amount;
                break;
            case "loss":
                updatedMonthlyTotals[monthlyTotalIndex].data.loss += transactionData.amount;
                break;
            // Add more cases as needed
        }
    });

    if (updatedMonthlyTotals.length > 0) {
        let thisMonthData = updatedMonthlyTotals[updatedMonthlyTotals.length - 1].data;

        let balanceToday = (thisMonthData.income) - (thisMonthData.loss + thisMonthData.expense);
        return balanceToday;
    }

    return 0; // Or whatever default value you want to return
}


export const userInvest = async (userId: string) => {
    const transactionsRef = firestore().collection('transactions');

    const lastTwelveMonthsQuery = transactionsRef.where('type', '==', 'invest').where('partner_id', '==', userId);

    const querySnapshot = await lastTwelveMonthsQuery.get();
    let investAmount: number = 0;

    querySnapshot.forEach((doc: any) => {
        const transactionData = doc.data();
        if (!transactionData) return;
        investAmount += parseInt(transactionData.amount);

    });

    if (investAmount > 0) {

        console.log("user invest :", investAmount);

        return investAmount;
    }

    return 0; // Or whatever default value you want to return
}

export const totallInvest = async () => {
    const transactionsRef = firestore().collection('transactions');

    const lastTwelveMonthsQuery = transactionsRef.where('type', '==', 'invest');

    const querySnapshot = await lastTwelveMonthsQuery.get();
    let investAmount: number = 0;

    querySnapshot.forEach((doc: any) => {
        const transactionData = doc.data();
        if (!transactionData) return;
        investAmount += parseInt(transactionData.amount);



    });

    if (investAmount> 0) { 
        return investAmount;
    }

    return 0; // Or whatever default value you want to return
}