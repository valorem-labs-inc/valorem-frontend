import { NextPage } from "next";
import dynamic from "next/dynamic";
import ConnectedRoute from "../../../../components/connectedRoute";
import Vault from "../../../../layouts/vault";

const NewOptionView = dynamic(import("../../../../components/newOptionView"), {
  ssr: false,
});

const NewOptionPage: NextPage = () => {
  return (
    <ConnectedRoute>
      <Vault>
        <NewOptionView />
      </Vault>
    </ConnectedRoute>
  );
};

export default NewOptionPage;
