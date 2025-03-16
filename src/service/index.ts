import axios from "axios";

const client = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_HOST,
  headers: {
    "Content-Type": "application/json",
    Authorization: 'Bearer ' + process.env.NEXT_PUBLIC_ACCESS_TOKEN,
    'X-GitHub-Api-Version': '2022-11-28'
  },
});

client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      return Promise.reject(error);
    }
    return Promise.reject(error);
  }
);

export default client;
