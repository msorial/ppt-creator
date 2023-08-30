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
import ApprovalButton from '../components/Reusable/ApprovalButton';

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

  const handleSubmit = () => {
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
      // Modified Copy of Communion Data to Post to API
      const modifiedCommunionData = { ...communionData };
      modifiedCommunionData.communionHymns = communionOptions.seasonalHymns;
      modifiedCommunionData.AllCommunionHymns = communionOptions.allHymns;

      axios.post(
        'https://stmarkapi.com:5000/communion?date=' + apiDate,
        modifiedCommunionData
      );

      axios
        .post('https://stmarkapi.com:5000/makeppt?date=' + apiDate)
        .then(() => {
          navigate('/success');
        })
        .catch((error) => {
          console.error('Error submitting data:', error);
        });
    }
  };
  const handleSubmitForApproval = () => {
    // Modified Copy of Communion Data to Post to API
    const modifiedCommunionData = { ...communionData };
    modifiedCommunionData.communionHymns = communionOptions.seasonalHymns;
    modifiedCommunionData.AllCommunionHymns = communionOptions.allHymns;

    axios.post(
      'https://stmarkapi.com:5000/communion?date=' + apiDate,
      modifiedCommunionData
    );

    axios
      .post('https://stmarkapi.com:5000/approval?date=' + apiDate)
      .then(() => {
        navigate('/');
      })
      .catch((error) => {
        console.error('Error submitting data:', error);
      });
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
        <Group position='center'>
          <BackButton onClick={() => navigate('/liturgyOfFaithful')} />
         
          <ApprovalButton onClick={handleSubmitForApproval} />
        </Group>
      }
    />
  );
};

export default Communion;
