import { Checkbox, Flex, Group, Skeleton, Stack, Text } from '@mantine/core';
import FormCard from '../components/Reusable/FormCard';
import PageLayout from '../components/Layout/PageLayout';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import useDates from '../store/useDates';
import BackButton from '../components/Reusable/BackButton';
import CardHeader from '../components/Reusable/CardHeader';
import SubmitButton from '../components/Reusable/SubmitButton';
import FormHeader from '../components/Reusable/FormHeader';
import { notifications } from '@mantine/notifications';
import { hasEmptyValues } from '../lib/functions/hasEmptyValue';

export interface CommunionApiProps {
  psalm150: string;
  communionMenu: string;
  communionHymns: string[];
  AllCommunionHymns: string[];
  finalConclusion1: string;
  liturgyConcludingHymn: string;
  finalConclusion2: string;
  finalTransition: string;
}

interface CommunionOptionsProps {
  seasonalHymns: string[];
  allHymns: string[];
}

const Communion = () => {
  const navigate = useNavigate();
  const { apiDate, setSelectedCopticDates } = useDates();
  const [communionData, setCommunionData] = useState<
    CommunionApiProps | undefined
  >(undefined);
  const [communionOptions, setCommunionOptions] =
    useState<CommunionOptionsProps>({
      seasonalHymns: [],
      allHymns: [],
    });
  const [disabled, setDisabled] = useState<boolean>(true);
  const [endpointCheck, setEndpointCheck] = useState({
    vespers: false,
    matins: false,
    offering: false,
    liturgyOfWord: false,
    liturgyOfFaithful: false,
  });

  const endpoints = [
    `https://stmarkapi.com:5000/vespers?date=${apiDate}`,
    `https://stmarkapi.com:5000/matins?date=${apiDate}`,
    `https://stmarkapi.com:5000/offering?date=${apiDate}`,
    `https://stmarkapi.com:5000/liturgyOfWord?date=${apiDate}`,
    `https://stmarkapi.com:5000/liturgyOfFaithful?date=${apiDate}`,
  ];

  // This useEffect returns selections previously made
  useEffect(() => {
    fetch('https://stmarkapi.com:5000/communion?date=' + apiDate)
      .then((response) => response.json())
      .then((data) => {
        if (data?.status !== 'No PPT For this date') {
          setCommunionOptions({
            ...communionOptions,
            seasonalHymns: data?.communionHymns,
            allHymns: data?.AllCommunionHymns,
          });
        }
      })
      .catch((error) => {
        console.error('Error fetching API data:', error);
      });
  }, []);

  // This useEffect returns ALL options for that given date
  useEffect(() => {
    fetch('https://stmarkapi.com:8080/communion?date=' + apiDate)
      .then((response) => response.json())
      .then((data) => {
        setSelectedCopticDates(data[0]);
        setCommunionData(data[1]);
        setDisabled(false);
      })
      .catch((error) => {
        console.error('Error fetching API data:', error);
      });
  }, []);

  const handleCommunionChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    hymnType: 'seasonalHymns' | 'allHymns'
  ) => {
    const value = event.target.value;

    setCommunionOptions((prevOptions: any) => {
      const newOptions = prevOptions[hymnType].includes(value)
        ? prevOptions[hymnType].filter((item: any) => item !== value)
        : [...prevOptions[hymnType], value];

      // Sort the new options array based on the original order
      const sortedOptions = communionData?.[
        hymnType === 'seasonalHymns' ? 'communionHymns' : 'AllCommunionHymns'
      ].filter((item) => newOptions.includes(item));

      return {
        ...prevOptions,
        [hymnType]: sortedOptions,
      };
    });
  };

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
              liturgyOfFaithfulResponse
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
              });
            }
          )
        )
        .catch((error) => {
          console.error('An error occurred:', error);
        });
    }
  };

  // TODO: Fix 2 click error
  const handleSubmit = async () => {
    if (
      communionOptions.seasonalHymns.length === 0 &&
      communionOptions.allHymns.length === 0
    ) {
      notifications.show({
        withCloseButton: true,
        autoClose: 2000,
        message: 'Please fill in all options',
        color: 'red',
      });
    } else {
      try {
        // Wait for all endpoint checks to complete
        await fetchEndpoints();

        // Check if all endpoint checks are true
        const areAllEndpointsTrue = Object.values(endpointCheck).every(
          (value) => value === true
        );

        if (areAllEndpointsTrue) {
          // Modified Copy of Communion Data to Post to API
          const modifiedCommunionData = { ...communionData };
          modifiedCommunionData.communionHymns = communionOptions.seasonalHymns;
          modifiedCommunionData.AllCommunionHymns = communionOptions.allHymns;

          await axios.post(
            'https://stmarkapi.com:5000/communion?date=' + apiDate,
            modifiedCommunionData
          );

          await axios
            .post('https://stmarkapi.com:5000/makeppt?date=' + apiDate)
            .then(() => navigate('/success'));
        } else {
          notifications.show({
            withCloseButton: true,
            autoClose: 5000,
            message: 'Complete every service before submitting',
            color: 'red',
          });
        }
      } catch (error) {
        console.error('Error submitting data:', error);
      }
    }
  };

  return (
    <PageLayout
      header={<FormHeader />}
      form={
        <FormCard
          content={
            <Flex
              gap='xl'
              justify='center'
              align='flex-start'
              direction='column'
            >
              <CardHeader header='Communion' />

              <Stack align='flex-start' spacing={5}>
                <Text fz='md' fw={500}>
                  Seasonal Communion Hymns
                </Text>

                {communionData?.communionHymns
                  ? communionData?.communionHymns.map(
                      (item: string, index: number) => (
                        <Checkbox
                          mt='sm'
                          key={index}
                          value={item}
                          checked={communionOptions.seasonalHymns.includes(
                            item
                          )}
                          onChange={(event) =>
                            handleCommunionChange(event, 'seasonalHymns')
                          }
                          label={item.split('/').slice(-1)[0].split('.')[0]}
                          transitionDuration={0}
                        />
                      )
                    )
                  : [1, 2, 3, 4].map((index: number) => (
                      <Skeleton
                        height={20}
                        mt={5}
                        width={Math.floor(Math.random() * (100 - 75 + 1)) + 75}
                        radius='md'
                        key={index}
                      />
                    ))}
              </Stack>

              <Stack align='flex-start' spacing={5}>
                <Text fz='md' fw={500}>
                  All Communion Hymns Index
                </Text>

                {communionData?.AllCommunionHymns
                  ? communionData?.AllCommunionHymns.map(
                      (item: string, index: number) => (
                        <Checkbox
                          mt='sm'
                          key={index}
                          value={item}
                          checked={communionOptions.allHymns.includes(item)}
                          onChange={(event) =>
                            handleCommunionChange(event, 'allHymns')
                          }
                          label={item.split('/').slice(-1)[0].split('.')[0]}
                          transitionDuration={0}
                        />
                      )
                    )
                  : [1, 2, 3, 4].map((index: number) => (
                      <Skeleton
                        height={20}
                        mt={5}
                        width={Math.floor(Math.random() * (100 - 75 + 1)) + 75}
                        radius='md'
                        key={index}
                      />
                    ))}
              </Stack>
            </Flex>
          }
        />
      }
      footer={
        <Group>
          <BackButton onClick={() => navigate('/liturgyOfFaithful')} />
          <SubmitButton onClick={handleSubmit} disabled={disabled} />
        </Group>
      }
    />
  );
};

export default Communion;
