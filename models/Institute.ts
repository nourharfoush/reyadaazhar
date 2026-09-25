import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IInstitute extends Document {
  name: string;
  instituteCode: string;
  regionId: mongoose.Types.ObjectId;
  administrationId: mongoose.Types.ObjectId;
  educationalLevel: string; // ابتدائي / إعدادي / ثانوي / مشترك
  contactInfo?: {
    phone?: string;
    address?: string;
    email?: string;
  };
  projectManagerId?: mongoose.Types.ObjectId;
  targetStudents: number;
  availableEquipment?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const InstituteSchema = new Schema<IInstitute>(
  {
    name: { type: String, required: true, trim: true },
    instituteCode: { type: String, required: true, unique: true, trim: true, index: true },
    regionId: { type: Schema.Types.ObjectId, ref: 'Region', required: true, index: true },
    administrationId: { type: Schema.Types.ObjectId, ref: 'EducationalAdministration', required: true, index: true },
    educationalLevel: {
      type: String,
      required: true,
      enum: ['ابتدائي', 'إعدادي', 'ثانوي', 'مشترك'],
    },
    contactInfo: {
      phone: String,
      address: String,
      email: String,
    },
    projectManagerId: { type: Schema.Types.ObjectId, ref: 'User' },
    targetStudents: { type: Number, required: true, min: 0 },
    availableEquipment: { type: String },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Institute: Model<IInstitute> =
  mongoose.models.Institute || mongoose.model<IInstitute>('Institute', InstituteSchema);

export default Institute;
