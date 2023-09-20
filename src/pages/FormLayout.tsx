import { Outlet } from "react-router-dom";
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
