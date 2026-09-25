import mongoose, { Schema, Document, Model } from 'mongoose';

export type ItemStatus = 'تم' | 'تم جزئيًا' | 'لم يتم' | 'لا ينطبق';

export interface IFieldVisitItem {
  itemKey: string;
  itemTitle: string;
  status: ItemStatus;
  notes?: string;
  evidenceUrls?: string[];
  requiresCorrectiveAction: boolean;
  correctiveActionId?: mongoose.Types.ObjectId;
}

export interface IFieldVisit extends Document {
  instituteId: mongoose.Types.ObjectId;
  academicCycleId: mongoose.Types.ObjectId;
  regionId: mongoose.Types.ObjectId;
  administrationId: mongoose.Types.ObjectId;
  visitDate: Date;
  supervisorId: mongoose.Types.ObjectId;
  supervisorName: string;
  visitLevel: 'إدارة تعليمية' | 'منطقة أزهرية' | 'إدارة عامة';
  items: IFieldVisitItem[];
  overallNotes?: string;
  status: 'مسودة' | 'مكتملة';
  createdAt: Date;
  updatedAt: Date;
}

const FieldVisitItemSchema = new Schema<IFieldVisitItem>({
  itemKey: { type: String, required: true },
  itemTitle: { type: String, required: true },
  status: {
    type: String,
    enum: ['تم', 'تم جزئيًا', 'لم يتم', 'لا ينطبق'],
    required: true,
  },
  notes: String,
  evidenceUrls: [String],
  requiresCorrectiveAction: { type: Boolean, default: false },
  correctiveActionId: { type: Schema.Types.ObjectId, ref: 'CorrectiveAction' },
});

const FieldVisitSchema = new Schema<IFieldVisit>(
  {
    instituteId: { type: Schema.Types.ObjectId, ref: 'Institute', required: true, index: true },
    academicCycleId: { type: Schema.Types.ObjectId, ref: 'AcademicCycle', required: true, index: true },
    regionId: { type: Schema.Types.ObjectId, ref: 'Region', required: true, index: true },
    administrationId: { type: Schema.Types.ObjectId, ref: 'EducationalAdministration', required: true, index: true },
    visitDate: { type: Date, required: true },
    supervisorId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    supervisorName: { type: String, required: true },
    visitLevel: {
      type: String,
      enum: ['إدارة تعليمية', 'منطقة أزهرية', 'إدارة عامة'],
      required: true,
    },
    items: [FieldVisitItemSchema],
    overallNotes: String,
    status: {
      type: String,
      enum: ['مسودة', 'مكتملة'],
      default: 'مسودة',
    },
  },
  { timestamps: true }
);

const FieldVisit: Model<IFieldVisit> =
  mongoose.models.FieldVisit || mongoose.model<IFieldVisit>('FieldVisit', FieldVisitSchema);

export default FieldVisit;
