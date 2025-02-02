import mongoose, { Document, Schema } from 'mongoose';

// 🔹 Contact Schema Type
export interface IContact extends Document {
  email: string;
  subject: string;
  description: string;
  createdAt: Date;
}

// 🔹 Contact Schema Definition
const ContactSchema: Schema = new Schema(
  {
    email: { type: String, required: true },
    subject: { type: String, required: true },
    description: { type: String, required: true },
  },
  { timestamps: true }
);

// 🔹 Export Model
const Contact =
  mongoose.models.Contact || mongoose.model<IContact>('Contact', ContactSchema);

export default Contact;
