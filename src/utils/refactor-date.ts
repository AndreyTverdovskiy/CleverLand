 export const RefactorDate = (date: string) => {
    const date2 = new Date(date);
    const day = new Intl.DateTimeFormat('ru', {day: '2-digit'}).format(date2);
    const month = new Intl.DateTimeFormat('ru', {month: '2-digit'}).format(date2);

    return (`${day}.${month}`)
}