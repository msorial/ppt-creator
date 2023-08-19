import {
  Checkbox,
  Flex,
  Group,
  Skeleton,
  Stack,
  Text,
  useMantineTheme,
} from '@mantine/core';
import NextButton from '../components/Reusable/NextButton';
import FormCard from '../components/Reusable/FormCard';
import PageLayout from '../components/Layout/PageLayout';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import useDates from '../store/useDates';
import { useMediaQuery } from '@mantine/hooks';
import BackButton from '../components/Reusable/BackButton';
import CardHeader from '../components/Reusable/CardHeader';
import FormField from '../components/Reusable/FormField';
import SegControl from '../components/Reusable/SegControl';
import ReadableDate from '../components/Reusable/ReadableDate';

export interface VespersApiProps {
  Vespers: string;
  vespersPrayerofThanksgiving: string;
  vespersVerseofTheCymbals: string;
  vespersLitaines: string;
  vesperspreDoxoPrayers: string;
  vesperspreDoxoPrayersUniversal: string;
  seasonVespersDoxologies: string[];
  vespersDoxolgiesConcl: string;
  vespersintroToCreed: string;
  vesperscreed: string;
  vespersOGodHaveMercy: string;
  vespersLitanyofTheGospel: string;
  VespersPsalmResponse: string;
  vespersGospel: string;
  vespersGospelResponse: string;
  vespers5ShortLitanies: string;
  vespersAbsolution: string;
  vespersConcludingHymn: string;
  vespersConclusion: string;
}

interface VespersOptionsProps {
  doxologies: string[];
  gospelLitany: string;
  fiveLitanies: string;
}

const Vespers = () => {
  const navigate = useNavigate();
  const theme = useMantineTheme();
  const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`);

  const { apiDate, setSelectedCopticDates } = useDates();
  const [vespersData, setVespersData] = useState<VespersApiProps | undefined>(
    undefined
  );
  const [vesperOptions, setVesperOptions] = useState<VespersOptionsProps>({
    doxologies: [],
    gospelLitany: 'standard',
    fiveLitanies: 'no',
  });

  // This useEffect returns selections previously made
  useEffect(() => {
    fetch('https://stmarkapi.com:5000/vespers?date=' + apiDate)
      .then((response) => response.json())
      .then((data) => {
        if (data?.status !== 'No PPT For this date') {
          setVesperOptions({
            ...vesperOptions,
            doxologies: data?.seasonVespersDoxologies,
            gospelLitany: data?.vespersLitanyofTheGospel,
            fiveLitanies: data?.vespers5ShortLitanies,
          });
        }
      })
      .catch((error) => {
        console.error('Error fetching API data:', error);
      });
  }, []);

  // This useEffect returns ALL options for that given date
  useEffect(() => {
    fetch('https://stmarkapi.com:8080/vespers?date=' + apiDate)
      .then((response) => response.json())
      .then((data) => {
        setSelectedCopticDates(data[0]);
        setVespersData(data[1]);
      })
      .catch((error) => {
        console.error('Error fetching API data:', error);
      });
  }, []);

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;

    setVesperOptions((prevOptions: any) => {
      const newOptions = prevOptions.doxologies.includes(value)
        ? prevOptions.doxologies.filter((item: any) => item !== value)
        : [...prevOptions.doxologies, value];

      // Sort the new options array based on the original order
      const sortedOptions = vespersData?.seasonVespersDoxologies.filter(
        (item) => newOptions.includes(item)
      );

      return {
        ...prevOptions,
        doxologies: sortedOptions,
      };
    });
  };

  const handleSubmit = () => {
    // Modified Copy of Vespers Data to Post to API
    const modifiedVespersData = { ...vespersData };
    modifiedVespersData.seasonVespersDoxologies = vesperOptions.doxologies;
    modifiedVespersData.vespersLitanyofTheGospel = vesperOptions.gospelLitany;
    modifiedVespersData.vespers5ShortLitanies = vesperOptions.fiveLitanies;

    axios
      .post(
        'https://stmarkapi.com:5000/vespers?date=' + apiDate,
        modifiedVespersData
      )
      .then(() => {
        navigate(`/matins`);
      })
      .catch((error) => {
        console.error('Error submitting data:', error);
      });
  };

  return (
    <PageLayout
      header={
        <Flex
          gap='xl'
          justify='space-between'
          align='end'
          direction='row'
          wrap='nowrap'
          sx={{ width: isMobile ? '100%' : '80%' }}
        >
          <Text align='left' fw={500}>
            Selected Date
          </Text>
          <ReadableDate />
        </Flex>
      }
      form={
        <FormCard
          content={
            <Flex
              gap='xl'
              justify='center'
              align='flex-start'
              direction='column'
            >
              <CardHeader header='Vespers' />

              <FormField
                title='Bishop Present'
                options={
                  <SegControl
                    data={[
                      { label: 'No', value: 'ng' },
                      { label: 'Yes', value: 'yes' },
                    ]}
                  />
                }
              />

              <Stack align='flex-start' spacing={5}>
                <Text fz='md' fw={500}>
                  Seasonal Vespers Doxologies
                </Text>

                {vespersData?.seasonVespersDoxologies
                  ? vespersData?.seasonVespersDoxologies.map(
                      (item: string, index: number) => (
                        <Checkbox
                          mt='sm'
                          key={index}
                          value={item}
                          checked={vesperOptions.doxologies.includes(item)}
                          onChange={handleCheckboxChange}
                          label={item.split('/').slice(-1)[0].split('.')[0]}
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

              <FormField
                title='Litany of the Gospel'
                options={
                  <SegControl
                    data={[
                      { label: 'Standard', value: 'standard' },
                      { label: 'Alternate', value: 'alternate' },
                    ]}
                    value={vesperOptions.gospelLitany}
                    onChange={(value: string) =>
                      setVesperOptions({
                        ...vesperOptions,
                        gospelLitany: value,
                      })
                    }
                  />
                }
              />

              <FormField
                title='Five Short Litanies'
                options={
                  <SegControl
                    data={[
                      { label: 'No', value: 'no' },
                      { label: 'Yes', value: 'yes' },
                    ]}
                    value={vesperOptions.fiveLitanies}
                    onChange={(value: string) =>
                      setVesperOptions({
                        ...vesperOptions,
                        fiveLitanies: value,
                      })
                    }
                  />
                }
              />
            </Flex>
          }
        />
      }
      footer={
        <Group>
          <BackButton onClick={() => navigate('/')} />
          <NextButton onClick={handleSubmit} />
        </Group>
      }
    />
  );
};

export default Vespers;
