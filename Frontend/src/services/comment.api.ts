import ApiClient from "./axios";

class CommentApi extends ApiClient {
  constructor() {
    super("/comment");
  }
}

export default new CommentApi();