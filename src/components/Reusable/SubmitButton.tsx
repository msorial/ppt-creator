import { Button } from '@mantine/core';
import { IconSend } from '@tabler/icons-react';
import React, { useState } from 'react';
import useUi from '../../store/useUi';

interface SubmitButtonProps {
  onClick?: () => void;
  disabled?: boolean;
}



const SubmitButton: React.FC<SubmitButtonProps> = ({ onClick }) => {
  const { darkMode } = useUi();
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
        rightIcon={<IconSend size={14} />}
        color={darkMode ? 'gray' : 'dark'}
      >
        Submit
      </Button>
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
  );
};

export default SubmitButton;
