import styled from "@emotion/styled";
import { onValue, ref, set } from "firebase/database";
import { FC, RefObject, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

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
  onClose(): void;
};

const JoinInviteModal: FC<Props> = ({ isOpen, onClose }) => {
  const handleCloseModal = useCallback(() => {
    onClose();
  }, [onClose]);

  const navigate = useNavigate();

  const inviteCodeRef: RefObject<HTMLInputElement> = useRef(null);

  const handleJoinInvite = useCallback(() => {
    const inviteCode = inviteCodeRef.current?.value;
    navigate(`${ROOT_URL}/join/${inviteCode}`);
  }, [onClose]);

  return (
    <Modal isOpen={isOpen} onClose={handleCloseModal}>
      <PlayerContainer>
        <InputContainer>
          <Label>Enter Invite Code:</Label>
          <Input name="inviteCode" forwardRef={inviteCodeRef}></Input>
        </InputContainer>
      </PlayerContainer>
      <ButtonContainer>
        <Button variant="text" onClick={handleCloseModal}>
          Cancel
        </Button>
        <Button variant="text" onClick={handleJoinInvite}>
          Join
        </Button>
      </ButtonContainer>
    </Modal>
  );
};

export default JoinInviteModal;
