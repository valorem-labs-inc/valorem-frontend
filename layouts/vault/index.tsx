import React, { useEffect } from "react";
import Link from "next/link";
import Router, { useRouter } from "next/router";
import { useAccount, useDisconnect, useNetwork } from "wagmi";

import Breadcrumbs from "../../components/breadcrumbs";
import Button from "../../components/button";
import StyledVault from "./index.css";

const Vault: React.FC = ({ children }) => {
  const router = useRouter();

  const { data: account } = useAccount();

  const { disconnect } = useDisconnect();

  useEffect(() => {
    if (!account) {
      router.push("/");
    }
  }, [account, router]);

  return (
    <StyledVault>
      <div className="vault-content">
        <aside>
          <div className="connected-account">
            <div>
              <header>
                <h5>Connected As</h5>
                <p>
                  {account?.address.substring(0, 8)}...
                  {account?.address.slice(-8)}
                </p>
              </header>
              <Button onClick={() => disconnect()} theme="purple-blue">
                Disconnect
              </Button>
            </div>
          </div>
          <ul>
            <li
              className={
                router.asPath.includes("/vault/options") ? "active" : ""
              }
            >
              <Link href="/vault/options">Options</Link>
              <div className="icon">
                <i className="fas fa-link" />
              </div>
              <header>
                <h4>Options</h4>
                <p>Write and manage your options.</p>
              </header>
            </li>
            <li
              className={
                router.asPath.includes("/vault/claims") ? "active" : ""
              }
            >
              <Link href="/vault/claims">Claims</Link>
              <div className="icon">
                <i className="fas fa-receipt" />
              </div>
              <header>
                <h4>Claims</h4>
                <p>View and redeem your claims.</p>
              </header>
            </li>
          </ul>
        </aside>
        <main>
          <Breadcrumbs />
          {children}
        </main>
      </div>
    </StyledVault>
  );
};

export default Vault;
