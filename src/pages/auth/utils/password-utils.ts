export const passwordUtils = (str: string) => {
    const comparePassword: string[] = []

    if (str?.length >= 8) {
        comparePassword.push('lengthComplete')
    }
    if (str?.match('^(?=.*[A-ZА-Я]).+$')) {
        comparePassword.push('upperCaseComplete')
    }
    if (str?.match('\\d+')) {
        comparePassword.push('numberComplete')
    }

    return comparePassword.sort((a, b) => +b - +a)
}




