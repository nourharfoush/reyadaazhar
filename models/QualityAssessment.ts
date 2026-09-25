import mongoose, { Schema, Document, Model } from 'mongoose';

export type QualityScore = 1 | 2 | 3 | 4;

export interface IQualityItem {
  axis: 'التخطيط' | 'التنفيذ' | 'المشاركة' | 'جودة الأداء' | 'الأثر والنتائج';
  itemKey: string;
  itemTitle: string;
  score: QualityScore;
  notes?: string;
  evidenceUrls?: string[];
  requiresCorrectiveAction?: boolean;
  correctiveActionId?: mongoose.Types.ObjectId;
}

export interface IQualityAssessment extends Document {
  instituteId: mongoose.Types.ObjectId;
  academicCycleId: mongoose.Types.ObjectId;
  fieldVisitId?: mongoose.Types.ObjectId;
  assessorId: mongoose.Types.ObjectId;
  assessorName: string;
  assessmentDate: Date;
  items: IQualityItem[];
  totalScore?: number;
  maxScore?: number;
  overallNotes?: string;
  status: 'مسودة' | 'مكتمل';
  createdAt: Date;
  updatedAt: Date;
}

const QualityItemSchema = new Schema<IQualityItem>({
  axis: {
    type: String,
    enum: ['التخطيط', 'التنفيذ', 'المشاركة', 'جودة الأداء', 'الأثر والنتائج'],
    required: true,
  },
  itemKey: { type: String, required: true },
  itemTitle: { type: String, required: true },
  score: { type: Number, enum: [1, 2, 3, 4], required: true },
  notes: String,
  evidenceUrls: [String],
  requiresCorrectiveAction: { type: Boolean, default: false },
  correctiveActionId: { type: Schema.Types.ObjectId, ref: 'CorrectiveAction' },
});

const QualityAssessmentSchema = new Schema<IQualityAssessment>(
  {
    instituteId: { type: Schema.Types.ObjectId, ref: 'Institute', required: true, index: true },
    academicCycleId: { type: Schema.Types.ObjectId, ref: 'AcademicCycle', required: true, index: true },
    fieldVisitId: { type: Schema.Types.ObjectId, ref: 'FieldVisit' },
    assessorId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    assessorName: { type: String, required: true },
    assessmentDate: { type: Date, required: true },
    items: [QualityItemSchema],
    totalScore: Number,
    maxScore: Number,
    overallNotes: String,
    status: {
      type: String,
      enum: ['مسودة', 'مكتمل'],
      default: 'مسودة',
    },
  },
  { timestamps: true }
);

const QualityAssessment: Model<IQualityAssessment> =
  mongoose.models.QualityAssessment ||
  mongoose.model<IQualityAssessment>('QualityAssessment', QualityAssessmentSchema);

export default QualityAssessment;
