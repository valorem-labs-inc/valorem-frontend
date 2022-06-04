import React from "react";
import Router from "next/router";
import PropTypes from "prop-types";
import Link from "next/link";

import StyledBreadcrumbs from "./index.css.js";

class Breadcrumbs extends React.Component {
  state = {
    breadcrumbs: [],
  };

  componentDidMount() {
    const pathParts = Router.asPath
      ?.split("/")
      .filter((part) => part?.trim() !== "");
    this.setState({
      path: Router.asPath,
      breadcrumbs: pathParts?.map((part, partIndex) => {
        const previousParts = pathParts.slice(0, partIndex);
        return {
          label: part?.split("?").shift(),
          href:
            previousParts?.length > 0
              ? `/${previousParts?.join("/")}/${part}`.split("?").shift()
              : `/${part}`.split("?").shift(),
        };
      }),
    });
  }

  render() {
    const { path, breadcrumbs } = this.state;

    return (
      <StyledBreadcrumbs>
        {breadcrumbs?.length > 0 && (
          <ul>
            {breadcrumbs?.map((breadcrumb, breadcrumbIndex) => {
              return (
                <li
                  key={breadcrumb?.href}
                  className={
                    breadcrumbIndex + 1 === breadcrumbs?.length ? "active" : ""
                  }
                >
                  <Link href={breadcrumb?.href}>{breadcrumb?.label}</Link>
                </li>
              );
            })}
          </ul>
        )}
      </StyledBreadcrumbs>
    );
  }
}

Breadcrumbs.propTypes = {
  // prop: PropTypes.string.isRequired,
};

export default Breadcrumbs;
