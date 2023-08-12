import { Button } from '@mantine/core';
import { IconSend } from '@tabler/icons-react';
import axios from 'axios';
import useDates from '../../store/useDates';
import { useNavigate } from 'react-router-dom';

const SubmitButton = () => {
  const navigate = useNavigate();
  const { apiDate } = useDates();

  const handleSubmit = () => {
    axios
      .post('http://192.81.219.24:5000/makeppt?date=' + apiDate)
      .then(() => {
        navigate('/');
      })
      .catch((error) => {
        console.error('Error submitting data:', error);
      });
  };

  return (
    <Button
      onClick={handleSubmit}
      rightIcon={<IconSend size={14} />}
      color='dark'
    >
      Submit
    </Button>
  );
};

export default SubmitButton;
