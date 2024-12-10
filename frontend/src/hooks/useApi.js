import { useState } from "react";
import axios from "axios";

const useApi = (baseUrl) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const callApi = async (endpoint, method = "GET", body = null) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios({
        url: `${baseUrl}${endpoint}`,
        method,
        data: body,
        headers: { "Content-Type": "application/json" },
      });
      setData(response.data);
      return response.data;
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, callApi };
};

export default useApi;
