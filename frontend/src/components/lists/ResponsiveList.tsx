"use client";
import React from "react";

interface Props {
  className?: string;
  onClick?: () => void;
  onBlur?: () => void;
  items: { [key: string]: () => void };
}

function ResponsiveList({ className, onClick, items }: Props) {
  return (
    <>
      {Object.keys(items).length === 0 ? (
        <p className={`text-black ${className}`} onClick={onClick}>
          Nenhum item presente.
        </p>
      ) : (
        <ul className={`list-none bg-gray-200 rounded-md overflow-hidden ${className}`} onClick={onClick}>
          {Object.entries(items).map(([key, func], index) => (
            <li
              key={index}
              className="py-2 px-4 cursor-pointer hover:bg-gray-400"
              onClick={func}
            >
              {key}
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

export default ResponsiveList;
