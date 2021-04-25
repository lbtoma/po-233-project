import React, { useState, FC, useEffect } from "react";
import firebase from "firebase";
import { ChakraProvider, Center, StorageManager } from "@chakra-ui/react";
import Login from "./components/Login";
import {
  LoadingStatusProvider,
  useWithLoading,
} from "./contexts/LoadingStatus";
import Classification from "./components/Classification";

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

  const setUser = useWithLoading(
    async (): Promise<void> =>
      new Promise<void>(async (resolve) => {
        await auth().setPersistence(auth.Auth.Persistence.LOCAL);
        auth().onAuthStateChanged((user) => {
          if (user) {
            setFirebaseUser(user);
            resolve();
          } else {
            setDisplayLogin(true);
            resolve();
          }
        });
      })
  );

  const colorModeManager: StorageManager = {
    get: () => "dark",
    set: () => {},
    type: "localStorage",
  };

  useEffect(() => {
    setUser();
  }, [setUser]);

  return (
    <ChakraProvider colorModeManager={colorModeManager}>
      <LoadingStatusProvider>
        <Center position="relative" my="80px">
          {firebaseUser ? (
            <Classification />
          ) : (
            displayLogin && <Login userSetter={setFirebaseUser} />
          )}
        </Center>
      </LoadingStatusProvider>
    </ChakraProvider>
  );
};
