import actionTypes from '../actions/actionTypes';

const initialState = {
   genders: [],
   roles: [],
   positions: [],
   listUser: [],
   listDoctor: [],
   listAllDoctor: [],
   inforDoctorById: [],
   listScheduleTime: [],
   isLoading: false,
   listAllRequireDoctorInfor: []
}

const adminReducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.FETCH_GENDER_START:
            let coppyState = {...state};
            coppyState.isLoading = true;
            return {
                ...coppyState,
            }
        case actionTypes.FETCH_GENDER_SUCCESS:
            state.genders = action.data;
            state.isLoading = false;
            return {
                ...state,
            }
        case actionTypes.FETCH_GENDER_FAILED:
            state.genders = [];
            return {
                ...state,
            }
        case actionTypes.FETCH_ROLE_SUCCESS:
            state.roles = action.data;
            state.isLoading = false;
            return {
                ...state,
            }
        case actionTypes.FETCH_ROLE_FAILED:
            state.roles = [];
            return {
                ...state,
            }
        case actionTypes.FETCH_POSITION_SUCCESS:
            state.positions = action.data;
            state.isLoading = false;
            return {
                ...state,
            }
        case actionTypes.FETCH_POSITION_FAILED:
            state.positions = [];
            return {
                ...state,
            }
        case actionTypes.CREATE_USER_SUCCESS:
        state.isLoading = false;
        return {
            ...state,
        }
        case actionTypes.CREATE_USER_FAILED:
            return {
                ...state,
            }
        case actionTypes.GET_ALL_USER_SUCCESS:
            state.listUser = action.users;
            state.isLoading = false;
            return {
                ...state,
            }
        case actionTypes.GET_ALL_USER_FAILED:
            return {
                ...state,
            }
        case actionTypes.DELETE_USER_SUCCESS:
            state.isLoading = false;
            return {
                ...state,
            }
        case actionTypes.DELETE_USER_FAILED:
            return {
                ...state,
            }
        case actionTypes.GET_TOP_DOCTOR_SUCCESS:
            state.listDoctor = action.doctorData;
            state.isLoading = false;
            return {
                ...state,
            }
        case actionTypes.GET_TOP_DOCTOR_FAILED:
            state.listDoctor = [];
            return {
                ...state,
            }
        case actionTypes.GET_ALL_DOCTOR_SUCCESS:
        state.listAllDoctor = action.allDoctorData;
        state.isLoading = false;
        return {
            ...state,
        }
        case actionTypes.GET_ALL_DOCTOR_FAILED:
            state.listAllDoctor = [];
            return {
                ...state,
            }
        case actionTypes.SAVE_INFOR_DOCTOR_SUCCESS:
            state.isLoading = false;
            return {
                ...state,
            }
        case actionTypes.SAVE_INFOR_DOCTOR_FAILED:
            return {
                ...state,
            }
        case actionTypes.GET_DOCTOR_BY_ID_SUCCESS:
            state.inforDoctorById = action.data
            state.isLoading = false;
            return {
                ...state,
            }
        case actionTypes.GET_DOCTOR_BY_ID_FAILED:
            return {
                ...state,
            }
        case actionTypes.GET_ALL_SCHEDULE_TIME_SUCCESS:
            state.listScheduleTime = action.dataTime;
            state.isLoading = false;
            return {
                ...state,
            }
        case actionTypes.GET_ALL_SCHEDULE_TIME_FAILED:
            state.listScheduleTime = [];
            return {
                ...state,
            }
        case actionTypes.FETCH_ALL_DOCTOR_INFOR_SUCCESS:
            state.listAllRequireDoctorInfor = action.data;
            state.isLoading = false;
            return {
                ...state,
            }
        case actionTypes.FETCH_ALL_DOCTOR_INFOR_FAILED:
            state.listAllRequireDoctorInfor = [];
            return {
                ...state,
            }
        default:
            return state;
    }
}

export default adminReducer;