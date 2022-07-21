import React, { FC, useCallback, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import useElementSize from "../../lib/hooks/useElementSize";

const Input = styled.input`
  border: 1px solid var(--cool-gray);
  background-color: #fff;
  border-radius: 4px;
  color: var(--gray-800);
  font-size: 16px;
  padding: 16px 20px;
  width: 100%;
`;

const InnerLabel = styled.div<{ position: "left" | "right" }>`
  align-items: center;
  display: flex;
  color: var(--gray-500);
  position: absolute;
  left: ${(props) => (props.position === "left" ? "0px" : "")};
  right: ${(props) => (props.position === "right" ? "0px" : "")};
  top: 0;
  bottom: 0;
  padding: 0 20px;
  font-size: 16px;
  pointer-events: none;
`;

const FLOATING_POINT_REGEX = /^[Ee0-9+\-.]$/;

function isFloatingPointNumericCharacter(character: string) {
  return FLOATING_POINT_REGEX.test(character);
}

interface Props {
  innerLabel?: string;
  innerLabelPosition?: "left" | "right";
}

const NumberInput: FC<Props> = ({ innerLabel, innerLabelPosition }) => {
  const [value, setValue] = useState("");
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [elRef, { width }] = useElementSize();

  useEffect(() => {
    if (innerLabel && innerLabelPosition === "left") {
      inputRef.current.style.paddingLeft = `${width}px`;
    }

    if (innerLabel && innerLabelPosition === "right") {
      inputRef.current.style.paddingRight = `${width}px`;
    }
  }, [innerLabel, innerLabelPosition, width]);

  const sanitize = (value: string) => {
    return value.split("").filter(isFloatingPointNumericCharacter).join("");
  };

  const onChange = (_event: React.ChangeEvent<HTMLInputElement>) => {
    const event = _event.nativeEvent as InputEvent;
    if (event.isComposing) {
      return;
    }

    const sanitizedValue = sanitize(_event.currentTarget.value);

    setValue(sanitizedValue);
  };

  const onBlur = () => {
    // If user types something like "2.", something that ends with a '.'
    // but no decimals, this removes the trailing '.'.
    if (value !== "") {
      setValue(parseFloat(value).toString());
    }
  };

  return (
    <div className="relative">
      {innerLabel && (
        <InnerLabel ref={elRef} position={innerLabelPosition}>
          {innerLabel}
        </InnerLabel>
      )}
      <Input
        data-testid="NumberInput__input"
        ref={inputRef}
        onBlur={onBlur}
        onChange={onChange}
        value={value}
      />
    </div>
  );
};

NumberInput.defaultProps = {
  innerLabelPosition: "left",
};

export default NumberInput;
