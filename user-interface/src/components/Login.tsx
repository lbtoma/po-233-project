import React, { useState } from "react";
import firebase from "firebase";
import { InputGroup, Input, Button, Center } from "@chakra-ui/react";
import { useWithLoading } from "../contexts/LoadingStatus";
import RoundedBox from "./shared/RoundedBox";

export interface LoginProps {
  userSetter: React.Dispatch<firebase.User>;
}

const inputsMargin = "10px";

const Login: React.FC<LoginProps> = ({ userSetter }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onEmailChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    setEmail(event.target.value);
  };
  const onPasswordChange: React.ChangeEventHandler<HTMLInputElement> = (
    event
  ) => {
    setPassword(event.target.value);
  };
  const onClick = useWithLoading(async () => {
    await firebase.auth().signInWithEmailAndPassword(email, password);
  });

  return (
    <RoundedBox>
      <InputGroup display="block">
        <Input
          my={inputsMargin}
          type="text"
          placeholder="Email"
          onChange={onEmailChange}
        />
        <Input
          my={inputsMargin}
          type="password"
          placeholder="Senha"
          onChange={onPasswordChange}
        />
      </InputGroup>
      <Center>
        <Button onClick={onClick} mt="30px">
          Login
        </Button>
      </Center>
    </RoundedBox>
  );
};

export default Login;
