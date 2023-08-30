import {
  ActionIcon,
  Group,
  LoadingOverlay,
  Menu,
  Overlay,
  Text,
} from '@mantine/core';
import { IconCircleCheck, IconDotsVertical, IconX } from '@tabler/icons-react';
import useDates from '../../store/useDates';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ApprovalButton from './ApprovalButton';

export interface EndpointCheckProps {
  vespers: boolean;
  matins: boolean;
  offering: boolean;
  liturgyOfWord: boolean;
  liturgyOfFaithful: boolean;
  communion: boolean;
}

const JumpButton = () => {
  const navigate = useNavigate();
  const { apiDate } = useDates();
  const [loading, setLoading] = useState<boolean>(true);
  const [disabled, setDisabled] = useState<boolean>(true);
  const [endpointCheck, setEndpointCheck] = useState<EndpointCheckProps>();

  useEffect(() => {
    setLoading(true);
  }, [apiDate]);

  const fetchEndpoints = () => {
    if (apiDate !== undefined) {
      fetch('https://stmarkapi.com:5000/getAll?date=' + apiDate)
        .then((response) => response.json())
        .then((data) => {
          setEndpointCheck(data);
          setLoading(false);
          setDisabled(Object.values(data).some((value) => value === false));
        })
        .catch((error) => {
          console.error('Error fetching API data:', error);
        });
    }
  };

  const handleSubmit = () => {
    axios
      .post('https://stmarkapi.com:5000/makeppt?date=' + apiDate)
      .then(() => {
        navigate('/success');
      })
      .catch((error) => {
        console.error('Error submitting data:', error);
      });
  };

  return (
    <Menu shadow='md' width={200} position='right-start'>
      <Menu.Target>
        <ActionIcon color='blue' variant='light' onClick={fetchEndpoints}>
          <IconDotsVertical size={16} stroke={1.5} />
        </ActionIcon>
      </Menu.Target>

      <Menu.Dropdown>
        {!apiDate && (
          <Overlay
            color='#323232'
            opacity={0.95}
            center
            sx={{ borderRadius: '0.25rem' }}
          >
            <Text fw={500} color='white'>
              Select Date
            </Text>
          </Overlay>
        )}

        <LoadingOverlay
          visible={apiDate === undefined ? false : loading}
          overlayBlur={2}
          transitionDuration={150}
        />

        <Menu.Label>Services</Menu.Label>
        <Menu.Divider />
        <Menu.Item
          icon={
            endpointCheck?.vespers ? (
              <IconCircleCheck size={14} stroke={1.5} color='green' />
            ) : (
              <IconX size={14} stroke={1.5} color='red' />
            )
          }
          onClick={() => navigate(`/vespers`)}
        >
          Vespers
        </Menu.Item>
        <Menu.Item
          icon={
            endpointCheck?.matins ? (
              <IconCircleCheck size={14} stroke={1.5} color='green' />
            ) : (
              <IconX size={14} stroke={1.5} color='red' />
            )
          }
          onClick={() => navigate(`/matins`)}
        >
          Matins
        </Menu.Item>
        <Menu.Item
          icon={
            endpointCheck?.offering ? (
              <IconCircleCheck size={14} stroke={1.5} color='green' />
            ) : (
              <IconX size={14} stroke={1.5} color='red' />
            )
          }
          onClick={() => navigate(`/offering`)}
        >
          Offering
        </Menu.Item>
        <Menu.Item
          icon={
            endpointCheck?.liturgyOfWord ? (
              <IconCircleCheck size={14} stroke={1.5} color='green' />
            ) : (
              <IconX size={14} stroke={1.5} color='red' />
            )
          }
          onClick={() => navigate(`/liturgyOfWord`)}
        >
          Liturgy of the Word
        </Menu.Item>
        <Menu.Item
          icon={
            endpointCheck?.liturgyOfFaithful ? (
              <IconCircleCheck size={14} stroke={1.5} color='green' />
            ) : (
              <IconX size={14} stroke={1.5} color='red' />
            )
          }
          onClick={() => navigate(`/liturgyOfFaithful`)}
        >
          Liturgy of the Faithful
        </Menu.Item>
        <Menu.Item
          icon={
            endpointCheck?.communion ? (
              <IconCircleCheck size={14} stroke={1.5} color='green' />
            ) : (
              <IconX size={14} stroke={1.5} color='red' />
            )
          }
          onClick={() => navigate(`/communion`)}
        >
          Communion
        </Menu.Item>

        <Group position='center' sx={{ padding: '10px 10px 8px' }}>
          <ApprovalButton onClick={handleSubmit}/>
        </Group>
      </Menu.Dropdown>
    </Menu>
  );
};

export default JumpButton;
