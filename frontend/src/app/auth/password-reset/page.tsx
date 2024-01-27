import React from "react";
import PasswordResetForm from "@/components/forms/PasswordResetForm";
import type { Metadata } from "next";
import { FieldValues } from "react-hook-form";
import { PasswordResetServerMsgs, urls } from "@/api";

export const metadata: Metadata = {
  title: "Redefinir senha",
  description: "Preencha o formulário para acessar sua conta.",
};

const PasswordReset = () => {
  const sendEmail = async (
    data: FieldValues
  ): Promise<PasswordResetServerMsgs> => {
    "use server";
    const response = await fetch(urls.resetPassword, {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify(data),
    });

    if (response.ok || 400) {
      const responseData = await response.json();
      return responseData;
    } else {
      throw new Error("Erro interno do sistema.");
    }
  };

  return (
    <div>
      <PasswordResetForm sendEmail={sendEmail} />
    </div>
  );
};

export default PasswordReset;
