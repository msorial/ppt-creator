import { ActionIcon, Group, LoadingOverlay, Menu } from '@mantine/core';
import { IconCircleCheck, IconDotsVertical, IconX } from '@tabler/icons-react';
import useDates from '../../store/useDates';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SubmitButton from './SubmitButton';

const JumpButton = () => {
  const navigate = useNavigate();
  const { apiDate } = useDates();
  const [endpointCheck, setEndpointCheck] = useState({
    vespers: false,
    matins: false,
    offering: false,
    liturgyOfWord: false,
    liturgyOfFaithful: false,
    communion: false,
  });
  const [loading, setLoading] = useState<boolean>(true);
  const isDisabled = Object.values(endpointCheck).some(
    (value) => value === false
  );

  useEffect(() => {
    setLoading(true);
  }, [apiDate]);

  const endpoints = [
    `https://stmarkapi.com:5000/vespers?date=${apiDate}`,
    `https://stmarkapi.com:5000/matins?date=${apiDate}`,
    `https://stmarkapi.com:5000/offering?date=${apiDate}`,
    `https://stmarkapi.com:5000/liturgyOfWord?date=${apiDate}`,
    `https://stmarkapi.com:5000/liturgyOfFaithful?date=${apiDate}`,
    `https://stmarkapi.com:5000/communion?date=${apiDate}`,
  ];

  const fetchEndpoints = () => {
    if (apiDate !== undefined) {
      axios
        .all(endpoints.map((endpoint) => axios.get(endpoint)))
        .then(
          axios.spread(
            (
              vespersResponse,
              matinsResponse,
              offeringResponse,
              liturgyOfWordResponse,
              liturgyOfFaithfulResponse,
              communionResponse
            ) => {
              setEndpointCheck({
                vespers: vespersResponse.data.status !== 'No PPT For this date',
                matins: matinsResponse.data.status !== 'No PPT For this date',
                offering:
                  offeringResponse.data.status !== 'No PPT For this date',
                liturgyOfWord:
                  liturgyOfWordResponse.data.status !== 'No PPT For this date',
                liturgyOfFaithful:
                  liturgyOfFaithfulResponse.data.status !==
                  'No PPT For this date',
                communion:
                  communionResponse.data.status !== 'No PPT For this date',
              });
              setLoading(false);
            }
          )
        )
        .catch((error) => {
          console.error('An error occurred:', error);
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
        <Menu.Label>Services</Menu.Label>
        <Menu.Divider />

        <LoadingOverlay
          visible={loading}
          overlayBlur={2}
          transitionDuration={150}
        />

        <Menu.Item
          icon={
            endpointCheck.vespers ? (
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
            endpointCheck.matins ? (
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
            endpointCheck.offering ? (
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
            endpointCheck.liturgyOfWord ? (
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
            endpointCheck.liturgyOfFaithful ? (
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
            endpointCheck.communion ? (
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
          <SubmitButton onClick={handleSubmit} disabled={isDisabled} />
        </Group>
      </Menu.Dropdown>
    </Menu>
  );
};

export default JumpButton;
