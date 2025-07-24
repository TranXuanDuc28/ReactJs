import actionTypes from './actionTypes';

export const setChatMessages = (messages) => ({
  type: actionTypes.SET_CHAT_MESSAGES,
  payload: messages,
});

export const addChatMessage = (message) => ({
  type: actionTypes.ADD_CHAT_MESSAGE,
  payload: message,
});

export const deleteChatMessage = (msgId) => ({
  type: actionTypes.DELETE_CHAT_MESSAGE,
  payload: msgId,
});

export const setChatLoading = (isLoading) => ({
  type: actionTypes.SET_CHAT_LOADING,
  payload: isLoading,
});

export const setSelectedDoctor = (doctor) => ({
  type: actionTypes.SET_SELECTED_DOCTOR,
  payload: doctor,
});

export const clearChatMessages = () => ({
  type: actionTypes.CLEAR_CHAT_MESSAGES,
}); 