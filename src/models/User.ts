import mongoose, { Schema, Document, Model } from 'mongoose';
import { softDeletePlugin } from './plugins/softDelete';

export interface IAddress {
  street?: string;
  streetNumber?: string;
  postalCode?: string;
  city?: string;
  province?: string;
}

export interface IUser extends Document {
  email: string;
  passwordHash: string;
  firstName?: string;
  lastName?: string;
  address: IAddress;
  role: 'user' | 'admin';
  emailVerified: boolean;
  verificationToken?: string;
  verificationTokenExpiry?: Date;
  deletedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
  softDelete: () => Promise<IUser>;
  restore: () => Promise<IUser>;
}

const AddressSchema = new Schema<IAddress>(
  {
    street: { type: String, default: '' },
    streetNumber: { type: String, default: '' },
    postalCode: { type: String, default: '' },
    city: { type: String, default: '' },
    province: { type: String, default: '' },
  },
  { _id: false }
);

const UserSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    firstName: { type: String, default: '' },
    lastName: { type: String, default: '' },
    address: { type: AddressSchema, default: () => ({}) },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    emailVerified: { type: Boolean, default: false },
    verificationToken: { type: String },
    verificationTokenExpiry: { type: Date },
  },
  { timestamps: true }
);

UserSchema.plugin(softDeletePlugin);

UserSchema.index({ verificationToken: 1 });

const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;
