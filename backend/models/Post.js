// models/Post.js
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
      type: String,
      required: false,
      default: null,
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
    // NEW: location field
    location: {
      lat: { type: Number },
      lng: { type: Number },
    },
  },
  {
    collection: 'posts',
    timestamps: true,
  }
);

export default model('Post', PostSchema);
