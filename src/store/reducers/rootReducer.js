import {combineReducers} from 'redux';
import { connectRouter } from 'connected-react-router';

import appReducer from "./appReducer";
import userReducer from "./userReducer";
import adminReducer from './adminReducer';
import patientReducer from './patientReducer';
import onlineDoctorsReducer from './onlineDoctorsReducer';
import chatReducer from './chatReducer';

import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';
import storage from 'redux-persist/lib/storage';
import { persistReducer } from 'redux-persist';

const persistCommonConfig = {
    storage: storage,
    stateReconciler: autoMergeLevel2,
};

const userPersistConfig = {
    ...persistCommonConfig,
    key: 'user',
    whitelist: ['isLoggedIn', 'userInfo']
};

const patientPersistConfig = {
    ...persistCommonConfig,
    key: 'patient',
    whitelist: ['isLoggedInPatient', 'patientInfo']
};

const appPersistConfig = {
    ...persistCommonConfig,
    key: 'app',
    whitelist: ['language']
}

export default (history) => combineReducers({
    router: connectRouter(history),
    user: persistReducer(userPersistConfig, userReducer),
    patient: persistReducer(patientPersistConfig, patientReducer),
    app: persistReducer(appPersistConfig, appReducer),
    // user: userReducer,
    admin: adminReducer,
    onlineDoctors: onlineDoctorsReducer,
    chat: chatReducer,
    // app: appReducer
})