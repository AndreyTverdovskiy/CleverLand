export enum InputType {
    Text = 'text',
    Password = 'password',
    Phone = 'phone',
    Email = 'email',
}

export enum InputId {
    Username = 'username',
    Identifier = 'identifier',
    Email = 'email',
    Password = 'password',
    FirstName = 'firstName',
    LastName = 'lastName',
    Phone = 'phone',
    NewPassword = 'newPassword',
    PasswordConfirmation = 'passwordConfirmation',
}

export enum InputPlaceholder {
    CreateLogin = 'Придумайте логин для входа',
    Login = 'Логин',
    Password = 'Пароль',
    FirstName = 'Имя',
    LastName = 'Фамилия',
    Email = 'E-mail',
    Phone = 'Номер телефона',
    // NewPassword = 'Новый пароль',
    PasswordConfirmation = 'Повторите пароль',
}

export enum InputMessage {
    EmptyValue = 'Поле не может быть пустым',
    CreateUserName = 'Используйте для логина латинский алфавит и цифры',
    Password = 'Пароль не менее 8 символов, с заглавной буквой и цифрой',
    PasswordConfirmation = 'Пароли не совпадают',
    Phone = 'В формате +375 (xx) xxx-xx-xx',
    Email = 'Введите корректный e-mail',
    PasswordRecovery = 'На это email  будет отправлено письмо с инструкциями по восстановлению пароля',
    LoginError = 'Неверный логин или пароль!'
}

export type FormDataType = {
    username: string;
    login:string;
    identifier: string,
    password: string;
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
    // newPassword: string,
    passwordConfirmation: string,
};

export type FormValues = {
    username: 'username',
    login:'login',
    password: 'password';
    identifier: 'identifier';
    firstName: 'firstName';
    lastName: 'lastName';
    email: 'email';
    phone: 'phone';
    // newPassword: 'newPassword'
    passwordConfirmation: 'passwordConfirmation'
};
