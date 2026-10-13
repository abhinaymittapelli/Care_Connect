import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../services/api";

const allServices = [
  {
    name: "Home Cleaning",
    icon: "🧹",
    description: "Professional cleaning services",
  },
  {
    name: "Plumber",
    icon: "🔧",
    description: "Fix leaks and plumbing issues",
  },
  {
    name: "Electrical",
    icon: "⚡",
    description: "Electrical repairs and installation",
  },
  {
    name: "AC repair",
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
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const [searchQuery, setSearchQuery] = useState("");
  const [upcomingBooking, setUpcomingBooking] = useState(null);
  const [requestCount, setRequestCount] = useState(0);
  const [loadingDashboard, setLoadingDashboard] = useState(true);

  useEffect(() => {
    fetchCustomerData();
  }, []);

  const fetchCustomerData = async () => {
    try {
      setLoadingDashboard(true);
      const [bookingsRes, requestsRes] = await Promise.allSettled([
        api.get("/bookings/my"),
        api.get("/service-requests"),
      ]);

      if (bookingsRes.status === "fulfilled") {
        const bookingsList = bookingsRes.value.data.bookings || [];
        const active = bookingsList.find(
          (b) => b.status !== "completed" && b.status !== "cancelled"
        );
        setUpcomingBooking(active || null);
      }

      if (requestsRes.status === "fulfilled") {
        const requestsList =
          requestsRes.value.data.serviceRequests ||
          requestsRes.value.data.requests ||
          requestsRes.value.data ||
          [];
        setRequestCount(Array.isArray(requestsList) ? requestsList.length : 0);
      }
    } catch (err) {
      console.error("Dashboard data load error:", err);
    } finally {
      setLoadingDashboard(false);
    }
  };

  const filteredServices = allServices.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectService = (serviceName) => {
    navigate("/service-request", { state: { categoryName: serviceName } });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="mx-auto max-w-7xl px-6 py-10 md:px-8">
        {/* Welcome */}
        <section>
          <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
            CUSTOMER DASHBOARD
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">
            Welcome back, {user?.name?.split(" ")[0]} 👋
          </h1>

          <p className="mt-2 text-gray-500">
            What home service do you need help with today?
          </p>
        </section>

        {/* Search */}
        <section className="mt-8">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (searchQuery.trim()) {
                handleSelectService(searchQuery.trim());
              }
            }}
            className="flex w-full max-w-2xl items-center rounded-xl border border-gray-300 bg-white p-1.5 shadow-sm"
          >
            <span className="px-3 text-gray-400">🔍</span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for cleaning, plumber, AC repair..."
              className="min-w-0 flex-1 bg-transparent px-2 py-3 text-sm outline-none"
            />
            <button
              type="submit"
              className="rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              Search
            </button>
          </form>
        </section>

        {/* Services */}
        <section className="mt-12">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Book a service
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Click any service to create a quick request
              </p>
            </div>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="text-xs font-semibold text-blue-600 hover:underline"
              >
                Clear filter
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {filteredServices.map((service) => (
              <button
                key={service.name}
                onClick={() => handleSelectService(service.name)}
                className="group rounded-xl border border-gray-200 bg-white p-5 text-left transition duration-200 hover:-translate-y-1 hover:border-blue-300 hover:shadow-md"
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
          <div className="flex flex-col justify-between rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <div>
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-gray-900">
                  Upcoming Booking
                </h2>
                <span className="text-xl">📅</span>
              </div>

              {loadingDashboard ? (
                <p className="mt-6 text-sm text-gray-400">Loading booking status...</p>
              ) : upcomingBooking ? (
                <div className="mt-4 space-y-1.5">
                  <p className="font-bold text-gray-900">
                    {upcomingBooking.serviceRequest?.title || "Scheduled Service"}
                  </p>
                  <p className="text-xs text-gray-500">
                    Pro: {upcomingBooking.provider?.businessName || "Assigned Provider"}
                  </p>
                  <p className="text-xs text-gray-500">
                    Date: {upcomingBooking.scheduledDate ? new Date(upcomingBooking.scheduledDate).toLocaleDateString() : ""} ({upcomingBooking.startTime} - {upcomingBooking.endTime})
                  </p>
                  <span className="mt-2 inline-block rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-semibold uppercase text-blue-700">
                    {upcomingBooking.status}
                  </span>
                </div>
              ) : (
                <p className="mt-6 text-sm text-gray-500">
                  You don't have any upcoming bookings right now.
                </p>
              )}
            </div>

            <button
              onClick={() => navigate("/service-request")}
              className="mt-5 text-left text-sm font-semibold text-blue-600 hover:underline"
            >
              Book a service →
            </button>
          </div>

          {/* Requests */}
          <div className="flex flex-col justify-between rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <div>
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-gray-900">
                  My Requests
                </h2>
                <span className="text-xl">📋</span>
              </div>

              <div className="mt-4">
                <p className="text-3xl font-bold text-gray-900">
                  {requestCount}
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  {requestCount === 1 ? "Active service request" : "Active service requests"}
                </p>
              </div>
            </div>

            <button
              onClick={() => navigate("/my-requests")}
              className="mt-5 text-left text-sm font-semibold text-blue-600 hover:underline"
            >
              View requests →
            </button>
          </div>

          {/* New Request CTA */}
          <div className="flex flex-col justify-between rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <div>
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-gray-900">
                  Post New Job
                </h2>
                <span className="text-xl">✨</span>
              </div>

              <p className="mt-4 text-sm text-gray-500">
                Receive free quotations from top verified local professionals within minutes.
              </p>
            </div>

            <button
              onClick={() => navigate("/service-request")}
              className="mt-5 text-left text-sm font-semibold text-blue-600 hover:underline"
            >
              Create request now →
            </button>
          </div>
        </section>

        {/* Help banner */}
        <section className="mt-12 overflow-hidden rounded-2xl bg-blue-600">
          <div className="flex flex-col justify-between gap-6 px-8 py-8 text-white md:flex-row md:items-center">
            <div>
              <p className="text-sm font-medium text-blue-100">
                NEED HOME ASSISTANCE?
              </p>
              <h2 className="mt-1 text-xl font-bold">
                Find trusted professionals for cleaning, repair, and installations.
              </h2>
              <p className="mt-1 text-sm text-blue-100">
                Post your requirement, receive custom quotes, and book with ease.
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