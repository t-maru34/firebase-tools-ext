import * as admin from 'firebase-admin';
import * as fs from 'fs';

let firebaseApp: admin.app.App;

export const firebaseInitializer = () => {
  const serviceAccountPath = process.env.FIREBASE_TOOL_EXT_CREDENTIAL;
  if (!serviceAccountPath) throw new Error('Environment variable FIREBASE_TOOL_EXT_CREDENTIAL needed.');

  const saJSON = JSON.parse(Buffer.from(fs.readFileSync(serviceAccountPath, 'utf-8')).toString());
  console.log(`firestore tool target project_id: ${saJSON.project_id}`);

  firebaseApp = admin.initializeApp({
    credential: admin.credential.cert(serviceAccountPath)
  });
};

export const cleanFirebase = () => {
  if (firebaseApp) firebaseApp.delete();
};

export const getFirestore = (): FirebaseFirestore.Firestore => {
  return admin.firestore();
};

export const getAuth = (): admin.auth.Auth => {
  return admin.auth();
};
