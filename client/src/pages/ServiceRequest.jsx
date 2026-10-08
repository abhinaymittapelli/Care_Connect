import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../services/api";

function ServiceRequest() {
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);

  const [form, setForm] = useState({
    category: "",
    title: "",
    description: "",
    address: "",
    city: "Hyderabad",
    preferredDate: "",
    preferredTime: "",
    estimatedBudget: "",
  });

  const [loadingCategories, setLoadingCategories] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get("/categories");

        setCategories(response.data.categories || response.data);
      } catch (error) {
        setError(
          error.response?.data?.message ||
            "Unable to load service categories."
        );
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSubmitting(true);

    try {
      await api.post("/service-requests", {
        category: form.category,
        title: form.title,
        description: form.description,
        address: form.address,
        city: form.city,
        preferredDate: form.preferredDate,
        preferredTime: form.preferredTime,
        estimatedBudget: form.estimatedBudget
          ? Number(form.estimatedBudget)
          : undefined,
      });

      navigate("/dashboard");
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to create service request."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="mx-auto max-w-4xl px-6 py-10 md:px-8">

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
            Request a service
          </h1>

          <p className="mt-2 text-gray-500">
            Tell us what you need and we'll help you find the right professional.
          </p>
        </div>

        {/* Form */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm md:p-8">

          {error && (
            <div className="mb-6 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="space-y-6"
          >

            {/* Category */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-800">
                What service do you need?
              </label>

              {loadingCategories ? (
                <div className="rounded-lg border border-gray-200 px-4 py-3 text-sm text-gray-500">
                  Loading services...
                </div>
              ) : (
                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                >
                  <option value="">
                    Select a service
                  </option>

                  {categories.map((category) => (
                    <option
                      key={category._id}
                      value={category._id}
                    >
                      {category.name}
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* Title */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-800">
                What do you need help with?
              </label>

              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Example: Kitchen sink leakage"
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* Description */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-800">
                Describe the problem
              </label>

              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Describe what needs to be repaired or serviced..."
                rows={5}
                required
                className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* Address */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-800">
                Service address
              </label>

              <textarea
                name="address"
                value={form.address}
                onChange={handleChange}
                placeholder="Enter your complete address"
                rows={3}
                required
                className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* City */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-800">
                City
              </label>

              <input
                type="text"
                name="city"
                value={form.city}
                onChange={handleChange}
                placeholder="Enter city"
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* Date + Time */}
            <div className="grid gap-5 md:grid-cols-2">

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-800">
                  Preferred date
                </label>

                <input
                  type="date"
                  name="preferredDate"
                  value={form.preferredDate}
                  onChange={handleChange}
                  required
                  min={new Date().toISOString().split("T")[0]}
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-800">
                  Preferred time
                </label>

                <input
                  type="time"
                  name="preferredTime"
                  value={form.preferredTime}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

            </div>

            {/* Budget */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-800">
                Estimated budget
                <span className="ml-2 font-normal text-gray-400">
                  (optional)
                </span>
              </label>

              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                  ₹
                </span>

                <input
                  type="number"
                  name="estimatedBudget"
                  value={form.estimatedBudget}
                  onChange={handleChange}
                  placeholder="Example: 1000"
                  min="0"
                  className="w-full rounded-lg border border-gray-300 py-3 pl-9 pr-4 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>
            </div>

            {/* Submit */}
            <div className="border-t border-gray-100 pt-6">

              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-lg bg-blue-600 py-3.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400"
              >
                {submitting
                  ? "Submitting request..."
                  : "Submit Service Request"}
              </button>

            </div>

          </form>
        </div>

        {/* Info */}
        <div className="mt-5 rounded-xl bg-blue-50 p-5">
          <div className="flex gap-3">
            <span className="text-lg">💡</span>

            <div>
              <p className="text-sm font-semibold text-gray-900">
                How CareConnect works
              </p>

              <p className="mt-1 text-sm leading-6 text-gray-600">
                Submit your request → matched professionals send
                quotations → choose the quotation you prefer → book
                your service.
              </p>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}

export default ServiceRequest;