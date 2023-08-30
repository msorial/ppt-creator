import { Button, Group, Modal, PinInput } from '@mantine/core';
import { IconSend } from '@tabler/icons-react';
import React, { useState } from 'react';
import useUi from '../../store/useUi';
import { useDisclosure } from '@mantine/hooks';

interface SubmitButtonProps {
  onClick?: () => void;
  disabled?: boolean;
}



const SubmitButton: React.FC<SubmitButtonProps> = ({ onClick }) => {
  const { darkMode } = useUi();
<<<<<<< Updated upstream
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [enteredPassword, setEnteredPassword] = useState('');
  const correctPassword = 'yourCorrectPassword'; // Replace with the actual correct password

  const handlePasswordChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
    setEnteredPassword(event.target.value);
  };

  const handleButtonClick = () => {
    setIsModalOpen(true);
  };

  const handleModalConfirm = () => {
    if (enteredPassword === correctPassword) {
      onClick(); // Perform the action
      setIsModalOpen(false);
    }
  };

  const handleModalCancel = () => {
    setIsModalOpen(false);
    setEnteredPassword('');
  };

  return (
    <div>
      <Button
        onClick={handleButtonClick}
        disabled={isModalOpen}
=======
  const [opened, { open, close }] = useDisclosure(false);

  const [enteredPassword, setEnteredPassword] = useState('');
  const correctPassword = '1234'; // Replace with the actual correct password

  // const handlePasswordChange = (event: {
  //   target: { value: React.SetStateAction<string> };
  // }) => {
  //   setEnteredPassword(event.target.value);
  // };

  // const handleButtonClick = () => {
  //   setOpened(true);
  // };

  // const handleModalConfirm = () => {
  //   if (enteredPassword === correctPassword) {
  //     onClick(); // Perform the action
  //     setOpened(false);
  //   }
  // };

  // const handleModalCancel = () => {
  //   setOpened(false);
  //   setEnteredPassword('');
  // };

  return (
    <>
      <Modal opened={opened} onClose={close} title='Authentication' centered>
        <Group position='center'>
          <PinInput />
        </Group>
      </Modal>

      <Button
        onClick={() => {
          onClick;
          open;
        }}
        disabled={disabled}
>>>>>>> Stashed changes
        rightIcon={<IconSend size={14} />}
        color={darkMode ? 'gray' : 'dark'}
      >
        Submit
      </Button>
<<<<<<< Updated upstream
      {isModalOpen && (
        <div>
          <input
            type="password"
            placeholder="Enter password"
            value={enteredPassword}
            onChange={handlePasswordChange}
          />
          <button onClick={handleModalConfirm}>Confirm</button>
          <button onClick={handleModalCancel}>Cancel</button>
        </div>
      )}
    </div>
=======
    </>
>>>>>>> Stashed changes
  );
};

export default SubmitButton;
