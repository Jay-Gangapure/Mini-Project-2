import axios from "axios";

const BASE_URL = "http://127.0.0.1:8000";

// ---------------- AXIOS INSTANCE ---------------- //
const API = axios.create({
  baseURL: BASE_URL,
});

// ---------------- TOKEN HELPER ---------------- //
export const getToken = () => {
  return localStorage.getItem("token");
};

// ---------------- AUTO ATTACH TOKEN ---------------- //
API.interceptors.request.use((config) => {
  const token = getToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// ---------------- LOGIN ---------------- //
export const loginUser = async (email: string, password: string) => {
  try {
    console.log("Calling Login API...");

    const res = await API.post("/auth/login", {
      email,
      password,
    });

    console.log("Login Response:", res.data);

    // SAVE TOKEN
    if (res.data.access_token) {
      localStorage.setItem("token", res.data.access_token);

      console.log("TOKEN SAVED SUCCESSFULLY");
    }

    return res.data;

  } catch (error: any) {
    console.log("LOGIN ERROR:", error);

    return {
      success: false,
      message:
        error.response?.data?.detail || "Login failed",
    };
  }
  
};

// ---------------- SIGNUP ---------------- //
export const signupUser = async (data: any) => {
  try {
    const res = await API.post("/auth/signup", data);

    return res.data;

  } catch (error: any) {
    return {
      success: false,
      message:
        error.response?.data?.detail || "Signup failed",
    };
  }
};

// ---------------- DOCUMENT UPLOAD ---------------- //
export const uploadDocument = async (file: File) => {
  try {
    const formData = new FormData();

    formData.append("file", file);

    const res = await API.post(
      "/documents/upload",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return res.data;

  } catch (error: any) {
    console.log("UPLOAD ERROR:", error);

    return {
      success: false,
      message:
        error.response?.data?.detail ||
        "Document upload failed",
    };
  }
};

// ---------------- AI INTERPRET ---------------- //
export const interpretText = async (text: string) => {
  try {
    const res = await API.post("/ai/interpret", {
      text,
    });

    return res.data;

  } catch (error: any) {
    return {
      success: false,
      message:
        error.response?.data?.detail ||
        "AI interpretation failed",
    };
  }
};

// ---------------- GET DIRECTORY ---------------- //
export const getDirectory = async () => {
  try {
    const res = await API.get("/directory");

    return res.data;

  } catch (error: any) {
    return {
      success: false,
      message:
        error.response?.data?.detail ||
        "Failed to fetch directory",
    };
  }
};