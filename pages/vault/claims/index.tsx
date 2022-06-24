import { NextPage } from "next";
import dynamic from "next/dynamic";
import Vault from "../../../layouts/vault";

const ClaimsView = dynamic(import("../../../components/claimsView"), {
  ssr: false,
});

const ClaimsPage: NextPage = () => {
  return (
    <Vault>
      <ClaimsView />
    </Vault>
  );
};

export default ClaimsPage;
