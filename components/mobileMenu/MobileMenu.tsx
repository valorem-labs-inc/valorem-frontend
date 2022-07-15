import { FC, useEffect, useLayoutEffect } from "react";
import useEventListener from "../../lib/hooks/useEventListener";
import useMediaQuery from "../../lib/hooks/useMediaQuery";
import VaultNavigation from "../vaultNavigation";
import { CloseButton, Menu, Wrapper } from "./elements";

interface Props {
  onClose: () => void;
}

const MobileMenu: FC<Props> = ({ onClose }) => {
  const matches = useMediaQuery("(min-width: 640px)");

  useEffect(() => {
    if (matches) {
      onClose();
    }
  }, [matches, onClose]);

  useEventListener("click", (e: Event) => {
    // @ts-ignore
    if (e.target.getAttribute("id") === "wrapper") {
      onClose();
    }
  });

  useLayoutEffect(() => {
    // Get original body overflow
    const originalStyle = window.getComputedStyle(document.body).overflow;
    // Prevent scrolling on mount
    document.body.style.overflow = "hidden";
    // Re-enable scrolling when component unmounts
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, []); // Empty array ensures effect is only run on mount and unmount

  return (
    <Wrapper id="wrapper">
      <Menu>
        <div className="top-area">
          <CloseButton onClick={onClose}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </CloseButton>
        </div>
        <VaultNavigation />
      </Menu>
    </Wrapper>
  );
};

export default MobileMenu;
