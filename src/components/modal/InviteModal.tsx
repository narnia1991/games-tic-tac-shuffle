import styled from "@emotion/styled";
import { onValue, ref, set } from "firebase/database";
import { FC, RefObject, useCallback, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { ROOT_URL } from "../../App";
import { db } from "../../firebase";
import { fallBackFont, textPrimary } from "../../variables";
import Button from "../common/Button";
import Input from "../common/Input";
import Modal from "../common/Modal";

const Container = styled.div`
  display: flex;
`;

const ButtonContainer = styled(Container)`
  justify-content: flex-end;
  margin-right: 1rem;
  align-items: flex-end;
`;

const PlayerContainer = styled(Container)`
  flex-direction: column;
  height: 70%;
  padding: 3rem;
`;

const InputContainer = styled(Container)`
  align-items: center;
  margin: 1rem;
`;

const Label = styled.label`
  color: ${textPrimary};
  margin-right: 2rem;
  font-family: ${fallBackFont};
  font-size: 1.5rem;
`;

type Props = {
  isOpen: boolean;
  onClose?: () => void;
};

const InviteModal: FC<Props> = ({ isOpen, onClose }) => {
  const location = useLocation();
  const uuid = location.pathname.split(`${ROOT_URL}/`)[1];

  const handleCloseModal = useCallback(() => {
    onClose?.();
  }, [ROOT_URL]);

  return (
    <Modal isOpen={isOpen} onClose={handleCloseModal}>
      <PlayerContainer>
        <Label>Send this link to your opponent</Label>
        <br />
        <Label>{`https://narnia1991.github.io${ROOT_URL}/join/${uuid}`}</Label>
        <br />
        <br />
        <Label>or </Label>
        <br />
        <Label>Let them join using this code </Label>
        <br />
        <Label>{uuid}</Label>
      </PlayerContainer>
      <ButtonContainer>
        <Button variant="text" onClick={handleCloseModal}>
          Ok
        </Button>
      </ButtonContainer>
    </Modal>
  );
};

export default InviteModal;
