import {CreateDate} from './create-date';


export const GetMonthsNames = (locale = 'default') => {
    const monthsNames: Array<{
        month: ReturnType<typeof CreateDate>['month']
        monthShort: ReturnType<typeof CreateDate>['monthShort']
        monthIndex: ReturnType<typeof CreateDate>['monthIndex']
        date: ReturnType<typeof CreateDate>['date']
    }> = Array.from({length: 12})

    const d = new Date()

    monthsNames.forEach((_, i) => {
        const {month, monthIndex, monthShort, date} = CreateDate({
            locale,
            date: new Date(d.getFullYear(), d.getMonth() + i, d.getDate())
        })

        monthsNames[monthIndex] = {month, monthIndex, monthShort, date}
    })

    return monthsNames
}
