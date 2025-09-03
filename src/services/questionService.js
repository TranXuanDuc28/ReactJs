import axios from "../axios";

const submitAssessment = (data) => {
  return axios.post("/api/submit-assessment", data);
};

const getAllQuestions = (params) => {
  // Nếu có params (ví dụ: { category_question_id: 1 }) thì truyền vào query string
  if (params && params.category_question_id) {
    return axios.get(
      `/api/category-questions/${params.category_question_id}/questions`
    );
  }
  return axios.get("/api/get_all_questions");
};

const getAllCategoryQuestions = () => {
  return axios.get("/api/category-questions");
};

const createNewCategoryQuestion = (data) => {
  return axios.post("/api/category-questions", data);
};

const getQuestionsByCategory = (categoryId) => {
  return axios.get(`/api/category-questions/${categoryId}/questions`);
};

const getAssessmentHistoryByUserId = (userId, limit) => {
  return axios.get(
    `/api/assessment-history-by-userid/${userId}?limit=${limit}`
  );
};

const getAssessmentDetailById = (id) => {
  return axios.get(`/api/assessment-detail-by-id/${id}`);
};

const createNewQuestion = (data) => {
  return axios.post("/api/create-new-question", data);
};

const editQuestion = (data) => {
  return axios.put("/api/edit-question", data);
};

const getQuestionById = (id) => {
  return axios.get(`/api/questions/${id}`);
};

const deleteQuestion = (id) => {
  return axios.delete(`/api/questions/${id}`);
};

export {
  submitAssessment,
  getAllQuestions,
  getAllCategoryQuestions,
  createNewCategoryQuestion,
  getQuestionsByCategory,
  getAssessmentHistoryByUserId,
  getAssessmentDetailById,
  createNewQuestion,
  editQuestion,
  getQuestionById,
  deleteQuestion,
};
