import { FC, useEffect, useLayoutEffect, useState } from "react";
import styled from "styled-components";
import useEventListener from "../../lib/hooks/useEventListener";
import VaultNavigation from "../vaultNavigation";

function useMediaQuery(query: string): boolean {
  const getMatches = (query: string): boolean => {
    // Prevents SSR issues
    if (typeof window !== "undefined") {
      return window.matchMedia(query).matches;
    }
    return false;
  };

  const [matches, setMatches] = useState<boolean>(getMatches(query));

  function handleChange() {
    setMatches(getMatches(query));
  }

  useEffect(() => {
    const matchMedia = window.matchMedia(query);

    // Triggered at the first client-side load and if query changes
    handleChange();

    // Listen matchMedia
    if (matchMedia.addListener) {
      matchMedia.addListener(handleChange);
    } else {
      matchMedia.addEventListener("change", handleChange);
    }

    return () => {
      if (matchMedia.removeListener) {
        matchMedia.removeListener(handleChange);
      } else {
        matchMedia.removeEventListener("change", handleChange);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  return matches;
}

const Wrapper = styled.div`
  background-color: rgba(0, 0, 0, 0.2);
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 99999999;
`;

const Overlay = styled.div`
  background-color: black;
  width: 100px;
  height: 100px;
`;

const Menu = styled.div`
  background-color: #fff;
  width: 420px;
  height: 100vh;

  .top-area {
    align-items: center;
    display: flex;
    height: 84px;
    padding: 0 16px;
  }
`;

const CloseButton = styled.button`
  background-color: transparent;
  border: none;
  border-radius: 99999px;
  color: var(--gray-500);
  padding: 4px;

  svg {
    display: block;
    height: 32px;
    width: 32px;
  }
`;

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
