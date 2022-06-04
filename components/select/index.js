import React from "react";
import PropTypes from "prop-types";
import _ from "lodash";
import Fuse from "fuse.js";
import AngleDown from "../icons/AngleDown";

import StyledSelect from "./index.css.js";

class Select extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: "",
      search: "",
      searchResults: [],
      showDropdown: false,
    };

    this.searchInput = React.createRef();
  }

  componentDidMount() {
    const { options } = this.props;
    this.searchIndex = new Fuse(options, {
      threshold: 0.1,
      keys: ["label"],
    });
  }

  handleSearch = (search = "") => {
    const searchResults = this.searchIndex.search(search);
    this.setState({
      search,
      searching: true,
      searchResults,
      showDropdown: true,
    });
  };

  handleSelectOption = (option, label) => {
    const { onChange } = this.props;
    this.setState(
      { value: option, searching: false, showDropdown: false },
      () => {
        onChange(option, label);
      }
    );
  };

  getSelectedOption = () => {
    const { options } = this.props;
    const { value } = this.state;
    return options?.find((option) => option.value === value);
  };

  handleToggleSelect = () => {
    this.setState(
      {
        showDropdown: true,
        search: "",
        value: "",
        selectedOption: null,
        searchResults: [],
      },
      () => {
        if (this.state.searching && this.searchInput.current) {
          setTimeout(() => this.searchInput.current.focus(), 300);
        }
      }
    );
  };

  render() {
    const { options, placeholder, value, onChange } = this.props;
    const { searching, searchResults, showDropdown } = this.state;
    const selectedOption = this.getSelectedOption();
    const optionsToRender =
      searchResults?.length > 0
        ? searchResults?.map(({ item }) => item)
        : options;

    return (
      <StyledSelect>
        <div
          tabIndex="0"
          className={`select-input ${showDropdown ? "open" : ""}`}
          onClick={this.handleToggleSelect}
        >
          {(searching || !selectedOption) && (
            <input
              ref={this.searchInput}
              placeholder={placeholder || "Select an option..."}
              onChange={(event) => this.handleSearch(event?.target?.value)}
            />
          )}
          {!searching && selectedOption && (
            <div className="selected-option">
              {/* NOTE: Disabling logos as the data is inconsistent and many return 404s. */}
              {/* <img src={selectedOption.logo} alt={selectedOption.label} /> */}
              {selectedOption.label}
            </div>
          )}
          <AngleDown />
        </div>
        {showDropdown && optionsToRender?.length > 0 && (
          <div className="select-options">
            <ul>
              {_.sortBy(optionsToRender, "label")?.map((option) => {
                return (
                  <li
                    tabIndex="0"
                    key={option.value}
                    onKeyDown={(event) => {
                      if (event.keyCode === 13) {
                        this.handleSelectOption(option.value, option.label);
                      }
                    }}
                    onClick={() =>
                      this.handleSelectOption(option.value, option.label)
                    }
                  >
                    {option?.logo && (
                      <img src={option.logo} alt={option.label} />
                    )}{" "}
                    {option.label}
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </StyledSelect>
    );
  }
}

Select.propTypes = {
  // prop: PropTypes.string.isRequired,
};

export default Select;
