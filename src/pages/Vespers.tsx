import {
  Checkbox,
  Flex,
  Group,
  SegmentedControl,
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
  gospelLitany: string | undefined;
  fiveLitanies: string;
}

const Vespers = () => {
  const navigate = useNavigate();
  const theme = useMantineTheme();
  const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`);

  const { selectedDate, setSelectedCopticDates } = useDates();
  const [vespersData, setVespersData] = useState<VespersApiProps | undefined>(
    undefined
  );
  const [vesperOptions, setVesperOptions] = useState<VespersOptionsProps>({
    doxologies: [],
    gospelLitany: 'alternate',
    fiveLitanies: 'no',
  });

  useEffect(() => {
    // TODO: Make this date dynamic based off date chosen and deep linking??
    fetch('http://192.81.219.24:5000/vespers?date=2023-08-27')
      .then((response) => response.json())
      .then((data) => {
        setVesperOptions({
          ...vesperOptions,
          gospelLitany: data?.vespersLitanyofTheGospel,
          fiveLitanies: data?.vespers5ShortLitanies,
        });
      })
      .catch((error) => {
        console.error('Error fetching API data:', error);
      });
  }, []);

  // This useEffect gives me the Doxology options for that given date
  useEffect(() => {
    fetch('http://192.81.219.24:8080/vespers')
      .then((response) => response.json())
      .then((data) => {
        setSelectedCopticDates(data[0]);
        setVespersData(data[1]);
      })
      .catch((error) => {
        console.error('Error fetching API data:', error);
      });
  }, []);

  console.log(vesperOptions);

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const item = event.target.value;

    setVesperOptions((prevOptions) => {
      if (prevOptions.doxologies.includes(item)) {
        // Uncheck: Remove the item from the array
        return {
          ...prevOptions,
          doxologies: prevOptions.doxologies.filter((value) => value !== item),
        };
      } else {
        // Check: Add the item to the array
        return {
          ...prevOptions,
          doxologies: [...prevOptions.doxologies, item],
        };
      }
    });
  };

  const handleSubmit = () => {
    // Modified Copy of Vespers Data to Post to API
    const modifiedVespersData = { ...vespersData };

    modifiedVespersData.seasonVespersDoxologies = vesperOptions.doxologies;
    modifiedVespersData.vespersLitanyofTheGospel = vesperOptions.gospelLitany;
    modifiedVespersData.vespers5ShortLitanies = vesperOptions.fiveLitanies;

    axios
      .post('http://192.81.219.24:5000/vespers', modifiedVespersData)
      .then(() => {
        navigate('/matins');
        console.log('PPT Created');
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
          <Text align='right' fs='italic'>
            {selectedDate?.toLocaleDateString()}
          </Text>
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
                  <SegmentedControl
                    data={[
                      { label: 'No', value: 'ng' },
                      { label: 'Yes', value: 'yes' },
                    ]}
                    sx={{ width: '100%' }}
                    color='dark'
                  />
                }
              />

              <Stack align='flex-start' spacing={5}>
                <Text fz='md' fw={500}>
                  Seasonal Vespers Doxologies
                </Text>

                {vespersData?.seasonVespersDoxologies
                  ? vespersData?.seasonVespersDoxologies.map(
                      (item: any, index: any) => (
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
                  : null}
              </Stack>

              <FormField
                title='Litany of the Gospel'
                options={
                  <SegmentedControl
                    data={[
                      { label: 'Alternate', value: 'alternate' },
                      { label: 'Standard', value: 'standard' },
                    ]}
                    value={vesperOptions.gospelLitany}
                    onChange={(value: string) =>
                      setVesperOptions({
                        ...vesperOptions,
                        gospelLitany: value,
                      })
                    }
                    sx={{ width: '100%' }}
                    color='dark'
                  />
                }
              />

              <FormField
                title='Five Short Litanies'
                options={
                  <SegmentedControl
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
                    sx={{ width: '100%' }}
                    color='dark'
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
