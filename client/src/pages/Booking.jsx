import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../services/api";

function Booking() {
  const { requestId, quotationId } = useParams();
  const navigate = useNavigate();

  const [quotation, setQuotation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    scheduledDate: "",
    startTime: "",
    endTime: "",
    address: "",
    city: "Hyderabad",
    notes: "",
  });

  useEffect(() => {
    fetchQuotation();
  }, [requestId, quotationId]);

  const fetchQuotation = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(
        `/quotations/request/${requestId}`
      );

      const quotations =
        response.data.quotations ||
        response.data;

      const selected = quotations.find(
        (item) => item._id === quotationId
      );

      if (!selected) {
        setError("Quotation not found.");
        return;
      }

      setQuotation(selected);

      const serviceRequest =
        selected.serviceRequest || {};

      setForm((prev) => ({
        ...prev,
        address: serviceRequest.address || "",
        city: serviceRequest.city || "Hyderabad",
      }));
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message ||
          "Unable to load quotation."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (
      !form.scheduledDate ||
      !form.startTime ||
      !form.endTime
    ) {
      setError(
        "Please select date, start time and end time."
      );
      return;
    }

    if (form.endTime <= form.startTime) {
      setError(
        "End time must be later than start time."
      );
      return;
    }

    try {
      setBooking(true);

      await api.post("/bookings", {
        serviceRequest: requestId,
        quotation: quotationId,
        scheduledDate: form.scheduledDate,
        startTime: form.startTime,
        endTime: form.endTime,
        address: form.address,
        city: form.city,
        notes: form.notes,
      });

      alert("Service scheduled successfully!");

      navigate("/dashboard");
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message ||
          "Unable to create booking."
      );
    } finally {
      setBooking(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />

        <div className="flex min-h-[70vh] items-center justify-center">
          <div className="text-center">
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />

            <p className="mt-4 text-gray-500">
              Loading booking details...
            </p>
          </div>
        </div>
      </>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="mx-auto max-w-4xl px-4 py-8">

        <button
          onClick={() => navigate(-1)}
          className="mb-6 text-sm font-medium text-gray-600 hover:text-gray-900"
        >
          ← Back
        </button>

        <h1 className="text-3xl font-bold text-gray-900">
          Schedule your service
        </h1>

        <p className="mt-2 text-gray-500">
          Choose a convenient date and time for your service.
        </p>

        {error && (
          <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {quotation && (
          <>
            {/* Quotation */}
            <div className="mt-6 rounded-2xl bg-white p-6 shadow-sm">

              <p className="text-sm text-gray-500">
                Selected professional
              </p>

              <div className="mt-3 flex items-center justify-between gap-4">

                <div>
                  <h2 className="text-lg font-bold text-gray-900">
                    {quotation.provider?.businessName ||
                      "Professional"}
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    {quotation.message ||
                      "Professional service"}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-2xl font-bold text-gray-900">
                    ₹{quotation.amount}
                  </p>

                  <p className="text-xs text-gray-500">
                    Quotation amount
                  </p>
                </div>

              </div>
            </div>

            {/* Booking Form */}
            <form
              onSubmit={handleSubmit}
              className="mt-6 rounded-2xl bg-white p-6 shadow-sm"
            >
              <h2 className="text-xl font-bold text-gray-900">
                Service details
              </h2>

              <div className="mt-6 grid gap-6 md:grid-cols-2">

                <div>
                  <label className="mb-2 block text-sm font-semibold">
                    Service date
                  </label>

                  <input
                    type="date"
                    name="scheduledDate"
                    value={form.scheduledDate}
                    min={
                      new Date()
                        .toISOString()
                        .split("T")[0]
                    }
                    onChange={handleChange}
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold">
                    Start time
                  </label>

                  <input
                    type="time"
                    name="startTime"
                    value={form.startTime}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold">
                    End time
                  </label>

                  <input
                    type="time"
                    name="endTime"
                    value={form.endTime}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold">
                    City
                  </label>

                  <input
                    type="text"
                    name="city"
                    value={form.city}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
                  />
                </div>

              </div>

              <div className="mt-6">
                <label className="mb-2 block text-sm font-semibold">
                  Service address
                </label>

                <textarea
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  rows="3"
                  className="w-full resize-none rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
                />
              </div>

              <div className="mt-6">
                <label className="mb-2 block text-sm font-semibold">
                  Additional notes
                </label>

                <textarea
                  name="notes"
                  value={form.notes}
                  onChange={handleChange}
                  rows="3"
                  placeholder="Any instructions for the professional?"
                  className="w-full resize-none rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
                />
              </div>

              <button
                type="submit"
                disabled={booking}
                className="mt-6 w-full rounded-xl bg-blue-600 px-6 py-4 font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
              >
                {booking
                  ? "Scheduling..."
                  : "Confirm & Schedule Service"}
              </button>
            </form>
          </>
        )}
      </main>
    </div>
  );
}

export default Booking;