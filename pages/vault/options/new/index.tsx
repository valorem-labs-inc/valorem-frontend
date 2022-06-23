import { NextPage } from "next";
import dynamic from "next/dynamic";
import Vault from "../../../../layouts/vault";

const NewOptionView = dynamic(import("../../../../components/newOptionView"), {
  ssr: false,
});

const NewOptionPage: NextPage = () => {
  return (
    <Vault>
      <NewOptionView />
    </Vault>
  );
};

export default NewOptionPage;
