import KycSection from "./KycSection";
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { getLoanOffers } from "../../services/loanService";
import { getMyApplications } from "../../services/applicationService";
import heroImage from "../../assets/hero.png";

function formatAmount(amount) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatDate(date) {
  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function Dashboard() {
  const { user, token, logout } = useAuth();

  const [activeSection, setActiveSection] = useState("home");
  const [loans, setLoans] = useState([]);
  const [applications, setApplications] = useState([]);

  const [selectedLoan, setSelectedLoan] = useState(null);
  const [loadingLoans, setLoadingLoans] = useState(true);
  const [loadingApplications, setLoadingApplications] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [applicationForm, setApplicationForm] = useState({
    amount: "",
    tenureMonths: "",
    monthlyIncome: "",
    employmentType: "salaried",
  });

  useEffect(() => {
    async function loadLoans() {
      if (!token) return;

      try {
        const data = await getLoanOffers(token);
        setLoans(data.loans || []);
      } catch (err) {
        setError(err.message || "Unable to load loan offers");
      } finally {
        setLoadingLoans(false);
      }
    }

    loadLoans();
  }, [token]);

  useEffect(() => {
    async function loadApplications() {
      if (!token) return;

      try {
        const data = await getMyApplications(token);
        setApplications(data.applications || []);
      } catch (err) {
        setError(err.message || "Unable to load applications");
      } finally {
        setLoadingApplications(false);
      }
    }

    loadApplications();
  }, [token]);

  const applicationStats = useMemo(() => {
    return {
      total: applications.length,
      pending: applications.filter(
        (item) => item.status === "pending"
      ).length,
      approved: applications.filter(
        (item) => item.status === "approved"
      ).length,
    };
  }, [applications]);

  function changeSection(section) {
    setActiveSection(section);
    setSelectedLoan(null);
    setMessage("");
    setError("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function selectLoan(loan) {
    setSelectedLoan(loan);

    setApplicationForm({
      amount: String(loan.minAmount),
      tenureMonths: String(Math.min(36, loan.maxTenureMonths)),
      monthlyIncome: "",
      employmentType: "salaried",
    });

    setMessage("");
    setError("");
    setActiveSection("apply");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function handleFormChange(event) {
    const { name, value } = event.target;

    setApplicationForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  async function submitApplication(event) {
    event.preventDefault();

    if (!selectedLoan || !token) return;

    try {
      setSubmitting(true);
      setError("");
      setMessage("");

      const response = await fetch(
        "http://localhost:5000/api/applications",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            loanId: selectedLoan.id,
            loanName: selectedLoan.name,
            ...applicationForm,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Application submission failed");
      }

      setApplications((previous) => [
        data.application,
        ...previous,
      ]);

      setMessage(
        `Application submitted successfully. Application ID: ${data.application.id}`
      );

      setSelectedLoan(null);
      setApplicationForm({
        amount: "",
        tenureMonths: "",
        monthlyIncome: "",
        employmentType: "salaried",
      });

      setActiveSection("applications");
    } catch (err) {
      setError(err.message || "Unable to submit application");
    } finally {
      setSubmitting(false);
    }
  }

  function renderHome() {
    return (
      <>
        {/* Hero */}
        <section className="overflow-hidden rounded-[2rem] bg-gradient-to-br from-sky-50 via-blue-50 to-white">
          <div className="grid items-center gap-8 px-6 py-8 md:px-10 lg:grid-cols-2 lg:px-12 lg:py-12">

            <div>
              <p className="text-sm font-bold uppercase tracking-[0.22em] text-blue-600">
                Your Credit. Your Control.
              </p>

              <h1 className="mt-4 max-w-2xl text-4xl font-extrabold leading-tight text-slate-900 md:text-5xl">
                Check your credit health
                <span className="block text-blue-700">
                  & explore loan options
                </span>
              </h1>

              <p className="mt-5 max-w-xl text-base leading-7 text-slate-600">
                Manage your credit profile, explore loan products and track
                your applications from one simple dashboard.
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <button
                  onClick={() => changeSection("score")}
                  className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white shadow-lg shadow-blue-100 transition hover:bg-blue-700"
                >
                  Check Credit Score →
                </button>

                <button
                  onClick={() => changeSection("loans")}
                  className="rounded-xl border border-blue-200 bg-white px-6 py-3 font-semibold text-blue-700 transition hover:bg-blue-50"
                >
                  Explore Loan Options
                </button>
              </div>

              <div className="mt-7 flex flex-wrap gap-5 text-sm text-slate-600">
                <span>✓ Secure account</span>
                <span>✓ Online application</span>
                <span>✓ Application tracking</span>
              </div>
            </div>

            <div className="relative">
              <div className="overflow-hidden rounded-[2rem] bg-white shadow-xl">
                <img
                  src={heroImage}
                  alt="CrediTrust customer"
                  className="h-[330px] w-full object-cover md:h-[390px]"
                />
              </div>

              <div className="absolute right-3 top-5 w-52 rounded-2xl border border-slate-100 bg-white/95 p-5 shadow-xl backdrop-blur">
                <p className="text-sm font-semibold text-slate-700">
                  Your Credit Score
                </p>

                <div className="mt-4 text-center">
                  <div className="text-5xl font-extrabold text-slate-900">
                    --
                  </div>

                  <p className="mt-1 text-sm font-semibold text-blue-600">
                    Not connected
                  </p>

                  <p className="mt-3 text-xs leading-5 text-slate-500">
                    Authorized credit-bureau integration will appear here.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* Quick actions */}
        <section className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <button
            onClick={() => changeSection("score")}
            className="rounded-2xl bg-white p-5 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-md"
          >
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-blue-50 text-xl">
              ↗
            </div>

            <h3 className="font-bold text-slate-900">
              Check Credit Score
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              View your available credit information.
            </p>
          </button>

          <button
            onClick={() => changeSection("report")}
            className="rounded-2xl bg-white p-5 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-md"
          >
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-blue-50 text-xl">
              ▤
            </div>

            <h3 className="font-bold text-slate-900">
              Credit Report
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              View report information and history.
            </p>
          </button>

          <button
            onClick={() => changeSection("loans")}
            className="rounded-2xl bg-white p-5 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-md"
          >
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-blue-50 text-xl">
              ₹
            </div>

            <h3 className="font-bold text-slate-900">
              Loan Offers
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Explore loan products and apply online.
            </p>
          </button>

          <button
            onClick={() => changeSection("education")}
            className="rounded-2xl bg-white p-5 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-md"
          >
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-blue-50 text-xl">
              ?
            </div>

            <h3 className="font-bold text-slate-900">
              Track & Improve
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Learn how to build healthier credit habits.
            </p>
          </button>
        </section>

        {/* Loan products + health */}
        <section className="mt-8 grid gap-6 xl:grid-cols-[1fr_360px]">

          <div>
            <div className="mb-5 flex items-end justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-600">
                  Loan Products
                </p>

                <h2 className="mt-2 text-2xl font-extrabold text-slate-900">
                  Our Loan Products
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Choose from available development loan products.
                </p>
              </div>

              <button
                onClick={() => changeSection("loans")}
                className="hidden text-sm font-semibold text-blue-600 md:block"
              >
                View All Loans →
              </button>
            </div>

            {loadingLoans ? (
              <div className="rounded-3xl bg-white p-10 text-center shadow-sm">
                Loading loan products...
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {loans.map((loan) => (
                  <div
                    key={loan.id}
                    className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">
                          {loan.category}
                        </p>

                        <h3 className="mt-2 text-lg font-bold text-slate-900">
                          {loan.name}
                        </h3>
                      </div>

                      <div className="rounded-xl bg-blue-50 px-3 py-2 text-lg font-bold text-blue-700">
                        ₹
                      </div>
                    </div>

                    <p className="mt-3 text-sm leading-6 text-slate-500">
                      {loan.description}
                    </p>

                    <div className="mt-4 flex items-end justify-between gap-3 border-t border-slate-100 pt-4">
                      <div>
                        <p className="text-xs text-slate-400">
                          Starting interest
                        </p>

                        <p className="mt-1 font-bold text-slate-900">
                          {loan.interestRate}
                        </p>
                      </div>

                      <button
                        onClick={() => selectLoan(loan)}
                        className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
                      >
                        Apply Now →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-3xl bg-blue-50 p-6">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-600">
              Your Credit Health
            </p>

            <h2 className="mt-2 text-2xl font-extrabold text-slate-900">
              At a Glance
            </h2>

            <div className="mt-6 rounded-2xl bg-white p-5 text-center shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Credit Score
              </p>

              <p className="mt-3 text-5xl font-extrabold text-slate-900">
                --
              </p>

              <p className="mt-2 text-sm font-semibold text-blue-600">
                Bureau connection pending
              </p>

              <button
                onClick={() => changeSection("score")}
                className="mt-5 rounded-xl border border-blue-200 px-4 py-2 text-sm font-semibold text-blue-700"
              >
                View Credit Details
              </button>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-2xl bg-white p-4">
                <p className="text-xs text-slate-500">
                  Applications
                </p>

                <p className="mt-1 text-2xl font-bold text-slate-900">
                  {applicationStats.total}
                </p>
              </div>

              <div className="rounded-2xl bg-white p-4">
                <p className="text-xs text-slate-500">
                  Pending
                </p>

                <p className="mt-1 text-2xl font-bold text-slate-900">
                  {applicationStats.pending}
                </p>
              </div>
            </div>
          </div>

        </section>

        {/* Learn */}
        <section className="mt-8 rounded-3xl bg-gradient-to-r from-slate-50 to-blue-50 p-6 md:p-8">
          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-600">
                Learn & Improve
              </p>

              <h2 className="mt-2 text-2xl font-extrabold text-slate-900">
                Build a stronger credit profile
              </h2>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                Learn practical credit concepts, understand loan terms and
                make informed financial decisions.
              </p>
            </div>

            <button
              onClick={() => changeSection("education")}
              className="text-sm font-bold text-blue-600"
            >
              Explore Education →
            </button>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {[
              ["Credit Score Basics", "Understand what a credit score means."],
              ["Improve Your Score", "Learn healthy credit management habits."],
              ["Avoid Common Mistakes", "Understand missed payments and over-borrowing."],
            ].map(([title, text]) => (
              <button
                key={title}
                onClick={() => changeSection("education")}
                className="rounded-2xl bg-white p-5 text-left shadow-sm"
              >
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 font-bold text-blue-600">
                  ✓
                </div>

                <h3 className="font-bold text-slate-900">
                  {title}
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  {text}
                </p>
              </button>
            ))}
          </div>
        </section>
      </>
    );
  }

  function renderLoans() {
    return (
      <>
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-600">
            Loan Products
          </p>

          <h2 className="mt-2 text-3xl font-extrabold text-slate-900">
            Explore Loan Options
          </h2>

          <p className="mt-2 text-slate-500">
            Select a development loan product to start your application.
          </p>
        </div>

        <div className="mt-7 grid gap-5 md:grid-cols-2">
          {loans.map((loan) => (
            <div
              key={loan.id}
              className="rounded-3xl bg-white p-6 shadow-sm"
            >
              <p className="text-sm font-semibold text-blue-600">
                {loan.category}
              </p>

              <h3 className="mt-2 text-2xl font-bold text-slate-900">
                {loan.name}
              </h3>

              <p className="mt-3 text-sm leading-6 text-slate-500">
                {loan.description}
              </p>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs text-slate-500">
                    Loan Amount
                  </p>

                  <p className="mt-1 text-sm font-bold">
                    {formatAmount(loan.minAmount)} -{" "}
                    {formatAmount(loan.maxAmount)}
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs text-slate-500">
                    Interest Rate
                  </p>

                  <p className="mt-1 text-sm font-bold">
                    {loan.interestRate}
                  </p>
                </div>
              </div>

              <button
                onClick={() => selectLoan(loan)}
                className="mt-5 w-full rounded-xl bg-blue-600 py-3 font-semibold text-white hover:bg-blue-700"
              >
                Apply Now →
              </button>
            </div>
          ))}
        </div>
      </>
    );
  }

  function renderApply() {
    if (!selectedLoan) {
      return (
        <div className="rounded-3xl bg-white p-10 text-center shadow-sm">
          <h2 className="text-2xl font-bold text-slate-900">
            Select a loan to continue
          </h2>

          <button
            onClick={() => changeSection("loans")}
            className="mt-5 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white"
          >
            View Loan Offers
          </button>
        </div>
      );
    }

    return (
      <>
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-600">
            Application
          </p>

          <h2 className="mt-2 text-3xl font-extrabold text-slate-900">
            Apply for {selectedLoan.name}
          </h2>

          <p className="mt-2 text-slate-500">
            Enter your basic financial information.
          </p>
        </div>

        <div className="mt-7 rounded-3xl bg-white p-6 shadow-sm md:p-8">
          <form
            onSubmit={submitApplication}
            className="max-w-2xl space-y-5"
          >
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Loan Amount
              </label>

              <input
                type="number"
                name="amount"
                value={applicationForm.amount}
                onChange={handleFormChange}
                min={selectedLoan.minAmount}
                max={selectedLoan.maxAmount}
                required
                className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Tenure (Months)
              </label>

              <input
                type="number"
                name="tenureMonths"
                value={applicationForm.tenureMonths}
                onChange={handleFormChange}
                min="1"
                max={selectedLoan.maxTenureMonths}
                required
                className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Monthly Income
              </label>

              <input
                type="number"
                name="monthlyIncome"
                value={applicationForm.monthlyIncome}
                onChange={handleFormChange}
                min="1"
                required
                className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Employment Type
              </label>

              <select
                name="employmentType"
                value={applicationForm.employmentType}
                onChange={handleFormChange}
                className="w-full rounded-xl border border-slate-200 px-4 py-3"
              >
                <option value="salaried">Salaried</option>
                <option value="self-employed">Self Employed</option>
                <option value="business">Business</option>
              </select>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white disabled:opacity-60"
              >
                {submitting ? "Submitting..." : "Submit Application"}
              </button>

              <button
                type="button"
                onClick={() => changeSection("loans")}
                className="rounded-xl border border-slate-200 px-6 py-3 font-semibold text-slate-700"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </>
    );
  }

  function renderApplications() {
    return (
      <>
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-600">
            Applications
          </p>

          <h2 className="mt-2 text-3xl font-extrabold text-slate-900">
            My Applications
          </h2>

          <p className="mt-2 text-slate-500">
            Track all loan applications from this account.
          </p>
        </div>

        {loadingApplications ? (
          <div className="mt-7 rounded-3xl bg-white p-10 text-center shadow-sm">
            Loading applications...
          </div>
        ) : applications.length === 0 ? (
          <div className="mt-7 rounded-3xl bg-white p-10 text-center shadow-sm">
            <h3 className="text-xl font-bold text-slate-900">
              No applications yet
            </h3>

            <button
              onClick={() => changeSection("loans")}
              className="mt-5 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white"
            >
              Explore Loans
            </button>
          </div>
        ) : (
          <div className="mt-7 space-y-4">
            {applications.map((application) => (
              <div
                key={application.id}
                className="rounded-3xl bg-white p-6 shadow-sm"
              >
                <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="text-xl font-bold text-slate-900">
                        {application.loanName}
                      </h3>

                      <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold capitalize text-blue-700">
                        {application.status.replace("-", " ")}
                      </span>
                    </div>

                    <p className="mt-2 text-sm text-slate-500">
                      ID:{" "}
                      <span className="font-semibold text-slate-700">
                        {application.id}
                      </span>
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                      Applied: {formatDate(application.createdAt)}
                    </p>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-3">
                    <div className="rounded-2xl bg-slate-50 p-4">
                      <p className="text-xs text-slate-500">Amount</p>
                      <p className="mt-1 font-bold">
                        {formatAmount(application.amount)}
                      </p>
                    </div>

                    <div className="rounded-2xl bg-slate-50 p-4">
                      <p className="text-xs text-slate-500">Tenure</p>
                      <p className="mt-1 font-bold">
                        {application.tenureMonths} months
                      </p>
                    </div>

                    <div className="rounded-2xl bg-slate-50 p-4">
                      <p className="text-xs text-slate-500">Income</p>
                      <p className="mt-1 font-bold">
                        {formatAmount(application.monthlyIncome)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </>
    );
  }

  function renderScore() {
    return (
      <>
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-600">
            Credit Profile
          </p>

          <h2 className="mt-2 text-3xl font-extrabold text-slate-900">
            Credit Score
          </h2>
        </div>

        <div className="mt-7 grid gap-6 lg:grid-cols-[360px_1fr]">
          <div className="rounded-3xl bg-white p-8 text-center shadow-sm">
            <p className="text-sm font-semibold text-slate-500">
              Current Credit Score
            </p>

            <div className="mx-auto mt-8 flex h-48 w-48 items-center justify-center rounded-full border-[18px] border-slate-200">
              <div>
                <p className="text-5xl font-extrabold text-slate-900">
                  --
                </p>

                <p className="mt-1 text-sm font-semibold text-slate-500">
                  Unavailable
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl bg-white p-8 shadow-sm">
            <h3 className="text-xl font-bold text-slate-900">
              Credit Score Connection
            </h3>

            <p className="mt-3 leading-7 text-slate-600">
              A real credit-bureau score should be retrieved through an
              authorized bureau/provider integration after the required
              customer consent and verification process.
            </p>

            <div className="mt-6 rounded-2xl bg-blue-50 p-5 text-sm text-blue-800">
              This development dashboard does not calculate or invent a
              credit score from PAN, Aadhaar or other uploaded documents.
            </div>
          </div>
        </div>
      </>
    );
  }

  function renderReport() {
    return (
      <>
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-600">
            Credit Report
          </p>

          <h2 className="mt-2 text-3xl font-extrabold text-slate-900">
            Your Credit Report
          </h2>
        </div>

        <div className="mt-7 rounded-3xl bg-white p-8 shadow-sm">
          <h3 className="text-xl font-bold text-slate-900">
            Report not connected yet
          </h3>

          <p className="mt-3 max-w-3xl leading-7 text-slate-600">
            The production version can display authorized bureau report data
            here after consent, identity verification and provider
            integration are completed.
          </p>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl bg-slate-50 p-5">
              <p className="text-xs text-slate-500">Credit Accounts</p>
              <p className="mt-2 text-2xl font-bold">--</p>
            </div>

            <div className="rounded-2xl bg-slate-50 p-5">
              <p className="text-xs text-slate-500">Active Accounts</p>
              <p className="mt-2 text-2xl font-bold">--</p>
            </div>

            <div className="rounded-2xl bg-slate-50 p-5">
              <p className="text-xs text-slate-500">Recent Enquiries</p>
              <p className="mt-2 text-2xl font-bold">--</p>
            </div>
          </div>
        </div>
      </>
    );
  }

  function renderEducation() {
    const topics = [
      [
        "Credit Score Basics",
        "Understand how credit scores are used and why payment history matters.",
      ],
      [
        "Improve Your Credit",
        "Learn practical habits such as timely payments and responsible borrowing.",
      ],
      [
        "Loan Terms",
        "Understand interest rates, tenure, processing fees and repayment obligations.",
      ],
      [
        "Avoid Common Mistakes",
        "Learn about missed payments, excessive borrowing and unnecessary applications.",
      ],
      [
        "EMI Basics",
        "Understand how loan amount, rate and tenure affect repayment.",
      ],
      [
        "Financial Planning",
        "Build a realistic borrowing and repayment plan for your goals.",
      ],
    ];

    return (
      <>
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-600">
            Education
          </p>

          <h2 className="mt-2 text-3xl font-extrabold text-slate-900">
            Learn & Improve
          </h2>

          <p className="mt-2 text-slate-500">
            Educational content for better financial decisions.
          </p>
        </div>

        <div className="mt-7 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {topics.map(([title, description]) => (
            <div
              key={title}
              className="rounded-3xl bg-white p-6 shadow-sm"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-50 font-bold text-blue-600">
                ?
              </div>

              <h3 className="mt-5 text-lg font-bold text-slate-900">
                {title}
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                {description}
              </p>
            </div>
          ))}
        </div>
      </>
    );
  }

  function renderAbout() {
    return (
      <>
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-600">
            About Us
          </p>

          <h2 className="mt-2 text-3xl font-extrabold text-slate-900">
            Better Credit. Brighter Future.
          </h2>
        </div>

        <div className="mt-7 rounded-3xl bg-white p-8 shadow-sm">
          <p className="max-w-4xl text-base leading-8 text-slate-600">
            CrediTrust is a development-stage digital lending platform
            interface focused on helping customers understand credit,
            explore loan products and track applications in one place.
          </p>

          <div className="mt-8 grid gap-5 md:grid-cols-3">
            <div className="rounded-2xl bg-slate-50 p-5">
              <h3 className="font-bold">Simple</h3>
              <p className="mt-2 text-sm text-slate-500">
                Clear customer journeys and easy-to-understand information.
              </p>
            </div>

            <div className="rounded-2xl bg-slate-50 p-5">
              <h3 className="font-bold">Transparent</h3>
              <p className="mt-2 text-sm text-slate-500">
                Clear loan details and application status visibility.
              </p>
            </div>

            <div className="rounded-2xl bg-slate-50 p-5">
              <h3 className="font-bold">Responsible</h3>
              <p className="mt-2 text-sm text-slate-500">
                Actual lending decisions would depend on verified lender
                policies and customer information.
              </p>
            </div>
          </div>
        </div>
      </>
    );
  }

  function renderContact() {
    return (
      <>
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-600">
            Contact
          </p>

          <h2 className="mt-2 text-3xl font-extrabold text-slate-900">
            Contact CrediTrust
          </h2>
        </div>

        <div className="mt-7 grid gap-6 md:grid-cols-3">
          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">
              Email
            </p>
            <p className="mt-2 font-bold text-slate-900">
              ykhanna333@gmail.com 
            </p>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">
              Support
            </p>
            <p className="mt-2 font-bold text-slate-900">
              Customer support portal
            </p>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">
              Hours
            </p>
            <p className="mt-2 font-bold text-slate-900">
              Mon - sat 
            </p>
          </div>
        </div>
      </>
    );
  }

  function renderActiveSection() {
    switch (activeSection) {
      case "score":
        return renderScore();

      case "loans":
        return renderLoans();

      case "apply":
        return renderApply();

      case "applications":
        return renderApplications();

      case "report":
        return renderReport();

      case "education":
        return renderEducation();
        case "kyc":

  return <KycSection token={token} />;

      case "about":
        return renderAbout();

      case "contact":
        return renderContact();

      default:
        return renderHome();
    }
  }

 const navItems = [
  ["home", "Home"],
  ["score", "Credit Score"],
  ["loans", "Loans"],
  ["report", "Credit Report"],
  ["education", "Education"],
  ["kyc", "KYC & Profile"],
  ["about", "About Us"],
  ["contact", "Contact"],
];

  return (
    <main className="min-h-screen bg-white text-slate-900">

      {/* Top Navigation */}
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-[1500px] items-center gap-6 px-5 py-4">

          <button
            onClick={() => changeSection("home")}
            className="mr-auto flex items-center gap-3 text-left"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-xl font-black text-white">
              C
            </div>

            <div>
              <div className="text-xl font-extrabold leading-none text-blue-700">
                CrediTrust
              </div>

              <div className="mt-1 text-[10px] font-medium text-slate-400">
                Better Credit. Brighter Future.
              </div>
            </div>
          </button>

          <nav className="hidden items-center gap-5 xl:flex">
            {navItems.map(([key, label]) => (
              <button
                key={key}
                onClick={() => changeSection(key)}
                className={`relative whitespace-nowrap px-1 py-2 text-sm font-semibold transition ${
                  activeSection === key
                    ? "text-blue-700"
                    : "text-slate-600 hover:text-blue-700"
                }`}
              >
                {label}

                {activeSection === key && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-blue-600" />
                )}
              </button>
            ))}
          </nav>

          <div className="hidden items-center gap-2 md:flex">
            <button
              onClick={() => changeSection("profile")}
              className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700"
            >
              {user?.fullName?.split(" ")[0] || "Account"}
            </button>

            <button
              onClick={logout}
              className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
            >
              Logout
            </button>
          </div>

          <button
            onClick={() => changeSection("loans")}
            className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white xl:hidden"
          >
            Loans
          </button>
        </div>

        <div className="overflow-x-auto border-t border-slate-100 px-5 py-2 xl:hidden">
          <div className="mx-auto flex max-w-[1500px] gap-5">
            {navItems.map(([key, label]) => (
              <button
                key={key}
                onClick={() => changeSection(key)}
                className={`whitespace-nowrap text-xs font-semibold ${
                  activeSection === key
                    ? "text-blue-700"
                    : "text-slate-500"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-[1500px] px-5 py-6 md:px-8">

        {error && (
          <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {message && (
          <div className="mb-5 rounded-2xl border border-green-200 bg-green-50 px-5 py-4 text-sm text-green-700">
            {message}
          </div>
        )}

        {renderActiveSection()}

        {/* Footer */}
        <footer className="mt-12 rounded-3xl bg-slate-950 px-6 py-8 text-white md:px-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">

            <button
              onClick={() => changeSection("home")}
              className="text-left"
            >
              <div className="text-xl font-extrabold">
                CrediTrust
              </div>

              <div className="mt-1 text-xs text-slate-400">
                Better Credit. Brighter Future.
              </div>
            </button>

            <div className="flex flex-wrap gap-5 text-sm text-slate-300">
              <button onClick={() => changeSection("about")}>
                About Us
              </button>

              <button onClick={() => changeSection("education")}>
                Education
              </button>

              <button onClick={() => changeSection("contact")}>
                Contact
              </button>
            </div>
          </div>

          <div className="mt-7 border-t border-slate-800 pt-5 text-xs text-slate-500">
            Development/demo environment. Loan terms and product data shown
            here are not a live lender offer.
          </div>
        </footer>
      </div>
    </main>
  );
}

export default Dashboard;
