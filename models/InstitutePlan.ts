import mongoose, { Schema, Document, Model } from 'mongoose';

export type ActivityStatus = 'لم يبدأ' | 'جارٍ' | 'مكتمل' | 'متأخر' | 'متوقف';

export interface IPlanActivity {
  title: string;
  phase: string;
  responsiblePersonId?: mongoose.Types.ObjectId;
  responsiblePersonName?: string;
  plannedDate: Date;
  actualDate?: Date;
  status: ActivityStatus;
  evidence?: string[];
  notes?: string;
  completionPercentage: number;
}

export interface IInstitutePlan extends Document {
  instituteId: mongoose.Types.ObjectId;
  academicCycleId: mongoose.Types.ObjectId;
  startDate: Date;
  endDate: Date;
  activities: IPlanActivity[];
  status: 'مسودة' | 'مرسل' | 'معتمد' | 'معاد للتعديل';
  createdBy: mongoose.Types.ObjectId;
  approvedBy?: mongoose.Types.ObjectId;
  approvedAt?: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const PlanActivitySchema = new Schema<IPlanActivity>({
  title: { type: String, required: true },
  phase: { type: String, required: true },
  responsiblePersonId: { type: Schema.Types.ObjectId, ref: 'User' },
  responsiblePersonName: String,
  plannedDate: { type: Date, required: true },
  actualDate: Date,
  status: {
    type: String,
    enum: ['لم يبدأ', 'جارٍ', 'مكتمل', 'متأخر', 'متوقف'],
    default: 'لم يبدأ',
  },
  evidence: [String],
  notes: String,
  completionPercentage: { type: Number, default: 0, min: 0, max: 100 },
});

const InstitutePlanSchema = new Schema<IInstitutePlan>(
  {
    instituteId: { type: Schema.Types.ObjectId, ref: 'Institute', required: true, index: true },
    academicCycleId: { type: Schema.Types.ObjectId, ref: 'AcademicCycle', required: true, index: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    activities: [PlanActivitySchema],
    status: {
      type: String,
      enum: ['مسودة', 'مرسل', 'معتمد', 'معاد للتعديل'],
      default: 'مسودة',
    },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    approvedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    approvedAt: Date,
    notes: String,
  },
  { timestamps: true }
);

const InstitutePlan: Model<IInstitutePlan> =
  mongoose.models.InstitutePlan || mongoose.model<IInstitutePlan>('InstitutePlan', InstitutePlanSchema);

export default InstitutePlan;
