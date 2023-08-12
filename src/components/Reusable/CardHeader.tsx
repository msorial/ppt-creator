import { Title } from '@mantine/core';

interface CardHeaderProps {
  header: string;
}

const CardHeader: React.FC<CardHeaderProps> = ({ header }) => {
  return (
    <Title
      order={3}
      variant='gradient'
      gradient={{ from: '#4286f4', to: '#0083B0', deg: 45 }}
      ta='center'
    >
      {header}
    </Title>
  );
};

export default CardHeader;
