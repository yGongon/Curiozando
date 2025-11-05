


// FIX: Switched to @firebase/app to resolve module export errors, likely caused by a dependency version mismatch.
import { initializeApp, FirebaseApp } from '@firebase/app';
// FIX: Removed firebase/analytics import as it was causing an error and was unused.
// import { getAnalytics } from 'firebase/analytics';
import { 
  getAuth, 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  signOut,
  User
} from 'firebase/auth';
import { 
  getFirestore, 
  collection, 
  getDocs, 
  getDoc,
  doc,
  addDoc,
  deleteDoc,
  updateDoc,
  serverTimestamp,
  query,
  orderBy,
  Timestamp
} from 'firebase/firestore';
import { Post } from '../types';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCzQLAlj9xg66iXeMCTd-7J242ej83fOec",
  authDomain: "curiozando-37d63.firebaseapp.com",
  projectId: "curiozando-37d63",
  storageBucket: "curiozando-37d63.firebasestorage.app",
  messagingSenderId: "405413118275",
  appId: "1:405413118275:web:5587c30e297f90346beff6",
  measurementId: "G-N8TTSLGMR5"
};

// Initialize Firebase
const app: FirebaseApp = initializeApp(firebaseConfig);
// FIX: Removed unused analytics initialization which was causing an error.
// const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);

const postsCollection = collection(db, 'posts');

// Authentication exports
export { auth, onAuthStateChanged, signInWithEmailAndPassword, signOut };
export type { User };

// Firestore functions
export const getPosts = async (): Promise<Post[]> => {
  const q = query(postsCollection, orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Post));
};

export const getPost = async (id: string): Promise<Post | null> => {
    const postDoc = await getDoc(doc(db, 'posts', id));
    if (postDoc.exists()) {
        return { id: postDoc.id, ...postDoc.data() } as Post;
    }
    return null;
}

export const addPost = async (post: Omit<Post, 'id' | 'createdAt'>): Promise<string> => {
  const docRef = await addDoc(postsCollection, {
    ...post,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
};

export const updatePost = async (id:string, post: Partial<Pick<Post, 'title' | 'deck' | 'content'>>): Promise<void> => {
  const postDoc = doc(db, 'posts', id);
  await updateDoc(postDoc, post);
};

export const deletePost = async (id: string): Promise<void> => {
  const postDoc = doc(db, 'posts', id);
  await deleteDoc(postDoc);
};

export const formatFirebaseTimestamp = (timestamp: Timestamp | null | undefined): string => {
    if (!timestamp) return 'No date';
    return new Date(timestamp.seconds * 1000).toLocaleDateString('pt-BR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
};