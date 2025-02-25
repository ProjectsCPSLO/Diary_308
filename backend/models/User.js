import { Schema, model } from 'mongoose';
import bcrypt from 'bcrypt';
import validator from 'validator';
import crypto from 'crypto';

const UserSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    collaborationCode: {
      type: String,
      unique: true,
    },
    collaborators: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    sharedPosts: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Post',
      },
    ],
  },
  {
    collection: 'users',
    timestamps: true,
  }
);

const generateUniqueCode = () => {
  return crypto.randomBytes(3).toString('hex').toUpperCase();
};

UserSchema.statics.signup = async function (email, password) {
  if (!email || !password) {
    throw Error('All fields required');
  }
  if (!validator.isEmail(email)) {
    throw Error('Invalid email');
  }
  if (!validator.isStrongPassword(password)) {
    throw Error('Password not strong enough');
  }

  const exists = await this.findOne({ email });
  if (exists) {
    throw Error('Email already registered');
  }

  let collaborationCode;
  let isCodeUnique = false;

  while (!isCodeUnique) {
    collaborationCode = generateUniqueCode();
    const existingCode = await this.findOne({ collaborationCode });
    if (!existingCode) {
      isCodeUnique = true;
    }
  }

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);

  const user = await this.create({
    email,
    password: hash,
    collaborationCode,
    collaborators: [],
    sharedPosts: [],
  });

  return user;
};

UserSchema.statics.login = async function (email, password) {
  if (!email || !password) {
    throw Error('All fields required');
  }

  const user = await this.findOne({ email });
  if (!user) {
    throw Error('Email not registered');
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    throw Error('Incorrect password');
  }

  return user;
};

UserSchema.methods.addCollaborator = async function (collaborationCode) {
  if (!collaborationCode) {
    throw Error('Collaboration code required');
  }

  const collaborator = await this.model('User').findOne({ collaborationCode });
  if (!collaborator) {
    throw Error('Invalid collaboration code');
  }

  if (collaborator._id.equals(this._id)) {
    throw Error('Cannot add yourself as a collaborator');
  }

  if (this.collaborators.includes(collaborator._id)) {
    throw Error('Already a collaborator');
  }

  this.collaborators.push(collaborator._id);
  await this.save();

  return collaborator;
};

export default model('User', UserSchema);
