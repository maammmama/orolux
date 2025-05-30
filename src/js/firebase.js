import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyAp9UJYdU7-Dxo-4_emNIMiIaiz42XF3EM",
  authDomain: "oroluxstor-b2b15.firebaseapp.com",
  databaseURL: "https://oroluxstor-b2b15-default-rtdb.firebaseio.com",
  projectId: "oroluxstor-b2b15",
  storageBucket: "oroluxstor-b2b15.firebasestorage.app",
  messagingSenderId: "978253542057",
  appId: "1:978253542057:web:9546e01981f07c8c73afb8",
  measurementId: "G-5FQT34W88Y"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

// Products operations
export const getProducts = async () => {
  try {
    const productsRef = collection(db, 'products');
    const snapshot = await getDocs(productsRef);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error getting products: ", error);
    throw error;
  }
};

// Cart operations
export const addToCart = async (userId, product) => {
  try {
    const cartRef = collection(db, `users/${userId}/cart`);
    await addDoc(cartRef, product);
  } catch (error) {
    console.error("Error adding to cart: ", error);
    throw error;
  }
};

export const getCartItems = async (userId) => {
  try {
    const cartRef = collection(db, `users/${userId}/cart`);
    const snapshot = await getDocs(cartRef);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error getting cart items: ", error);
    throw error;
  }
};

// Auth operations
export const registerUser = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error("Error registering user: ", error);
    throw error;
  }
};

export const loginUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error("Error logging in: ", error);
    throw error;
  }
};

export const logoutUser = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Error logging out: ", error);
    throw error;
  }
};

export { db, auth, storage, app };
