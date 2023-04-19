export const checkIsBookingActive = (date: Date) => {
    const cuttentDateTime = new Date()

    return cuttentDateTime <= date;

}
