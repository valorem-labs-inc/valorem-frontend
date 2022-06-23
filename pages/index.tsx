/* eslint-disable @next/next/no-img-element */
import React, { Fragment, useEffect, useState } from "react";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useAccount, useConnect } from "wagmi";

import Button from "../components/button";
import StyledIndex from "./index.css";
import ConnectWalletModal from "../components/connectWalletModal";

const Index: NextPage = () => {
  const [modalOpen, setModalOpen] = useState(false);

  const router = useRouter();

  const { data: account } = useAccount();

  const { isConnecting } = useConnect();

  useEffect(() => {
    if (account) {
      router.push("/vault/options");
    }
  }, [account, router]);

  return (
    <Fragment>
      <StyledIndex>
        <img className="logo" src="/logo.png" alt="Valorem" />
        <Button
          disabled={isConnecting}
          onClick={() => setModalOpen(true)}
          theme="purple-blue"
        >
          {isConnecting ? "Connecting..." : "Connect Wallet"}
        </Button>
      </StyledIndex>
      <ConnectWalletModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </Fragment>
  );
};

export default Index;

// type IndexProps = {
//   connectWallet: () => boolean;
//   walletError?: string;
// };

// type IndexState = {
//   connectingWallet: boolean;
// };

// class Index extends React.Component<IndexProps, IndexState> {
//   private index = React.createRef<HTMLDivElement>();

//   constructor(props) {
//     super(props);

//     this.state = {
//       connectingWallet: false,
//     } as IndexState;
//   }

//   handleConnectWallet = () => {
//     const { connectWallet } = this.props;

//     this.setState({ connectingWallet: true }, async () => {
//       try {
//         const success = await connectWallet();

//         if (success) {
//           this.index.current.classList.add("fade-out");
//           setTimeout(() => Router.push("/vault/options"), 500);
//         } else {
//           this.setState({ connectingWallet: false });
//         }
//       } catch (exception) {
//         this.setState({ connectingWallet: false });
//       }
//     });
//   };

//   render() {
//     const { connectingWallet } = this.state;
//     const { walletError } = this.props;

//     return (
//       <StyledIndex ref={this.index}>
//         <img className="logo" src="/logo.png" alt="Valorem" />
// <Button
//   disabled={connectingWallet}
//   onClick={this.handleConnectWallet}
//   theme="purple-blue"
// >
//   {connectingWallet ? "Connecting..." : "Connect Wallet"}
// </Button>
//         {walletError && (
//           <p className="wallet-error">
//             <strong>Error:</strong> {walletError}
//           </p>
//         )}
//         <p>
//           Connected wallet data is <em>only</em> stored in your browser —
//           Valorem does not store this information.
//         </p>
//       </StyledIndex>
//     );
//   }
// }

// const mapStateToProps = (state: { walletError: string }) => {
//   return { walletError: state.walletError };
// };

// export default connect(mapStateToProps)(Index);
