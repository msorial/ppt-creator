import {
  Flex,
  Group,
  Select,
  Skeleton,
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
import ReadableDate from '../components/Reusable/ReadableDate';

export interface OfferingApiProps {
  transitionSlide: string;
  ThirdHourIntro: string;
  thirdHourPsalms: string[];
  sixthHourIntro: string;
  sixthHourPsalms: string[];
  gospels: string;
  OfferingintroCreed: string;
  OfferingCreed: string;
  OfferingSelection: string;
  OfferingAlleluia: string;
  OfferingThanksgiving: string;
}

interface OfferingOptionsProps {
  thirdHourPsalms: string;
  sixthHourPsalms: string;
}

interface SelectItemProps {
  value: string;
  label: string;
}

interface PsalmsObjectProps {
  thirdHourPsalms: SelectItemProps[];
  sixthHourPsalms: SelectItemProps[];
}

const Matins = () => {
  const navigate = useNavigate();
  const theme = useMantineTheme();
  const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`);

  const { apiDate, setSelectedCopticDates } = useDates();
  const [psalmsObject, setPsalmsObject] = useState<PsalmsObjectProps>({
    thirdHourPsalms: [],
    sixthHourPsalms: [],
  });
  const [offeringData, setOfferingData] = useState<
    OfferingApiProps | undefined
  >(undefined);

  const [offeringOptions, setOfferingOptions] = useState<OfferingOptionsProps>({
    thirdHourPsalms: '',
    sixthHourPsalms: '',
  });

  // This useEffect returns selections previously made
  useEffect(() => {
    fetch('http://192.81.219.24:5000/offering?date=' + apiDate)
      .then((response) => response.json())
      .then((data) => {
        if (data?.status !== 'No PPT For this date') {
          setOfferingOptions({
            ...offeringOptions,
            thirdHourPsalms: data.thirdHourPsalms[0],
            sixthHourPsalms: data.sixthHourPsalms[0],
          });
        }
      })
      .catch((error) => {
        console.error('Error fetching API data:', error);
      });
  }, []);

  // This useEffect returns ALL options for that given date
  useEffect(() => {
    fetch('http://192.81.219.24:8080/offering?date=' + apiDate)
      .then((response) => response.json())
      .then((data) => {
        setSelectedCopticDates(data[0]);
        setOfferingData(data[1]);

        setPsalmsObject({
          thirdHourPsalms: data[1].thirdHourPsalms.map((path: string) => ({
            value: path,
            label: path.split('/').slice(-1)[0].split('.')[0],
          })),
          sixthHourPsalms: data[1].sixthHourPsalms.map((path: string) => ({
            value: path,
            label: path.split('/').slice(-1)[0].split('.')[0],
          })),
        });
      })
      .catch((error) => {
        console.error('Error fetching API data:', error);
      });
  }, []);

  const handleChange = (
    psalmType: 'thirdHourPsalms' | 'sixthHourPsalms',
    newValue: string
  ) => {
    setOfferingOptions((prevOptions) => ({
      ...prevOptions,
      [psalmType]: newValue,
    }));
  };

  const handleSubmit = () => {
    // Modified Copy of Matins Data to Post to API
    const modifiedOfferingData = { ...offeringData };
    modifiedOfferingData.thirdHourPsalms = [offeringOptions.thirdHourPsalms];
    modifiedOfferingData.sixthHourPsalms = [offeringOptions.sixthHourPsalms];

    axios
      .post(
        'http://192.81.219.24:5000/offering?date=' + apiDate,
        modifiedOfferingData
      )
      .then(() => {
        navigate('/liturgyofWord');
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
              <CardHeader header='Offering' />

              <FormField
                title='3rd Hour Psalm'
                options={
                  psalmsObject.thirdHourPsalms.length === 0 ? (
                    <Skeleton height={20} mt={5} width='100%' radius='md' />
                  ) : (
                    <Select
                      value={
                        offeringOptions.thirdHourPsalms
                          ? offeringOptions.thirdHourPsalms
                          : 'powerpoints/agpeya/3rd hour psalms/psalm 19.pptx'
                      }
                      onChange={(value: string) =>
                        handleChange('thirdHourPsalms', value)
                      }
                      data={psalmsObject.thirdHourPsalms}
                      sx={{ width: '100%' }}
                    />
                  )
                }
              />

              <FormField
                title='6th Hour Psalm'
                options={
                  psalmsObject.sixthHourPsalms.length === 0 ? (
                    <Skeleton height={20} mt={5} width='100%' radius='md' />
                  ) : (
                    <Select
                      value={
                        offeringOptions.sixthHourPsalms
                          ? offeringOptions.sixthHourPsalms
                          : 'powerpoints/agpeya/6th hour psalms/psalm 56.pptx'
                      }
                      onChange={(value: string) =>
                        handleChange('sixthHourPsalms', value)
                      }
                      data={psalmsObject.sixthHourPsalms}
                      sx={{ width: '100%' }}
                    />
                  )
                }
              />
            </Flex>
          }
        />
      }
      footer={
        <Group>
          <BackButton onClick={() => navigate('/matins')} />
          <NextButton onClick={handleSubmit} />
        </Group>
      }
    />
  );
};

export default Matins;
