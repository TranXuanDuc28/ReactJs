import axios from "../axios";
const getTopDoctorServices = (limit) => {
  return axios.get(`/api/top-doctor-home?limit=${limit}`);
};
const getAllDoctorServices = () => {
  return axios.get(`/api/get_all_doctor`);
};
const saveDetailInforDoctorServices = (data) => {
  return axios.post("/api/save_detail_doctor", data);
};
const getDetailDoctorByIdServices = (inputId) => {
  return axios.get(`/api/get_detail_doctor_by_id?id=${inputId}`);
};
const saveBulkScheduleDoctor = (data) => {
  return axios.post("/api/bulk_create_schedule", data);
};
const getScheduleDoctorByDate = (doctorId, date) => {
  return axios.get(
    `/api/get_schedule_doctor_by_date?doctorId=${doctorId}&date=${date}`
  );
};
const getExtraDoctorInforByIdServices = (inputId) => {
  return axios.get(`/api/get-extra-doctor-by-id?doctorId=${inputId}`);
};
const getProfileDoctorById = (inputId) => {
  return axios.get(`/api/get-profile-doctor-by-id?doctorId=${inputId}`);
};
const postPatientBookAppointment = (data) => {
  return axios.post("/api/patient-book-appointment", data);
};

export {
  getTopDoctorServices,
  getAllDoctorServices,
  saveDetailInforDoctorServices,
  getDetailDoctorByIdServices,
  saveBulkScheduleDoctor,
  getScheduleDoctorByDate,
  getExtraDoctorInforByIdServices,
  getProfileDoctorById,
  postPatientBookAppointment,
};
