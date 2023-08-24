import { Flex, Group, Radio, Select, Skeleton } from '@mantine/core';
import NextButton from '../components/Reusable/NextButton';
import FormCard from '../components/Reusable/FormCard';
import PageLayout from '../components/Layout/PageLayout';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import useDates from '../store/useDates';
import BackButton from '../components/Reusable/BackButton';
import CardHeader from '../components/Reusable/CardHeader';
import FormField from '../components/Reusable/FormField';
import SegControl from '../components/Reusable/SegControl';
import FormHeader from '../components/Reusable/FormHeader';

// TODO: HasEmptyValues Revamp
export interface FaithfulLiturgyApiProps {
  Liturgy3GreatLitanies: string;
  inTheWisdomOfGod: string;
  liturgyCreed: string;
  prayerOfReconcilation: string[];
  rejoiceOMary: string;
  anaphora: string;
  OLordofHosts: string;
  theCherubim: string;
  agiosLiturgy: string;
  instiution: string;
  yeahWeAskYou: string;
  sevenLitanies: string;
  jeNaiNan: string;
  seasonLitany: string;
  conclusionSeason: string;
  healingToThesick: string;
  Oblations: string;
  Commemoration: string;
  postCommemoration: string;
  prefaceToTheFraction: string;
  seasonalFraction: string[];
  fractionIndex: string[];
  postFraction: string;
}

interface FaithfulLiturgysOptionsProps {
  threeLitanies: string;
  reconcilePrayer: string;
  rejoiceOMary: string;
  anaphora: string;
  OLordofHosts: string;
  agios: string;
  instiution: string;
  yeahWeAskYou: string;
  jeNaiNan: string;
  healingToTheSick: string;
  commemoration: string;
  postCommemoration: string;
  fractionIntro: string;
  seasonalFraction: string;
  standardFraction: string;
}

interface SelectItemProps {
  value: string;
  label: string;
}

interface FractionObjectProps {
  seasonalFractions: SelectItemProps[];
  standardFractions: SelectItemProps[];
}

const FaithfulLiturgy = () => {
  const navigate = useNavigate();

  const { apiDate, setSelectedCopticDates } = useDates();
  const [fractionObject, setFractionObject] = useState<FractionObjectProps>({
    seasonalFractions: [],
    standardFractions: [],
  });
  const [faithfulData, setFaithfulData] = useState<
    FaithfulLiturgyApiProps | undefined
  >(undefined);
  const [faithfulOptions, setFaithfulOptions] =
    useState<FaithfulLiturgysOptionsProps>({
      threeLitanies: 'no',
      reconcilePrayer:
        'powerpoints/liturgy/reconciliation prayers/o god the great the eternal.pptx',
      rejoiceOMary: 'no',
      anaphora: 'basil',
      OLordofHosts: 'no',
      agios: 'basil',
      instiution: 'basil',
      yeahWeAskYou: 'no',
      jeNaiNan: 'no',
      healingToTheSick: 'no',
      commemoration: 'basil',
      postCommemoration: 'basil',
      fractionIntro: 'basil',
      seasonalFraction: '',
      standardFraction: '',
    });
  const [disabled, setDisabled] = useState<boolean>(true);

  // This useEffect returns selections previously made
  useEffect(() => {
    fetch('https://stmarkapi.com:5000/liturgyOfFaithful?date=' + apiDate)
      .then((response) => response.json())
      .then((data) => {
        if (data?.status !== 'No PPT For this date') {
          setFaithfulOptions({
            ...faithfulOptions,
            threeLitanies: data?.Liturgy3GreatLitanies,
            reconcilePrayer: data?.prayerOfReconcilation[0],
            rejoiceOMary: data?.rejoiceOMary,
            anaphora: data?.anaphora,
            OLordofHosts: data?.OLordofHosts,
            agios: data?.agiosLiturgy,
            instiution: data?.instiution,
            yeahWeAskYou: data?.yeahWeAskYou,
            jeNaiNan: data?.jeNaiNan,
            healingToTheSick: data?.healingToThesick,
            commemoration: data?.Commemoration,
            postCommemoration: data?.postCommemoration,
            fractionIntro: data?.prefaceToTheFraction,
            seasonalFraction: data?.seasonalFraction[0],
            standardFraction: data?.fractionIndex[0],
          });
        }
      })
      .catch((error) => {
        console.error('Error fetching API data:', error);
      });
  }, []);

  // This useEffect returns ALL options for that given date
  useEffect(() => {
    fetch('https://stmarkapi.com:8080/liturgyOfFaithful?date=' + apiDate)
      .then((response) => response.json())
      .then((data) => {
        setSelectedCopticDates(data[0]);
        setFaithfulData(data[1]);
        setDisabled(false);

        setFractionObject({
          seasonalFractions: data[1].seasonalFraction.map((path: string) => ({
            value: path,
            label: path.split('/').slice(-1)[0].split('.')[0],
          })),
          standardFractions: data[1].fractionIndex.map((path: string) => ({
            value: path,
            label: path.split('/').slice(-1)[0].split('.')[0],
          })),
        });
      })
      .catch((error) => {
        console.error('Error fetching API data:', error);
      });
  }, []);

  const handleRadioChange = (value: string) => {
    setFaithfulOptions((prevOptions) => ({
      ...prevOptions,
      reconcilePrayer: value,
    }));
  };

  const handleFractionChange = (
    fraction: 'seasonalFraction' | 'standardFraction',
    newValue: string
  ) => {
    setFaithfulOptions((prevOptions) => ({
      ...prevOptions,
      [fraction]: newValue,
    }));
  };

  const handleSubmit = () => {
    // Modified Copy of Faithful Data to Post to API
    const modifiedFaithfulData = { ...faithfulData };
    modifiedFaithfulData.Liturgy3GreatLitanies = faithfulOptions.threeLitanies;
    modifiedFaithfulData.prayerOfReconcilation = [
      faithfulOptions.reconcilePrayer,
    ];
    modifiedFaithfulData.rejoiceOMary = faithfulOptions.rejoiceOMary;
    modifiedFaithfulData.anaphora = faithfulOptions.anaphora;
    modifiedFaithfulData.OLordofHosts = faithfulOptions.OLordofHosts;
    modifiedFaithfulData.agiosLiturgy = faithfulOptions.agios;
    modifiedFaithfulData.instiution = faithfulOptions.instiution;
    modifiedFaithfulData.yeahWeAskYou = faithfulOptions.yeahWeAskYou;
    modifiedFaithfulData.jeNaiNan = faithfulOptions.jeNaiNan;
    modifiedFaithfulData.healingToThesick = faithfulOptions.healingToTheSick;
    modifiedFaithfulData.Commemoration = faithfulOptions.commemoration;
    modifiedFaithfulData.postCommemoration = faithfulOptions.postCommemoration;
    modifiedFaithfulData.prefaceToTheFraction = faithfulOptions.fractionIntro;
    modifiedFaithfulData.seasonalFraction = [faithfulOptions.seasonalFraction];
    modifiedFaithfulData.fractionIndex = [faithfulOptions.standardFraction];

    axios
      .post(
        'https://stmarkapi.com:5000/liturgyOfFaithful?date=' + apiDate,
        modifiedFaithfulData
      )
      .then(() => {
        navigate(`/communion`);
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
              <CardHeader header='Liturgy of the Faithful' />

              <FormField
                title='Three Long Litanies'
                options={
                  <SegControl
                    data={[
                      { label: 'No', value: 'no' },
                      { label: 'Yes', value: 'yes' },
                    ]}
                    value={faithfulOptions.threeLitanies}
                    onChange={(value: string) =>
                      setFaithfulOptions({
                        ...faithfulOptions,
                        threeLitanies: value,
                      })
                    }
                  />
                }
              />

              <FormField
                title='Reconciliation Prayer'
                options={
                  <Radio.Group
                    value={faithfulOptions.reconcilePrayer}
                    onChange={handleRadioChange}
                  >
                    {faithfulData?.prayerOfReconcilation
                      ? faithfulData?.prayerOfReconcilation.map(
                          (item: string, index: number) => (
                            <Radio
                              mt='sm'
                              label={item.split('/').slice(-1)[0].split('.')[0]}
                              value={item}
                              key={index}
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
                            radius='md'
                            key={index}
                          />
                        ))}
                  </Radio.Group>
                }
              />

              <FormField
                title='Rejoice O Mary'
                options={
                  <SegControl
                    data={[
                      { label: 'No', value: 'no' },
                      { label: 'Yes', value: 'yes' },
                    ]}
                    value={faithfulOptions.rejoiceOMary}
                    onChange={(value: string) =>
                      setFaithfulOptions({
                        ...faithfulOptions,
                        rejoiceOMary: value,
                      })
                    }
                  />
                }
              />

              <FormField
                title='Anaphora'
                options={
                  <SegControl
                    data={[
                      { label: 'Basil', value: 'basil' },
                      { label: 'Gregory', value: 'gregory' },
                    ]}
                    value={faithfulOptions.anaphora}
                    onChange={(value: string) =>
                      setFaithfulOptions({
                        ...faithfulOptions,
                        anaphora: value,
                      })
                    }
                  />
                }
              />

              <FormField
                title='O Lord of Hosts'
                options={
                  <SegControl
                    data={[
                      { label: 'No', value: 'no' },
                      { label: 'Yes', value: 'yes' },
                    ]}
                    value={faithfulOptions.OLordofHosts}
                    onChange={(value: string) =>
                      setFaithfulOptions({
                        ...faithfulOptions,
                        OLordofHosts: value,
                      })
                    }
                  />
                }
              />

              <FormField
                title='Agios'
                options={
                  <SegControl
                    data={[
                      { label: 'Basil', value: 'basil' },
                      { label: 'Gregory', value: 'gregory' },
                    ]}
                    value={faithfulOptions.agios}
                    onChange={(value: string) =>
                      setFaithfulOptions({
                        ...faithfulOptions,
                        agios: value,
                      })
                    }
                  />
                }
              />

              <FormField
                title='Institution Narrative'
                options={
                  <SegControl
                    data={[
                      { label: 'Basil', value: 'basil' },
                      { label: 'Gregory', value: 'gregory' },
                    ]}
                    value={faithfulOptions.instiution}
                    onChange={(value: string) =>
                      setFaithfulOptions({
                        ...faithfulOptions,
                        instiution: value,
                      })
                    }
                  />
                }
              />

              <FormField
                title='Yes We Ask You'
                options={
                  <SegControl
                    data={[
                      { label: 'No', value: 'no' },
                      { label: 'Yes', value: 'yes' },
                    ]}
                    value={faithfulOptions.yeahWeAskYou}
                    onChange={(value: string) =>
                      setFaithfulOptions({
                        ...faithfulOptions,
                        yeahWeAskYou: value,
                      })
                    }
                  />
                }
              />

              <FormField
                title='Je Nai Nan'
                options={
                  <SegControl
                    data={[
                      { label: 'No', value: 'no' },
                      { label: 'Yes', value: 'yes' },
                    ]}
                    value={faithfulOptions.jeNaiNan}
                    onChange={(value: string) =>
                      setFaithfulOptions({
                        ...faithfulOptions,
                        jeNaiNan: value,
                      })
                    }
                  />
                }
              />
              <FormField
                title='Healing to the Sick'
                options={
                  <SegControl
                    data={[
                      { label: 'No', value: 'no' },
                      { label: 'Yes', value: 'yes' },
                    ]}
                    value={faithfulOptions.healingToTheSick}
                    onChange={(value: string) =>
                      setFaithfulOptions({
                        ...faithfulOptions,
                        healingToTheSick: value,
                      })
                    }
                  />
                }
              />

              <FormField
                title='Commemoration'
                options={
                  <SegControl
                    data={[
                      { label: 'Basil', value: 'basil' },
                      { label: 'Gregory', value: 'gregory' },
                    ]}
                    value={faithfulOptions.commemoration}
                    onChange={(value: string) =>
                      setFaithfulOptions({
                        ...faithfulOptions,
                        commemoration: value,
                      })
                    }
                  />
                }
              />

              <FormField
                title='Post Commemoration'
                options={
                  <SegControl
                    data={[
                      { label: 'Basil', value: 'basil' },
                      { label: 'Gregory', value: 'gregory' },
                    ]}
                    value={faithfulOptions.postCommemoration}
                    onChange={(value: string) =>
                      setFaithfulOptions({
                        ...faithfulOptions,
                        postCommemoration: value,
                      })
                    }
                  />
                }
              />

              <FormField
                title='Intro to the Fraction'
                options={
                  <SegControl
                    data={[
                      { label: 'Basil', value: 'basil' },
                      { label: 'Gregory', value: 'gregory' },
                    ]}
                    value={faithfulOptions.fractionIntro}
                    onChange={(value: string) =>
                      setFaithfulOptions({
                        ...faithfulOptions,
                        fractionIntro: value,
                      })
                    }
                  />
                }
              />

              <FormField
                title='Seasonal Fractions'
                options={
                  fractionObject.seasonalFractions.length === 0 ? (
                    <Skeleton height={20} mt={5} width='100%' radius='md' />
                  ) : (
                    <Select
                      placeholder='Select Fraction'
                      value={faithfulOptions.seasonalFraction}
                      onChange={(value: string) => {
                        handleFractionChange('seasonalFraction', value);
                        handleFractionChange('standardFraction', '');
                      }}
                      data={fractionObject.seasonalFractions}
                      clearable
                      searchable
                      sx={{ width: '100%' }}
                    />
                  )
                }
              />

              <FormField
                title='Fraction Index'
                options={
                  fractionObject.standardFractions.length === 0 ? (
                    <Skeleton height={20} mt={5} width='100%' radius='md' />
                  ) : (
                    <Select
                      placeholder='Select Fraction'
                      value={faithfulOptions.standardFraction}
                      onChange={(value: string) => {
                        handleFractionChange('standardFraction', value);
                        handleFractionChange('seasonalFraction', '');
                      }}
                      data={fractionObject.standardFractions}
                      clearable
                      searchable
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
          <BackButton onClick={() => navigate('/liturgyofWord')} />
          <NextButton onClick={handleSubmit} disabled={disabled} />
        </Group>
      }
    />
  );
};

export default FaithfulLiturgy;
