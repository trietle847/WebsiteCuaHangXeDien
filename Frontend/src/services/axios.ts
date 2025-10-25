import axios from "axios";

const apiURL = "/api";
// Hàm tạo API client theo baseURL
const AxiosCreate = (endpoint: string) => {
  const instance = axios.create({
    baseURL: `${apiURL}${endpoint}`,
    // headers: {
    //   "Content-Type": "application/json",
    // },
  });

  // interceptor: tự gắn token
  instance.interceptors.request.use((config) => {
    const token = sessionStorage.getItem("token"); // hoặc localStorage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  return instance;
};

// Ép kiểu cho endpoint
type Endpoint = `/${string}`;

class ApiClient {
  api;
  constructor(endpoint: Endpoint) {
    this.api = AxiosCreate(endpoint);
  }

  async getAll(queryParams?: Record<string, any>) {
    try {
      return (await this.api.get("/", { params: queryParams })).data;
    } catch (error) {
      throw new Error(`Failed to fetch all: ${error}`);
    }
  }

  async getById(id: string) {
    return (await this.api.get(`/${id}`)).data;
  }

  async create(data: any) {
    return (await this.api.post("/", data)).data;
  }

  async update(id: number, data: any) {
    try {
      return (await this.api.put(`/${id}`, data)).data;
    } catch (error) {
      throw new Error(`Failed to update: ${error}`);
    }
  }

  async delete(id: number) {
    try {
      return (await this.api.delete(`/${id}`)).data;
    } catch (error) {
      throw new Error(`Failed to delete: ${error}`);
    }
  }
}

export default ApiClient;
