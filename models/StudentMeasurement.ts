import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IStudentMeasurement extends Document {
  studentId: mongoose.Types.ObjectId;
  studentCode: string;
  instituteId: mongoose.Types.ObjectId;
  academicCycleId: mongoose.Types.ObjectId;
  measurementDate: Date;
  measurementType: 'قبلي' | 'بيني' | 'بعدي';
  testName: string;
  rawResult: number;
  unit?: string;
  standardScore?: number;       // الدرجة المعيارية (if standards are defined)
  performanceLevel?: string;    // مستوى الأداء
  notes?: string;
  recordedBy: mongoose.Types.ObjectId;
  isApproved: boolean;
  approvedBy?: mongoose.Types.ObjectId;
  approvedAt?: Date;
  importJobId?: string;         // إذا أُدخل عبر استيراد جماعي
  createdAt: Date;
  updatedAt: Date;
}

const StudentMeasurementSchema = new Schema<IStudentMeasurement>(
  {
    studentId: { type: Schema.Types.ObjectId, ref: 'Student', required: true, index: true },
    studentCode: { type: String, required: true, index: true },
    instituteId: { type: Schema.Types.ObjectId, ref: 'Institute', required: true, index: true },
    academicCycleId: { type: Schema.Types.ObjectId, ref: 'AcademicCycle', required: true, index: true },
    measurementDate: { type: Date, required: true },
    measurementType: {
      type: String,
      enum: ['قبلي', 'بيني', 'بعدي'],
      required: true,
    },
    testName: { type: String, required: true },
    rawResult: { type: Number, required: true },
    unit: String,
    standardScore: Number,
    performanceLevel: String,
    notes: String,
    recordedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    isApproved: { type: Boolean, default: false },
    approvedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    approvedAt: Date,
    importJobId: String,
  },
  { timestamps: true }
);

// Prevent duplicate measurements for same student/cycle/type/test
StudentMeasurementSchema.index(
  { studentId: 1, academicCycleId: 1, measurementType: 1, testName: 1 },
  { unique: true }
);

const StudentMeasurement: Model<IStudentMeasurement> =
  mongoose.models.StudentMeasurement ||
  mongoose.model<IStudentMeasurement>('StudentMeasurement', StudentMeasurementSchema);

export default StudentMeasurement;
