import * as React from "react";
import { render, RenderOptions } from "@testing-library/react";

const AllTheProviders: React.FC = ({ children }) => {
  return (
    <div>
      <div>
        <div>{children}</div>
      </div>
    </div>
  );
};

const customRender = (
  ui: React.ReactElement,
  options?: Omit<RenderOptions, "wrapper">
) => render(ui, { wrapper: AllTheProviders, ...options });

export * from "@testing-library/react";
export { customRender as render };
