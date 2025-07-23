import actionTypes from '../actions/actionTypes';

const initialState = [];

const onlineDoctorsReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.SET_ONLINE_DOCTORS:
      return action.doctors;
    default:
      return state;
  }
};

export default onlineDoctorsReducer; 