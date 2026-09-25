import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IAcademicCycle extends Document {
  name: string;       // مثال: الدورة الأولى 2026-2027
  year: number;
  startDate: Date;
  endDate: Date;
  isCurrent: boolean;
  isActive: boolean;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

const AcademicCycleSchema = new Schema<IAcademicCycle>(
  {
    name: { type: String, required: true, trim: true },
    year: { type: Number, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    isCurrent: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    description: { type: String },
  },
  { timestamps: true }
);

const AcademicCycle: Model<IAcademicCycle> =
  mongoose.models.AcademicCycle || mongoose.model<IAcademicCycle>('AcademicCycle', AcademicCycleSchema);

export default AcademicCycle;
