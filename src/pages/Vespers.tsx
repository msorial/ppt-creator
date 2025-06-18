import {
  Button,
  Checkbox,
  Flex,
  Group,
  ScrollArea,
  Skeleton,
  Stack,
  Text,
  TextInput,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconCheck } from '@tabler/icons-react';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageLayout from '../components/Layout/PageLayout';
import BackButton from '../components/Reusable/BackButton';
import CardHeader from '../components/Reusable/CardHeader';
import FormCard from '../components/Reusable/FormCard';
import FormField from '../components/Reusable/FormField';
import FormHeader from '../components/Reusable/FormHeader';
import NextButton from '../components/Reusable/NextButton';
import SaveButton from '../components/Reusable/SaveButton';
import SegControl from '../components/Reusable/SegControl';
import { hasEmptyValues } from '../lib/functions/hasEmptyValue';
import useDates from '../store/useDates';

export interface VespersApiProps {
  bishop: string;
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
  bishop: string;
  doxologies: string[];
  gospelLitany: string;
  fiveLitanies: string;
}

const Vespers = () => {
  const navigate = useNavigate();
  const { apiDate, setSelectedCopticDates } = useDates();
  const [vespersData, setVespersData] = useState<VespersApiProps | undefined>(
    undefined
  );
  const [vesperOptions, setVesperOptions] = useState<VespersOptionsProps>({
    bishop: 'no',
    doxologies: [],
    gospelLitany: 'standard',
    fiveLitanies: 'no',
  });
  const [disabled, setDisabled] = useState<boolean>(true);
  const [checkedItems, setCheckedItems] = useState<string[]>([]);
  const [showOptionalDoxologies, setShowOptionalDoxologies] =
    useState<boolean>(false);

  const handleCheckboxChangeOptional = (item: string, isChecked: boolean) => {
    setCheckedItems((prev) =>
      isChecked ? [...prev, item] : prev.filter((i) => i !== item)
    );
  };

  const [optionalDoxologiesList, setOptionalDoxologiesList] = useState<
    string[]
  >([]);
  const [search, setSearch] = useState('');

  const filteredList = optionalDoxologiesList.filter((item) =>
    item.toLowerCase().includes(search.toLowerCase())
  );

  const optionalDoxologies = () => {
    setShowOptionalDoxologies(true);
    fetch('https://stmarkapi.com:8080/optionalDoxologies')
      .then((response) => response.json())
      .then((data) => {
        setOptionalDoxologiesList(data[0]);
      })
      .catch((error) => {
        console.error('Error fetching API data:', error);
      });
  };
  // This useEffect returns selections previously made
  useEffect(() => {
    fetch('https://stmarkapi.com:5000/vespers?date=' + apiDate)
      .then((response) => response.json())
      .then((data) => {
        if (data?.status !== 'No PPT For this date') {
          setVesperOptions({
            ...vesperOptions,
            bishop: data?.bishop,
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
        setDisabled(false);
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
  const Save = () => {
    if (hasEmptyValues(vesperOptions)) {
      notifications.show({
        withCloseButton: true,
        autoClose: 2000,
        message: 'Please fill in all options',
        color: 'red',
      });
    } else {
      // Modified Copy of Vespers Data to Post to API
      notifications.show({
        withCloseButton: true,
        message: 'Selections Saving',
        color: 'blue',
        loading: true,
        id: 'save',
      });
      console.log('This message will be logged immediately.');
      const modifiedVespersData = { ...vespersData };
      const combined = [...vesperOptions.doxologies, ...checkedItems];

      modifiedVespersData.bishop = vesperOptions.bishop;
      modifiedVespersData.seasonVespersDoxologies = combined;
      modifiedVespersData.vespersLitanyofTheGospel = vesperOptions.gospelLitany;
      modifiedVespersData.vespers5ShortLitanies = vesperOptions.fiveLitanies;

      axios
        .post(
          'https://stmarkapi.com:5000/vespers?date=' + apiDate,
          modifiedVespersData
        )
        .then(() => {
          notifications.update({
            withCloseButton: true,
            autoClose: 2000,
            message: 'Selections Saved',
            color: 'green',
            icon: <IconCheck />,
            id: 'save',
          });
        });
    }
  };

  const handleSubmit = () => {
    if (hasEmptyValues(vesperOptions)) {
      notifications.show({
        withCloseButton: true,
        autoClose: 2000,
        message: 'Please fill in all options',
        color: 'red',
      });
    } else {
      // Modified Copy of Vespers Data to Post to API
      const combined = Array.from(
        new Set([...vesperOptions.doxologies, ...checkedItems])
      );
      const modifiedVespersData = { ...vespersData };
      modifiedVespersData.bishop = vesperOptions.bishop;
      modifiedVespersData.seasonVespersDoxologies = combined;
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
              <CardHeader header='Vespers' />

              <FormField
                title='Bishop Present'
                options={
                  <SegControl
                    data={[
                      { label: 'No', value: 'no' },
                      { label: 'Yes', value: 'yes' },
                    ]}
                    value={vesperOptions.bishop}
                    onChange={(value: string) =>
                      setVesperOptions({
                        ...vesperOptions,
                        bishop: value,
                      })
                    }
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

              {showOptionalDoxologies ? (
                <Stack align='flex-start' spacing={5}>
                  <Text fz='md' fw={500}>
                    Optional Doxologies
                  </Text>

                  <TextInput
                    placeholder='Search...'
                    value={search}
                    onChange={(event) => setSearch(event.currentTarget.value)}
                    mb='sm'
                  />

                  <ScrollArea style={{ height: 200 }} type='scroll'>
                    {optionalDoxologiesList.length > 0
                      ? filteredList.map((item: string, index: number) => (
                          <Checkbox
                            mt='sm'
                            key={index}
                            value={item}
                            checked={checkedItems.includes(item)}
                            onChange={(event) =>
                              handleCheckboxChangeOptional(
                                item,
                                event.currentTarget.checked
                              )
                            }
                            label={
                              item.split('/').slice(-1)[0].split('.pptx')[0]
                            }
                            transitionDuration={0}
                          />
                        ))
                      : [1, 2, 3, 4].map((index: number) => (
                          <Skeleton
                            height={20}
                            mt={5}
                            width={
                              Math.floor(Math.random() * (100 - 75 + 1)) + 75
                            }
                            radius='md'
                            key={index}
                          />
                        ))}
                  </ScrollArea>
                </Stack>
              ) : (
                <Button onClick={optionalDoxologies}>
                  + Optional Doxologies
                </Button>
              )}

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
          <NextButton onClick={handleSubmit} disabled={disabled} />
          <SaveButton onClick={Save} disabled={disabled} />
        </Group>
      }
    />
  );
};

export default Vespers;
