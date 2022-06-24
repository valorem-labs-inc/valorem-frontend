import { NextPage } from "next";
import dynamic from "next/dynamic";
import Vault from "../../../layouts/vault";
import ConnectedRoute from "../../../components/connectedRoute";

const ClaimsView = dynamic(import("../../../components/claimsView"), {
  ssr: false,
});

const ClaimsPage: NextPage = () => {
  return (
    <ConnectedRoute>
      <Vault>
        <ClaimsView />
      </Vault>
    </ConnectedRoute>
  );
};

export default ClaimsPage;
