import Link from "next/link";
import React from "react";
import UserIcon from "../icons/UserIcon";
import defaultUserIcon from "../../../public/unlogged.svg";
import { Token } from "@/api";

const TopBar = async () => {
  const token = new Token();
  const isAuthenticated = await token.verify();

  const logout = async () => {
    "use server";
    const token = new Token();
    token.delete();
  };

  return (
    <div className="bg-sky-500 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <nav className="space-x-4">
          <Link href="/" className="hover:text-gray-300">
            Home
          </Link>
        </nav>

        <UserIcon
          isAuthenticated={isAuthenticated}
          src={defaultUserIcon}
          logout={logout}
        />
      </div>
    </div>
  );
};

export default TopBar;
