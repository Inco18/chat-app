import React from "react";
import { Outlet } from "react-router-dom";
import Header from "../components/header/Header";

type Props = {};

const RootLayout = (props: Props) => {
  return (
    <>
      <Header />
      <Outlet />
    </>
  );
};

export default RootLayout;
