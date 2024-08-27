import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCEli15SSz40ZzsWWY3orYRcxx8I9qxIXw",
  authDomain: "agroshop-tramontin-c28cc.firebaseapp.com",
  projectId: "agroshop-tramontin-c28cc",
  storageBucket: "agroshop-tramontin-c28cc.appspot.com",
  messagingSenderId: "550256230785",
  appId: "1:550256230785:web:fa4e1d693f4a7f7b0fe880",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
