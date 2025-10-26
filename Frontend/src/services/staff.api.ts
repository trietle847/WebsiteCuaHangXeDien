import ApiClient from "./axios";

export interface LoginData {
  username: string;
  password: string;
}

export class StaffApi extends ApiClient {
  constructor() {
    super("/user");
  }

  async login(data: LoginData) {
    return (await this.api.post("/login", data)).data;
  }

  async getInfoByUsername() {
    return (await this.api.get("/me")).data;
  }

  async getAll(queryParams?: Record<string, any>) {
    try {
      return (await this.api.get("/staff", { params: queryParams })).data;
    } catch (error) {
      throw new Error(`Failed to fetch all: ${error}`);
    }
  }

  async create(data: any) {
    return (await this.api.post("/staff", data)).data;
  }
}

export default new StaffApi();