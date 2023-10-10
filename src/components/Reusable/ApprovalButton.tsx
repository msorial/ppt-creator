import { Button } from '@mantine/core';
import { IconMailForward } from '@tabler/icons-react';
import React from 'react';

interface ApprovalButtonProps {
  onClick?: () => void;
  size?: string;
}

const ApprovalButton: React.FC<ApprovalButtonProps> = ({ onClick, size }) => {
  return (
    <Button
      onClick={onClick}
      rightIcon={<IconMailForward size={14} />}
      size={size}
    >
      Submit For Approval
    </Button>
  );
};

export default ApprovalButton;
