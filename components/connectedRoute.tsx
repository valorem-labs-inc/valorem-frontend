import { FC, Fragment, useEffect } from "react";
import { useRouter } from "next/router";
import { useNetwork } from "wagmi";

const ConnectedRoute: FC = ({ children }) => {
  const router = useRouter();

  const { activeChain } = useNetwork();

  useEffect(() => {
    if (!activeChain || activeChain.unsupported) {
      router.push("/");
    }
  }, [activeChain, router]);

  if (!activeChain || activeChain.unsupported) {
    return null;
  }

  return <Fragment>{children}</Fragment>;
};

export default ConnectedRoute;
