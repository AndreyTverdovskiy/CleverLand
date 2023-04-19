import {CheckDateIsEqual} from './check-date-is-equal';


export const CheckIsToday =(date: Date) => {
    const today = new Date()

    return CheckDateIsEqual(today, date)
}
