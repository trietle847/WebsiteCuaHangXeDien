import ApiClient  from "./axios";

export class UserClient extends ApiClient {
  constructor() {
    super("/user");
  }

  async login(data: any) {
    try {
      return (await this.api.post("/login", data)).data;
    } catch (error) {
      throw new Error(`Failed to login: ${error}`);
    }
  }
}

export default new UserClient();
