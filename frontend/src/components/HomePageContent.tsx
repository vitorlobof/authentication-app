"use client";
import React, { useState, useEffect } from "react";
import { Token } from "@/api";

const HomePageContent = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [content, setContent] = useState("");

  const checkAuthentication = async () => {
    const token = new Token();
    setIsAuthenticated(await token.verify());
  };

  const getContent = () => {
    if (isAuthenticated) {
      setContent("Você está autenticado.");
    } else {
      setContent("Você não está autenticado.");
    }
  };

  useEffect(() => {
    checkAuthentication();
  }, []);

  useEffect(() => {
    getContent();
  }, [isAuthenticated]);

  return <div>{content}</div>;
};

export default HomePageContent;
