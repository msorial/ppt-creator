import { useDisclosure } from '@mantine/hooks';
import { Modal, Group, Button } from '@mantine/core';import React from 'react';
import useUi from '../../store/useUi';

interface SubmitButtonProps {
  onClick?: () => void;
  disabled?: boolean;
}

const PasswordModal: React.FC<SubmitButtonProps> = ({ onClick, disabled }) => {
  const { darkMode } = useUi();
  const [opened, setOpened] = useState<boolean>(false);

  return (
    <>
      <Modal opened={opened} onClose={close} title="Authentication" centered>
        {/* Modal content */}
      </Modal>

      <Group position="center">
        <Button onClick={open}>Open centered Modal</Button>
      </Group>
    </>
  );
};

export default PasswordModal;
