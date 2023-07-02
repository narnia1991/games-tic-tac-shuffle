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
  onClose(): void;
};

const JoinGameModal: FC<Props> = ({ isOpen, onClose }) => {
  const [matchDetails, setMatchDetails] = useState<any>({});
  const userId = localStorage.getItem("userId");
  const location = useLocation();
  const navigate = useNavigate();
  const uuid = location.pathname.split(`${ROOT_URL}/join/`)[1];
  const sessionRef = ref(db, uuid);
  const [isGameInvalid, setIsGameInvalid] = useState(false);

  const handleCloseModal = useCallback(() => {
    navigate(`${ROOT_URL}`, { replace: true });
  }, [navigate, ROOT_URL]);

  const p2Ref: RefObject<HTMLInputElement> = useRef(null);

  const handleJoinGame = useCallback(() => {
    const player2 = p2Ref.current;

    if (!player2) {
      return;
    }

    const p2Name = player2.value;

    try {
      set(sessionRef, {
        ...matchDetails,
        p2Id: userId,
        p2Name,
      });

      localStorage.setItem("playerType", "p2");

      onClose?.();

      navigate(`${ROOT_URL}/${uuid}`, { replace: true });
    } catch (err) {
      console.log(err);
    }
  }, [set, navigate, matchDetails, localStorage]);

  useEffect(() => {
    onValue(sessionRef, (snap) => {
      const data = snap.val();
      if (data) {
        if (data.matchType === "VSAI") {
          setIsGameInvalid(true);
          return;
        }
        setMatchDetails(data);
      }
    });
  }, []);

  return (
    <Modal isOpen={isOpen} onClose={handleCloseModal}>
      {!matchDetails.p1Id && <Label>Game Not Found</Label>}
      {!!matchDetails.p1Id && (
        <PlayerContainer>
          <Label>Game With: {matchDetails.p1Name}</Label>
          <br />
          <Label>No. of Matches: {matchDetails.rCount}</Label>
          <br />
          <InputContainer>
            <Label>Nickname:</Label>
            <Input name="player2" forwardRef={p2Ref}></Input>
          </InputContainer>
        </PlayerContainer>
      )}
      <ButtonContainer>
        <Button variant="text" onClick={handleCloseModal}>
          Cancel
        </Button>
        {!!matchDetails.p1Id && !isGameInvalid && (
          <Button variant="text" onClick={handleJoinGame}>
            Join
          </Button>
        )}
      </ButtonContainer>
    </Modal>
  );
};

export default JoinGameModal;
