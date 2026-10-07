import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getMyApplications } from "../../services/applicationService";

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

function getStatusClasses(status) {
  switch (status) {
    case "approved":
      return "bg-green-100 text-green-700";

    case "rejected":
      return "bg-red-100 text-red-700";

    case "under-review":
      return "bg-yellow-100 text-yellow-700";

    default:
      return "bg-blue-100 text-blue-700";
  }
}

function Applications() {
  const { token } = useAuth();

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadApplications() {
      if (!token) {
        setLoading(false);
        setError("Please login to view your applications.");
        return;
      }

      try {
        setLoading(true);
        setError("");

        const data = await getMyApplications(token);

        setApplications(data.applications || []);
      } catch (err) {
        console.error("Applications error:", err);
        setError(err.message || "Unable to load applications");
      } finally {
        setLoading(false);
      }
    }

    loadApplications();
  }, [token]);

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
            My Applications
          </h1>

          <p className="mt-2 text-slate-500">
            Track your submitted loan applications and their current status.
          </p>
        </div>

        {loading ? (
          <div className="rounded-2xl bg-white p-10 text-center shadow-sm">
            <p className="text-slate-600">
              Loading applications...
            </p>
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-red-700">
            {error}
          </div>
        ) : applications.length === 0 ? (
          <div className="rounded-3xl bg-white p-10 text-center shadow-sm">
            <h2 className="text-xl font-bold text-slate-900">
              No applications yet
            </h2>

            <p className="mt-2 text-slate-500">
              You have not submitted a loan application.
            </p>

            <Link
              to="/dashboard/loan-offers"
              className="mt-6 inline-block rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
            >
              Explore Loan Offers
            </Link>
          </div>
        ) : (
          <div className="space-y-5">

            <div className="rounded-2xl bg-white p-5 shadow-sm">
              <p className="text-sm text-slate-500">
                Total Applications
              </p>

              <p className="mt-1 text-3xl font-bold text-slate-900">
                {applications.length}
              </p>
            </div>

            {applications.map((application) => (
              <div
                key={application.id}
                className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <h2 className="text-xl font-bold text-slate-900">
                        {application.loanName}
                      </h2>

                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${getStatusClasses(
                          application.status
                        )}`}
                      >
                        {application.status.replace("-", " ")}
                      </span>
                    </div>

                    <p className="mt-2 text-sm text-slate-500">
                      Application ID:{" "}
                      <span className="font-semibold text-slate-700">
                        {application.id}
                      </span>
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                      Applied on: {formatDate(application.createdAt)}
                    </p>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-3 lg:min-w-[520px]">

                    <div className="rounded-2xl bg-slate-50 p-4">
                      <p className="text-xs text-slate-500">
                        Loan Amount
                      </p>

                      <p className="mt-1 font-bold text-slate-900">
                        {formatAmount(application.amount)}
                      </p>
                    </div>

                    <div className="rounded-2xl bg-slate-50 p-4">
                      <p className="text-xs text-slate-500">
                        Tenure
                      </p>

                      <p className="mt-1 font-bold text-slate-900">
                        {application.tenureMonths} months
                      </p>
                    </div>

                    <div className="rounded-2xl bg-slate-50 p-4">
                      <p className="text-xs text-slate-500">
                        Monthly Income
                      </p>

                      <p className="mt-1 font-bold text-slate-900">
                        {formatAmount(application.monthlyIncome)}
                      </p>
                    </div>

                  </div>

                </div>
              </div>
            ))}

          </div>
        )}

      </div>
    </main>
  );
}

export default Applications;
