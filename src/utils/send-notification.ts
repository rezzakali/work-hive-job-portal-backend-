import { messaging } from '../config/firebase.admin.config';

const sendNotification = async (
  tokens: string[],
  title: string,
  body: string
): Promise<void> => {
  if (!tokens.length) {
    console.warn('No FCM tokens provided.');
    return;
  }

  const message = {
    notification: {
      title,
      body,
    },
    tokens,
  };

  try {
    const response = await messaging.sendEachForMulticast(message);
    console.log('Notifications sent:', response);
  } catch (error) {
    console.error('Error sending notifications:', error);
  }
};

export default sendNotification;
