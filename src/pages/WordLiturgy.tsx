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

export interface WordLiturgyApiProps {
  hymnOfCenser: string;
  hymnofIntercessions: string;
  pauline: string[];
  catholic: string;
  praxis: string;
  acts: string;
  synxar: string;
  paralexHymns: string[];
  agios: string;
  LiturgylitanyoftheGospel: string;
  LiturgyPsalm: string;
  LiturgyPsalmResonse: string;
  LiturgyGospel: string;
  transitionSlide1: string;
  LiturgyGospelresponse: string;
}

interface WordLiturgyOptionsProps {
  paralex: string[];
  gospelLitany: string;
}

const WordLiturgy = () => {
  const navigate = useNavigate();
  const theme = useMantineTheme();
  const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`);

  const { apiDate, setSelectedCopticDates } = useDates();
  const [wordData, setWordData] = useState<WordLiturgyApiProps | undefined>(
    undefined
  );
  const [wordOptions, setWordOptions] = useState<WordLiturgyOptionsProps>({
    paralex: [],
    gospelLitany: 'alternate',
  });

  // This useEffect returns selections previously made
  useEffect(() => {
    fetch('http://192.81.219.24:5000/liturgyOfWord?date=' + apiDate)
      .then((response) => response.json())
      .then((data) => {
        if (data?.status !== 'No PPT For this date') {
          setWordOptions({
            ...wordOptions,
            paralex: data?.paralexHymns,
            gospelLitany: data?.LiturgylitanyoftheGospel,
          });
        }
      })
      .catch((error) => {
        console.error('Error fetching API data:', error);
      });
  }, []);

  // This useEffect returns ALL options for that given date
  useEffect(() => {
    fetch('http://192.81.219.24:8080/liturgyOfWord?date=' + apiDate)
      .then((response) => response.json())
      .then((data) => {
        setSelectedCopticDates(data[0]);
        setWordData(data[1]);
      })
      .catch((error) => {
        console.error('Error fetching API data:', error);
      });
  }, []);

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;

    setWordOptions((prevOptions: any) => {
      const newOptions = prevOptions.paralex.includes(value)
        ? prevOptions.paralex.filter((item: any) => item !== value)
        : [...prevOptions.paralex, value];

      // Sort the new options array based on the original order
      const sortedOptions = wordData?.paralexHymns.filter((item) =>
        newOptions.includes(item)
      );

      return {
        ...prevOptions,
        paralex: sortedOptions,
      };
    });
  };

  const handleSubmit = () => {
    // Modified Copy of Word Data to Post to API
    const modifiedWordData = { ...wordData };

    modifiedWordData.paralexHymns = wordOptions.paralex;
    modifiedWordData.LiturgylitanyoftheGospel = wordOptions.gospelLitany;

    console.log(modifiedWordData);

    axios
      .post(
        'http://192.81.219.24:5000/liturgyOfWord?date=' + apiDate,
        modifiedWordData
      )
      .then(() => {
        navigate(`/liturgyOfFaithful`);
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
              <CardHeader header='Liturgy of the Word' />

              {wordData?.paralexHymns.length !== 0 ? (
                <Stack align='flex-start' spacing={5}>
                  <Text fz='md' fw={500}>
                    Paralex Hymns
                  </Text>

                  {wordData?.paralexHymns
                    ? wordData?.paralexHymns.map(
                        (item: string, index: number) => (
                          <Checkbox
                            mt='sm'
                            key={index}
                            value={item}
                            checked={wordOptions.paralex.includes(item)}
                            onChange={handleCheckboxChange}
                            label={item.split('/').slice(-1)[0].split('.')[0]}
                          />
                        )
                      )
                    : [1, 2, 3, 4].map((index: number) => (
                        <Skeleton
                          height={20}
                          mt={5}
                          width={
                            Math.floor(Math.random() * (100 - 75 + 1)) + 75
                          }
                          radius='sm'
                          key={index}
                        />
                      ))}
                </Stack>
              ) : null}

              <FormField
                title='Litany of the Gospel'
                options={
                  <SegControl
                    data={[
                      { label: 'Alternate', value: 'alternate' },
                      { label: 'Standard', value: 'standard' },
                    ]}
                    value={wordOptions.gospelLitany}
                    onChange={(value: string) =>
                      setWordOptions({
                        ...wordOptions,
                        gospelLitany: value,
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
          <BackButton onClick={() => navigate('/offering')} />
          <NextButton onClick={handleSubmit} />
        </Group>
      }
    />
  );
};

export default WordLiturgy;
