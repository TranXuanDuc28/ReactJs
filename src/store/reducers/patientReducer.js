import actionTypes from '../actions/actionTypes';

const initialState = {
    isLoggedInPatient: false,
    patientInfo: null
}

const patientReducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.PATIENT_LOGIN_SUCCESS:
            return {
                ...state,
                isLoggedInPatient: true,
                patientInfo: action.patientInfo
            }
        case actionTypes.PATIENT_LOGIN_FAIL:
            return {
                ...state,
                isLoggedInPatient: false,
                patientInfo: null
            }
        case actionTypes.PATIENT_LOGOUT:
            return {
                ...state,
                isLoggedInPatient: false,
                patientInfo: null
            }
        default:
            return state;
    }
}

export default patientReducer;