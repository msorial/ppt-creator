import { Button } from '@mantine/core';
import { IconSend } from '@tabler/icons-react';
import React from 'react';

interface ApprovalButtonProps {
  onClick?: () => void;
}

const ApprovalButton: React.FC<ApprovalButtonProps> = ({ onClick }) => {
  return (
    <Button onClick={onClick} rightIcon={<IconSend size={14} />} color='dark'>
      Submit For Approval
    </Button>
  );
};

export default ApprovalButton;
