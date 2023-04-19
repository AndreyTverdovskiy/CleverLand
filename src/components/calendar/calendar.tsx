import {Fragment, useState} from 'react';

import {UseCalendar} from './hooks/use-calendar';
import {CheckDateIsEqual, CheckIsToday} from './utils/helpers';
import {CheckIsTomorrow} from './utils/helpers/check-is-tomorrow';
import {CheckIsWeekend} from './utils/helpers/check-is-weekend';

import s from './calendar.module.scss'

type CalendarPT = {
    locale?: string,
    selectedDate?: Date,
    selectDate: (date: Date) => void,
    firstWeekDay?: number,
}

export const Calendar = ({locale = 'default',
                             firstWeekDay = 2,
                             selectedDate: date,
                             selectDate
}: CalendarPT) => {
    const {state, functions} = UseCalendar({firstWeekDay, locale, selectedDate: date})

    const [currentMode, setCurrentMode] = useState(state.mode)

    const onDropDownClick = () => {
        if (currentMode === 'days') {
            functions.setMode('months')
            setCurrentMode('months')
        } else {
            functions.setMode('days')
            setCurrentMode('days')
        }
    }

    const selectMonth = (monthIndex:number) => {
        functions.setMode('days')
        setCurrentMode('days')
        functions.setSelectedMonthByIndex(monthIndex)
    }

    return (
        <div className={s.calendar} data-test-id='calendar'>
            <div className={s.calendar_header}>
                <div className={s.calendar_header_block} data-test-id='month-select'  aria-hidden='true' onClick={onDropDownClick}>
                    {
                        `${state.monthsNames[state.selectedMonth.monthIndex].month}  ${state.selectedYear}`
                    }

                    <div className={currentMode === 'days'
                        ? s.calendar_header_block_arrow_down
                        : s.calendar_header_block_arrow_up}
                    />
                </div>

                <div className={s.calendar_header_arrow}>
                    <div aria-hidden='true' data-test-id='button-prev-month'   className={s.calendar_header_arrow_up}
                         onClick={() => functions.onClickArrow('up')}/>
                    <div aria-hidden='true' data-test-id='button-next-month'  className={s.calendar_header_arrow_down}
                         onClick={() => functions.onClickArrow('down')}/>
                </div>

            </div>


            <div className={s.calendar_body}>
                {state.mode === 'days' && (
                    <Fragment>
                        <div className={s.calendar_week_names}>
                            {state.weekDaysNames.map((weekDaysName) => (
                                <div key={weekDaysName.dayShort}>
                                    {weekDaysName.dayShort}
                                </div>
                            ))}
                        </div>
                        <div className={s.calendar_days}>
                            {
                                state.calendarDays.map((day) => {
                                    const isToday = CheckIsToday(day.date)
                                    const isTomorrow = CheckIsTomorrow(day.date)
                                    const isWeekend = CheckIsWeekend(day.date)
                                    const isSelectedDay = date ? CheckDateIsEqual(day.date, date ) : false
                                    const isAdditionalDay = day.monthIndex !== new Date().getMonth()


                                    return (
                                        <button
                                            key={`${day.dayNumber} - ${day.monthIndex}`}
                                            type='button'
                                            data-test-id='day-button'
                                            onClick={() => {
                                                functions.setSelectedDate(day)
                                                selectDate(day.date)}
                                            }
                                            disabled={ isToday ? false : !isTomorrow }
                                            className={`
                                        ${s.calendar_day}
                                        ${isToday ? s.calendar_today_item : ''}
                                        ${isTomorrow ? s.calendar_tomorrow : ''}
                                        ${isSelectedDay ? s.calendar_selected_item : ''}
                                        ${isAdditionalDay ? s.calendar_additional_day : ''}
                                        ${isWeekend && isWeekend !== isAdditionalDay ? s.calendar_weekend: ''}
                                        ${isWeekend && isWeekend === isToday ? s.calendar_weekend_today: ''}
                                        `}
                                        >
                                            {day.dayNumber}
                                        </button>
                                    )
                                })
                            }


                        </div>
                    </Fragment>
                )}

                {
                    state.mode === 'months' && (
                        <div className={s.calendar_pick_item_container}>
                            {
                                state.monthsNames.map(monthsName => {

                                    const isCurrentMonth =
                                        new Date().getMonth() === monthsName.monthIndex &&
                                        new Date().getFullYear() === state.selectedYear
                                    const isSelectedMonth = monthsName.monthIndex === state.selectedMonth.monthIndex

                                    return <div aria-hidden='true'
                                                onClick={() => selectMonth(monthsName.monthIndex)}
                                                className={`
                                    ${s.calendar_pick_item}
                                    ${isCurrentMonth ? s.calendar_today_item : ''}
                                    ${isSelectedMonth ? s.calendar_selected_item : ''}

                                    `}>
                                        {monthsName.monthShort}
                                    </div>
                                })
                            }
                        </div>
                    )
                }
            </div>


        </div>
    )
}
