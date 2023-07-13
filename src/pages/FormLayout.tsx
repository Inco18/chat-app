import React from "react";
import { Outlet } from "react-router-dom";
import Logo from "../components/header/Logo";
import FormHeader from "../components/header/FormHeader";
import FormMain from "../components/form/FormMain";

const FormLayout = () => {
  return (
    <>
      <FormHeader />
      <FormMain>
        <Outlet />
      </FormMain>
    </>
  );
};

export default FormLayout;
