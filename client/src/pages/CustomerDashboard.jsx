import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

const services = [
  {
    name: "Home Cleaning",
    icon: "🧹",
    description: "Professional cleaning services",
  },
  {
    name: "Plumbing",
    icon: "🔧",
    description: "Fix leaks and plumbing issues",
  },
  {
    name: "Electrical",
    icon: "⚡",
    description: "Electrical repairs and installation",
  },
  {
    name: "AC Repair",
    icon: "❄️",
    description: "AC service and repair",
  },
  {
    name: "Painting",
    icon: "🎨",
    description: "Professional painting services",
  },
  {
    name: "Appliance Repair",
    icon: "🔌",
    description: "Repair your home appliances",
  },
];

function CustomerDashboard() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="mx-auto max-w-7xl px-6 py-10 md:px-8">

        {/* Welcome */}
        <section>
          <p className="text-sm font-medium text-blue-600">
            CUSTOMER DASHBOARD
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">
            Welcome back, {user?.name?.split(" ")[0]} 👋
          </h1>

          <p className="mt-2 text-gray-500">
            What service do you need today?
          </p>
        </section>

        {/* Search */}
        <section className="mt-8">
          <div className="flex w-full max-w-2xl items-center rounded-xl border border-gray-300 bg-white p-1.5 shadow-sm">

            <span className="px-3 text-gray-400">
              🔍
            </span>

            <input
              type="text"
              placeholder="Search for a service"
              className="min-w-0 flex-1 bg-transparent px-2 py-3 text-sm outline-none"
            />

            <button className="rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700">
              Search
            </button>

          </div>
        </section>

        {/* Services */}
        <section className="mt-12">

          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Book a service
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Choose from our most popular home services
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">

            {services.map((service) => (
              <button
                key={service.name}
                onClick={() => navigate("/service-request")}
                className="group rounded-xl border border-gray-200 bg-white p-5 text-left transition duration-200 hover:-translate-y-1 hover:border-blue-200 hover:shadow-md"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gray-100 text-2xl transition group-hover:bg-blue-50">
                  {service.icon}
                </div>

                <h3 className="mt-4 text-sm font-semibold text-gray-900">
                  {service.name}
                </h3>

                <p className="mt-1 text-xs leading-5 text-gray-500">
                  {service.description}
                </p>
              </button>
            ))}

          </div>
        </section>

        {/* Dashboard cards */}
        <section className="mt-12 grid gap-5 md:grid-cols-3">

          {/* Upcoming */}
          <div className="rounded-xl border border-gray-200 bg-white p-6">

            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-gray-900">
                Upcoming booking
              </h2>

              <span className="text-xl">
                📅
              </span>
            </div>

            <p className="mt-6 text-sm text-gray-500">
              You don't have any upcoming bookings.
            </p>

            <button
              onClick={() => navigate("/service-request")}
              className="mt-5 text-sm font-semibold text-blue-600 hover:underline"
            >
              Book a service →
            </button>

          </div>

          {/* Requests */}
          <div className="rounded-xl border border-gray-200 bg-white p-6">

            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-gray-900">
                My requests
              </h2>

              <span className="text-xl">
                📋
              </span>
            </div>

            <p className="mt-6 text-sm text-gray-500">
              View and manage your service requests.
            </p>

            <button
  onClick={() => navigate("/my-requests")}
  className="mt-5 text-sm font-semibold text-blue-600 hover:underline"
>
  View requests →
</button>
          </div>

          {/* Notifications */}
          <div className="rounded-xl border border-gray-200 bg-white p-6">

            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-gray-900">
                Notifications
              </h2>

              <span className="text-xl">
                🔔
              </span>
            </div>

            <p className="mt-6 text-sm text-gray-500">
              Stay updated about your bookings and services.
            </p>

            <button
              className="mt-5 text-sm font-semibold text-blue-600 hover:underline"
            >
              View notifications →
            </button>

          </div>

        </section>

        {/* Help banner */}
        <section className="mt-12 overflow-hidden rounded-2xl bg-blue-600">

          <div className="flex flex-col justify-between gap-6 px-8 py-8 text-white md:flex-row md:items-center">

            <div>
              <p className="text-sm font-medium text-blue-100">
                NEED HELP?
              </p>

              <h2 className="mt-1 text-xl font-bold">
                Find a trusted professional for your home.
              </h2>

              <p className="mt-1 text-sm text-blue-100">
                Tell us what you need and we'll help you find the right provider.
              </p>
            </div>

            <button
              onClick={() => navigate("/service-request")}
              className="shrink-0 rounded-lg bg-white px-6 py-3 text-sm font-semibold text-blue-600 transition hover:bg-gray-100"
            >
              Request a Service
            </button>

          </div>

        </section>

      </main>
    </div>
  );
}

export default CustomerDashboard;