import React from 'react';
import { initializeApp } from "firebase/app";
import { getAuth, setPersistence, browserSessionPersistence } from "firebase/auth";
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCEli15SSz40ZzsWWY3orYRcxx8I9qxIXw",
  authDomain: "agroshop-tramontin-c28cc.firebaseapp.com",
  projectId: "agroshop-tramontin-c28cc",
  storageBucket: "agroshop-tramontin-c28cc.appspot.com",
  messagingSenderId: "550256230785",
  appId: "1:550256230785:web:fa4e1d693f4a7f7b0fe880",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

setPersistence(auth, browserSessionPersistence)
  .then(() => {
    console.log("Sessão persistente configurada.");
  })
  .catch((error) => {
    console.error("Erro ao configurar a persistência:", error);
  });

export { db, auth };

