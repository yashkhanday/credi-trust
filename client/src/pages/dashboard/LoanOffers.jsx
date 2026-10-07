import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getLoanOffers } from "../../services/loanService";

function formatAmount(amount) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

function LoanOffers() {
  const { token, loading: authLoading } = useAuth();

  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadLoans() {
      if (authLoading) {
        return;
      }

      if (!token) {
        setLoading(false);
        setError("Please login to view loan offers.");
        return;
      }

      try {
        setLoading(true);
        setError("");

        const data = await getLoanOffers(token);
        setLoans(data.loans || []);
      } catch (err) {
        console.error("Loan offers error:", err);
        setError(err.message || "Unable to load loan offers");
      } finally {
        setLoading(false);
      }
    }

    loadLoans();
  }, [authLoading, token]);

  if (authLoading || loading) {
    return (
      <main className="min-h-screen bg-slate-50 px-6 py-10">
        <div className="mx-auto max-w-7xl">
          <p className="text-slate-600">Loading loan offers...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10">
      <div className="mx-auto max-w-7xl">

        <Link
          to="/dashboard"
          className="text-sm font-semibold text-blue-600 hover:text-blue-700"
        >
          ← Back to Dashboard
        </Link>

        <div className="mb-8 mt-6">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
            CrediTrust
          </p>

          <h1 className="mt-2 text-3xl font-bold text-slate-900">
            Loan Offers
          </h1>

          <p className="mt-2 text-slate-500">
            Explore available loan products and their basic terms.
          </p>
        </div>

        {error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-red-700">
            {error}
          </div>
        ) : loans.length === 0 ? (
          <div className="rounded-2xl bg-white p-8 text-center shadow-sm">
            <p className="text-slate-600">
              No loan offers available.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {loans.map((loan) => {
              return (
                <div
                  key={loan.id}
                  className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold text-blue-600">
                        {loan.category}
                      </p>

                      <h2 className="mt-2 text-2xl font-bold text-slate-900">
                        {loan.name}
                      </h2>
                    </div>

                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                      Available
                    </span>
                  </div>

                  <p className="mt-4 text-sm leading-6 text-slate-500">
                    {loan.description}
                  </p>

                  <div className="mt-6 space-y-4 border-t border-slate-100 pt-5">

                    <div className="flex items-start justify-between gap-4">
                      <span className="text-sm text-slate-500">
                        Loan Amount
                      </span>

                      <span className="text-right text-sm font-semibold text-slate-900">
                        {formatAmount(loan.minAmount)} -{" "}
                        {formatAmount(loan.maxAmount)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-500">
                        Interest Rate
                      </span>

                      <span className="text-sm font-semibold text-slate-900">
                        {loan.interestRate}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-500">
                        Maximum Tenure
                      </span>

                      <span className="text-sm font-semibold text-slate-900">
                        {loan.maxTenureMonths} months
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-500">
                        Processing Fee
                      </span>

                      <span className="text-sm font-semibold text-slate-900">
                        {loan.processingFee}
                      </span>
                    </div>

                  </div>

                  <Link
                    to={`/dashboard/apply/${loan.id}`}
                    className="mt-6 block w-full rounded-xl bg-blue-600 px-4 py-3 text-center font-semibold text-white transition hover:bg-blue-700"
                  >
                    Apply Now
                  </Link>
                </div>
              );
            })}
          </div>
        )}

        <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-5 text-sm text-slate-500">
          Loan rates, amounts and fees shown here are development/demo data.
          Actual approval, pricing and eligibility would depend on the
          applicable lender and verified customer information.
        </div>

      </div>
    </main>
  );
}

export default LoanOffers;
