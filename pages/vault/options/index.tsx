import dynamic from "next/dynamic";

const OptionsView = dynamic(import("../../../components/optionsView"), {
  ssr: false,
});

function Options(): JSX.Element {
  return (
    <>
      <OptionsView />
    </>
  );
}

export default Options;
