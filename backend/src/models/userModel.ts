import { InferSchemaType, model, Schema, Types } from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';

const userSchema = new Schema(
  {
    userRef: {
      type: String,
      required: [true, 'UserRef is required.'],
      unique: true,
      trim: true,
    },
    surname: {
      type: String,
      required: [true, 'Surname field is required.'],
      lowercase: true,
      trim: true,
    },
    otherNames: {
      type: String,
      required: [true, 'Other names field is required.'],
      lowercase: true,
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email field is required.'],
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, 'Email must be a valid email address.'],
      trim: true,
    },
    emailVerificationToken: String,
    isVerified: {
      type: Boolean,
      required: true,
      default: false,
    },
    verificationDate: Date,
    password: {
      type: String,
      required: [true, 'Password field is required.'],
      minlength: [8, 'Password must be at least 8 characters long.'],
      select: false,
    },
    confirmPassword: {
      type: String,
      required: [true, 'Confirm password field is required.'],
      validate: {
        validator: function (this: any, inputPassword: string) {
          return this.password === inputPassword;
        },
        message: 'Password and confirm password must match.',
      },
      select: false,
    },
    passwordResetToken: String,
    passwordResetExpires: Date,
    passwordChangedAt: Date,
    photo: String,
    photoPublicId: String,
    phone: String,

    role: {
      type: String,
      enum: {
        values: ['user', 'admin', 'super-admin'],
        message: 'Invalid role values.',
      },
      default: 'user',
    },
    personalWallet: {
      type: Number,
      default: 0,
    },
    inflow: {
      type: Number,
      default: 0,
    },
    outflow: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      required: true,
      default: true,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

// hash password pre save middleware
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;

  this.password = await bcrypt.hash(this.password, 12);
  this.confirmPassword = '';
});

userSchema.methods.correctPassword = async function (
  inputtedPassword: string,
  savedPassword: string
) {
  return bcrypt.compare(inputtedPassword, savedPassword);
};

userSchema.methods.detectPasswordChange = async function (timeStamp: number) {
  if (this.passwordChangedAt) {
    const changedTime = parseInt(
      `${this.passwordChangedAt.getTime() / 1000}`,
      10
    );

    return changedTime > timeStamp;
  }
  return false;
};

export type IUser = InferSchemaType<typeof userSchema> & {
  _id: Types.ObjectId;
  correctPassword: (
    inputtedPassword: string,
    savedPassword: string
  ) => Promise<Boolean>;
  detectPasswordChange: (timeStamp: number) => Promise<Boolean>;
};

export default model<IUser>('User', userSchema);
