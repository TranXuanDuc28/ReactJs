import actionTypes from '../actions/actionTypes';

const initialState = {
  messages: [],
  isLoading: false,
  selectedDoctor: null,
};

const chatReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.SET_CHAT_MESSAGES:
      return { ...state, messages: action.payload };
    case actionTypes.ADD_CHAT_MESSAGE:
      return { ...state, messages: [...state.messages, action.payload] };
    case actionTypes.DELETE_CHAT_MESSAGE:
      return { ...state, messages: state.messages.filter(m => m.id !== action.payload) };
    case actionTypes.SET_CHAT_LOADING:
      return { ...state, isLoading: action.payload };
    case actionTypes.SET_SELECTED_DOCTOR:
      return { ...state, selectedDoctor: action.payload };
    case actionTypes.CLEAR_CHAT_MESSAGES:
      return { ...state, messages: [] };
    default:
      return state;
  }
};

export default chatReducer; 