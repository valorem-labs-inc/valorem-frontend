import React from "react";
import Router from "next/router";
import queryString from "query-string";
import moment from "moment";
import { ethers } from "ethers";
import _ from "lodash";
import Vault from "../../../layouts/vault";
import Button from "../../../components/button";
import OptionModal from "../../../components/optionModal";
import Loader from "../../../components/loader";
import { options as optionsQuery } from "../../../graphql/queries/options";
import store from "../../../lib/store";
import graphql from "../../../graphql/client";
import unfreezeApolloCacheValue from "../../../lib/unfreezeApolloCacheValue";
import getToken from "../../../lib/getToken";

import StyledOptions from "./index.css.js";
import BlankState from "../../../components/blankState";

class Options extends React.Component {
  state = {
    list: "active",
    optionsModalOpen: false,
    option: null,
    loading: true,
    options: [],
  };

  async componentDidMount() {
    const queryParams = queryString.parse(location.search);

    if (queryParams?.option) {
      return this.setState({
        optionsModalOpen: true,
        option: queryParams.option,
      });
    }

    await this.handleFetchOptions();
  }

  handleFetchOptions = async (list = "active") => {
    this.setState({ loading: true }, async () => {
      const state = store.getState();
      const query = {
        query: optionsQuery,
        skip: !state?.wallet?.connection?.accounts[0],
        variables: {
          account: state?.wallet?.connection?.accounts[0].toLowerCase(),
        },
      };

      const { data } = await graphql.query(query);
      const optionsData = data?.account?.ERC1155balances.filter(
        (item) => item.token.type === 1);
      const sanitizedData = unfreezeApolloCacheValue(optionsData || []);

      const sortedAndFormattedData = _.sortBy(
        sanitizedData,
        "expiryTimestamp"
      )?.map((tokenData) => {
        return {
          ...tokenData,
          // TODO(In our display for unknown tokens, we should )
          // TODO(These decimals should be taken from the ERC20 contract for non standard tokens to display correctly)
          // TODO(Exponential notation here may be more useful than decimals?)
          balance: tokenData?.valueExact,
          exerciseAmount: ethers.utils.formatEther(tokenData?.token.option.exerciseAmount),
          underlyingAmount: ethers.utils.formatEther(tokenData?.token.option.underlyingAmount),
          underlyingAsset: getToken(tokenData?.token.option.underlyingAsset),
          exerciseAsset: getToken(tokenData?.token.option.exerciseAsset),
          exerciseTimestamp: moment(tokenData?.token.option.exerciseTimestamp, "X").format(),
          expiryTimestamp: moment(tokenData?.token.option.expiryTimestamp, "X").format(),
        };
      });

      this.setState({
        loading: false,
        options: sortedAndFormattedData,
      });
    });
  };

  handleSetList = (list = "active") => {
    this.setState({ list }, () => {
      this.handleFetchOptions(list);
    });
  };

  handleOpenOptionModal = () => {
    this.setState({ optionsModalOpen: true });
  };

  render() {
    const { list, optionsModalOpen, option, loading, options } = this.state;

    return (
      <>
        <Vault>
          <StyledOptions>
            <header>
              <h4>Options</h4>
              <Button
                theme="purple-blue"
                onClick={() => Router.push("/vault/options/new")}
              >
                Write Options
              </Button>
            </header>
            <div className="tabs">
              <ul>
                <li
                  className={list === "active" ? `active` : ""}
                  onClick={() => this.handleSetList("active")}
                >
                  Active
                </li>
                <li
                  className={list === "expired" ? `active` : ""}
                  onClick={() => this.handleSetList("expired")}
                >
                  Expired
                </li>
              </ul>
            </div>
            {loading && <Loader />}
            {!loading && options?.length === 0 && (
              <BlankState
                title={
                  {
                    active: "You aren't holding any active options.",
                    expired: "You aren't holding any expired options.",
                  }[list]
                }
                subtitle={
                  {
                    active:
                      'To write a new option, click the "Write Option" button above.',
                    expired:
                      "Once options you've hold have expired, they will display here.",
                  }[list]
                }
              />
            )}
            {!loading && options?.length > 0 && (
              <div className="options">
                <ul>
                  {options?.map((item, itemIndex) => {
                    return (
                      <li
                        key={`item-${item?.id}`}
                        className={`option ${
                          list === "expired" ? "expired" : ""
                        }`}
                        onClick={() => this.handleOpenOptionModal(item)}
                      >
                        <div className="option-row">
                          <div className="option-datapoint">
                            <h5>Balance</h5>
                            <h4>{item?.balance || 0}</h4>
                          </div>
                        </div>
                        <div className="option-row">
                          <div className="option-datapoint">
                            <h5>Exercise Date</h5>
                            <h4>
                              {moment(item?.exerciseTimestamp).format(
                                "MMM Do, YYYY"
                              )}
                            </h4>
                          </div>
                          <div className="option-datapoint">
                            <h5>Expiry Date</h5>
                            <h4>
                              {moment(item?.expiryTimestamp).format(
                                "MMM Do, YYYY"
                              )}
                            </h4>
                          </div>
                        </div>
                        <div className="option-row">
                          <div className="option-datapoint">
                            <h5>Underlying Asset Amount</h5>
                            <h4>
                              {item?.underlyingAmount > 0
                                ? item?.underlyingAmount
                                : "~"}{" "}
                              {item?.underlyingAsset?.symbol}{" "}
                              <span>(x {item?.balance || 0})</span>
                            </h4>
                          </div>
                          <div className="option-datapoint">
                            <h5>Exercise Asset Amount</h5>
                            <h4>
                              {item?.exerciseAmount > 0
                                ? item?.exerciseAmount
                                : "~"}{" "}
                              {item?.exerciseAsset?.symbol}{" "}
                              <span>(x {item?.balance || 0})</span>
                            </h4>
                          </div>
                        </div>
                        <Button theme="purple-blue">View Option</Button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
          </StyledOptions>
        </Vault>
        <OptionModal
          open={optionsModalOpen}
          option={option}
          onClose={() => {
            this.setState({ optionsModalOpen: false }, () => {
              Router.router.push("/vault/options");
            });
          }}
        />
      </>
    );
  }
}

export default Options;
