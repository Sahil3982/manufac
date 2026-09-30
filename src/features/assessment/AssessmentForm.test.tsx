import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { assessmentSchema } from "./schema";
import AssessmentForm from "./AssessmentForm";

describe("assessment schema boundary", () => {
  it("accepts the exact 60-year boundary and rejects a patient just over 60", () => {
    const validResult = assessmentSchema.safeParse({
      mrn: "MRN-004821",
      patientName: "Sushila Deshpande",
      dateOfBirth: "1966-08-07",
      assessmentDate: "2026-08-07",
      mobility: "cane",
      barthelIndex: 80,
      medicationCount: 3,
      pharmacistReviewRequested: false,
      followUpDate: "2026-09-04",
      consentObtained: true,
    });

    expect(validResult.success).toBe(true);

    const invalidResult = assessmentSchema.safeParse({
      mrn: "MRN-004821",
      patientName: "Sushila Deshpande",
      dateOfBirth: "1966-08-08",
      assessmentDate: "2026-08-07",
      mobility: "cane",
      barthelIndex: 80,
      medicationCount: 3,
      pharmacistReviewRequested: false,
      followUpDate: "2026-09-04",
      consentObtained: true,
    });

    expect(invalidResult.success).toBe(false);
  });
});

describe("assessment form", () => {
  it("loads sample patient data and submits parsed values", async () => {
    const user = userEvent.setup();
    const saveHandler = vi.fn();

    render(<AssessmentForm onSave={saveHandler} />);

    await user.click(
      screen.getByRole("button", { name: /load sample patient/i }),
    );
    await user.click(screen.getByRole("button", { name: /submit/i }));

    await waitFor(() => {
      expect(saveHandler).toHaveBeenCalledTimes(1);
    });

    expect(saveHandler).toHaveBeenCalledWith({
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
    });
  });
});
