"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import ResponsiveList from "../lists/ResponsiveList";

type UserIconProps = {
  isAuthenticated: boolean;
  src: any;
  logout: () => void;
  height?: number;
  alt?: string;
};

const UserIcon = ({
  isAuthenticated,
  src,
  logout,
  height = 28,
  alt = "User icon",
}: UserIconProps) => {
  const router = useRouter();
  const [isActive, setIsActive] = useState(false);
  const [options, setOptions] = useState({});

  const handleIconClick = () => {
    setIsActive((prev) => !prev);
  };

  const handleListClick = () => {
    setIsActive(false);
  };

  const handleListBlur = (event: any) => {
    if (isActive && !event.target.closest(".user-icon-container")) {
      setIsActive(false);
    }
  };

  useEffect(() => {
    if (isActive) document.addEventListener("click", handleListBlur);
    else document.removeEventListener("click", handleListBlur);
  }, [isActive]);

  useEffect(() => {
    if (isAuthenticated) {
      setOptions({
        Perfil: () => router.push("../profile"),
        Sair: () => {
          logout();
          router.push("../auth/login");
        },
      });
    } else {
      setOptions({
        Login: () => router.push("../auth/login"),
        "Cadastrar-se": () => router.push("../auth/register"),
      });
    }
  }, [isAuthenticated, logout, router]);

  return (
    <div className="relative user-icon-container">
      <Image
        priority
        className={`rounded-full h-${height} cursor-pointer`}
        src={src}
        height={height}
        alt={alt}
        onClick={handleIconClick}
      />

      {isActive && (
        <div className="absolute right-0 top-full mt-2 text-black">
          <ResponsiveList
            onClick={handleListClick}
            className="text-sm text-nowrap"
            items={options}
          />
        </div>
      )}
    </div>
  );
};

export default UserIcon;
