import {
  Center,
  Checkbox,
  Flex,
  Group,
  SegmentedControl,
  Stack,
  Text,
  Title,
  useMantineTheme,
} from '@mantine/core';
import NextButton from '../components/Reusable/NextButton';
import DatePicker from '../components/Reusable/DatePicker';
import FormCard from '../components/Reusable/FormCard';
import PageLayout from '../components/Layout/PageLayout';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import useDates from '../store/useDates';
import { useMediaQuery } from '@mantine/hooks';
import BackButton from '../components/Reusable/BackButton';
import CardHeader from '../components/Reusable/CardHeader';

interface VespersApiProps {
  Vespers: string;
  VespersPsalmResponse: string;
  seasonVespersDoxologies: string[];
  vespers5ShortLitanies: string;
  vespersAbsolution: string;
  vespersConcludingHymn: string;
  vespersConclusion: string;
  vespersDoxolgiesConcl: string;
  vespersGospel: string;
  vespersGospelResponse: string;
  vespersLitaines: string;
  vespersLitanyofTheGospel: string;
  vespersOGodHaveMercy: string;
  vespersPrayerofThanksgiving: string;
  vespersVerseofTheCymbals: string;
  vesperscreed: string;
  vespersintroToCreed: string;
  vesperspreDoxoPrayers: string;
  vesperspreDoxoPrayersUniversal: string;
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

  const { selectedDate, setSelectedCopticDates } = useDates();
  const [vespersData, setVespersData] = useState<VespersApiProps | undefined>(
    undefined
  );
  const [vesperOptions, setVesperOptions] = useState<VespersOptionsProps>({
    doxologies: [],
    gospelLitany: 'alternate',
    fiveLitanies: 'yes',
  });

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
      .post('http://localhost:5000/vespers', modifiedVespersData)
      .then(() => {
        navigate('/matins');
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
              <CardHeader title='Vespers' />

              <Stack align='flex-start' spacing={5}>
                <Text fz='md' fw={500}>
                  Bishop Present
                </Text>

                <SegmentedControl
                  sx={{ width: '100%' }}
                  data={[
                    { label: 'No', value: 'ng' },
                    { label: 'Yes', value: 'yes' },
                  ]}
                />
              </Stack>

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
                          name='seasonalDoxoMatins'
                          value={item}
                          checked={vesperOptions.doxologies.includes(item)}
                          onChange={handleCheckboxChange}
                          label={item.split('/').slice(-1)[0].split('.')[0]}
                        />
                      )
                    )
                  : null}
              </Stack>

              <Stack align='flex-start' spacing={5}>
                <Text fz='md' fw={500}>
                  Litany of the Gospel
                </Text>

                <SegmentedControl
                  sx={{ width: '100%' }}
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
                />
              </Stack>

              <Stack align='flex-start' spacing={5}>
                <Text fz='md' fw={500}>
                  Five Short Litanies
                </Text>

                <SegmentedControl
                  sx={{ width: '100%' }}
                  data={[
                    { label: 'Yes', value: 'yes' },
                    { label: 'No', value: 'no' },
                  ]}
                  value={vesperOptions.fiveLitanies}
                  onChange={(value: string) =>
                    setVesperOptions({
                      ...vesperOptions,
                      fiveLitanies: value,
                    })
                  }
                />
              </Stack>
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
