import React, { type ReactNode } from "react";

type ContainerProps = {
  children: ReactNode;
};

const Container = ({ children }: ContainerProps) => {
  return <div className="w-4/5 ml-auto mr-auto mt-4 mb-52">{children}</div>;
};

export default Container;
