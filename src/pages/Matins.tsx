import { Checkbox, Flex, Group, Skeleton, Stack, Text } from "@mantine/core";
import NextButton from "../components/Reusable/NextButton";
import FormCard from "../components/Reusable/FormCard";
import PageLayout from "../components/Layout/PageLayout";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import useDates from "../store/useDates";
import BackButton from "../components/Reusable/BackButton";
import CardHeader from "../components/Reusable/CardHeader";
import FormField from "../components/Reusable/FormField";
import SegControl from "../components/Reusable/SegControl";
import FormHeader from "../components/Reusable/FormHeader";
import { hasEmptyValues } from "../lib/functions/hasEmptyValue";
import { notifications } from "@mantine/notifications";
import SaveButton from "../components/Reusable/SaveButton";
import { IconCheck } from "@tabler/icons-react";

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

const Matins = () => {
  const navigate = useNavigate();
  const { apiDate, setSelectedCopticDates } = useDates();
  const [matinsData, setMatinsData] = useState<MatinsApiProps | undefined>(
    undefined
  );
  const [matinsOptions, setMatinsOptions] = useState<MatinsOptionsProps>({
    doxologies: [],
    gospelLitany: "standard",
    fiveLitanies: "no",
  });
  const [disabled, setDisabled] = useState<boolean>(true);

  // This useEffect returns selections previously made
  useEffect(() => {
    fetch("https://stmarkapi.com:5000/matins?date=" + apiDate)
      .then((response) => response.json())
      .then((data) => {
        if (data?.status !== "No PPT For this date") {
          setMatinsOptions({
            ...matinsOptions,
            doxologies: data?.seasonmatinsDoxologies,
            gospelLitany: data?.matinsLitanyofTheGospel,
            fiveLitanies: data?.matins5ShortLitanies,
          });
        }
      })
      .catch((error) => {
        console.error("Error fetching API data:", error);
      });
  }, []);

  // This useEffect returns ALL options for that given date
  useEffect(() => {
    fetch("https://stmarkapi.com:8080/matins?date=" + apiDate)
      .then((response) => response.json())
      .then((data) => {
        setSelectedCopticDates(data[0]);
        setMatinsData(data[1]);
        setDisabled(false);
      })
      .catch((error) => {
        console.error("Error fetching API data:", error);
      });
  }, []);

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;

    setMatinsOptions((prevOptions: any) => {
      const newOptions = prevOptions.doxologies.includes(value)
        ? prevOptions.doxologies.filter((item: any) => item !== value)
        : [...prevOptions.doxologies, value];

      // Sort the new options array based on the original order
      const sortedOptions = matinsData?.seasonmatinsDoxologies.filter((item) =>
        newOptions.includes(item)
      );

      return {
        ...prevOptions,
        doxologies: sortedOptions,
      };
    });
  };
  const Save = () => {
    if (hasEmptyValues(matinsOptions)) {
      notifications.show({
        withCloseButton: true,
        autoClose: 2000,
        message: "Please fill in all options",
        color: "red",
      });
    } else {
      notifications.show({
        withCloseButton: true,
        message: "Selections Saving",
        color: "blue",
        loading: true,
        id: "save",
      });
      // Modified Copy of Matins Data to Post to API
      const modifiedMatinsData = { ...matinsData };
      modifiedMatinsData.seasonmatinsDoxologies = matinsOptions.doxologies;
      modifiedMatinsData.matinsLitanyofTheGospel = matinsOptions.gospelLitany;
      modifiedMatinsData.matins5ShortLitanies = matinsOptions.fiveLitanies;

      axios
        .post(
          "https://stmarkapi.com:5000/matins?date=" + apiDate,
          modifiedMatinsData
        )
        .then(() => {
          notifications.update({
            withCloseButton: true,
            autoClose: 2000,
            message: "Selections Saved",
            color: "green",
            icon: <IconCheck />,
            id: "save",
          });
        });
    }
  };

  const handleSubmit = () => {
    if (hasEmptyValues(matinsOptions)) {
      notifications.show({
        withCloseButton: true,
        autoClose: 2000,
        message: "Please fill in all options",
        color: "red",
      });
    } else {
      // Modified Copy of Matins Data to Post to API
      const modifiedMatinsData = { ...matinsData };
      modifiedMatinsData.seasonmatinsDoxologies = matinsOptions.doxologies;
      modifiedMatinsData.matinsLitanyofTheGospel = matinsOptions.gospelLitany;
      modifiedMatinsData.matins5ShortLitanies = matinsOptions.fiveLitanies;

      axios
        .post(
          "https://stmarkapi.com:5000/matins?date=" + apiDate,
          modifiedMatinsData
        )
        .then(() => {
          navigate("/offering");
        })
        .catch((error) => {
          console.error("Error submitting data:", error);
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
              gap="xl"
              justify="center"
              align="flex-start"
              direction="column"
            >
              <CardHeader header="Matins" />

              <Stack align="flex-start" spacing={5}>
                <Text fz="md" fw={500}>
                  Seasonal Matins Doxologies
                </Text>

                {matinsData?.seasonmatinsDoxologies
                  ? matinsData?.seasonmatinsDoxologies.map(
                      (item: string, index: number) => (
                        <Checkbox
                          mt="sm"
                          key={index}
                          value={item}
                          checked={matinsOptions.doxologies.includes(item)}
                          onChange={handleCheckboxChange}
                          label={item.split("/").slice(-1)[0].split(".")[0]}
                          transitionDuration={0}
                        />
                      )
                    )
                  : [1, 2, 3, 4].map((index: number) => (
                      <Skeleton
                        height={20}
                        mt={5}
                        width={Math.floor(Math.random() * (100 - 75 + 1)) + 75}
                        radius="md"
                        key={index}
                      />
                    ))}
              </Stack>

              <FormField
                title="Litany of the Gospel"
                options={
                  <SegControl
                    data={[
                      { label: "Standard", value: "standard" },
                      { label: "Alternate", value: "alternate" },
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
                title="Five Short Litanies"
                options={
                  <SegControl
                    data={[
                      { label: "No", value: "no" },
                      { label: "Yes", value: "yes" },
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
          <BackButton onClick={() => navigate("/vespers")} />
          <NextButton onClick={handleSubmit} disabled={disabled} />
          <SaveButton onClick={Save} disabled={disabled} />
        </Group>
      }
    />
  );
};

export default Matins;
