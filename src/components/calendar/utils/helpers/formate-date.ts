import {CreateDate} from './create-date';


export const FormateDate = (date:Date, format: string) => {
    const d = CreateDate({date})

    return format
        .replace(/\bYYYY\b/, d.year.toString())
        .replace(/\bMM\b/, d.monthNumber.toString().padStart(2,'0'))
        .replace(/\bDD\b/, d.dayNumber.toString().padStart(2,'0'))
}
