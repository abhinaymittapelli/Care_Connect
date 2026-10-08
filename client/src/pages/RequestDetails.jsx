import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../services/api";

function RequestDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [request, setRequest] = useState(null);
  const [providers, setProviders] = useState([]);
  const [quotations, setQuotations] = useState([]);

  const [loading, setLoading] = useState(true);
  const [loadingProviders, setLoadingProviders] = useState(false);
  const [loadingQuotations, setLoadingQuotations] = useState(false);

  const [acceptingQuote, setAcceptingQuote] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchRequest();
  }, [id]);

  const fetchRequest = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(`/service-requests/${id}`);

      const requestData = response.data.request || response.data;

      setRequest(requestData);

      fetchMatchingProviders();
      fetchQuotations();
    } catch (error) {
      console.error(error);
      setError(
        error.response?.data?.message ||
          "Unable to load service request."
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchMatchingProviders = async () => {
    try {
      setLoadingProviders(true);

      const response = await api.get(`/matching/${id}`);

      const data =
        response.data.matches ||
        response.data.providers ||
        response.data;

      setProviders(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Matching error:", error);
      setProviders([]);
    } finally {
      setLoadingProviders(false);
    }
  };

  const fetchQuotations = async () => {
    try {
      setLoadingQuotations(true);

      const response = await api.get(
        `/quotations/request/${id}`
      );

      const data =
        response.data.quotations ||
        response.data;

      setQuotations(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Quotation error:", error);
      setQuotations([]);
    } finally {
      setLoadingQuotations(false);
    }
  };

  const handleAcceptQuotation = async (quotationId) => {
    try {
      setAcceptingQuote(quotationId);
      setError("");

      await api.put(
        `/quotations/${quotationId}/accept`
      );

      await fetchRequest();
      await fetchQuotations();

      alert("Quotation accepted successfully!");
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message ||
          "Unable to accept quotation."
      );
    } finally {
      setAcceptingQuote(null);
    }
  };

  const getStatusStyle = (status) => {
    const styles = {
      pending:
        "bg-yellow-100 text-yellow-700",
      matched:
        "bg-blue-100 text-blue-700",
      quoted:
        "bg-purple-100 text-purple-700",
      accepted:
        "bg-green-100 text-green-700",
      scheduled:
        "bg-indigo-100 text-indigo-700",
      in_progress:
        "bg-orange-100 text-orange-700",
      completed:
        "bg-emerald-100 text-emerald-700",
      cancelled:
        "bg-red-100 text-red-700",
    };

    return (
      styles[status] ||
      "bg-gray-100 text-gray-700"
    );
  };

  if (loading) {
    return (
      <>
        <Navbar />

        <div className="flex min-h-[70vh] items-center justify-center">
          <div className="text-center">
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600"></div>

            <p className="mt-4 text-gray-500">
              Loading request details...
            </p>
          </div>
        </div>
      </>
    );
  }

  if (!request) {
    return (
      <>
        <Navbar />

        <div className="flex min-h-[70vh] items-center justify-center px-4">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900">
              Request not found
            </h1>

            <p className="mt-2 text-gray-500">
              We couldn't find this service request.
            </p>

            <button
              onClick={() => navigate("/my-requests")}
              className="mt-6 rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
            >
              Back to My Requests
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

        {/* Back */}
        <button
          onClick={() => navigate("/my-requests")}
          className="mb-6 flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900"
        >
          ← Back to My Requests
        </button>

        {/* Error */}
        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Request Header */}
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">

          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">

            <div>
              <div className="flex flex-wrap items-center gap-3">

                <h1 className="text-2xl font-bold text-gray-900">
                  {request.title}
                </h1>

                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${getStatusStyle(
                    request.status
                  )}`}
                >
                  {request.status?.replace(
                    "_",
                    " "
                  )}
                </span>
              </div>

              <p className="mt-2 text-gray-500">
                Service request details
              </p>
            </div>

            {request.estimatedBudget && (
              <div className="rounded-xl bg-gray-50 px-5 py-3 text-right">
                <p className="text-xs text-gray-500">
                  Estimated Budget
                </p>

                <p className="text-xl font-bold text-gray-900">
                  ₹{request.estimatedBudget}
                </p>
              </div>
            )}
          </div>

          {/* Request Information */}
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                Service
              </p>

              <p className="mt-1 font-semibold text-gray-900">
                {request.category?.name ||
                  request.categoryName ||
                  "Service"}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                Preferred Date
              </p>

              <p className="mt-1 font-semibold text-gray-900">
                {request.preferredDate
                  ? new Date(
                      request.preferredDate
                    ).toLocaleDateString("en-IN")
                  : "Not specified"}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                Preferred Time
              </p>

              <p className="mt-1 font-semibold text-gray-900">
                {request.preferredTime ||
                  "Not specified"}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                City
              </p>

              <p className="mt-1 font-semibold text-gray-900">
                {request.city || "Not specified"}
              </p>
            </div>
          </div>

          {/* Address */}
          <div className="mt-6 rounded-xl bg-gray-50 p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
              Service Address
            </p>

            <p className="mt-1 text-sm text-gray-700">
              {request.address || "Address not specified"}
            </p>
          </div>

          {/* Description */}
          <div className="mt-6">
            <p className="text-sm font-semibold text-gray-900">
              Description
            </p>

            <p className="mt-2 text-sm leading-6 text-gray-600">
              {request.description ||
                "No description provided."}
            </p>
          </div>
        </div>

        {/* Matching Providers */}
        <section className="mt-8">

          <div className="mb-4">
            <h2 className="text-xl font-bold text-gray-900">
              Recommended Professionals
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Professionals available for your service
            </p>
          </div>

          {loadingProviders ? (
            <div className="rounded-2xl bg-white p-8 text-center shadow-sm">
              <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600"></div>

              <p className="mt-3 text-sm text-gray-500">
                Finding professionals...
              </p>
            </div>
          ) : providers.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-8 text-center">
              <div className="text-4xl">
                🔍
              </div>

              <h3 className="mt-3 font-semibold text-gray-900">
                No professionals found
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                We couldn't find an available professional
                matching this request right now.
              </p>
            </div>
          ) : (
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">

              {providers.map((provider) => (
                <div
                  key={provider._id}
                  className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                >

                  <div className="flex items-start gap-4">

                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xl font-bold text-blue-600">
                      {(
                        provider.businessName ||
                        provider.user?.name ||
                        "P"
                      )
                        .charAt(0)
                        .toUpperCase()}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="truncate font-bold text-gray-900">
                          {provider.businessName ||
                            "Professional"}
                        </h3>

                        {provider.isVerified && (
                          <span className="text-blue-600">
                            ✓
                          </span>
                        )}
                      </div>

                      <p className="mt-1 text-sm text-gray-500">
                        {provider.city ||
                          request.city}
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 grid grid-cols-2 gap-3">

                    <div className="rounded-lg bg-gray-50 p-3">
                      <p className="text-xs text-gray-400">
                        Experience
                      </p>

                      <p className="mt-1 font-semibold text-gray-900">
                        {provider.experienceYears || 0} years
                      </p>
                    </div>

                    <div className="rounded-lg bg-gray-50 p-3">
                      <p className="text-xs text-gray-400">
                        Rating
                      </p>

                      <p className="mt-1 font-semibold text-gray-900">
                        ⭐{" "}
                        {provider.rating
                          ? provider.rating.toFixed(1)
                          : "New"}
                      </p>
                    </div>
                  </div>

                  {provider.hourlyRate && (
                    <div className="mt-4">
                      <span className="text-lg font-bold text-gray-900">
                        ₹{provider.hourlyRate}
                      </span>

                      <span className="text-sm text-gray-500">
                        /hour
                      </span>
                    </div>
                  )}

                  <div className="mt-4 flex items-center gap-2 text-xs">

                    <span className="rounded-full bg-green-50 px-3 py-1 font-medium text-green-700">
                      ● Available
                    </span>

                    {provider.isVerified && (
                      <span className="rounded-full bg-blue-50 px-3 py-1 font-medium text-blue-700">
                        Verified
                      </span>
                    )}
                  </div>
                </div>
              ))}

            </div>
          )}
        </section>

        {/* Quotations */}
        <section className="mt-10">

          <div className="mb-4">
            <h2 className="text-xl font-bold text-gray-900">
              Quotations
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Compare quotations from professionals
            </p>
          </div>

          {loadingQuotations ? (
            <div className="rounded-2xl bg-white p-8 text-center shadow-sm">
              <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600"></div>

              <p className="mt-3 text-sm text-gray-500">
                Loading quotations...
              </p>
            </div>
          ) : quotations.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-8 text-center">

              <div className="text-4xl">
                💰
              </div>

              <h3 className="mt-3 font-semibold text-gray-900">
                No quotations yet
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                Professionals will send their quotations
                after reviewing your request.
              </p>

            </div>
          ) : (
            <div className="space-y-4">

              {quotations.map((quotation) => {

                const provider =
                  quotation.provider || {};

                return (
                  <div
                    key={quotation._id}
                    className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"
                  >

                    <div className="flex flex-col justify-between gap-5 md:flex-row">

                      <div className="flex gap-4">

                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-600">
                          {(
                            provider.businessName ||
                            provider.user?.name ||
                            "P"
                          )
                            .charAt(0)
                            .toUpperCase()}
                        </div>

                        <div>
                          <h3 className="font-bold text-gray-900">
                            {provider.businessName ||
                              "Professional"}
                          </h3>

                          <p className="mt-1 text-sm text-gray-500">
                            {quotation.message ||
                              "Professional quotation"}
                          </p>

                          {quotation.estimatedDuration && (
                            <p className="mt-2 text-xs text-gray-500">
                              Estimated duration:{" "}
                              <span className="font-medium text-gray-700">
                                {quotation.estimatedDuration} hours
                              </span>
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="text-left md:text-right">

                        <p className="text-2xl font-bold text-gray-900">
                          ₹{quotation.amount}
                        </p>

                        <span
                          className={`mt-2 inline-block rounded-full px-3 py-1 text-xs font-semibold capitalize ${
                            quotation.status ===
                            "accepted"
                              ? "bg-green-100 text-green-700"
                              : quotation.status ===
                                "rejected"
                              ? "bg-red-100 text-red-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {quotation.status}
                        </span>

                      </div>
                    </div>

                    {quotation.status === "pending" && (
                      <div className="mt-5 border-t border-gray-100 pt-4">

                        <button
                          onClick={() =>
                            handleAcceptQuotation(
                              quotation._id
                            )
                          }
                          disabled={
                            acceptingQuote ===
                            quotation._id
                          }
                          className="w-full rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60 md:w-auto"
                        >
                          {acceptingQuote ===
                          quotation._id
                            ? "Accepting..."
                            : "Accept Quotation"}
                        </button>

                      </div>
                    )}

                    {quotation.status ===
                      "accepted" && (
                      <div className="mt-5 border-t border-gray-100 pt-4">

                        <div className="rounded-xl bg-green-50 p-4">

                          <p className="font-semibold text-green-800">
                            ✓ Quotation accepted
                          </p>

                          <p className="mt-1 text-sm text-green-700">
                            You can now schedule your
                            service.
                          </p>

                          <button
                            onClick={() =>
                             navigate(`/booking/${request._id}/${quotation._id}`)
                            }
                            className="mt-3 rounded-lg bg-green-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-green-700"
                          >
                            Schedule Service
                          </button>

                        </div>

                      </div>
                    )}

                  </div>
                );
              })}

            </div>
          )}

        </section>

      </main>
    </div>
  );
}

export default RequestDetails;