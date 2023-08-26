import { Button } from '@mantine/core';
import { IconMailForward } from '@tabler/icons-react';
import React from 'react';

interface ApprovalButtonProps {
  onClick?: () => void;
}

const ApprovalButton: React.FC<ApprovalButtonProps> = ({ onClick }) => {
  return (
    <Button onClick={onClick} rightIcon={<IconMailForward size={14} />}>
      Submit For Approval
    </Button>
  );
};

export default ApprovalButton;
