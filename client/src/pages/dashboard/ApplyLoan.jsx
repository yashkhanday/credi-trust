import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function ApplyLoan() {
  const { loanId } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();

  const [loan, setLoan] = useState(null);

  const [formData, setFormData] = useState({
    amount: "",
    tenureMonths: "",
    monthlyIncome: "",
    employmentType: "salaried",
  });

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadLoan() {
      try {
        const response = await fetch(
          `http://localhost:5000/api/loans/${loanId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Loan not found");
        }

        setLoan(data.loan);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    if (token) {
      loadLoan();
    }
  }, [loanId, token]);

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      setSubmitting(true);
      setError("");

      const response = await fetch(
        "http://localhost:5000/api/applications",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            loanId: loan.id,
            loanName: loan.name,
            ...formData,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Application failed");
      }

      navigate("/dashboard/applications");
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50">
        <p>Loading loan...</p>
      </main>
    );
  }

  if (error && !loan) {
    return (
      <main className="min-h-screen bg-slate-50 p-6">
        <p className="text-red-600">{error}</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10">
      <div className="mx-auto max-w-2xl">

        <Link
          to="/dashboard/loan-offers"
          className="text-sm font-semibold text-blue-600"
        >
          ← Back to Loan Offers
        </Link>

        <div className="mt-6 rounded-3xl bg-white p-8 shadow-sm">
          <p className="text-sm font-semibold text-blue-600">
            CrediTrust
          </p>

          <h1 className="mt-2 text-3xl font-bold text-slate-900">
            Apply for {loan.name}
          </h1>

          <p className="mt-2 text-slate-500">
            Submit your basic financial information for this development
            application flow.
          </p>

          {error && (
            <div className="mt-5 rounded-xl bg-red-50 p-4 text-sm text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">

            <div>
              <label className="mb-2 block text-sm font-medium">
                Loan Amount
              </label>

              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                min={loan.minAmount}
                max={loan.maxAmount}
                required
                placeholder={`₹${loan.minAmount} - ₹${loan.maxAmount}`}
                className="w-full rounded-xl border border-slate-200 px-4 py-3"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Tenure (Months)
              </label>

              <input
                type="number"
                name="tenureMonths"
                value={formData.tenureMonths}
                onChange={handleChange}
                min="1"
                max={loan.maxTenureMonths}
                required
                placeholder={`Up to ${loan.maxTenureMonths} months`}
                className="w-full rounded-xl border border-slate-200 px-4 py-3"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Monthly Income
              </label>

              <input
                type="number"
                name="monthlyIncome"
                value={formData.monthlyIncome}
                onChange={handleChange}
                min="1"
                required
                placeholder="Enter monthly income"
                className="w-full rounded-xl border border-slate-200 px-4 py-3"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Employment Type
              </label>

              <select
                name="employmentType"
                value={formData.employmentType}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-200 px-4 py-3"
              >
                <option value="salaried">Salaried</option>
                <option value="self-employed">Self Employed</option>
                <option value="business">Business</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white disabled:opacity-60"
            >
              {submitting ? "Submitting..." : "Submit Application"}
            </button>

          </form>
        </div>

      </div>
    </main>
  );
}

export default ApplyLoan;
