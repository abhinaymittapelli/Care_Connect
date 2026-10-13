import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../services/api";

function ProviderDashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const [activeTab, setActiveTab] = useState("requests"); // "requests" | "bookings" | "quotations"

  // Requests state
  const [requests, setRequests] = useState([]);
  const [loadingRequests, setLoadingRequests] = useState(true);
  const [requestsError, setRequestsError] = useState("");

  // Bookings state
  const [bookings, setBookings] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(false);
  const [updatingBookingId, setUpdatingBookingId] = useState(null);

  // Quotations state
  const [myQuotations, setMyQuotations] = useState([]);
  const [loadingQuotations, setLoadingQuotations] = useState(false);

  // Quotation modal state
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [quotation, setQuotation] = useState({
    amount: "",
    message: "",
    estimatedDuration: "",
  });
  const [sending, setSending] = useState(false);
  const [modalError, setModalError] = useState("");

  useEffect(() => {
    if (user?.role === "provider") {
      fetchRequests();
      fetchBookings();
      fetchQuotations();
    }
  }, []);

  const fetchRequests = async () => {
    try {
      setLoadingRequests(true);
      setRequestsError("");

      const response = await api.get("/service-requests/provider/available");
      setRequests(response.data.requests || []);
    } catch (err) {
      console.error(err);
      setRequestsError(
        err.response?.data?.message || "Unable to load service requests."
      );
    } finally {
      setLoadingRequests(false);
    }
  };

  const fetchBookings = async () => {
    try {
      setLoadingBookings(true);
      const response = await api.get("/bookings/provider");
      setBookings(response.data.bookings || []);
    } catch (err) {
      console.error("Error fetching provider bookings:", err);
    } finally {
      setLoadingBookings(false);
    }
  };

  const fetchQuotations = async () => {
    try {
      setLoadingQuotations(true);
      const response = await api.get("/quotations/my");
      setMyQuotations(response.data.quotations || []);
    } catch (err) {
      console.error("Error fetching provider quotations:", err);
    } finally {
      setLoadingQuotations(false);
    }
  };

  const handleUpdateBookingStatus = async (bookingId, newStatus) => {
    try {
      setUpdatingBookingId(bookingId);
      await api.put(`/bookings/${bookingId}/status`, { status: newStatus });
      await fetchBookings();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update booking status.");
    } finally {
      setUpdatingBookingId(null);
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
    setModalError("");

    if (!quotation.amount) {
      setModalError("Please enter quotation amount.");
      return;
    }

    try {
      setSending(true);

      await api.post("/quotations", {
        serviceRequest: selectedRequest._id,
        amount: Number(quotation.amount),
        message: quotation.message,
        estimatedDuration: Number(quotation.estimatedDuration) || 1,
      });

      alert("Quotation sent successfully!");
      setSelectedRequest(null);
      setQuotation({
        amount: "",
        message: "",
        estimatedDuration: "",
      });

      fetchRequests();
      fetchQuotations();
    } catch (err) {
      console.error(err);
      setModalError(
        err.response?.data?.message || "Unable to send quotation."
      );
    } finally {
      setSending(false);
    }
  };

  if (!user || user.role !== "provider") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="rounded-xl bg-white p-8 text-center shadow-sm">
          <h1 className="text-xl font-bold text-gray-900">Provider Access Required</h1>
          <p className="mt-2 text-sm text-gray-500">
            Please log in with a service provider account to access this dashboard.
          </p>
          <button
            onClick={() => navigate("/login")}
            className="mt-5 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  const isProfileMissing = requestsError.toLowerCase().includes("not found");
  const isPendingVerification = requestsError.toLowerCase().includes("not verified");

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm font-semibold tracking-wide text-blue-600 uppercase">
              Provider Dashboard
            </p>
            <h1 className="mt-1 text-3xl font-bold text-gray-900">
              Welcome, {user.name}
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage incoming customer requests, sent quotations, and scheduled bookings.
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => navigate("/provider-profile")}
              className="inline-flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50 hover:text-blue-600"
            >
              ⚙️ Manage Profile
            </button>
          </div>
        </div>

        {/* Profile Onboarding / Verification Notices */}
        {isProfileMissing && (
          <div className="mb-8 rounded-2xl border border-blue-200 bg-blue-50/70 p-6 text-blue-900">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="font-bold text-lg text-blue-950">
                  Complete your provider profile
                </h3>
                <p className="mt-1 text-sm text-blue-800">
                  Set up your business name, hourly rate, and service categories to start receiving customer requests.
                </p>
              </div>
              <button
                onClick={() => navigate("/provider-profile")}
                className="shrink-0 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-700"
              >
                Set Up Profile Now →
              </button>
            </div>
          </div>
        )}

        {isPendingVerification && (
          <div className="mb-8 rounded-2xl border border-amber-200 bg-amber-50 p-6 text-amber-900">
            <div className="flex items-start gap-3">
              <span className="text-2xl">⏳</span>
              <div>
                <h3 className="font-bold text-amber-950">
                  Profile Awaiting Verification
                </h3>
                <p className="mt-1 text-sm text-amber-800">
                  Your profile has been created and is pending review by the administrator. Once verified, requests matching your skills and city will appear below.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="mb-6 flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab("requests")}
            className={`border-b-2 px-6 py-3 text-sm font-semibold transition ${
              activeTab === "requests"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-900"
            }`}
          >
            Available Requests ({requests.length})
          </button>
          <button
            onClick={() => setActiveTab("bookings")}
            className={`border-b-2 px-6 py-3 text-sm font-semibold transition ${
              activeTab === "bookings"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-900"
            }`}
          >
            My Bookings ({bookings.length})
          </button>
          <button
            onClick={() => setActiveTab("quotations")}
            className={`border-b-2 px-6 py-3 text-sm font-semibold transition ${
              activeTab === "quotations"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-900"
            }`}
          >
            Sent Quotations ({myQuotations.length})
          </button>
        </div>

        {/* TAB 1: AVAILABLE REQUESTS */}
        {activeTab === "requests" && (
          <div>
            {loadingRequests ? (
              <div className="rounded-2xl bg-white p-12 text-center shadow-sm">
                <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />
                <p className="mt-4 text-sm text-gray-500">Finding matching service requests...</p>
              </div>
            ) : requests.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-12 text-center">
                <div className="text-5xl">📭</div>
                <h2 className="mt-4 text-xl font-bold text-gray-900">No service requests available</h2>
                <p className="mt-2 text-sm text-gray-500 max-w-md mx-auto">
                  New requests matching your verified skills and service location will automatically appear here.
                </p>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {requests.map((request) => (
                  <div
                    key={request._id}
                    className="flex flex-col justify-between rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition hover:shadow-md"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <span className="inline-block rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-700">
                            {request.category?.name || "Service"}
                          </span>
                          <h2 className="mt-2 text-lg font-bold text-gray-900">
                            {request.title}
                          </h2>
                        </div>
                        <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold capitalize text-amber-800">
                          {request.status}
                        </span>
                      </div>

                      <p className="mt-3 line-clamp-3 text-sm leading-6 text-gray-600">
                        {request.description}
                      </p>

                      <div className="mt-4 space-y-1.5 border-t border-gray-100 pt-4 text-xs text-gray-500">
                        <p>📍 {request.address}, {request.city}</p>
                        <p>📅 Date: {request.preferredDate ? new Date(request.preferredDate).toLocaleDateString() : "Flexible"}</p>
                        <p>⏰ Time: {request.preferredTime || "Flexible"}</p>
                        {request.estimatedBudget > 0 && (
                          <p className="font-semibold text-gray-900">
                            💰 Budget: ₹{request.estimatedBudget}
                          </p>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setSelectedRequest(request);
                        setModalError("");
                      }}
                      className="mt-6 w-full rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
                    >
                      Send Quotation
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: MY BOOKINGS */}
        {activeTab === "bookings" && (
          <div>
            {loadingBookings ? (
              <div className="rounded-2xl bg-white p-12 text-center shadow-sm">
                <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />
                <p className="mt-4 text-sm text-gray-500">Loading your scheduled bookings...</p>
              </div>
            ) : bookings.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-12 text-center">
                <div className="text-5xl">📅</div>
                <h2 className="mt-4 text-xl font-bold text-gray-900">No bookings yet</h2>
                <p className="mt-2 text-sm text-gray-500">
                  When customers accept your quotations and schedule service dates, your bookings will appear here.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {bookings.map((b) => (
                  <div
                    key={b._id}
                    className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm"
                  >
                    <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                      <div>
                        <div className="flex items-center gap-3">
                          <h3 className="text-lg font-bold text-gray-900">
                            {b.serviceRequest?.title || "Home Service Booking"}
                          </h3>
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold uppercase ${
                              b.status === "completed"
                                ? "bg-green-100 text-green-800"
                                : b.status === "in_progress"
                                ? "bg-orange-100 text-orange-800"
                                : b.status === "confirmed"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {b.status}
                          </span>
                        </div>
                        <p className="mt-1 text-sm text-gray-600">
                          Customer: <span className="font-semibold text-gray-900">{b.customer?.name}</span> ({b.customer?.phone || "No phone"})
                        </p>
                        <p className="mt-1 text-xs text-gray-500">
                          📍 {b.address || b.serviceRequest?.address}, {b.city || b.serviceRequest?.city}
                        </p>
                        <p className="mt-1 text-xs text-gray-500">
                          📅 Scheduled: {b.scheduledDate ? new Date(b.scheduledDate).toLocaleDateString() : ""} from {b.startTime} to {b.endTime}
                        </p>
                        {b.notes && (
                          <p className="mt-2 text-xs italic text-gray-500">
                            Customer note: "{b.notes}"
                          </p>
                        )}
                      </div>

                      <div className="flex flex-col items-end gap-3">
                        <p className="text-2xl font-bold text-gray-900">
                          ₹{b.amount}
                        </p>

                        <div className="flex flex-wrap gap-2">
                          {b.status === "scheduled" && (
                            <button
                              disabled={updatingBookingId === b._id}
                              onClick={() => handleUpdateBookingStatus(b._id, "confirmed")}
                              className="rounded-lg bg-blue-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
                            >
                              Confirm
                            </button>
                          )}
                          {["scheduled", "confirmed"].includes(b.status) && (
                            <button
                              disabled={updatingBookingId === b._id}
                              onClick={() => handleUpdateBookingStatus(b._id, "in_progress")}
                              className="rounded-lg bg-orange-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-orange-700 disabled:opacity-50"
                            >
                              Start Job
                            </button>
                          )}
                          {b.status === "in_progress" && (
                            <button
                              disabled={updatingBookingId === b._id}
                              onClick={() => handleUpdateBookingStatus(b._id, "completed")}
                              className="rounded-lg bg-green-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-green-700 disabled:opacity-50"
                            >
                              Complete Job
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: MY QUOTATIONS */}
        {activeTab === "quotations" && (
          <div>
            {loadingQuotations ? (
              <div className="rounded-2xl bg-white p-12 text-center shadow-sm">
                <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />
                <p className="mt-4 text-sm text-gray-500">Loading your quotations...</p>
              </div>
            ) : myQuotations.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-12 text-center">
                <div className="text-5xl">🏷️</div>
                <h2 className="mt-4 text-xl font-bold text-gray-900">No quotations sent</h2>
                <p className="mt-2 text-sm text-gray-500">
                  Quotations you send on available requests will appear here so you can track customer decisions.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {myQuotations.map((q) => (
                  <div
                    key={q._id}
                    className="flex flex-col justify-between gap-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:flex-row sm:items-center"
                  >
                    <div>
                      <div className="flex items-center gap-3">
                        <h3 className="font-bold text-gray-900">
                          {q.serviceRequest?.title || "Service Request"}
                        </h3>
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${
                            q.status === "accepted"
                              ? "bg-green-100 text-green-800"
                              : q.status === "rejected"
                              ? "bg-red-100 text-red-800"
                              : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          {q.status}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-gray-500">
                        {q.message || "No custom message provided"}
                      </p>
                      <p className="mt-1 text-xs text-gray-400">
                        Estimated duration: {q.estimatedDuration} hrs • Location: {q.serviceRequest?.city || "Hyderabad"}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-xl font-bold text-gray-900">
                        ₹{q.amount}
                      </p>
                      <p className="text-xs text-gray-400">
                        Sent on {new Date(q.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Quotation Modal */}
        {selectedRequest && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl sm:p-8">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Send Quotation</h2>
                  <p className="mt-1 text-sm text-gray-500">{selectedRequest.title}</p>
                </div>
                <button
                  onClick={() => setSelectedRequest(null)}
                  className="text-2xl text-gray-400 hover:text-gray-700"
                >
                  ×
                </button>
              </div>

              {modalError && (
                <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700">
                  {modalError}
                </div>
              )}

              <form onSubmit={handleSendQuotation} className="mt-6 space-y-4">
                <div>
                  <label className="mb-1 block text-sm font-semibold text-gray-700">
                    Quotation Amount (₹)
                  </label>
                  <input
                    type="number"
                    name="amount"
                    value={quotation.amount}
                    onChange={handleQuotationChange}
                    placeholder="Enter amount in ₹"
                    min="1"
                    required
                    className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-semibold text-gray-700">
                    Estimated Duration (Hours)
                  </label>
                  <input
                    type="number"
                    name="estimatedDuration"
                    value={quotation.estimatedDuration}
                    onChange={handleQuotationChange}
                    placeholder="E.g. 2"
                    min="1"
                    className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-semibold text-gray-700">
                    Message to Customer
                  </label>
                  <textarea
                    name="message"
                    value={quotation.message}
                    onChange={handleQuotationChange}
                    rows="3"
                    placeholder="Explain your approach, warranty, or parts included..."
                    className="w-full resize-none rounded-xl border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-blue-500"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setSelectedRequest(null)}
                    className="flex-1 rounded-xl border border-gray-300 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={sending}
                    className="flex-1 rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 disabled:opacity-60"
                  >
                    {sending ? "Sending..." : "Submit Quotation"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default ProviderDashboard;