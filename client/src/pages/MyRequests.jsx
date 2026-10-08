import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../services/api";

function MyRequests() {
  const navigate = useNavigate();

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchRequests();
  }, []);

 const fetchRequests = async () => {
  try {
    setLoading(true);
    setError("");

    const response = await api.get("/service-requests");

    const data =
      response.data.requests ||
      response.data.serviceRequests ||
      response.data;

    setRequests(Array.isArray(data) ? data : []);
  } catch (error) {
    console.error(error);

    setError(
      error.response?.data?.message ||
        "Unable to load your service requests."
    );

    setRequests([]);
  } finally {
    setLoading(false);
  }
};;

  const getStatusStyle = (status) => {
    const styles = {
      pending: "bg-yellow-50 text-yellow-700",
      matched: "bg-blue-50 text-blue-700",
      quoted: "bg-purple-50 text-purple-700",
      accepted: "bg-green-50 text-green-700",
      scheduled: "bg-blue-50 text-blue-700",
      in_progress: "bg-orange-50 text-orange-700",
      completed: "bg-green-50 text-green-700",
      cancelled: "bg-red-50 text-red-700",
    };

    return styles[status] || "bg-gray-100 text-gray-600";
  };

  const formatStatus = (status) => {
    return status
      .replace("_", " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="mx-auto max-w-6xl px-6 py-10 md:px-8">

        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate("/dashboard")}
            className="mb-5 text-sm font-medium text-gray-500 hover:text-gray-900"
          >
            ← Back to dashboard
          </button>

          <p className="text-sm font-semibold uppercase tracking-widest text-blue-600">
            CareConnect
          </p>

          <h1 className="mt-2 text-3xl font-bold text-gray-900">
            My service requests
          </h1>

          <p className="mt-2 text-gray-500">
            Track your service requests and their current status.
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* Loading */}
        {loading ? (
          <div className="rounded-2xl border border-gray-200 bg-white py-20 text-center">
            <p className="text-gray-500">
              Loading your requests...
            </p>
          </div>
        ) : requests.length === 0 ? (
          /* Empty */
          <div className="rounded-2xl border border-gray-200 bg-white px-6 py-20 text-center">

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 text-2xl">
              📋
            </div>

            <h2 className="mt-5 text-xl font-semibold text-gray-900">
              No service requests yet
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm text-gray-500">
              You haven't requested any home services yet.
              Start by booking a service.
            </p>

            <button
              onClick={() => navigate("/service-request")}
              className="mt-6 rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700"
            >
              Request a Service
            </button>

          </div>
        ) : (
          /* Requests */
          <div className="space-y-5">

            {requests.map((request) => (
              <div
                key={request._id}
                className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
              >

                {/* Top */}
                <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">

                  <div>
                    <div className="flex flex-wrap items-center gap-3">

                      <h2 className="text-lg font-bold text-gray-900">
                        {request.title}
                      </h2>

                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusStyle(
                          request.status
                        )}`}
                      >
                        {formatStatus(request.status)}
                      </span>

                    </div>

                    <p className="mt-2 text-sm text-gray-500">
                      {request.category?.name ||
                        "Service"}
                    </p>
                  </div>

                  <button
                    onClick={() =>
                      navigate(`/requests/${request._id}`)
                    }
                    className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    View Details
                  </button>

                </div>

                {/* Details */}
                <div className="mt-6 grid gap-5 border-t border-gray-100 pt-5 md:grid-cols-3">

                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                      Address
                    </p>

                    <p className="mt-1 text-sm text-gray-700">
                      {request.address}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                      Preferred date
                    </p>

                    <p className="mt-1 text-sm text-gray-700">
                      {request.preferredDate
                        ? new Date(
                            request.preferredDate
                          ).toLocaleDateString()
                        : "Not specified"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                      Preferred time
                    </p>

                    <p className="mt-1 text-sm text-gray-700">
                      {request.preferredTime ||
                        "Not specified"}
                    </p>
                  </div>

                </div>

                {/* Budget */}
                {request.estimatedBudget && (
                  <div className="mt-5 rounded-lg bg-gray-50 px-4 py-3">

                    <span className="text-sm text-gray-500">
                      Estimated budget
                    </span>

                    <span className="ml-2 font-semibold text-gray-900">
                      ₹{request.estimatedBudget}
                    </span>

                  </div>
                )}

              </div>
            ))}

          </div>
        )}

      </main>
    </div>
  );
}

export default MyRequests;