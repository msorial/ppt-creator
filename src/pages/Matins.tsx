import { Button, Flex, Group } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconCheck } from '@tabler/icons-react';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageLayout from '../components/Layout/PageLayout';
import BackButton from '../components/Reusable/BackButton';
import CardHeader from '../components/Reusable/CardHeader';
import DoxologyList from '../components/Reusable/DoxologyList';
import FormCard from '../components/Reusable/FormCard';
import FormField from '../components/Reusable/FormField';
import FormHeader from '../components/Reusable/FormHeader';
import NextButton from '../components/Reusable/NextButton';
import SaveButton from '../components/Reusable/SaveButton';
import SegControl from '../components/Reusable/SegControl';
import { hasEmptyValues } from '../lib/functions/hasEmptyValue';
import useDates from '../store/useDates';

export interface MatinsApiProps {
  Matins: string;
  matinsPrayerofThanksgiving: string;
  matinsVerseofTheCymbals: string;
  matinsLitaines: string;
  matinspreDoxoPrayers: string;
  matinspreDoxoPrayersUniversal: string;
  seasonmatinsDoxologies: string[];
  matinsDoxolgiesConcl: string;
  matinsintroToCreed: string;
  matinscreed: string;
  matinsOGodHaveMercy: string;
  matinsLitanyofTheGospel: string;
  matinsPsalmResponse: string;
  matinsGospel: string;
  matinsGospelResponse: string;
  matins5ShortLitanies: string;
  matinsAbsolution: string;
  matinsConcludingHymn: string;
  matinsConclusion: string;
}

interface MatinsOptionsProps {
  doxologies: string[];
  gospelLitany: string;
  fiveLitanies: string;
}

interface DoxologyItem {
  id: string;
  value: string;
  label: string;
  checked: boolean;
  isOptional?: boolean;
}

const Matins = () => {
  const navigate = useNavigate();
  const { apiDate, setSelectedCopticDates } = useDates();
  const [matinsData, setMatinsData] = useState<MatinsApiProps | undefined>(
    undefined
  );
  const [matinsOptions, setMatinsOptions] = useState<MatinsOptionsProps>({
    doxologies: [],
    gospelLitany: 'standard',
    fiveLitanies: 'no',
  });
  const [disabled, setDisabled] = useState<boolean>(true);
  const [seasonalDoxologies, setSeasonalDoxologies] = useState<DoxologyItem[]>(
    []
  );
  const [optionalDoxologies, setOptionalDoxologies] = useState<DoxologyItem[]>(
    []
  );
  const [showOptionalDoxologies, setShowOptionalDoxologies] =
    useState<boolean>(false);
  const [search, setSearch] = useState('');

  const loadOptionalDoxologies = () => {
    if (showOptionalDoxologies) return; // Already loaded

    setShowOptionalDoxologies(true);
    fetch('https://stmarkapi.com:8080/optionalDoxologies')
      .then((response) => response.json())
      .then((data) => {
        const optionalItems: DoxologyItem[] = data[0].map(
          (item: string, index: number) => ({
            id: `optional-${index}`,
            value: item,
            label: item.split('/').slice(-1)[0].split('.pptx')[0],
            checked: false,
            isOptional: true,
          })
        );

        // Merge with existing optional doxologies (from extra doxologies)
        setOptionalDoxologies((prev) => {
          const existingValues = prev.map((item) => item.value);
          const newItems = optionalItems.filter(
            (item) => !existingValues.includes(item.value)
          );
          return [...prev, ...newItems];
        });
      })
      .catch((error) => {
        console.error('Error fetching API data:', error);
      });
  };

  // This useEffect loads all data and sets up the initial state
  useEffect(() => {
    const loadData = async () => {
      try {
        // Fetch both API endpoints in parallel
        const [apiResponse, savedResponse] = await Promise.all([
          fetch('https://stmarkapi.com:8080/matins?date=' + apiDate).then(
            (res) => res.json()
          ),
          fetch('https://stmarkapi.com:5000/matins?date=' + apiDate).then(
            (res) => res.json()
          ),
        ]);

        setSelectedCopticDates(apiResponse[0]);
        setMatinsData(apiResponse[1]);

        // Get all saved doxologies (remove duplicates)
        const savedDoxologies =
          savedResponse?.status !== 'No PPT For this date'
            ? (Array.from(
                new Set(savedResponse.seasonmatinsDoxologies || [])
              ) as string[])
            : [];

        // Get API doxologies (remove duplicates)
        const apiDoxologies = Array.from(
          new Set(apiResponse[1]?.seasonmatinsDoxologies || [])
        ) as string[];

        // Set matins options
        setMatinsOptions({
          doxologies: savedDoxologies,
          gospelLitany: savedResponse?.matinsLitanyofTheGospel || 'standard',
          fiveLitanies: savedResponse?.matins5ShortLitanies || 'no',
        });

        // Create seasonal doxologies - combine API doxologies with saved ones
        const allSeasonalDoxologies = Array.from(
          new Set([...apiDoxologies, ...savedDoxologies])
        ) as string[];
        const seasonalItems: DoxologyItem[] = allSeasonalDoxologies.map(
          (item: string, index: number) => ({
            id: `seasonal-${index}`,
            value: item,
            label: item.split('/').slice(-1)[0].split('.pptx')[0],
            checked: savedDoxologies.includes(item),
            isOptional: false,
          })
        );
        setSeasonalDoxologies(seasonalItems);

        // Find extra doxologies that are in saved data but not in API data
        const extraDoxologies = savedDoxologies.filter(
          (saved: string) => !apiDoxologies.includes(saved)
        );

        if (extraDoxologies.length > 0) {
          const extraItems: DoxologyItem[] = extraDoxologies.map(
            (item: string, index: number) => ({
              id: `extra-${index}`,
              value: item,
              label: item.split('/').slice(-1)[0].split('.pptx')[0],
              checked: true,
              isOptional: true,
            })
          );
          setOptionalDoxologies(extraItems);
          setShowOptionalDoxologies(true);
        }

        // Always load optional doxologies on page load
        loadOptionalDoxologies();

        setDisabled(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setDisabled(false);
      }
    };

    loadData();
  }, []);

  const handleSeasonalDoxologyToggle = (
    item: DoxologyItem,
    isChecked: boolean
  ) => {
    setSeasonalDoxologies((prev) =>
      prev.map((dox) =>
        dox.id === item.id ? { ...dox, checked: isChecked } : dox
      )
    );

    setMatinsOptions((prevOptions) => {
      const newDoxologies = isChecked
        ? [...prevOptions.doxologies, item.value]
        : prevOptions.doxologies.filter((dox) => dox !== item.value);

      return {
        ...prevOptions,
        doxologies: newDoxologies,
      };
    });
  };

  const handleOptionalDoxologyToggle = (
    item: DoxologyItem,
    isChecked: boolean
  ) => {
    // Update optional doxologies
    setOptionalDoxologies((prev) =>
      prev.map((dox) =>
        dox.id === item.id ? { ...dox, checked: isChecked } : dox
      )
    );

    if (isChecked) {
      // Move to seasonal doxologies and update matins options in one go
      setSeasonalDoxologies((prev) => {
        const exists = prev.some((dox) => dox.value === item.value);
        if (!exists) {
          const newItem: DoxologyItem = {
            ...item,
            id: `seasonal-${Date.now()}`,
            isOptional: false,
            checked: true,
          };
          const newSeasonal = [...prev, newItem];

          // Update matins options with the new doxology
          setMatinsOptions((prevOptions) => ({
            ...prevOptions,
            doxologies: [...prevOptions.doxologies, item.value],
          }));

          return newSeasonal;
        }
        return prev.map((dox) =>
          dox.value === item.value ? { ...dox, checked: true } : dox
        );
      });
    } else {
      // Remove from seasonal doxologies and update matins options
      setSeasonalDoxologies((prev) =>
        prev.filter((dox) => dox.value !== item.value)
      );

      setMatinsOptions((prev) => ({
        ...prev,
        doxologies: prev.doxologies.filter((dox) => dox !== item.value),
      }));
    }
  };

  const handleSeasonalDoxologyReorder = (items: DoxologyItem[]) => {
    setSeasonalDoxologies(items);
    const newDoxologies = items
      .filter((item) => item.checked)
      .map((item) => item.value);

    setMatinsOptions((prev) => ({
      ...prev,
      doxologies: newDoxologies,
    }));
  };

  const handleOptionalDoxologyReorder = (items: DoxologyItem[]) => {
    setOptionalDoxologies(items);
  };

  const Save = () => {
    if (hasEmptyValues(matinsOptions)) {
      notifications.show({
        withCloseButton: true,
        autoClose: 2000,
        message: 'Please fill in all options',
        color: 'red',
      });
    } else {
      notifications.show({
        withCloseButton: true,
        message: 'Selections Saving',
        color: 'blue',
        loading: true,
        id: 'save',
      });

      // Only use seasonal doxologies (which already includes moved optional ones)
      // Remove duplicates to ensure clean data
      const uniqueDoxologies = Array.from(new Set(matinsOptions.doxologies));

      // Modified Copy of Matins Data to Post to API
      const modifiedMatinsData = { ...matinsData };
      modifiedMatinsData.seasonmatinsDoxologies = uniqueDoxologies;
      modifiedMatinsData.matinsLitanyofTheGospel = matinsOptions.gospelLitany;
      modifiedMatinsData.matins5ShortLitanies = matinsOptions.fiveLitanies;

      axios
        .post(
          'https://stmarkapi.com:5000/matins?date=' + apiDate,
          modifiedMatinsData
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
    if (hasEmptyValues(matinsOptions)) {
      notifications.show({
        withCloseButton: true,
        autoClose: 2000,
        message: 'Please fill in all options',
        color: 'red',
      });
    } else {
      // Modified Copy of Matins Data to Post to API
      // Only use seasonal doxologies (which already includes moved optional ones)
      // Remove duplicates to ensure clean data
      const uniqueDoxologies = Array.from(new Set(matinsOptions.doxologies));
      const modifiedMatinsData = { ...matinsData };
      modifiedMatinsData.seasonmatinsDoxologies = uniqueDoxologies;
      modifiedMatinsData.matinsLitanyofTheGospel = matinsOptions.gospelLitany;
      modifiedMatinsData.matins5ShortLitanies = matinsOptions.fiveLitanies;

      axios
        .post(
          'https://stmarkapi.com:5000/matins?date=' + apiDate,
          modifiedMatinsData
        )
        .then(() => {
          navigate('/offering');
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
              <CardHeader header='Matins' />

              <DoxologyList
                title='Seasonal Matins Doxologies'
                items={seasonalDoxologies}
                onItemToggle={handleSeasonalDoxologyToggle}
                onReorder={handleSeasonalDoxologyReorder}
                isLoading={!matinsData}
              />
              {showOptionalDoxologies ? (
                <DoxologyList
                  title='Optional Doxologies'
                  items={optionalDoxologies}
                  onItemToggle={handleOptionalDoxologyToggle}
                  onReorder={handleOptionalDoxologyReorder}
                  showSearch={true}
                  searchValue={search}
                  onSearchChange={setSearch}
                  isLoading={optionalDoxologies.length === 0}
                />
              ) : (
                <Button onClick={loadOptionalDoxologies}>
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
                    value={matinsOptions.gospelLitany}
                    onChange={(value: string) =>
                      setMatinsOptions({
                        ...matinsOptions,
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
                    value={matinsOptions.fiveLitanies}
                    onChange={(value: string) =>
                      setMatinsOptions({
                        ...matinsOptions,
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
          <BackButton onClick={() => navigate('/vespers')} />
          <NextButton onClick={handleSubmit} disabled={disabled} />
          <SaveButton onClick={Save} disabled={disabled} />
        </Group>
      }
    />
  );
};

export default Matins;
