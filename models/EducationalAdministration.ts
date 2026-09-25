import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IEducationalAdministration extends Document {
  name: string;
  code: string;
  regionId: mongoose.Types.ObjectId;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const EducationalAdministrationSchema = new Schema<IEducationalAdministration>(
  {
    name: { type: String, required: true, trim: true },
    code: { type: String, required: true, unique: true, trim: true, index: true },
    regionId: { type: Schema.Types.ObjectId, ref: 'Region', required: true, index: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const EducationalAdministration: Model<IEducationalAdministration> =
  mongoose.models.EducationalAdministration ||
  mongoose.model<IEducationalAdministration>('EducationalAdministration', EducationalAdministrationSchema);

export default EducationalAdministration;
