import { useEffect, useState } from "react";
import { getMyKyc, saveMyKyc } from "../../services/kycService";

const initialForm = {
  fullName: "",
  dateOfBirth: "",
  gender: "prefer-not-to-say",

  address: "",
  city: "",
  state: "",
  pincode: "",

  employmentType: "salaried",
  monthlyIncome: "",
  companyName: "",
  workExperience: "",

  identityType: "pan",
};

const steps = [
  "Personal",
  "Employment",
  "Identity",
  "Consent",
];

function KycSection({ token }) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState(initialForm);

  const [status, setStatus] = useState({
    identityStatus: "not-submitted",
    addressStatus: "not-submitted",
    consentStatus: "pending",
    overallStatus: "not-submitted",
  });

  const [consent, setConsent] = useState(false);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadKyc() {
      try {
        const data = await getMyKyc(token);

        const kyc = data.kyc;

        setForm({
          fullName: kyc.fullName || "",
          dateOfBirth: kyc.dateOfBirth || "",
          gender: kyc.gender || "prefer-not-to-say",

          address: kyc.address || "",
          city: kyc.city || "",
          state: kyc.state || "",
          pincode: kyc.pincode || "",

          employmentType: kyc.employmentType || "salaried",
          monthlyIncome: kyc.monthlyIncome || "",
          companyName: kyc.companyName || "",
          workExperience: kyc.workExperience || "",

          identityType: kyc.identityType || "pan",
        });

        setStatus({
          identityStatus:
            kyc.identityStatus || "not-submitted",
          addressStatus:
            kyc.addressStatus || "not-submitted",
          consentStatus:
            kyc.consentStatus || "pending",
          overallStatus:
            kyc.overallStatus || "not-submitted",
        });

        setConsent(
          kyc.consentStatus === "recorded"
        );
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    if (token) {
      loadKyc();
    }
  }, [token]);

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  function nextStep() {
    setError("");
    setMessage("");

    if (step === 1) {
      if (
        !form.fullName ||
        !form.dateOfBirth ||
        !form.gender
      ) {
        setError("Please complete all personal details.");
        return;
      }
    }
    if (step === 2) {
      if (
        !form.address ||
        !form.city ||
        !form.state ||
        !form.pincode ||
        !form.employmentType ||
        !form.monthlyIncome ||
        !form.companyName
      ) {
        setError("Please complete your employment and address details.");
        return;
      }

      if (!/^[1-9][0-9]{5}$/.test(form.pincode)) {
        setError("Please enter a valid 6-digit pincode.");
        return;
      }
    }

    if (step === 3) {
      if (!form.identityType) {
        setError("Please select an identity verification method.");
        return;
      }
    }

    setStep((previous) => Math.min(previous + 1, 4));
  }

  function previousStep() {
    setError("");
    setMessage("");
    setStep((previous) => Math.max(previous - 1, 1));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!consent) {
      setError("Please provide consent before submitting.");
      return;
    }

    try {
      setSaving(true);
      setError("");
      setMessage("");

      const data = await saveMyKyc(token, form);

      setStatus({
        identityStatus: data.kyc.identityStatus,
        addressStatus: data.kyc.addressStatus,
        consentStatus: data.kyc.consentStatus,
        overallStatus: data.kyc.overallStatus,
      });

      setMessage(
        "KYC profile submitted successfully. Verification is pending."
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="rounded-3xl bg-white p-10 text-center shadow-sm">
        Loading KYC profile...
      </div>
    );
  }

  return (
    <div>
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-600">
          KYC & Profile
        </p>

        <h2 className="mt-2 text-3xl font-extrabold text-slate-900">
          Complete Your Verification
        </h2>

        <p className="mt-2 text-slate-500">
          Complete each step to prepare your profile for the loan workflow.
        </p>
      </div>

      {message && (
        <div className="mt-6 rounded-2xl border border-green-200 bg-green-50 px-5 py-4 text-sm text-green-700">
          {message}
        </div>
      )}

      {error && (
        <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Progress */}
      <div className="mt-7 rounded-3xl bg-white p-5 shadow-sm">
        <div className="grid grid-cols-4 gap-2">
          {steps.map((label, index) => {
            const stepNumber = index + 1;
            const active = stepNumber === step;
            const completed = stepNumber < step;

            return (
              <div key={label} className="text-center">
                <div
                  className={`mx-auto flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold ${
                    active || completed
                      ? "bg-blue-600 text-white"
                      : "bg-slate-100 text-slate-500"
                  }`}
                >
                  {completed ? "✓" : stepNumber}
                </div>

                <p
                  className={`mt-2 text-xs font-semibold ${
                    active
                      ? "text-blue-700"
                      : "text-slate-500"
                  }`}
                >
                  {label}
                </p>
              </div>
            );
          })}
        </div>

        <div className="mt-5 h-2 overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-blue-600 transition-all"
            style={{
              width: `${step * 25}%`,
            }}
          />
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_340px]">

        {/* Main form */}
        <form
          onSubmit={handleSubmit}
          className="rounded-3xl bg-white p-7 shadow-sm md:p-8"
        >
          {/* Step 1 */}
          {step === 1 && (
            <div>
              <h3 className="text-xl font-bold text-slate-900">
                Personal Details
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Enter your basic profile information.
              </p>

              <div className="mt-6 space-y-5">

                <Field
                  label="Full Name"
                  name="fullName"
                  value={form.fullName}
                  onChange={handleChange}
                  placeholder="Enter full name"
                />

                <div className="grid gap-5 md:grid-cols-2">
                  <Field
                    label="Date of Birth"
                    name="dateOfBirth"
                    type="date"
                    value={form.dateOfBirth}
                    onChange={handleChange}
                  />

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Gender
                    </label>

                    <select
                      name="gender"
                      value={form.gender}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-slate-200 px-4 py-3"
                    >
                      <option value="prefer-not-to-say">
                        Prefer not to say
                      </option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* Step 2 */}
          {step === 2 && (
            <div>
              <h3 className="text-xl font-bold text-slate-900">
                Employment & Address
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Add your employment and basic address information.
              </p>

              <div className="mt-6 space-y-5">

                <Field
                  label="Address"
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  placeholder="Enter address"
                />

                <div className="grid gap-5 md:grid-cols-3">
                  <Field
                    label="City"
                    name="city"
                    value={form.city}
                    onChange={handleChange}
                    placeholder="City"
                  />

                  <Field
                    label="State"
                    name="state"
                    value={form.state}
                    onChange={handleChange}
                    placeholder="State"
                  />

                  <Field
                    label="Pincode"
                    name="pincode"
                    value={form.pincode}
                    onChange={handleChange}
                    placeholder="6-digit pincode"
                    maxLength={6}
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Employment Type
                  </label>

                  <select
                    name="employmentType"
                    value={form.employmentType}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-200 px-4 py-3"
                  >
                    <option value="salaried">Salaried</option>
                    <option value="self-employed">
                      Self Employed
                    </option>
                    <option value="business">
                      Business
                    </option>
                  </select>
                </div>

                <div className="grid gap-5 md:grid-cols-3">
                  <Field
                    label="Monthly Income"
                    name="monthlyIncome"
                    type="number"
                    value={form.monthlyIncome}
                    onChange={handleChange}
                    placeholder="Monthly income"
                  />

                  <Field
                    label="Company / Business Name"
                    name="companyName"
                    value={form.companyName}
                    onChange={handleChange}
                    placeholder="Company name"
                  />

                  <Field
                    label="Work Experience (Years)"
                    name="workExperience"
                    type="number"
                    value={form.workExperience}
                    onChange={handleChange}
                    placeholder="Years"
                  />
                </div>

              </div>
            </div>
          )}

          {/* Step 3 */}
          {step === 3 && (
            <div>
              <h3 className="text-xl font-bold text-slate-900">
                Identity Verification
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Select how identity verification will be handled.
              </p>

              <div className="mt-6 space-y-4">

                <label className="flex cursor-pointer gap-4 rounded-2xl border border-slate-200 p-5">
                  <input
                    type="radio"
                    name="identityType"
                    value="pan"
                    checked={form.identityType === "pan"}
                    onChange={handleChange}
                    className="mt-1"
                  />

                  <div>
                    <p className="font-bold text-slate-900">
                      PAN Verification
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                      The production system would verify PAN through an
                      authorized verification provider.
                    </p>
                  </div>
                </label>

                <label className="flex cursor-pointer gap-4 rounded-2xl border border-slate-200 p-5">
                  <input
                    type="radio"
                    name="identityType"
                    value="authorized-provider"
                    checked={
                      form.identityType === "authorized-provider"
                    }
                    onChange={handleChange}
                    className="mt-1"
                  />

                  <div>
                    <p className="font-bold text-slate-900">
                      Authorized KYC Provider
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                      Use this option when a supported identity provider is
                      connected.
                    </p>
                  </div>
                </label>

                <div className="rounded-2xl bg-amber-50 p-5 text-sm leading-6 text-amber-800">
                  This development version does not collect or store real
                  PAN/Aadhaar numbers or document images. Actual identity
                  verification will be connected through an authorized
                  provider.
                </div>

              </div>
            </div>
          )}

          {/* Step 4 */}
          {step === 4 && (
            <div>
              <h3 className="text-xl font-bold text-slate-900">
                Consent & Submit
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Review your information before submitting.
              </p>

              <div className="mt-6 space-y-4">

                <SummaryRow
                  label="Name"
                  value={form.fullName}
                />

                <SummaryRow
                  label="City"
                  value={`${form.city}, ${form.state}`}
                />

                <SummaryRow
                  label="Employment"
                  value={form.employmentType}
                />

                <SummaryRow
                  label="Identity Method"
                  value={
                    form.identityType === "pan"
                      ? "PAN Verification"
                      : "Authorized Provider"
                  }
                />

                <label className="mt-5 flex cursor-pointer gap-3 rounded-2xl bg-blue-50 p-5">
                  <input
                    type="checkbox"
                    checked={consent}
                    onChange={(event) =>
                      setConsent(event.target.checked)
                    }
                    className="mt-1"
                  />

                  <span className="text-sm leading-6 text-slate-700">
                    I consent to the processing of the information provided
                    for the requested service and understand that actual
                    identity verification may require an authorized
                    verification provider.
                  </span>
                </label>

              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="mt-8 flex items-center justify-between border-t border-slate-100 pt-6">

            {step > 1 ? (
              <button
                type="button"
                onClick={previousStep}
                className="rounded-xl border border-slate-200 px-5 py-3 font-semibold text-slate-700"
              >
                ← Back
              </button>
            ) : (
              <div />
            )}

            {step < 4 ? (
              <button
                type="button"
                onClick={nextStep}
                className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
              >
                Continue →
              </button>
            ) : (
              <button
                type="submit"
                disabled={saving || !consent}
                className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saving ? "Submitting..." : "Submit KYC"}
              </button>
            )}

          </div>
        </form>

        {/* Status sidebar */}
        <div className="rounded-3xl bg-slate-950 p-6 text-white">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-400">
            Verification Status
          </p>

          <h3 className="mt-2 text-2xl font-extrabold">
            KYC Checklist
          </h3>

          <div className="mt-6 space-y-3">

            <StatusRow
              label="Identity"
              value={status.identityStatus}
            />

            <StatusRow
              label="Address"
              value={status.addressStatus}
            />

            <StatusRow
              label="Consent"
              value={status.consentStatus}
            />

            <StatusRow
              label="Overall"
              value={status.overallStatus}
            />

          </div>

          <div className="mt-6 rounded-2xl bg-white/10 p-4 text-sm leading-6 text-slate-300">
            Submitted information will remain in the development profile
            workflow until an authorized verification process is connected.
          </div>
        </div>

      </div>
    </div>
  );
}

function Field({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
  maxLength,
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-slate-700">
        {label}
      </label>

      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        maxLength={maxLength}
        required
        className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
      />
    </div>
  );
}

function SummaryRow({ label, value }) {
  return (
    <div className="flex items-center justify-between rounded-2xl bg-slate-50 p-4">
      <span className="text-sm text-slate-500">
        {label}
      </span>

      <span className="max-w-[60%] text-right text-sm font-semibold capitalize text-slate-900">
        {value || "--"}
      </span>
    </div>
  );
}

function StatusRow({ label, value }) {
  const display = value
    .replaceAll("-", " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());

  return (
    <div className="flex items-center justify-between rounded-2xl bg-white/10 p-4">
      <span className="text-sm text-slate-300">
        {label}
      </span>

      <span className="rounded-full bg-blue-500/20 px-3 py-1 text-xs font-semibold text-blue-300">
        {display}
      </span>
    </div>
  );
}

export default KycSection;
