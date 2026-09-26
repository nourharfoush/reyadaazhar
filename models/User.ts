import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IUser extends Document {
  username: string;
  passwordHash: string;
  email?: string;
  name: string;
  role: 'institute_manager' | 'administration_supervisor' | 'region_manager' | 'general_admin' | 'system_admin';
  isActive: boolean;
  regionId?: mongoose.Types.ObjectId;
  administrationId?: mongoose.Types.ObjectId;
  instituteId?: mongoose.Types.ObjectId;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    username: { type: String, required: true, unique: true, index: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    email: { type: String, sparse: true, index: true, lowercase: true, trim: true },
    name: { type: String, required: true },
    role: {
      type: String,
      required: true,
      enum: ['institute_manager', 'administration_supervisor', 'region_manager', 'general_admin', 'system_admin'],
    },
    isActive: { type: Boolean, default: true, index: true },
    regionId: { type: Schema.Types.ObjectId, ref: 'Region', index: true },
    administrationId: { type: Schema.Types.ObjectId, ref: 'EducationalAdministration', index: true },
    instituteId: { type: Schema.Types.ObjectId, ref: 'Institute', index: true },
    lastLogin: { type: Date },
  },
  { timestamps: true }
);

const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
export default User;
