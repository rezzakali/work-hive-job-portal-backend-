import admin from 'firebase-admin';
import serviceAccount from './serviceAccountKey';

// Check if Firebase is already initialized to prevent re-initialization issues
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
  });
}

export const messaging = admin.messaging(); // Export messaging instance
export default admin;
