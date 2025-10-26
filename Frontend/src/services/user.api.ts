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

  async verifyToken(token: string){
    return (await this.api.get("/verify-token", { params: { token } })).data;
  }

  async resetPassword(token: string, newPassword: string){
    return (await this.api.post("/reset-password", { token, newPassword })).data;
  }
}

export default new UserClient();
