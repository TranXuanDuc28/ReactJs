import axios from "../axios";

const handleLoginApi = (email, password) => {
  return axios.post("/api/login", { email, password });
};


const handlePatientChatLogin = (email, password) => {
  return axios.post('/api/login-patient-chat', { email, password });
};

const handleGetAllUsers = (id) => {
  return axios.get(`/api/get_all_users?id=${id}`);
};
const createNewUsersServices = (data) => {
  return axios.post("/api/create_new_users", data);
};
const deleteUsersServices = (id) => {
  return axios.delete("/api/delete_users", {
    data: {
      id,
    },
  });
};
const editUsersServices = (data) => {
  return axios.put("/api/edit_users", data);
};
const getAllCodeServices = (inputType) => {
  return axios.get(`/api/allcode?type=${inputType}`);
};

const postVerifyBookAppointment = (data) => {
  return axios.post("/api/verify-book-appointment", data);
};
const createNewSpecialty = (data) => {
  return axios.post("/api/create-new-specialty", data);
};
const getAllSpecialty = () => {
  return axios.get(`/api/get-specialty`);
};
const getAllDetailSpecialtyById = (data) => {
  return axios.get(
    `/api/get-detail-specialty-by-id?id=${data.id}&location=${data.location}`
  );
};
// Clinic related services
const createNewClinic = (data) => {
  return axios.post("/api/create-new-clinic", data);
};
const getAllClinic = () => {
  return axios.get(`/api/get-clinic`);
};
const getAllDetailClinicById = (data) => {
  return axios.get(`/api/get-detail-clinic-by-id?id=${data.id}`);
};

const getAllPatientForDoctor = (data) => {
  return axios.get(
    `/api/get-list-patient-for-doctor?doctorId=${data.doctorId}&roleId=${data.roleId}&date=${data.date}`
  );
};
const postSendRemedy = (data) => {
  return axios.post("/api/send-remedy", data);
};
const getAllMedicines = () => {
  return axios.get("/api/get-medicines");
};
const postMedicalAppointmentStatus = (data) => {
  return axios.post("/api/update-medical-appointment-status", data);
};

const postSendPayment = (data) => {
  return axios.post("/api/send-payment", data);
};

export {
  handleLoginApi,
  handleGetAllUsers,
  createNewUsersServices,
  deleteUsersServices,
  editUsersServices,
  getAllCodeServices,
  postVerifyBookAppointment,
  createNewSpecialty,
  getAllSpecialty,
  getAllDetailSpecialtyById,
  createNewClinic,
  getAllClinic,
  getAllDetailClinicById,
  getAllPatientForDoctor,
  postSendRemedy,
  getAllMedicines,
  postMedicalAppointmentStatus,
  postSendPayment,
  handlePatientChatLogin
};
