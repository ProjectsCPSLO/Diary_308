import { Schema, model } from 'mongoose';

const PostSchema = new Schema(
  {
    date: {
      type: Date,
      required: true,
      default: Date.now,
    },
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    user_id: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    mood: {
      type: String,
      required: false,
      enum: ['Happy', 'Sad', 'Excited', 'Anxious', 'Neutral'],
      default: 'Neutral',
    },
    password: {
      type: String, // Add password field
      required: false,
      default: null, // Default value for new documents
    },
    sharedWith: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    tags: {
      type: [String],
      default: [],
    },
  },
  {
    collection: 'posts',
    timestamps: true,
  }
);

export default model('Post', PostSchema);
