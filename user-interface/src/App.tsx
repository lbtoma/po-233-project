import React, { useState, FC, useEffect } from "react";
import firebase from "firebase";

firebase.initializeApp({
  apiKey: "AIzaSyAz-zriNYH4vtV03zOv7srx3bYUTZr1ytw",
  authDomain: "skin-color-ml.firebaseapp.com ",
  projectId: "skin-color-ml",
  storageBucket: "skin-color-ml.appspot.com",
  messagingSenderId: "926852434",
  appId: "1:926852434:web:c66f56e285061fcd8f468b",
});

const { auth } = firebase;

export const App: FC = () => {
  const [firebaseUser, setFirebaseUser] = useState<firebase.User | null>(null);
  const [displayLogin, setDisplayLogin] = useState<boolean>(false);

  useEffect(() => {
    auth()
      .setPersistence(auth.Auth.Persistence.LOCAL)
      .then(() => {
        auth().onAuthStateChanged((user) => {
          if (user) {
            setFirebaseUser(user);
          } else {
            setDisplayLogin(true);
          }
        });
      });
  }, []);

  return (
    <div>
      {firebaseUser && <h1>Autenticado</h1>}
      {!firebaseUser && displayLogin
        ? <h1>Login</h1>
        : <h1>Carregando...</h1>
      }
    </div>
  );
};
