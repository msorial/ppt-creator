import { Button, Group, Modal, PinInput } from '@mantine/core';
import { IconSend } from '@tabler/icons-react';
import React, { useState } from 'react';
import useUi from '../../store/useUi';
import { useDisclosure } from '@mantine/hooks';

interface SubmitButtonProps {
  onClick?: () => void;
  disabled?: boolean;
}

const SubmitButton: React.FC<SubmitButtonProps> = () => {
  const { darkMode } = useUi();
  const [opened, { open, close }] = useDisclosure(false);
  const [error, setError] = useState(false);
  const [pinValue, setPinValue] = useState('');
  //const [enteredPassword, setEnteredPassword] = useState('');
  const correctPassword = '1234'; // Replace with the actual correct password

  // const handlePasswordChange = (event: {
  //   target: { value: React.SetStateAction<string> };
  // }) => {
  //   setEnteredPassword(event.target.value);
  // };

  const handlePinComplete = () => {
    console.log('Pin Value:', pinValue);
    if (pinValue === correctPassword) {
      setError(false);
    } else {
      setError(true);
    }
  };

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
          <PinInput
            type={/^[0-9]+/}
            inputType='tel'
            inputMode='numeric'
            autoFocus={true}
            manageFocus={true}
            error={error}
            onComplete={handlePinComplete}
            onChange={(value) => setPinValue(value)}
          />
        </Group>
      </Modal>
      <Group position='center'>
        <Button
          onClick={open}
          rightIcon={<IconSend size={14} />}
          color={darkMode ? 'gray' : 'dark'}
        >
          Submit
        </Button>
      </Group>
    </>
  );
};

export default SubmitButton;
