import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IStudent extends Document {
  studentCode: string;    // كود الطالب الداخلي
  instituteId: mongoose.Types.ObjectId;
  name?: string;          // اختياري لخصوصية البيانات
  grade: string;          // الصف
  gender: 'ذكر' | 'أنثى';
  birthDate?: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const StudentSchema = new Schema<IStudent>(
  {
    studentCode: { type: String, required: true, unique: true, index: true },
    instituteId: { type: Schema.Types.ObjectId, ref: 'Institute', required: true, index: true },
    name: { type: String },
    grade: { type: String, required: true },
    gender: { type: String, enum: ['ذكر', 'أنثى'], required: true },
    birthDate: Date,
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Compound index for efficient queries
StudentSchema.index({ instituteId: 1, grade: 1 });
StudentSchema.index({ instituteId: 1, gender: 1 });

const Student: Model<IStudent> = mongoose.models.Student || mongoose.model<IStudent>('Student', StudentSchema);
export default Student;
