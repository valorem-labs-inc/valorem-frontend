import { useEffect, useState } from "react";
import { useNetwork } from "wagmi";

export function useIsNetworkSupported() {
  const [isSupported, setIsSupported] = useState(false);

  const { activeChain } = useNetwork();

  useEffect(() => {
    if (!activeChain || activeChain.unsupported) {
      setIsSupported(false);
    } else {
      setIsSupported(true);
    }
  }, [activeChain]);

  return isSupported;
}
