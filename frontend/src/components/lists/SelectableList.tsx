"use client";
import React, { useState } from "react";

interface Props {
  className?: string;
  onClick?: () => void;
  onBlur?: () => void;
  items: string[];
}

function SelectableList({ className, onClick, items }: Props) {
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const handleClick = (index: number) => {
    if (selectedIndex === index) {
      setSelectedIndex(-1); // Unselect the item if it's already selected
    } else {
      setSelectedIndex(index);
    }
  };

  return (
    <>
      {Object.keys(items).length === 0 ? (
        <p className={`text-gray-500 ${className}`} onClick={onClick}>
          Nenhum item presente.
        </p>
      ) : (
        <ul className={`list-none ${className}`} onClick={onClick}>
          {items.map((item, index) => (
            <li
              key={index}
              className={`py-2 px-4 cursor-pointer ${
                selectedIndex === index
                  ? "bg-blue-500 text-white"
                  : "hover:bg-gray-200"
              }`}
              onClick={() => {
                handleClick(index);
              }}
            >
              {item}
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

export default SelectableList;
