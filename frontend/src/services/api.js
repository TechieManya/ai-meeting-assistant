import axios from "axios";

const BASE_URL  = "https://conferio-backend-s38i.onrender.com"

;

const apiClient = axios.create({ baseURL: BASE_URL });

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("conferio_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("conferio_token");
      localStorage.removeItem("conferio_user");
      window.location.reload();
    }
    return Promise.reject(error);
  }
);

export const registerUser = async (email, password, name) => {
  const response = await apiClient.post("/api/v1/auth/register", { email, password, name });
  return response.data;
};

export const loginUser = async (email, password) => {
  const response = await apiClient.post("/api/v1/auth/login", { email, password });
  return response.data;
};

export const transcribeAudio = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  const response = await apiClient.post("/api/v1/transcribe", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const joinMeeting = async (meetingUrl) => {
  const response = await apiClient.post("/api/v1/meeting/join", { meeting_url: meetingUrl });
  return response.data;
};

export const getTranscriptStatus = async (botId) => {
  const response = await apiClient.get(`/api/v1/meeting/transcript/${botId}`);
  return response.data;
};

export const generateSummary = async (botId) => {
  const response = await apiClient.post(`/api/v1/summary/${botId}`);
  return response.data;
};

export const getSummary = async (botId) => {
  const response = await apiClient.get(`/api/v1/summary/${botId}`);
  return response.data;
};

export const getAllMeetings = async () => {
  const response = await apiClient.get("/api/v1/meeting/all");
  return response.data;
};

export const getFreshAudioUrl = async (botId) => {
  const response = await apiClient.get(`/api/v1/meeting/audio/${botId}`, {
    responseType: "blob",
  });

  // Handle the legacy fallback case (old meetings, pre-permanent-storage,
  // where the backend can only return a temporary Meeting BaaS link as JSON)
  if (response.headers["content-type"]?.includes("application/json")) {
    const text = await response.data.text();
    const parsed = JSON.parse(text);
    return { audio_url: parsed.legacy_redirect };
  }

  const blobUrl = URL.createObjectURL(response.data);
  return { audio_url: blobUrl };
};

export const sendMeetingReport = async (botId) => {
  const response = await apiClient.post(`/api/v1/meeting/${botId}/send-report`);
  return response.data;
};

export const getMeetingHistory = getAllMeetings;