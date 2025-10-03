import ApiClient from "./axios";

export interface LoginData {
  username: string;
  password: string;
}

export class UserClient extends ApiClient {
  constructor() {
    super("/user");
  }

  async login(data: LoginData) {
    return (await this.api.post("/login", data)).data;
  }

  async getInfoByUsername() {
    return (await this.api.get("/me")).data
  }
}

export default new UserClient();
