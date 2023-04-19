import {CheckDateIsEqual} from './check-date-is-equal';

export const CheckIsTomorrow = (date: Date) => {

    const tomorrow = new Date()

    tomorrow.setDate(tomorrow.getDate() + 1)

    const tomorrowInWeek = tomorrow.getDay();

    if (tomorrowInWeek === 6) {
        tomorrow.setDate(tomorrow.getDate() + 2);
    } else if (tomorrowInWeek === 0) {
        tomorrow.setDate(tomorrow.getDate() + 1);
    }

    return CheckDateIsEqual(tomorrow, date)
}
