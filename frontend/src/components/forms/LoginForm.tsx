"use client";
import React, { useState } from "react";
import { useForm, type FieldValues } from "react-hook-form";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { LoginServerErrors } from "@/api";

type LoginFormProps = {
  getTokenPair: (data: FieldValues) => Promise<void | LoginServerErrors>;
};

const LoginForm = ({ getTokenPair }: LoginFormProps) => {
  const router = useRouter();
  const [serverErrors, setServerErrors] = useState<LoginServerErrors>({});

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm();

  const onSubmit = async (data: FieldValues) => {
    const newServerErrors = await getTokenPair(data);

    if (newServerErrors === undefined) {
      router.push("../");
      reset();
    } else {
      setServerErrors(newServerErrors);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-md mx-auto my-8 p-6 bg-white rounded shadow-md"
    >
      {serverErrors.non_field_errors &&
        serverErrors.non_field_errors.map((message, index) => {
          return (
            <p key={index} className="text-red-500 text-sm">{`${message}`}</p>
          );
        })}

      <div className="mb-4">
        <label
          htmlFor="username_or_email"
          className="block text-gray-700 text-sm font-bold mb-2"
        >
          Username ou email:
        </label>
        <input
          {...register("username_or_email", {
            required: "Informe seu username ou email.",
          })}
          placeholder="Username ou email"
          type="text"
          className="w-full p-2 border rounded"
        />

        {errors.username_or_email && (
          <p className="text-red-500 text-sm">{`${errors.username_or_email.message}`}</p>
        )}

        {serverErrors.username_or_email &&
          serverErrors.username_or_email.map((message, index) => {
            return (
              <p key={index} className="text-red-500 text-sm">{`${message}`}</p>
            );
          })}
      </div>

      <div className="mb-4">
        <label
          htmlFor="password"
          className="block text-gray-700 text-sm font-bold mb-2"
        >
          Senha:
        </label>
        <input
          {...register("password", {
            required: "Digite sua senha.",
          })}
          placeholder="Senha..."
          type="password"
          className="w-full p-2 border rounded"
        />
        {errors.password && (
          <p className="text-red-500 text-sm">{`${errors.password.message}`}</p>
        )}

        {serverErrors.password &&
          serverErrors.password.map((message, index) => {
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

      <p className="text-xs mt-3 mb-3">
        Esqueceu sua senha?{" "}
        <Link
          href={"../auth/password-reset"}
          className="text-blue-500 underline"
        >
          Clique aqui
        </Link>
        .
      </p>
    </form>
  );
};

export default LoginForm;
