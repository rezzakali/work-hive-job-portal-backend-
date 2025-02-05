import mongoose from 'mongoose';

const FCMTokenSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  token: { type: String, required: true },
});

const FCMToken = mongoose.model('FCMToken', FCMTokenSchema);

export default FCMToken;
