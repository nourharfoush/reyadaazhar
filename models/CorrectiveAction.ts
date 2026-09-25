import mongoose, { Schema, Document, Model } from 'mongoose';

export type CAStatus =
  | 'لم يبدأ'
  | 'جارٍ التنفيذ'
  | 'تم التنفيذ'
  | 'متعثر'
  | 'متوقف'
  | 'يحتاج إلى دعم إضافي';

export type GapStatus = 'مفتوحة' | 'مغلقة جزئيًا' | 'مغلقة';

export interface ICorrectiveAction extends Document {
  referenceCode: string;   // CA-INST001-2026-0001
  instituteId: mongoose.Types.ObjectId;
  instituteCode: string;
  regionId: mongoose.Types.ObjectId;
  administrationId: mongoose.Types.ObjectId;
  academicCycleId: mongoose.Types.ObjectId;

  // Source
  sourceType: string;      // من وحدة الإجراءات التصحيحية
  sourceId?: mongoose.Types.ObjectId;   // رابط لزيارة/تقييم
  sourceItemKey?: string;
  visitDate?: Date;
  supervisorId: mongoose.Types.ObjectId;
  supervisorName: string;
  visitLevel?: string;

  // Gap analysis
  gapAxis: string;
  gapItem: string;
  gapDescription: string;
  priority: 'مرتفعة' | 'متوسطة' | 'منخفضة';
  impact: 'كبير' | 'متوسط' | 'محدود' | 'دون تأثير مباشر';
  rootCause: string;
  rootCauseAnalysis?: string;

  // Action plan
  actionDescription: string;
  actionType: string;
  responsibleEntity: string;
  responsiblePersonId?: mongoose.Types.ObjectId;
  responsiblePersonName: string;
  startDate: Date;
  targetCompletionDate: Date;

  // Implementation tracking
  implementationStatus: CAStatus;
  completionPercentage: number;   // 0-100
  lastUpdatedAt?: Date;
  completedOnTime?: boolean;
  implementationNotes?: string;
  evidenceUrls?: string[];

  // Re-monitoring
  reMonitoringDone: boolean;
  reMonitoringDate?: Date;
  reMonitoringResult?: string;
  indicatorBefore?: number;
  indicatorAfter?: number;
  reMonitoringDescription?: string;
  actionEffectiveness?: 1 | 2 | 3 | 4;

  // Gap closure
  gapStatus: GapStatus;
  closedAt?: Date;
  closedBy?: mongoose.Types.ObjectId;
  closureReason?: string;

  // Chain
  parentActionId?: mongoose.Types.ObjectId;

  createdAt: Date;
  updatedAt: Date;
}

const CorrectiveActionSchema = new Schema<ICorrectiveAction>(
  {
    referenceCode: { type: String, required: true, unique: true, index: true },
    instituteId: { type: Schema.Types.ObjectId, ref: 'Institute', required: true, index: true },
    instituteCode: { type: String, required: true, index: true },
    regionId: { type: Schema.Types.ObjectId, ref: 'Region', required: true, index: true },
    administrationId: { type: Schema.Types.ObjectId, ref: 'EducationalAdministration', required: true, index: true },
    academicCycleId: { type: Schema.Types.ObjectId, ref: 'AcademicCycle', required: true, index: true },

    sourceType: { type: String, required: true },
    sourceId: { type: Schema.Types.ObjectId },
    sourceItemKey: String,
    visitDate: Date,
    supervisorId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    supervisorName: { type: String, required: true },
    visitLevel: String,

    gapAxis: { type: String, required: true },
    gapItem: { type: String, required: true },
    gapDescription: { type: String, required: true },
    priority: { type: String, enum: ['مرتفعة', 'متوسطة', 'منخفضة'], required: true },
    impact: { type: String, enum: ['كبير', 'متوسط', 'محدود', 'دون تأثير مباشر'], required: true },
    rootCause: { type: String, required: true },
    rootCauseAnalysis: String,

    actionDescription: { type: String, required: true },
    actionType: { type: String, required: true },
    responsibleEntity: { type: String, required: true },
    responsiblePersonId: { type: Schema.Types.ObjectId, ref: 'User' },
    responsiblePersonName: { type: String, required: true },
    startDate: { type: Date, required: true },
    targetCompletionDate: { type: Date, required: true },

    implementationStatus: {
      type: String,
      enum: ['لم يبدأ', 'جارٍ التنفيذ', 'تم التنفيذ', 'متعثر', 'متوقف', 'يحتاج إلى دعم إضافي'],
      default: 'لم يبدأ',
    },
    completionPercentage: { type: Number, default: 0, min: 0, max: 100 },
    lastUpdatedAt: Date,
    completedOnTime: Boolean,
    implementationNotes: String,
    evidenceUrls: [String],

    reMonitoringDone: { type: Boolean, default: false },
    reMonitoringDate: Date,
    reMonitoringResult: {
      type: String,
      enum: ['عولجت بالكامل', 'تحسن واضح', 'تحسن جزئي', 'لا تحسن', 'مشكلة أخرى', undefined],
    },
    indicatorBefore: Number,
    indicatorAfter: Number,
    reMonitoringDescription: String,
    actionEffectiveness: { type: Number, enum: [1, 2, 3, 4] },

    gapStatus: {
      type: String,
      enum: ['مفتوحة', 'مغلقة جزئيًا', 'مغلقة'],
      default: 'مفتوحة',
      index: true,
    },
    closedAt: Date,
    closedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    closureReason: String,

    parentActionId: { type: Schema.Types.ObjectId, ref: 'CorrectiveAction' },
  },
  { timestamps: true }
);

CorrectiveActionSchema.index({ gapStatus: 1, priority: 1 });
CorrectiveActionSchema.index({ targetCompletionDate: 1, gapStatus: 1 });

const CorrectiveAction: Model<ICorrectiveAction> =
  mongoose.models.CorrectiveAction ||
  mongoose.model<ICorrectiveAction>('CorrectiveAction', CorrectiveActionSchema);

export default CorrectiveAction;
