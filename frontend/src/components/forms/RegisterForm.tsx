"use client";
import React, { useState } from "react";
import { useForm, type FieldValues } from "react-hook-form";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { RegisterServerErrors } from "@/api";

type RegisterFormProps = {
  registerUser: (data: FieldValues) => Promise<void | RegisterServerErrors>;
};

const RegisterForm = ({ registerUser }: RegisterFormProps) => {
  const router = useRouter();
  const [serverErrors, setServerErrors] =
    useState<RegisterServerErrors>({});

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    getValues,
  } = useForm();

  const onSubmit = async (data: FieldValues) => {
    const newServerErrors = await registerUser(data);

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
          htmlFor="username"
          className="block text-gray-700 text-sm font-bold mb-2"
        >
          Username:
        </label>
        <input
          {...register("username", {
            required: "Você precisa de um username.",
          })}
          placeholder="Username"
          type="text"
          className="w-full p-2 border rounded"
        />

        {errors.username && (
          <p className="text-red-500 text-sm">{`${errors.username.message}`}</p>
        )}

        {serverErrors.username &&
          serverErrors.username.map((message, index) => {
            return (
              <p key={index} className="text-red-500 text-sm">{`${message}`}</p>
            );
          })}
      </div>

      <div className="mb-4">
        <label
          htmlFor="email"
          className="block text-gray-700 text-sm font-bold mb-2"
        >
          Email:
        </label>
        <input
          {...register("email", { required: "Você precisa de um email." })}
          placeholder="Email"
          type="email"
          className="w-full p-2 border rounded"
        />

        {errors.email && (
          <p className="text-red-500 text-sm">{`${errors.email.message}`}</p>
        )}

        {serverErrors.email &&
          serverErrors.email.map((message, index) => {
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
            required: "Você precisa de uma senha.",
            minLength: {
              value: 8,
              message: "Sua senha deve ter no mínimo 8 caractéres.",
            },
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

      <div className="mb-4">
        <label
          htmlFor="confirm_password"
          className="block text-gray-700 text-sm font-bold mb-2"
        >
          Confirme sua senha:
        </label>
        <input
          {...register("confirm_password", {
            required: "Você precisa confirmar sua senha.",
            validate: (value) =>
              value === getValues("password") || "As senhas devem ser iguais.",
          })}
          placeholder="Senha..."
          type="password"
          className="w-full p-2 border rounded"
        />
        {errors.confirm_password && (
          <p className="text-red-500 text-sm">{`${errors.confirm_password.message}`}</p>
        )}
      </div>

      <button
        disabled={isSubmitting}
        type="submit"
        className="bg-blue-500 text-white p-2 rounded"
      >
        Enviar
      </button>

      <p className="text-xs mt-3 mb-3">
        Já tem uma conta?{" "}
        <Link href={"../auth/login"} className="text-blue-500 underline">
          Faça login
        </Link>
        .
      </p>
    </form>
  );
};

export default RegisterForm;
