// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAM3OTNuAoTa7mARXMLfGE5kf6TVqw0tQU",
  authDomain: "ethanwakeford-bf2d6.firebaseapp.com",
  projectId: "ethanwakeford-bf2d6",
  storageBucket: "ethanwakeford-bf2d6.appspot.com",
  messagingSenderId: "256228365589",
  appId: "1:256228365589:web:8dc99b34882fe39641c51c",
  measurementId: "G-FZD6SVJWG9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
