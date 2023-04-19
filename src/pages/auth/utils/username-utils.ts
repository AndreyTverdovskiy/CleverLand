export const usernameUtils = (str: string) => {
    // Пустой
    if (str === '') {
        return 'emptyField'
    }
    // Только латинские
    if (str?.match('^[a-zA-Z]+$')) {
        return 'letterField'
    }
    // Только цифры
    if (str?.match('^[0-9]+$')) {
        return 'numberField'
    }
    // Нет ошибок
    if (str?.match('^[a-zA-Z0-9]+$')) {
        return 'emptyField'
    }

    // Русские буквы
    if (str?.match('^[а-яА-Я]+$')) {
        return 'AllField'
    }

    // Есть цифры и русские
    if (str?.match('^[а-яА-Я0-9]+$')) {
        return 'numberField'
    }

    // Есть цифры и русские и английские
    if (str?.match('^[a-zA-Zа-яА-Я0-9]+$')) {
        return 'numberField'
    }

    return 'error'
}
