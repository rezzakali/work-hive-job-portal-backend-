import mongoose, { Document, Schema } from 'mongoose';

interface INotification extends Document {
  userId: mongoose.Schema.Types.ObjectId;
  message: string;
  type: 'new_job';
  isRead: boolean;
  createdAt: Date;
}

const NotificationSchema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false,
  },
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true }, // Reference to the job

  message: { type: String, required: true },
  type: { type: String, enum: ['new_job'], required: true },
  isReadBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Tracks who has read it
  createdAt: { type: Date, default: Date.now },
});

const Notification = mongoose.model<INotification>(
  'Notification',
  NotificationSchema
);
export default Notification;
