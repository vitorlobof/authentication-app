"use client";
import React, { useState } from "react";
import { useForm, SubmitHandler, FieldValues } from "react-hook-form";
import Image from "next/image";
import { StaticImport } from "next/dist/shared/lib/get-img-props";
import { urls } from "@/api";

type ServerErrors = {
  profileImg?: string[];
  bio?: string[];
  non_field_errors?: string[];
};

type ProfileFormProps = {
  profileImgSrc: string | StaticImport;
  bio: string;
};

const ProfileForm = ({ profileImgSrc, bio }: ProfileFormProps) => {
  const [serverErrors, setServerErrors] = useState<ServerErrors>({});

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    const response = await fetch(urls.profile, {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const data = await response.json();
      setServerErrors(data);
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
          htmlFor="profileImg"
          className="block text-gray-700 text-sm font-bold mb-2"
        >
          Profile Image:
        </label>

        {/* Circular preview of the profile image */}
        <div className="mb-2 w-16 h-16 rounded-full overflow-hidden">
          <Image
            src={profileImgSrc}
            alt="Profile"
            className="w-full h-full object-cover"
          />
        </div>

        {/* File input for uploading profile image */}
        <input
          {...register("profileImg", { maxLength: 200 })}
          type="file"
          accept="image/*"
          className="w-full p-2 border rounded"
        />

        {errors.profileImg && (
          <p className="text-red-500 text-sm">{`${errors.profileImg.message}`}</p>
        )}

        {serverErrors.profileImg &&
          serverErrors.profileImg.map((message, index) => {
            return (
              <p key={index} className="text-red-500 text-sm">{`${message}`}</p>
            );
          })}
      </div>

      <div className="mb-4">
        <label
          htmlFor="bio"
          className="block text-gray-700 text-sm font-bold mb-2"
        >
          Bio:
        </label>
        <input
          {...register("bio", { maxLength: 200 })}
          placeholder="bio"
          type="text"
          value={bio}
          className="w-full p-2 border rounded"
        />

        {errors.bio && (
          <p className="text-red-500 text-sm">{`${errors.bio.message}`}</p>
        )}

        {serverErrors.bio &&
          serverErrors.bio.map((message, index) => {
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
        Salvar alterações
      </button>
    </form>
  );
};

export default ProfileForm;
