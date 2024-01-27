import React from "react";
import type { Metadata } from "next";
import ProfileForm from "@/components/forms/ProfileForm";
import defaultUserIcon from "../../../public/unlogged.svg";
import { urls, Token } from "@/api";

export const metadata: Metadata = {
  title: "Perfil",
  description: "Altere o formulário para alterar seu perfil.",
};

type ProfileProps = {
  username: string;
  first_name: string;
  last_name: string;
  profileImgUrl: string;
  bio: string;
};

const Profile = async () => {
  const token = new Token();

  const response = await fetch(urls.profile, {
    method: "GET",
    headers: {
      "Content-type": "application/json",
      Authorization: token.authorization(),
    },
  });
  const data: ProfileProps = await response.json();

  console.log(data);

  return (
    <>
      <div>
        <p>{data.username}</p>
        <p>
          {data.first_name} {data.last_name}
        </p>
      </div>

      {/* <ProfileForm
        profileImgSrc={data.profileImgUrl || defaultUserIcon}
        bio={data.bio}
      /> */}
    </>
  );
};

export default Profile;
