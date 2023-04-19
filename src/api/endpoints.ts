export const Endpoints = {
    Auth: {
        Me : '/api/users/me',
        Login: '/api/auth/local',
        Registration: '/api/auth/local/register',
        ForgotPassword: '/api/auth/forgot-password',
        ResetPassword: '/api/auth/reset-password',
    },
    Category: {
        Categories: '/api/categories',
    },
    Books: {
        Books:'/api/books',
        Book:'/api/books/',
        CreateComment:'/api/comments',
        EditComment:'/api/comments/',
        Booking:'/api/bookings',
        EditBooking:'/api/bookings/',
    },
    Profile: {
        UploadPhoto:'/api/upload',
        UpdatePhoto:'/api/users/',
        UpdateInfo:'/api/users/',
    },
}
