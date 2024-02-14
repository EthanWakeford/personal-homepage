import { initializeApp } from 'firebase/app';
import type { DocumentData } from 'firebase/firestore';
import { getFirestore, collection, getDocs } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const getData = async (coll: string): Promise<DocumentData[]> => {
  const testCol = collection(db, coll);

  const snapshot = await getDocs(testCol);

  const data = snapshot.docs.map((doc) => doc.data());

  return data;
};

export interface Project {
  title: string;
  project_type: 'project' | 'website';
  description: string;
  url_slug: string;
  hero_picture: string;
  tools: string;
  dates: string;
  project_url: string;
  source_url: string;
}

export interface MyInfo {
  about: string;
  bgimage: string;
  headshot: string;
}

const projects: Project[] = (await getData('projects')) as Project[];
const myInfo: MyInfo[] = (await getData('myinfo')) as MyInfo[];

export { projects, myInfo };
