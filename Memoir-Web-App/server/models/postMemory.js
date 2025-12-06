import mongoose from 'mongoose';

const postSchema = mongoose.Schema({
    title: String,
    message: String,
    creator: String,
    tags: [String],
    selectedFile: String,
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    likeCount: {
        type: Number,
        default: 0,
    },
    comments: [
        {
            username: String,
            userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
            content: String,
            createdAt: { type: Date, default: new Date() }
        }
    ],
    createdAt: {
        type: Date,
        default: new Date(),
    },
})

var PostMessage = mongoose.model('PostMessage', postSchema);

export default PostMessage;