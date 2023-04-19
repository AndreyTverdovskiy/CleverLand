import {GetWeekNumber} from './get-week-number';


type CreateDatePT = {
    locale?: string
    date?: Date
}

export const CreateDate = (params?:CreateDatePT) => {
    const locale = params?.locale ?? 'default'

    const d = params?.date ?? new Date()
    const dayNumber = d.getDate()
    const day = d.toLocaleDateString(locale, {weekday: 'long'})

    const dayNumberInWeek = d.getDay() + 1

    const dayShort = d.toLocaleDateString(locale, {weekday: 'short'})
    const year = d.getFullYear()
    const yearShort = d.toLocaleDateString(locale, {year: '2-digit'})

    const  month = d.toLocaleDateString(locale, {month: 'long'})
    const  monthShort = d.toLocaleDateString(locale, {month: 'short'})

    const monthNumber = d.getMonth() + 1

    const monthIndex = d.getMonth()

    const timesTamp = d.getTime()
    const week = GetWeekNumber(d)

    return {
        date:d, dayNumber, day, dayNumberInWeek, dayShort, year, yearShort, month, monthShort, monthNumber,
        monthIndex,timesTamp, week
    }

}
