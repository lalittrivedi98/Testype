// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCq8O7zpTCNqv6z6TNNf5y5ZsYkxIxrUO0",
  authDomain: "testype-app.firebaseapp.com",
  projectId: "testype-app",
  storageBucket: "testype-app.appspot.com",
  messagingSenderId: "439394816132",
  appId: "1:439394816132:web:4601c53b2b190252d772d1",
  measurementId: "G-Y7H3Q9NER7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
