import {useMemo, useState} from 'react';

import {
    CreateDate,
    CreateMonth,
    GetMonthNumberOfDays,
    GetMonthsNames,
    GetWeekDaysNames
} from '../utils/helpers';


type UseCalendarPT = {
    locale?: string,
    selectedDate?: Date | undefined
    firstWeekDay: number,
}

const getYearsInterval = (year: number) => {
    const startYear = Math.floor(year / 10) * 10

    return [...Array(10)].map((_, i) => startYear + i)
}


export const UseCalendar = ({
                                firstWeekDay,
                                locale = 'default',
                                selectedDate: date

                            }: UseCalendarPT) => {

    const [mode, setMode] = useState<'days' | 'months'>('days')
    const [selectedDate, setSelectedDate] = useState(CreateDate({date}))
    const [selectedMonth, setSelectedMonth] = useState(
        CreateMonth({date: new Date(selectedDate.year, selectedDate.monthIndex), locale})
    )

    const [selectedYear, setSelectedYear] = useState(selectedDate.year)
    // Выбор интервала по годам
    const [selectedYearInterval, setSelectedYearInterval] = useState(getYearsInterval(selectedDate.year))

    const monthsNames = useMemo(() => GetMonthsNames(locale), [locale])
    const weekDaysNames = useMemo(() => GetWeekDaysNames(firstWeekDay, locale), [firstWeekDay, locale])

    const days = useMemo(() => selectedMonth.createMonthDays(),
        [
            selectedMonth,
            // selectedYear
        ])


    const calendarDays = useMemo(() => {
        const monthNumberOfDays = GetMonthNumberOfDays(selectedMonth.monthIndex, selectedYear)

        const prevMonthDays = CreateMonth({
            date: new Date(selectedYear, selectedMonth.monthIndex - 1),
            locale
        }).createMonthDays()

        const nextMonthDays = CreateMonth({
            date: new Date(selectedYear, selectedMonth.monthIndex + 1),
            locale
        }).createMonthDays()

        const firstDay = days[0]
        const lastDay = days[monthNumberOfDays - 1]

        const shiftIndex = firstWeekDay - 1

        const numberOfPrevDays = firstDay.dayNumberInWeek - 1 - shiftIndex < 0
            ? 7 - (firstWeekDay - firstDay.dayNumberInWeek)
            : firstDay.dayNumberInWeek - 1 - shiftIndex


        const numberOfNextDays = 7 - lastDay.dayNumberInWeek + shiftIndex > 6
            ? 7 - lastDay.dayNumberInWeek - (7 - shiftIndex)
            : 7 - lastDay.dayNumberInWeek + shiftIndex

        const totalCalendarDays = days.length + numberOfNextDays + numberOfPrevDays

        const result = []

        for (let i = 0; i < numberOfPrevDays; i += 1) {
            const inverted = numberOfPrevDays - i

            result[i] = prevMonthDays[prevMonthDays.length - inverted]
        }

        for (let i = numberOfPrevDays; i < totalCalendarDays - numberOfNextDays; i += 1) {
            result[i] = days[i - numberOfPrevDays]
        }

        for (let i = totalCalendarDays - numberOfNextDays; i < totalCalendarDays; i += 1) {
            result[i] = nextMonthDays[i - totalCalendarDays + numberOfNextDays]
        }

        return result

    }, [selectedYear, selectedMonth.monthIndex, locale, days, firstWeekDay])



    // selectedYear

    // eslint-disable-next-line consistent-return
    const onClickArrow = (direction: 'up' | 'down') => {
        if (mode === 'days'){
            const monthIndex =
                direction === 'up' ? selectedMonth.monthIndex - 1 : selectedMonth.monthIndex + 1

            if(monthIndex === -1) {
                const year = selectedYear -1

                setSelectedYear(year)
                if(!selectedYearInterval.includes(year)) setSelectedYearInterval(getYearsInterval(year))

                return setSelectedMonth(CreateMonth({date: new Date(year, 11), locale}))
            }


            if(monthIndex === 12){
                const year = selectedYear + 1

                setSelectedYear(year)
                if(!selectedYearInterval.includes(year)) setSelectedYearInterval(getYearsInterval(year))

                return setSelectedMonth(CreateMonth({date: new Date(year, 0), locale}))
            }

            setSelectedMonth(CreateMonth({date: new Date(selectedYear, monthIndex), locale}))

        }
    }

    const setSelectedMonthByIndex = (monthIndex: number) => {
        setSelectedMonth(CreateMonth({date: new Date(selectedYear, monthIndex), locale}))
    }


    return {
        state: {
            mode,
            calendarDays,
            weekDaysNames,
            monthsNames,
            selectedDate,
            selectedMonth,
            selectedYear,
            selectedYearInterval,
        },
        functions: {
            setMode,
            setSelectedDate,
            onClickArrow,
            setSelectedMonthByIndex,
        }
    }
}
