import mongoose, { Schema, Document, Model } from 'mongoose';

export interface INotification extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  message: string;
  type: 'new_task' | 'deadline_approaching' | 'overdue' | 're_monitoring_needed' | 'report_returned' | 'import_complete' | 'import_error';
  entityType?: string;
  entityId?: string;
  isRead: boolean;
  readAt?: Date;
  createdAt: Date;
}

const NotificationSchema = new Schema<INotification>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    type: {
      type: String,
      required: true,
      enum: ['new_task', 'deadline_approaching', 'overdue', 're_monitoring_needed', 'report_returned', 'import_complete', 'import_error'],
    },
    entityType: String,
    entityId: String,
    isRead: { type: Boolean, default: false, index: true },
    readAt: Date,
  },
  { timestamps: true }
);

const Notification: Model<INotification> =
  mongoose.models.Notification || mongoose.model<INotification>('Notification', NotificationSchema);

export default Notification;
