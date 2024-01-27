"use client";
import React, { useState } from "react";
import { useForm, type FieldValues } from "react-hook-form";
import Link from "next/link";
import { PasswordResetServerMsgs } from "@/api";

type PasswordResetFormProps = {
  sendEmail: (data: FieldValues) => Promise<PasswordResetServerMsgs>;
};

const PasswordResetForm = ({ sendEmail }: PasswordResetFormProps) => {
  const [serverMsgs, setServerMsgs] = useState<PasswordResetServerMsgs>({});

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm();

  const onSubmit = async (data: FieldValues) => {
    const messages = await sendEmail(data);
    setServerMsgs(messages);

    if (messages.detail === undefined) reset();
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-md mx-auto my-8 p-6 bg-white rounded shadow-md"
    >
      {serverMsgs.detail && (
        <p className="text-green-500 text-sm">{`${serverMsgs.detail}`}</p>
      )}

      {serverMsgs.non_field_errors &&
        serverMsgs.non_field_errors.map((message, index) => {
          return (
            <p key={index} className="text-red-500 text-sm">{`${message}`}</p>
          );
        })}

      <div className="mb-4">
        <label
          htmlFor="email"
          className="block text-gray-700 text-sm font-bold mb-2"
        >
          Email:
        </label>
        <input
          {...register("email", {
            required: "Informe seu email.",
          })}
          placeholder="Email"
          type="text"
          className="w-full p-2 border rounded"
        />

        {errors.email && (
          <p className="text-red-500 text-sm">{`${errors.email.message}`}</p>
        )}

        {serverMsgs.email &&
          serverMsgs.email.map((message, index) => {
            return (
              <p key={index} className="text-red-500 text-sm">{`${message}`}</p>
            );
          })}
      </div>

      <button
        disabled={isSubmitting}
        type="submit"
        className="bg-blue-500 text-white p-2 rounded"
      >
        Enviar
      </button>

      <p className="text-xs mt-3 mb-3">
        Não tem uma conta?{" "}
        <Link href={"../auth/register"} className="text-blue-500 underline">
          Cadastre-se
        </Link>
        .
      </p>
    </form>
  );
};

export default PasswordResetForm;
