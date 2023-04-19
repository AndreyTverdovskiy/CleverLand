import axios from 'axios';

import {FormDataType} from '../components/utils/custom-input/custom-input.types';

import {Endpoints} from './endpoints';


export const baseURL = 'https://strapi.cleverland.by'

export const instance = axios.create({
    baseURL,
});

const urlsSkipAuth = [Endpoints.Auth.Login, Endpoints.Auth.Registration]

instance.interceptors.request.use(async (config) => {
    if (config.url && urlsSkipAuth.includes(config.url)) {
        return config
    }

    const accessToken = localStorage.getItem('token')

    if (accessToken) {
        // eslint-disable-next-line no-param-reassign
        config.headers.Authorization = `Bearer ${accessToken}`
    }

    return config
})


export const categoryAPI = {
    getActualCategory() {
        return instance.get(Endpoints.Category.Categories)
    }
}

export const booksAPI = {
    getBooksCatalog() {
        return instance.get(Endpoints.Books.Books)
    },
    getBookInfo(id: number) {
        return instance.get(`${Endpoints.Books.Book}${id}`)
    },
    createComment(rating: number, text: string,bookId:string, userId: string){
        return instance.post(Endpoints.Books.CreateComment, {
            data:{
                rating,
                text,
                book: bookId,
                user:userId,
            }
        })
    },
    editComment(commentId:number, rating: number, text: string,bookId:string, userId: string){
        return instance.put(`${Endpoints.Books.EditComment}${commentId}`, {
            data:{
                rating,
                text,
                book: bookId,
                user:userId,
            }
        })

    },
    booking(dateOrder:string, bookId:string, customerId:string) {
        return instance.post(Endpoints.Books.Booking, {
            data:{
                order: true,
                dateOrder,
                book:bookId,
                customer: customerId
            }
        })
    },
    editBooking(bookingId:string, dateOrder: string, bookId: string, customerId: string) {
        return instance.put(`${Endpoints.Books.EditBooking}${bookingId}`, {
            data:{
                order: true,
                dateOrder,
                book:bookId,
                customer: customerId
            }
        })
    },
    removeBooking(bookingId:string) {
        return instance.delete(`${Endpoints.Books.EditBooking}${bookingId}`)
    }
}

export const AuthAPI = {
    me() {
        return instance.get(Endpoints.Auth.Me)
    },
    registration(data: FormDataType) {
        return instance.post(Endpoints.Auth.Registration, {
            email: data.email,
            username: data.username,
            password: data.password,
            firstName: data.firstName,
            lastName: data.lastName,
            phone: data.phone,
        })
    },
    login(data: FormDataType) {
        return instance.post(Endpoints.Auth.Login, {
            identifier: data.identifier,
            password: data.password,
        })
    },
    forgotPassword(data: FormDataType) {
        return instance.post(Endpoints.Auth.ForgotPassword, {
            email: data.email,
        })
    },
    resetPassword(data:FormDataType, code:string) {
        return instance.post(Endpoints.Auth.ResetPassword, {
            password: data.password,
            passwordConfirmation: data.passwordConfirmation,
            code
        })
    }
}

export const ProfileApi = {
    uploadPhoto (data:object){
        return instance.post(Endpoints.Profile.UploadPhoto, data)
    },
    updatePhoto (userId: number,id:number){
        return instance.put(`${Endpoints.Profile.UpdatePhoto}${userId}`, {
            avatar: id
        })
    },
    updateInfo (
        userId:number, username:string,
        email:string, password:string,
        firstName?:string,lastName?:string,
        phone?:string) {
        return instance.put(`${Endpoints.Profile.UpdateInfo}${userId}`, {
            username,
            email,
            password,
            firstName,
            lastName,
            phone,
        })
    }
}


