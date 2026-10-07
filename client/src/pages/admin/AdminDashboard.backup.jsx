import CreateUser from "./CreateUser";
import KycReview from "./KycReview";
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import {
  getAllApplications,
  updateApplicationStatus,
} from "../../services/adminService";

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

function AdminDashboard() {
  const { user, token, logout } = useAuth();

  const [applications, setApplications] = useState([]);
  const [activeSection, setActiveSection] = useState("overview");
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function loadApplications() {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const data = await getAllApplications(token);
        setApplications(data.applications || []);
      } catch (err) {
        setError(err.message || "Unable to load applications");
      } finally {
        setLoading(false);
      }
    }

    loadApplications();
  }, [token]);

  const stats = useMemo(() => {
    return {
      total: applications.length,
      pending: applications.filter(
        (item) => item.status === "pending"
      ).length,
      review: applications.filter(
        (item) => item.status === "under-review"
      ).length,
      approved: applications.filter(
        (item) => item.status === "approved"
      ).length,
      rejected: applications.filter(
        (item) => item.status === "rejected"
      ).length,
    };
  }, [applications]);

  async function handleStatusChange(applicationId, status) {
    try {
      setUpdatingId(applicationId);
      setError("");
      setMessage("");

      const data = await updateApplicationStatus(
        token,
        applicationId,
        status
      );

      setApplications((previous) =>
        previous.map((application) =>
          application.id === applicationId
            ? data.application
            : application
        )
      );

      setMessage(
        `Application ${applicationId} updated to ${status.replace(
          "-",
          " "
        )}.`
      );
    } catch (err) {
      setError(err.message || "Unable to update application");
    } finally {
      setUpdatingId("");
    }
  }

  function changeSection(section) {
    setActiveSection(section);
    setError("");
    setMessage("");
  }

  return (
    <main className="min-h-screen bg-slate-100">
      <div className="mx-auto flex min-h-screen max-w-[1600px]">

        <aside className="hidden w-72 bg-slate-950 p-5 text-white md:block">
          <div className="sticky top-5">
            <p className="text-xl font-extrabold text-blue-400">
              CrediTrust
            </p>

            <p className="mt-1 text-xs text-slate-500">
              Admin Portal
            </p>

            <nav className="mt-8 space-y-2">
              [
 const menuItems = [
  ["overview", "Overview"],  
  ["applications", "Applications"],
  ["create-user", "Create User"],
  ["customers", "Customers"],
  ["loans", "Loans"],
  ["kyc", "KYC Review"],
  ["settings", "Settings"],
];.map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => changeSection(key)}
                  className={`w-full rounded-xl px-4 py-3 text-left text-sm font-semibold ${
                    activeSection === key
                      ? "bg-blue-600 text-white"
                      : "text-slate-300 hover:bg-slate-800"
                  }`}
                >
                  {label}
                </button>
              ))}
            </nav>

            <button
              onClick={logout}
              className="mt-8 w-full rounded-xl border border-slate-700 px-4 py-3 text-sm font-semibold text-slate-200 hover:bg-slate-800"
            >
              Logout
            </button>
          </div>
        </aside>

        <section className="min-w-0 flex-1 p-5 md:p-8">

          <header className="mb-6 flex items-center justify-between rounded-3xl bg-white p-5 shadow-sm">
            <div>
              <p className="text-sm text-slate-500">
                Admin Portal
              </p>

              <p className="font-bold text-slate-900">
                {user?.fullName}
              </p>
            </div>

            <button
              onClick={logout}
              className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white"
            >
              Logout
            </button>
          </header>

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

          {activeSection === "overview" && (
            <>
              <div className="mb-8">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-600">
                  Overview
                </p>

                <h1 className="mt-2 text-3xl font-extrabold text-slate-900">
                  Welcome, {user?.fullName}
                </h1>

                <p className="mt-2 text-slate-500">
                  Monitor customer applications and loan activity.
                </p>
              </div>

              <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-5">
                <StatCard label="Total" value={stats.total} />
                <StatCard label="Pending" value={stats.pending} />
                <StatCard label="Under Review" value={stats.review} />
                <StatCard label="Approved" value={stats.approved} />
                <StatCard label="Rejected" value={stats.rejected} />
              </div>

              <div className="mt-8 rounded-3xl bg-white p-6 shadow-sm">
                <h2 className="text-xl font-bold text-slate-900">
                  Recent Applications
                </h2>

                <div className="mt-5 space-y-3">
                  {applications.slice(0, 5).map((application) => (
                    <div
                      key={application.id}
                      className="flex flex-col gap-2 rounded-2xl bg-slate-50 p-4 md:flex-row md:items-center md:justify-between"
                    >
                      <div>
                        <p className="font-bold text-slate-900">
                          {application.loanName}
                        </p>

                        <p className="text-xs text-slate-500">
                          {application.id}
                        </p>
                      </div>

                      <span className="w-fit rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold capitalize text-blue-700">
                        {application.status.replace("-", " ")}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {activeSection === "applications" && (
            <>
              <div className="mb-8">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-600">
                  Application Management
                </p>

                <h1 className="mt-2 text-3xl font-extrabold text-slate-900">
                  All Applications
                </h1>
              </div>

              {loading ? (
                <div className="rounded-3xl bg-white p-10 text-center">
                  Loading applications...
                </div>
              ) : (
                <div className="overflow-hidden rounded-3xl bg-white shadow-sm">
                  <div className="overflow-x-auto">
                    <table className="min-w-full text-left">
                      <thead className="bg-slate-50">
                        <tr>
                          <th className="px-5 py-4 text-xs uppercase text-slate-500">
                            Application
                          </th>
                          <th className="px-5 py-4 text-xs uppercase text-slate-500">
                            Loan
                          </th>
                          <th className="px-5 py-4 text-xs uppercase text-slate-500">
                            Amount
                          </th>
                          <th className="px-5 py-4 text-xs uppercase text-slate-500">
                            Status
                          </th>
                          <th className="px-5 py-4 text-xs uppercase text-slate-500">
                            Update
                          </th>
                        </tr>
                      </thead>

                      <tbody className="divide-y divide-slate-100">
                        {applications.map((application) => (
                          <tr key={application.id}>
                            <td className="px-5 py-5">
                              <p className="font-bold text-slate-900">
                                {application.id}
                              </p>

                              <p className="text-xs text-slate-500">
                                {formatDate(application.createdAt)}
                              </p>
                            </td>

                            <td className="px-5 py-5 font-semibold">
                              {application.loanName}
                            </td>

                            <td className="px-5 py-5 font-semibold">
                              {formatAmount(application.amount)}
                            </td>

                            <td className="px-5 py-5">
                              <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold capitalize text-blue-700">
                                {application.status.replace("-", " ")}
                              </span>
                            </td>

                            <td className="px-5 py-5">
                              <select
                                value={application.status}
                                disabled={
                                  updatingId === application.id
                                }
                                onChange={(event) =>
                                  handleStatusChange(
                                    application.id,
                                    event.target.value
                                  )
                                }
                                className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
                              >
                                <option value="pending">
                                  Pending
                                </option>
                                <option value="under-review">
                                  Under Review
                                </option>
                                <option value="approved">
                                  Approved
                                </option>
                                <option value="rejected">
                                  Rejected
                                </option>
                              </select>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </>
          )}

          {activeSection === "customers" && (
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-600">
                Customers
              </p>

              <h1 className="mt-2 text-3xl font-extrabold text-slate-900">
                Customer Activity
              </h1>

              <div className="mt-7 rounded-3xl bg-white p-8 shadow-sm">
                <p className="text-5xl font-extrabold text-blue-600">
                  {new Set(
                    applications.map(
                      (application) => application.userId
                    )
                  ).size}
                </p>

                <p className="mt-2 text-slate-500">
                  Customers represented in applications
                </p>
              </div>
            </div>
          )}

          {activeSection === "loans" && (
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-600">
                Products
              </p>

              <h1 className="mt-2 text-3xl font-extrabold text-slate-900">
                Loan Products
              </h1>

              <div className="mt-7 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {[
                  "Personal Loan",
                  "Business Loan",
                  "Home Loan",
                  "Education Loan",
                  "Vehicle Loan",
                ].map((loan) => (
                  <div
                    key={loan}
                    className="rounded-3xl bg-white p-6 shadow-sm"
                  >
                    <h3 className="text-xl font-bold text-slate-900">
                      {loan}
                    </h3>

                    <p className="mt-2 text-sm text-slate-500">
                      Product available in customer portal.
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

        </section>
      </div>
    </main>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="rounded-3xl bg-white p-6 shadow-sm">
      <p className="text-sm text-slate-500">
        {label}
      </p>

      <p className="mt-3 text-4xl font-extrabold text-slate-900">
        {value}
      </p>
    </div>
  );
}

export default AdminDashboard;
