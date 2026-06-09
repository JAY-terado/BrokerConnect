import axios from "axios";
import secureStorage from "./src/components/helper/secureStorage";
import toast from "react-hot-toast";
import Cookies from "js-cookie";

const baseUrl = process.env.NEXT_PUBLIC_API_URL;

const axiosClient = axios.create({
  baseURL: baseUrl,
});

const redirectToLogin = () => {
  if (typeof window !== "undefined") {
    Cookies.remove("token");
    Cookies.remove("userToken");
    secureStorage.removeItem("type");
    window.location.replace("/login");
  }
};

// ✅ REQUEST
axiosClient.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = Cookies.get("token");
      if (token) {
        config.headers.Authorization = token;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ RESPONSE
axiosClient.interceptors.response.use(
  (response) => {
    // Case 1: Backend uses errCode pattern
    if (
      response.data?.isLoggedOut === true ||
      (response.data?.errCode === 1 &&
        (
          response.data?.errMsg?.includes("Session not found") ||
          response.data?.errMsg?.includes("Session Timeout") ||
          response.data?.errMsg?.includes("Invalid Token")
        ))
    ) {
      toast.error("Session timeout, redirecting to login page", {
        id: "session-timeout",
      });
      redirectToLogin();
      return Promise.reject(new Error(response.data.errMsg || "Session expired"));
    }

    return response;
  },
  (error) => {
    // Case 2: HTTP status based auth failure
    const status = error?.response?.status;

    if (status === 401 || status === 403 || status === 419) {
      toast.error("Session timeout, redirecting to login page", {
        id: "session-timeout",
      });
      redirectToLogin();
    }

    return Promise.reject(error);
  }
);

export default axiosClient;
