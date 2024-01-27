import React from "react";
import type { FieldValues } from "react-hook-form";
import LoginForm from "@/components/forms/LoginForm";
import { urls, Token } from "@/api";
import type { TokenPairData, LoginServerErrors } from "@/api";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login",
  description: "Preencha o formulário para acessar sua conta.",
};

const Login = () => {
  const getTokenPair = async (
    data: FieldValues
  ): Promise<void | LoginServerErrors> => {
    "use server";
    const response = await fetch(urls.login, {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      const data: TokenPairData = await response.json();
      const token = new Token(data.token);
      token.save();
    } else if (response.status === 400) {
      const errors: LoginServerErrors = await response.json();
      return errors;
    } else {
      throw new Error("System internal error.");
    }
  };

  return (
    <div>
      <LoginForm getTokenPair={getTokenPair} />
    </div>
  );
};

export default Login;
