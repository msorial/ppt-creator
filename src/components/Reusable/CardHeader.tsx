import { Title } from '@mantine/core';

interface CardHeaderProps {
  title: string;
}

const CardHeader: React.FC<CardHeaderProps> = ({ title }) => {
  return (
    <Title
      order={3}
      variant='gradient'
      gradient={{ from: '#373B44', to: '#4286f4', deg: 45 }}
      ta='center'
    >
      {title}
    </Title>
  );
};

export default CardHeader;
