import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User,
} from "firebase/auth";
import {
  getFirestore,
  collection,
  doc,
  getDoc,
  setDoc,
  getDocs,
  query,
  where,
  orderBy,
  addDoc,
  serverTimestamp,
  DocumentData,
} from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
// Replace with your actual Firebase config
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
const googleProvider = new GoogleAuthProvider();

// Auth functions
const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;

    // Check if the user document exists
    const userDocRef = doc(db, "users", user.uid);
    const userDoc = await getDoc(userDocRef);

    // If user doesn't exist, create a new user document
    if (!userDoc.exists()) {
      await setDoc(userDocRef, {
        uid: user.uid,
        name: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        createdAt: serverTimestamp(),
      });
    }

    return user;
  } catch (error) {
    console.error("Error signing in with Google: ", error);
    throw error;
  }
};

const signUpWithEmail = async (
  email: string,
  password: string,
  name: string,
) => {
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    const user = result.user;

    // Create a new user document
    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      name,
      email,
      photoURL: null,
      createdAt: serverTimestamp(),
    });

    return user;
  } catch (error) {
    console.error("Error signing up with email: ", error);
    throw error;
  }
};

const signInWithEmail = async (email: string, password: string) => {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    return result.user;
  } catch (error) {
    console.error("Error signing in with email: ", error);
    throw error;
  }
};

const signOut = async () => {
  try {
    await firebaseSignOut(auth);
  } catch (error) {
    console.error("Error signing out: ", error);
    throw error;
  }
};

// Menu functions
const getMenuItems = async () => {
  try {
    const menuSnapshot = await getDocs(collection(db, "menu"));
    return menuSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Error getting menu items: ", error);
    throw error;
  }
};

// Order functions
const createOrder = async (userId: string, orderData: any) => {
  try {
    const orderRef = await addDoc(collection(db, "orders"), {
      userId,
      ...orderData,
      status: "pending",
      createdAt: serverTimestamp(),
    });

    return orderRef.id;
  } catch (error) {
    console.error("Error creating order: ", error);
    throw error;
  }
};

const getUserOrders = async (userId: string) => {
  try {
    const q = query(
      collection(db, "orders"),
      where("userId", "==", userId),
      orderBy("createdAt", "desc"),
    );

    const ordersSnapshot = await getDocs(q);
    return ordersSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Error getting user orders: ", error);
    throw error;
  }
};

// Current user function
const getCurrentUser = () => {
  return new Promise<User | null>((resolve, reject) => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (user) => {
        unsubscribe();
        resolve(user);
      },
      (error) => {
        reject(error);
      },
    );
  });
};

export {
  auth,
  db,
  storage,
  signInWithGoogle,
  signUpWithEmail,
  signInWithEmail,
  signOut,
  getMenuItems,
  createOrder,
  getUserOrders,
  getCurrentUser,
};
