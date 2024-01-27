import React from "react";
import RegisterForm from "@/components/forms/RegisterForm";
import { FieldValues } from "react-hook-form";
import type { Metadata } from "next";
import { urls, Token } from "@/api";
import type { TokenPairData, RegisterServerErrors } from "@/api";

export const metadata: Metadata = {
  title: "Cadastre-se",
  description: "Preencha o formulário para criar uma conta.",
};

const Register = () => {
  const registerUser = async (
    data: FieldValues
  ): Promise<void | RegisterServerErrors> => {
    "use server";
    const response = await fetch(urls.register, {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      const data: TokenPairData = await response.json();

      const token = new Token(data.token);
      token.save();
    } else if (response.status === 400) {
      const errors: RegisterServerErrors = await response.json();
      return errors;
    } else {
      throw new Error("System internal error.");
    }
  };

  return (
    <>
      <RegisterForm registerUser={registerUser} />
    </>
  );
};

export default Register;
