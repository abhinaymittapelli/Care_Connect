import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import api from "../services/api";

function ProviderDashboard() {
  const user = JSON.parse(localStorage.getItem("user"));

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedRequest, setSelectedRequest] =
    useState(null);

  const [quotation, setQuotation] = useState({
    amount: "",
    message: "",
    estimatedDuration: "",
  });

  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (user?.role === "provider") {
      fetchRequests();
    }
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(
        "/service-requests/provider/available"
      );

      setRequests(
        response.data.requests || []
      );
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message ||
          "Unable to load service requests."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleQuotationChange = (e) => {
    setQuotation({
      ...quotation,
      [e.target.name]: e.target.value,
    });
  };

  const handleSendQuotation = async (e) => {
    e.preventDefault();

    if (!quotation.amount) {
      setError("Please enter quotation amount.");
      return;
    }

    try {
      setSending(true);
      setError("");

      await api.post("/quotations", {
        serviceRequest: selectedRequest._id,
        amount: Number(quotation.amount),
        message: quotation.message,
        estimatedDuration:
          Number(quotation.estimatedDuration) || 1,
      });

      alert("Quotation sent successfully!");

      setSelectedRequest(null);

      setQuotation({
        amount: "",
        message: "",
        estimatedDuration: "",
      });

      fetchRequests();
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message ||
          "Unable to send quotation."
      );
    } finally {
      setSending(false);
    }
  };

  if (!user || user.role !== "provider") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <h1 className="text-xl font-semibold">
          Provider access required
        </h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-8">
          <p className="text-sm font-medium text-blue-600">
            Provider Dashboard
          </p>

          <h1 className="mt-1 text-3xl font-bold text-gray-900">
            Service Requests
          </h1>

          <p className="mt-2 text-gray-500">
            Find nearby customers and send your quotations.
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Loading */}
        {loading ? (
          <div className="rounded-2xl bg-white p-10 text-center shadow-sm">
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />

            <p className="mt-4 text-gray-500">
              Finding service requests...
            </p>
          </div>
        ) : requests.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-12 text-center">

            <div className="text-5xl">
              📭
            </div>

            <h2 className="mt-4 text-xl font-bold text-gray-900">
              No service requests
            </h2>

            <p className="mt-2 text-gray-500">
              New matching customer requests will appear here.
            </p>

          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">

            {requests.map((request) => (
              <div
                key={request._id}
                className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >

                <div className="flex items-start justify-between gap-3">

                  <div>
                    <h2 className="font-bold text-gray-900">
                      {request.title}
                    </h2>

                    <p className="mt-1 text-sm text-blue-600">
                      {request.category?.name}
                    </p>
                  </div>

                  <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold capitalize text-yellow-700">
                    {request.status}
                  </span>

                </div>

                <p className="mt-4 line-clamp-3 text-sm leading-6 text-gray-600">
                  {request.description}
                </p>

                <div className="mt-4 space-y-2 text-sm text-gray-500">

                  <p>
                    📍 {request.city}
                  </p>

                  <p>
                    📅{" "}
                    {request.preferredDate
                      ? new Date(
                          request.preferredDate
                        ).toLocaleDateString("en-IN")
                      : "Flexible"}
                  </p>

                  <p>
                    🕐{" "}
                    {request.preferredTime ||
                      "Flexible"}
                  </p>

                  {request.estimatedBudget && (
                    <p className="font-semibold text-gray-800">
                      Budget: ₹
                      {request.estimatedBudget}
                    </p>
                  )}

                </div>

                <button
                  onClick={() =>
                    setSelectedRequest(request)
                  }
                  className="mt-5 w-full rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white hover:bg-blue-700"
                >
                  Send Quotation
                </button>

              </div>
            ))}

          </div>
        )}

        {/* Quotation Modal */}
        {selectedRequest && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">

            <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">

              <div className="flex items-center justify-between">

                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    Send Quotation
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    {selectedRequest.title}
                  </p>
                </div>

                <button
                  onClick={() =>
                    setSelectedRequest(null)
                  }
                  className="text-2xl text-gray-400 hover:text-gray-700"
                >
                  ×
                </button>

              </div>

              <form
                onSubmit={handleSendQuotation}
                className="mt-6 space-y-5"
              >

                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-900">
                    Quotation amount
                  </label>

                  <input
                    type="number"
                    name="amount"
                    value={quotation.amount}
                    onChange={handleQuotationChange}
                    placeholder="Enter amount"
                    min="1"
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-900">
                    Estimated duration
                  </label>

                  <input
                    type="number"
                    name="estimatedDuration"
                    value={
                      quotation.estimatedDuration
                    }
                    onChange={handleQuotationChange}
                    placeholder="Hours"
                    min="1"
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-900">
                    Message
                  </label>

                  <textarea
                    name="message"
                    value={quotation.message}
                    onChange={handleQuotationChange}
                    rows="4"
                    placeholder="Explain your service and quotation..."
                    className="w-full resize-none rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={sending}
                  className="w-full rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
                >
                  {sending
                    ? "Sending..."
                    : "Send Quotation"}
                </button>

              </form>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}

export default ProviderDashboard;