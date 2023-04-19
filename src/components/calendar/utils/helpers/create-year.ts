import {CreateDate} from './create-date';
import {CreateMonth} from './create-month';


type CreateYearPT = {
    locale?: string,
    year?:number,
    monthNumber:number,
}

export const CreateYear = (params?:CreateYearPT) => {
    const locale = params?.locale ?? 'default'

    const monthCount = 12
    const today = CreateDate()

    const year = params?.year ?? today.year
    const monthNumber = params?.monthNumber ?? today.monthNumber

    const month = CreateMonth({date: new Date(year, monthNumber - 1), locale})

    const getMonthDays = (monthIndex: number) =>
        CreateMonth({date: new Date(year, monthIndex), locale}).createMonthDays()

    const createYearMonths = () => {
        const months = []

        for(let i = 0; i <= monthCount - 1; i+=1){
            months[i] = getMonthDays(i)
        }

        return months

    }

    return {
        createYearMonths,
        month,
        year,

    }
}
