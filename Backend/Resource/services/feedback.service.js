const FeedbackModel = require("../models/feedback.model")

class FeedbackService {
    async createComment(data) {
        const comment = await FeedbackModel.create(data)
        return comment
    }

    async getAllComment() {
        const comments = await FeedbackModel.findAll()

        return comments
    }
}

module.exports = new FeedbackService();
