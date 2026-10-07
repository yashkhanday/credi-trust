import { Link } from "react-router-dom";

function ResetPassword() {
  return (
    <main className="min-h-screen bg-slate-50 px-6 pt-28">
      <div className="mx-auto w-full max-w-md">

        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-xl">

          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-blue-600">
            CrediTrust
          </p>

          <h1 className="mt-3 text-3xl font-bold text-slate-900">
            Reset Password
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Create a new password for your account.
          </p>

          <form className="mt-8 space-y-5">

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                New Password
              </label>

              <input
                type="password"
                placeholder="Enter new password"
                className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Confirm Password
              </label>

              <input
                type="password"
                placeholder="Confirm new password"
                className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-xl bg-blue-600 py-3.5 font-semibold text-white hover:bg-blue-700"
            >
              Reset Password
            </button>

          </form>

          <p className="mt-7 text-center text-sm text-slate-500">
            <Link
              to="/login"
              className="font-semibold text-blue-600 hover:text-blue-700"
            >
              Back to Login
            </Link>
          </p>

        </div>
      </div>
    </main>
  );
}

export default ResetPassword;