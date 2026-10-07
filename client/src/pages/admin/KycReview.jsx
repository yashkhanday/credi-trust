import { useEffect, useState } from "react";
import {
  getAdminKycRecords,
  updateKycStatus,
} from "../../services/adminKycService";

function KycReview({ token }) {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function loadRecords() {
    try {
      setLoading(true);
      setError("");

      const data = await getAdminKycRecords(token);
      setRecords(data.records || []);
    } catch (err) {
      setError(err.message || "Unable to load KYC records");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (token) {
      loadRecords();
    }
  }, [token]);

  async function handleStatusChange(userId, status) {
    try {
      setUpdatingId(userId);
      setError("");
      setMessage("");

      const data = await updateKycStatus(
        token,
        userId,
        status
      );

      setRecords((previous) =>
        previous.map((record) =>
          record.userId === userId
            ? {
                ...record,
                kyc: data.kyc,
              }
            : record
        )
      );

      setMessage(
        `KYC status updated to ${status}.`
      );
    } catch (err) {
      setError(err.message || "Unable to update KYC");
    } finally {
      setUpdatingId("");
    }
  }

  return (
    <div>
      <div className="mb-8">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-600">
          Verification
        </p>

        <h1 className="mt-2 text-3xl font-extrabold text-slate-900">
          KYC Review
        </h1>

        <p className="mt-2 text-slate-500">
          Review customer profile verification status.
        </p>
      </div>

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

      {loading ? (
        <div className="rounded-3xl bg-white p-10 text-center shadow-sm">
          Loading KYC records...
        </div>
      ) : records.length === 0 ? (
        <div className="rounded-3xl bg-white p-10 text-center shadow-sm">
          No KYC records found.
        </div>
      ) : (
        <div className="space-y-5">
          {records.map((record) => {
            const kyc = record.kyc;

            return (
              <div
                key={record.userId}
                className="rounded-3xl bg-white p-6 shadow-sm"
              >
                <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">

                  <div>
                    <h2 className="text-xl font-bold text-slate-900">
                      {record.fullName}
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                      {record.email}
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                      {record.phone}
                    </p>

                    <p className="mt-3 break-all text-xs text-slate-400">
                      User ID: {record.userId}
                    </p>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    <StatusCard
                      label="Identity"
                      value={kyc.identityStatus}
                    />

                    <StatusCard
                      label="Address"
                      value={kyc.addressStatus}
                    />

                    <StatusCard
                      label="Consent"
                      value={kyc.consentStatus}
                    />

                    <StatusCard
                      label="Overall"
                      value={kyc.overallStatus}
                    />
                  </div>
                </div>

                <div className="mt-6 grid gap-4 border-t border-slate-100 pt-6 md:grid-cols-3">
                  <Info
                    label="Employment"
                    value={kyc.employmentType}
                  />

                  <Info
                    label="Monthly Income"
                    value={
                      kyc.monthlyIncome
                        ? `₹${Number(
                            kyc.monthlyIncome
                          ).toLocaleString("en-IN")}`
                        : "--"
                    }
                  />

                  <Info
                    label="Location"
                    value={`${kyc.city || "--"}, ${
                      kyc.state || "--"
                    }`}
                  />
                </div>

                <div className="mt-6 flex flex-col gap-3 border-t border-slate-100 pt-6 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-sm text-slate-500">
                    KYC review action
                  </p>

                  <select
                    value={kyc.overallStatus || "pending"}
                    disabled={updatingId === record.userId}
                    onChange={(event) =>
                      handleStatusChange(
                        record.userId,
                        event.target.value
                      )
                    }
                    className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700"
                  >
                    <option value="pending">
                      Pending
                    </option>

                    <option value="verified">
                      Verified
                    </option>

                    <option value="rejected">
                      Rejected
                    </option>
                  </select>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function StatusCard({ label, value }) {
  return (
    <div className="rounded-2xl bg-slate-50 p-4">
      <p className="text-xs text-slate-500">
        {label}
      </p>

      <p className="mt-1 text-sm font-bold capitalize text-slate-900">
        {(value || "pending").replace("-", " ")}
      </p>
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div className="rounded-2xl bg-slate-50 p-4">
      <p className="text-xs text-slate-500">
        {label}
      </p>

      <p className="mt-1 font-semibold capitalize text-slate-900">
        {value}
      </p>
    </div>
  );
}

export default KycReview;
