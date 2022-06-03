import React from 'react';
import DateTime from 'react-datetime';
import moment from 'moment';
import { ethers } from 'ethers';
import Web3 from 'web3';
import Vault from '../../../../layouts/vault';
import Amount from '../../../../components/amount';
import Button from '../../../../components/button';
import Warning from '../../../../components/warning';
import TokenSelect from '../../../../components/tokenSelect';
import OptionModal from '../../../../components/optionModal';
import store from '../../../../lib/store';

import StyledNewOption from './index.css.js';

const web3 = new Web3();
const MAX_APPROVAL = '115792089237316195423570985008687907853269984665640564039457584007913129639935';

class NewOption extends React.Component {
  state = {
    numberOfContracts: 0,
    exerciseTimestamp: '',
    expiryTimestamp: '',
    exerciseAsset: '',
    exerciseAmount: 0,
    underlyingAsset: '',
    underlyingAssetName: '', // NOTE: Just for display, not used in transaction.
    underlyingAmount: 0,
    lowBalanceWarning: null,
    writingOption: false,
    needsApproval: false,
  };

  handleWrite = (contract = {}, optionId = '', numberOfContracts = 0) => {
    console.log({
      contract,
      optionId,
      numberOfContracts,
    })

    contract.write(optionId, numberOfContracts).then((response) => {
      contract.on('OptionsWritten', (optionId, writer, claimId, amount) => {
        // TODO: Confirm or redirect?
        console.log('OptionsWritten', {
          optionId,
          writer,
          claimId,
          amount,
        });
      });
    });
  };

  handleWriteContract = async () => {
    const hasAllowance = await this.checkIfHasAllowance(this.state?.underlyingAsset, this.connection?.optionsSettlementEngineAddress);

    console.log({hasAllowance});

    if (hasAllowance) {
      this.handleWrite(
        this.contractWithSigner,
        this?.optionId?.toNumber(),
        ethers.BigNumber.from(this.state.numberOfContracts)
      );
    } else {
      this.setState({ needsApproval: true });
    }
  };

  handleApproveToken = async (underlyingAsset = '', underlyingAmount = 0, numberOfContracts = 0, callback = null) => {
    const state = store.getState();
    const erc20 = state?.wallet?.connection?.erc20;
    const optionsSettlementEngineAddress = state?.wallet?.connection?.optionsSettlementEngineAddress;
    const erc20Instance = erc20(underlyingAsset);
    const erc20InstanceWithSigner = erc20Instance ? erc20Instance.connect(this.connection.signer) : null;
    const approvalTransaction = await erc20InstanceWithSigner.approve(
      optionsSettlementEngineAddress,
      // NOTE: Parse Ether to WEI before performing approval.
      MAX_APPROVAL
      // ethers.utils.parseEther(`${underlyingAmount * numberOfContracts}`)
    );

    return approvalTransaction.wait().then((approvalResponse) => {
      console.log({approvalResponse});
      this.setState({ needsApproval: false }, callback);
    });
  };

  checkIfHasAllowance = async (underlyingAsset = '', optionsSettlementEngineAddress = '') => {
    const state = store.getState();
    const erc20 = state?.wallet?.connection?.erc20;
    const erc20Instance = erc20(underlyingAsset);
    const allowanceResponse = await erc20Instance.allowance(state?.wallet?.connection?.accounts[0], optionsSettlementEngineAddress);

    if (allowanceResponse?._hex === '0x00') {
      return false;
    }

    return true;
  };

  checkIfHasRequiredBalance = async (underlyingAsset, underlyingAmount, numberOfContracts) => {
    const state = store.getState();
    const erc20 = state?.wallet?.connection?.erc20;
    const erc20Instance = erc20(underlyingAsset);
    const underlyingAssetBalance = await erc20Instance.balanceOf(state?.wallet?.connection?.accounts[0]);
    const totalUnderlyingAmount = underlyingAmount * numberOfContracts;

    console.log({
      underlyingAssetBalance,
      totalUnderlyingAmount,
    });

    return underlyingAssetBalance > totalUnderlyingAmount;
  };

  handleVerifyHash = async (contractWithSigner = {}, chainHash = '') => {
    try {
      return contractWithSigner.hashToOptionToken(chainHash);
    } catch (exception) {
      console.warn(exception);
    }
  };

  handleGetChainHash = (contractWithSigner = {}, chain = {}) => {
    // const encodings = {
    //   web3abi: web3.eth.abi.encodeParameters(
    //     ['address', 'uint40', 'uint40', 'address', 'uint96', 'uint160', 'uint96'],
    //     Object.values(chain)
    //   ),
    //   ethersabi: ethers.utils.defaultAbiCoder.encode([
    //     'address',
    //     'uint40',
    //     'uint40',
    //     'address',
    //     'uint96',
    //     'uint160',
    //     'uint96',
    //   ], Object.values(chain))
    // };

    // const hashes = {
    //   web3Hash: web3.utils.sha3(
    //     web3.eth.abi.encodeParameters(
    //       ['address', 'uint40', 'uint40', 'address', 'uint96', 'uint160', 'uint96'],
    //       Object.values(chain)
    //     ),
    //   ),
    //   ethersKeccak256: ethers.utils.keccak256(
    //     ethers.utils.defaultAbiCoder.encode([
    //       'address',
    //       'uint40',
    //       'uint40',
    //       'address',
    //       'uint96',
    //       'uint160',
    //       'uint96',
    //     ], Object.values(chain))
    //   ),
    //   ethersSHA256: ethers.utils.sha256(
    //     ethers.utils.defaultAbiCoder.encode([
    //       'address',
    //       'uint40',
    //       'uint40',
    //       'address',
    //       'uint96',
    //       'uint160',
    //       'uint96',
    //     ], Object.values(chain))
    //   ),
    //   solidityKeccak256: ethers.utils.solidityKeccak256([
    //     'address',
    //     'uint40',
    //     'uint40',
    //     'address',
    //     'uint96',
    //     'uint160',
    //     'uint96',
    //   ], Object.values(chain)),
    // };

    // return Promise.all(Object.entries(hashes).map(async ([hashName, hashValue]) => {
    //   return {
    //     hashName,
    //     hashValue,
    //     encodings,
    //     result: await this.handleVerifyHash(contractWithSigner, hashValue),
    //   };
    // }));

    const values = Object.values(chain);
    const valuesWithTypes = [
      'address',
      'uint40',
      'uint40',
      'address',
      'uint96',
      'uint160',
      'uint96',
    ].map((type, index) => {
      return { t: type, v: values[index] };
    });

    return web3.utils.soliditySha3(...valuesWithTypes);
  };

  handleGetOptionType = () => {
    return {
      underlyingAsset: this.state.underlyingAsset,
      exerciseTimestamp: ethers.BigNumber.from(moment(this.state.exerciseTimestamp).unix()),
      expiryTimestamp: ethers.BigNumber.from(moment(this.state.expiryTimestamp).unix()),
      exerciseAsset: this.state.exerciseAsset,
      exerciseAmount: ethers.utils.parseEther(this?.state?.exerciseAmount),
      settlementSeed: ethers.BigNumber.from(0),
      underlyingAmount: ethers.utils.parseEther(this?.state?.underlyingAmount),
    };
  };

  handleGetConnection = () => {
    const state = store.getState();
    const connection = state?.wallet?.connection;
    return connection;
  };

  handleWriteOption = async (event) => {
    event.preventDefault();

    this.setState({ writingOption: true, lowBalanceWarning: null }, async () => {
      this.connection = this.handleGetConnection();

      const contract = this.connection?.contract;
      const signer = this.connection?.signer;

      this.contractWithSigner = contract ? contract.connect(signer) : null;
      this.chain = this.handleGetOptionType();

      const hasRequiredBalance = await this.checkIfHasRequiredBalance(
        this.chain.underlyingAsset,
        this.chain.underlyingAmount,
        this.state.numberOfContracts,
      );
  
      if (!hasRequiredBalance) {
        this.setState({ writingOption: false, lowBalanceWarning: `Balance of underlying asset too low to write.` });
        return;
      }

      // TODO(Check if a chain of this type already exists by doing a lookup)
      this.setState({ writingOption: true }, () => {
        this.contractWithSigner.newChain(this.chain).then(async (response) => {
          this.contractWithSigner.on('NewChain', async (optionId) => {
            this.optionId = optionId;
            this.handleWriteContract();
          });
        }).catch((error) => {
          console.dir(error);
        });
      });
    });
  };

  render() {
    const {
      numberOfContracts,
      exerciseTimestamp,
      expiryTimestamp,
      exerciseAsset,
      exerciseAmount,
      underlyingAsset,
      underlyingAmount,
      lowBalanceWarning,
      needsApproval,
      writingOption,
    } = this.state;

    // TODO(This should ideally present the user with a few common asset/strike/expiry/exercise to write)
    // Will help liquidity fragmentation, and this present screen will be a "custom" option
    // Out of scope for MVP.
    return (
      <Vault>
        <StyledNewOption>
          <header>
            <h4>Write New Option</h4>
          </header>
          <form disabled={writingOption} onSubmit={this.handleWriteOption}>
            <div className="contract-options">
              <div className="form-row">
                <div className="form-input-group">
                  <label htmlFor="numberOfContracts">Number of Contracts</label>
                  <Amount
                    label="#"
                    paddingLeft="65px"
                    value={numberOfContracts}
                    onChange={(event) => {
                      this.setState({ numberOfContracts: event.target.value });
                    }}
                  />
                </div>
                <div className="form-input-group">
                  <label htmlFor="exerciseTimestamp">Exercise From Date</label>
                  <DateTime
                    timeFormat={false}
                    value={moment(exerciseTimestamp)}
                    onChange={(date) => {
                      // NOTE: date is a moment() object, here format it as an ISO-8601 string.
                      this.setState({ exerciseTimestamp: date.format() });
                    }}
                  />
                </div>
                <div className="form-input-group">
                  <label htmlFor="expiryTimestamp">Expiration Date</label>
                  <DateTime
                    timeFormat={false}
                    value={moment(expiryTimestamp)}
                    onChange={(date) => {
                      // NOTE: date is a moment() object, here format it as an ISO-8601 string.
                      this.setState({ expiryTimestamp: date.format() });
                    }}
                  />
                </div>
              </div>
            </div>
            <div className="asset">
              <header>
                <h4>Exercise Asset</h4>
              </header>
              <div className="form-row">
                <div className="form-input-group">
                  <label htmlFor="exerciseAsset">Asset</label>
                  <TokenSelect
                    value={exerciseAsset}
                    onChange={(asset) => {
                      this.setState({ exerciseAsset: asset });
                    }}
                  />
                </div>
              </div>
              <div className="form-input-group">
                <label htmlFor="exerciseAmount">Amount</label>
                <Amount
                  label="Ether"
                  paddingLeft="108px"
                  value={exerciseAmount}
                  onChange={(event) => {
                    this.setState({ exerciseAmount: event?.target?.value });
                  }}
                />
              </div>
            </div>
            <div className="asset">
              <header>
                <h4>Underlying Asset</h4>
              </header>
              <div className="form-row">
                <div className="form-input-group">
                  <label htmlFor="underlyingAsset">Asset</label>
                  <TokenSelect
                    value={underlyingAsset}
                    onChange={(asset, assetName) => {
                      this.setState({ underlyingAsset: asset, underlyingAssetName: assetName });
                    }}
                  />
                </div>
              </div>
              <div className="form-input-group">
                <label htmlFor="underlyingAmount">Amount</label>
                <Amount
                  label="Ether"
                  paddingLeft="108px"
                  value={underlyingAmount}
                  onChange={(event) => {
                    this.setState({ underlyingAmount: event?.target?.value });
                  }}
                />
              </div>
            </div>
            <Warning center>
              <p><strong>👉</strong> Valorem charges a 0.05% fee in order to exercise this option.</p>
            </Warning>
            {lowBalanceWarning && (
              <p className="low-balance-warning">{lowBalanceWarning}</p>
            )}
            <Button disabled={writingOption} type="submit" theme="purple-blue">
              {writingOption ? 'Writing option...' : 'Write New Option'}
            </Button>
          </form>
        </StyledNewOption>
        <OptionModal
          hide={false}
          open={!!needsApproval}
          needsApproval={needsApproval}
          option={{
            numberOfContracts,
            exerciseTimestamp,
            expiryTimestamp,
            underlyingAsset,
            underlyingAmount,
            exerciseAmount,
            exerciseAsset,
            needsApproval,
          }}
          onApprove={() => {
            this.handleApproveToken(underlyingAsset, underlyingAmount, numberOfContracts, () => {
              this.handleWriteContract();
            });
          }}
        />
      </Vault>
    );
  }
}

NewOption.propTypes = {
  // prop: PropTypes.string.isRequired,
};

export default NewOption;
