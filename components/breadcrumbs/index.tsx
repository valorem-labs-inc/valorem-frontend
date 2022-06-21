import Link from "next/link";
import Router from "next/router";
import React from "react";

import StyledBreadcrumbs from "./index.css";

type Breadcrumb = {
  label: string;
  href: string;
}

type BreadcrumbsProps = {
};

type BreadcrumbsState = {
  breadcrumbs: Breadcrumb[];
  path: string;
}

class Breadcrumbs extends React.Component<BreadcrumbsProps, BreadcrumbsState> {
  state: BreadcrumbsState = {
    breadcrumbs: [],
    path: '',
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

export default Breadcrumbs;
