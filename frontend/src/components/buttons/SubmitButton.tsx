"use client";
import React, { ReactNode } from "react";

interface SubmitButtonProps extends React.HTMLAttributes<HTMLButtonElement> {}

const SubmitButton = ({ children, ...props }: SubmitButtonProps) => {
  return (
    <div>
      <button {...props}>{children}</button>
    </div>
  );
};

export default SubmitButton;
