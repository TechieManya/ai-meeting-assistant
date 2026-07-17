import axios from "axios";

const BASE_URL = "http://localhost:8000";

export const transcribeAudio = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  const response = await axios.post(
    `${BASE_URL}/api/v1/transcribe`,
    formData,
    { headers: { "Content-Type": "multipart/form-data" } }
  );
  return response.data;
};

export const joinMeeting = async (meetingUrl) => {
  const response = await axios.post(
    `${BASE_URL}/api/v1/meeting/join`,
    { meeting_url: meetingUrl }
  );
  return response.data;
};

export const getTranscriptStatus = async (botId) => {
  const response = await axios.get(
    `${BASE_URL}/api/v1/meeting/transcript/${botId}`
  );
  return response.data;
};

export const generateSummary = async (botId) => {
  const response = await axios.post(
    `${BASE_URL}/api/v1/summary/${botId}`
  );
  return response.data;
};

export const getSummary = async (botId) => {
  const response = await axios.get(
    `${BASE_URL}/api/v1/summary/${botId}`
  );
  return response.data;
};