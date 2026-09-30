import { useState } from "react";
import {
  Alert,
  Button,
  Checkbox,
  Code,
  Container,
  Group,
  MantineProvider,
  NumberInput,
  Paper,
  Select,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { schemaResolver, useForm } from "@mantine/form";
import dayjs from "dayjs";
import { assessmentSchema, type Assessment, MOBILITY } from "./schema";

type AssessmentFormValues = {
  mrn: string;
  patientName: string;
  dateOfBirth: string;
  assessmentDate: string;
  mobility: (typeof MOBILITY)[number] | "";
  barthelIndex: number | undefined;
  medicationCount: number | undefined;
  pharmacistReviewRequested: boolean;
  followUpDate: string;
  consentObtained: boolean;
};

const samplePatient: AssessmentFormValues = {
  mrn: "MRN-004821",
  patientName: "Sushila Deshpande",
  dateOfBirth: "1949-03-12",
  assessmentDate: "2026-08-07",
  mobility: "cane",
  barthelIndex: 80,
  medicationCount: 3,
  pharmacistReviewRequested: false,
  followUpDate: "2026-09-04",
  consentObtained: true,
};

const emptyValues: AssessmentFormValues = {
  mrn: "",
  patientName: "",
  dateOfBirth: "",
  assessmentDate: "",
  mobility: "",
  barthelIndex: undefined,
  medicationCount: undefined,
  pharmacistReviewRequested: false,
  followUpDate: "",
  consentObtained: false,
};

const mobilityOptions = MOBILITY.map((option) => ({
  value: option,
  label: option.charAt(0).toUpperCase() + option.slice(1),
}));

const zodResolver = schemaResolver;

const normalizeDateValue = (value: Date | string | null) => {
  if (!value) {
    return "";
  }

  return typeof value === "string" ? value : dayjs(value).format("YYYY-MM-DD");
};

const parseNumberInputValue = (value: number | string | undefined) => {
  if (value === "" || value === undefined) {
    return undefined;
  }

  return Number(value);
};

type AssessmentFormProps = {
  onSave?: (values: Assessment) => void;
};

export default function AssessmentForm({ onSave }: AssessmentFormProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState<Assessment | null>(null);

  const form = useForm<AssessmentFormValues>({
    initialValues: emptyValues,
    validate: zodResolver(assessmentSchema),
    validateInputOnBlur: true,
  });

  const handleSubmit = form.onSubmit(async (values) => {
    const parsedValues = assessmentSchema.parse(values);

    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 800));

    onSave?.(parsedValues);
    setSuccessMessage(parsedValues);
    setIsSaving(false);
  });

  return (
    <MantineProvider defaultColorScheme="light">
      <Container size="sm" py="xl">
        <Paper withBorder radius="md" p="xl">
          <Stack gap="lg">
            <Title order={2}>Geriatric Care Assessment</Title>

            <form onSubmit={handleSubmit}>
              <Stack gap="md">
                <TextInput
                  label="Medical record number"
                  placeholder="MRN-004821"
                  value={form.values.mrn}
                  onChange={(event) =>
                    form.setFieldValue("mrn", event.currentTarget.value)
                  }
                  onBlur={() => form.validateField("mrn")}
                  error={form.errors.mrn}
                />

                <TextInput
                  label="Patient name"
                  value={form.values.patientName}
                  onChange={(event) =>
                    form.setFieldValue("patientName", event.currentTarget.value)
                  }
                  onBlur={() => form.validateField("patientName")}
                  error={form.errors.patientName}
                />

                <DateInput
                  label="Date of birth"
                  value={
                    form.values.dateOfBirth
                      ? new Date(form.values.dateOfBirth)
                      : null
                  }
                  onChange={(value) =>
                    form.setFieldValue("dateOfBirth", normalizeDateValue(value))
                  }
                  onBlur={() => form.validateField("dateOfBirth")}
                  valueFormat="YYYY-MM-DD"
                  error={form.errors.dateOfBirth}
                />

                <DateInput
                  label="Assessment date"
                  value={
                    form.values.assessmentDate
                      ? new Date(form.values.assessmentDate)
                      : null
                  }
                  onChange={(value) =>
                    form.setFieldValue(
                      "assessmentDate",
                      normalizeDateValue(value),
                    )
                  }
                  onBlur={() => form.validateField("assessmentDate")}
                  valueFormat="YYYY-MM-DD"
                  maxDate={new Date()}
                  error={form.errors.assessmentDate}
                />

                <Select
                  label="Mobility"
                  placeholder="Select mobility"
                  data={mobilityOptions}
                  value={form.values.mobility || null}
                  onChange={(value) =>
                    form.setFieldValue(
                      "mobility",
                      (value ?? "") as AssessmentFormValues["mobility"],
                    )
                  }
                  onBlur={() => form.validateField("mobility")}
                  error={form.errors.mobility}
                />

                <NumberInput
                  label="Barthel Index"
                  min={0}
                  max={100}
                  step={5}
                  value={form.values.barthelIndex}
                  onChange={(value) =>
                    form.setFieldValue(
                      "barthelIndex",
                      parseNumberInputValue(value),
                    )
                  }
                  onBlur={() => form.validateField("barthelIndex")}
                  error={form.errors.barthelIndex}
                />

                <NumberInput
                  label="Regular medications"
                  min={0}
                  max={30}
                  value={form.values.medicationCount}
                  onChange={(value) =>
                    form.setFieldValue(
                      "medicationCount",
                      parseNumberInputValue(value),
                    )
                  }
                  onBlur={() => form.validateField("medicationCount")}
                  error={form.errors.medicationCount}
                />

                <Checkbox
                  label="Pharmacist review requested"
                  checked={form.values.pharmacistReviewRequested}
                  onChange={(event) =>
                    form.setFieldValue(
                      "pharmacistReviewRequested",
                      event.currentTarget.checked,
                    )
                  }
                  onBlur={() => form.validateField("pharmacistReviewRequested")}
                  error={form.errors.pharmacistReviewRequested}
                />

                <DateInput
                  label="Next review date"
                  value={
                    form.values.followUpDate
                      ? new Date(form.values.followUpDate)
                      : null
                  }
                  onChange={(value) =>
                    form.setFieldValue(
                      "followUpDate",
                      normalizeDateValue(value),
                    )
                  }
                  onBlur={() => form.validateField("followUpDate")}
                  valueFormat="YYYY-MM-DD"
                  error={form.errors.followUpDate}
                />

                <Checkbox
                  label="Patient or representative has given consent"
                  checked={form.values.consentObtained}
                  onChange={(event) =>
                    form.setFieldValue(
                      "consentObtained",
                      event.currentTarget.checked,
                    )
                  }
                  onBlur={() => form.validateField("consentObtained")}
                  error={form.errors.consentObtained}
                />

                <Group justify="space-between" mt="sm">
                  <Button
                    type="button"
                    variant="default"
                    onClick={() => form.setValues(samplePatient)}
                  >
                    Load sample patient
                  </Button>

                  <Button type="submit" loading={isSaving} disabled={isSaving}>
                    Submit
                  </Button>
                </Group>
              </Stack>
            </form>

            {successMessage ? (
              <Alert title="Assessment saved" color="green">
                <Text size="sm">
                  The assessment has been saved successfully.
                </Text>
                <Code block mt="sm">
                  {JSON.stringify(successMessage, null, 2)}
                </Code>
              </Alert>
            ) : null}
          </Stack>
        </Paper>
      </Container>
    </MantineProvider>
  );
}
