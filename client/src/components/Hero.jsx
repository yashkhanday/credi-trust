function Hero() {
  return (
    <section className="relative overflow-hidden bg-slate-50 pt-32">

      {/* Background decoration */}
      <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-blue-200/40 blur-3xl" />

      <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-cyan-200/40 blur-3xl" />

      <div className="relative mx-auto grid min-h-[650px] max-w-7xl items-center gap-12 px-6 py-16 lg:grid-cols-2 lg:px-8">

        {/* Left */}
        <div>
          <div className="mb-6 inline-flex rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700">
            Trusted Credit & Loan Platform
          </div>

          <h1 className="max-w-2xl text-5xl font-bold leading-tight tracking-tight text-slate-900 sm:text-6xl">
            Better Credit.
            <span className="block text-blue-600">
              Brighter Future.
            </span>
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
            Understand your credit profile, explore suitable loan options,
            and manage your financial journey from one secure platform.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <button className="rounded-full bg-blue-600 px-7 py-3.5 font-semibold text-white shadow-xl shadow-blue-600/20 transition hover:bg-blue-700">
              Check Credit Score
            </button>

            <button className="rounded-full border border-slate-300 bg-white px-7 py-3.5 font-semibold text-slate-700 transition hover:border-blue-300 hover:text-blue-600">
              Explore Loans
            </button>
          </div>

          <div className="mt-8 flex flex-wrap gap-6 text-sm text-slate-500">
            <span>✓ Secure</span>
            <span>✓ Consent Based</span>
            <span>✓ Transparent</span>
          </div>
        </div>

        {/* Credit Card */}
        <div className="relative flex justify-center lg:justify-end">

          <div className="relative w-full max-w-md">

            {/* Glow */}
            <div className="absolute inset-0 rounded-[2rem] bg-blue-500/20 blur-3xl" />

            {/* Card */}
            <div className="relative rounded-[2rem] border border-white/70 bg-white/75 p-7 shadow-2xl backdrop-blur-xl">

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    Your Credit Score
                  </p>

                  <p className="mt-1 text-xs text-slate-400">
                    Updated recently
                  </p>
                </div>

                <div className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-600">
                  Good
                </div>
              </div>

              <div className="mt-8 flex items-end gap-3">
                <span className="text-7xl font-bold tracking-tight text-slate-900">
                  742
                </span>

                <span className="mb-3 text-sm text-slate-400">
                  / 900
                </span>
              </div>

              <div className="mt-6 h-3 overflow-hidden rounded-full bg-slate-100">
                <div className="h-full w-[82%] rounded-full bg-blue-600" />
              </div>

              <div className="mt-7 grid grid-cols-3 gap-3">

                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs text-slate-400">
                    Accounts
                  </p>
                  <p className="mt-1 text-lg font-bold text-slate-800">
                    06
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs text-slate-400">
                    Enquiries
                  </p>
                  <p className="mt-1 text-lg font-bold text-slate-800">
                    02
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs text-slate-400">
                    Payments
                  </p>
                  <p className="mt-1 text-lg font-bold text-slate-800">
                    98%
                  </p>
                </div>

              </div>

              <div className="mt-6 rounded-2xl bg-blue-600 p-5 text-white">
                <p className="text-sm text-blue-100">
                  Improve your credit profile
                </p>

                <p className="mt-1 font-semibold">
                  Better Credit • Bigger Dreams
                </p>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

export default Hero;