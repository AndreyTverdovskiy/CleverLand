import {Action, applyMiddleware, combineReducers, createStore} from 'redux';
import thunkMiddleware, {ThunkDispatch} from 'redux-thunk';

import {appReducer} from './app-reducer';
import {authReducer} from './auth-reducer';
import {bookReducer} from './book-reducer';
import {catalogReducer} from './catalog-reducer';
import {categoryReducer} from './category-reducer';
import {profileReducer} from './profile-reducer';
import {sortReducer} from './sort-reducer';


const rootReducer = combineReducers({
    appData:appReducer,
    catalogData: catalogReducer,
    categoryData: categoryReducer,
    bookData: bookReducer,
    sortData: sortReducer,
    authData:authReducer,
    profileData: profileReducer,
})

export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = ThunkDispatch<RootState, void, Action>;


 export const store = createStore(rootReducer, applyMiddleware(thunkMiddleware));




