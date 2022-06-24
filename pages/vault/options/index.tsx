import dynamic from "next/dynamic";
import ConnectedRoute from "../../../components/connectedRoute";

const OptionsView = dynamic(import("../../../components/optionsView"), {
  ssr: false,
});

function Options(): JSX.Element {
  return (
    <ConnectedRoute>
      <OptionsView />
    </ConnectedRoute>
  );
}

export default Options;
