import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../services/api";

function AdminDashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const [activeTab, setActiveTab] = useState("categories"); // "categories" | "providers"

  // Categories
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    name: "",
    description: "",
  });
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [addingCategory, setAddingCategory] = useState(false);

  // Providers
  const [providers, setProviders] = useState([]);
  const [loadingProviders, setLoadingProviders] = useState(false);
  const [verifyingId, setVerifyingId] = useState(null);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (!user || user.role !== "admin") {
      navigate("/");
      return;
    }

    fetchCategories();
    fetchProviders();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoadingCategories(true);
      setError("");

      const response = await api.get("/categories");
      setCategories(response.data.categories || response.data || []);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to load services.");
    } finally {
      setLoadingCategories(false);
    }
  };

  const fetchProviders = async () => {
    try {
      setLoadingProviders(true);
      const response = await api.get("/providers");
      setProviders(response.data.providers || []);
    } catch (err) {
      console.error("Fetch providers error:", err);
    } finally {
      setLoadingProviders(false);
    }
  };

  const handleVerifyProvider = async (providerId) => {
    try {
      setVerifyingId(providerId);
      setError("");
      setSuccess("");

      await api.put(`/providers/${providerId}/verify`);
      setSuccess("Provider verified successfully!");
      await fetchProviders();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to verify provider.");
    } finally {
      setVerifyingId(null);
    }
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddService = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!form.name.trim()) {
      setError("Service name is required.");
      return;
    }

    try {
      setAddingCategory(true);

      const response = await api.post("/categories", {
        name: form.name.trim(),
        description: form.description.trim(),
      });

      const newCategory = response.data.category || response.data;
      setCategories((prev) => [...prev, newCategory]);
      setForm({ name: "", description: "" });
      setSuccess("Service added successfully.");
    } catch (err) {
      setError(err.response?.data?.message || "Unable to add service.");
    } finally {
      setAddingCategory(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm("Are you sure you want to delete this service?");
    if (!confirmed) return;

    try {
      await api.delete(`/categories/${id}`);
      setCategories((prev) => prev.filter((cat) => cat._id !== id));
      setSuccess("Service deleted successfully.");
    } catch (err) {
      setError(err.response?.data?.message || "Unable to delete service.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="mx-auto max-w-7xl px-6 py-10 md:px-8">
        {/* Header */}
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-widest text-blue-600">
            CareConnect Administration
          </p>
          <h1 className="mt-2 text-3xl font-bold text-gray-900">
            Admin Management Console
          </h1>
          <p className="mt-2 text-gray-500">
            Manage home service categories and verify professional service providers.
          </p>
        </div>

        {/* Messages */}
        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-6 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
            {success}
          </div>
        )}

        {/* Tabs */}
        <div className="mb-8 flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab("categories")}
            className={`border-b-2 px-6 py-3 text-sm font-semibold transition ${
              activeTab === "categories"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-900"
            }`}
          >
            Services & Categories ({categories.length})
          </button>
          <button
            onClick={() => setActiveTab("providers")}
            className={`border-b-2 px-6 py-3 text-sm font-semibold transition ${
              activeTab === "providers"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-900"
            }`}
          >
            Provider Verification ({providers.length})
          </button>
        </div>

        {/* TAB 1: CATEGORIES */}
        {activeTab === "categories" && (
          <div className="grid gap-8 lg:grid-cols-[380px_1fr]">
            {/* Add service */}
            <div className="h-fit rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900">Add a Service Category</h2>
              <p className="mt-1 text-sm text-gray-500">
                Create a new service offering for customers.
              </p>

              <form onSubmit={handleAddService} className="mt-6 space-y-5">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Service Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Example: AC Repair, Pest Control"
                    required
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    placeholder="Describe what this service covers..."
                    rows={4}
                    className="w-full resize-none rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                <button
                  type="submit"
                  disabled={addingCategory}
                  className="w-full rounded-xl bg-blue-600 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:opacity-60"
                >
                  {addingCategory ? "Adding Service..." : "+ Add Service Category"}
                </button>
              </form>
            </div>

            {/* List services */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Current Categories</h2>
                  <p className="mt-1 text-sm text-gray-500">{categories.length} active categories</p>
                </div>
              </div>

              <div className="mt-6">
                {loadingCategories ? (
                  <div className="py-10 text-center text-sm text-gray-500">
                    Loading services...
                  </div>
                ) : categories.length === 0 ? (
                  <div className="rounded-xl bg-gray-50 py-12 text-center text-sm text-gray-500">
                    No services created yet.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {categories.map((cat) => (
                      <div
                        key={cat._id}
                        className="flex items-center justify-between rounded-xl border border-gray-200 p-4 transition hover:border-blue-200 hover:bg-blue-50/20"
                      >
                        <div>
                          <h3 className="font-semibold text-gray-900">{cat.name}</h3>
                          <p className="mt-1 text-sm text-gray-500">
                            {cat.description || "No description provided"}
                          </p>
                        </div>
                        <button
                          onClick={() => handleDelete(cat._id)}
                          className="rounded-lg px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50"
                        >
                          Delete
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: PROVIDERS VERIFICATION */}
        {activeTab === "providers" && (
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Provider Verification</h2>
                <p className="mt-1 text-sm text-gray-500">
                  Review service providers and grant verification status so they can quote on jobs.
                </p>
              </div>
            </div>

            <div className="mt-6">
              {loadingProviders ? (
                <div className="py-12 text-center text-sm text-gray-500">
                  Loading providers...
                </div>
              ) : providers.length === 0 ? (
                <div className="rounded-xl bg-gray-50 py-12 text-center text-sm text-gray-500">
                  No service providers registered yet.
                </div>
              ) : (
                <div className="space-y-4">
                  {providers.map((p) => (
                    <div
                      key={p._id}
                      className="flex flex-col justify-between gap-4 rounded-xl border border-gray-200 p-5 transition hover:border-blue-200 hover:bg-gray-50/50 sm:flex-row sm:items-center"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-3">
                          <h3 className="text-base font-bold text-gray-900">
                            {p.businessName}
                          </h3>
                          <span
                            className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                              p.isVerified
                                ? "bg-green-100 text-green-800"
                                : "bg-amber-100 text-amber-800"
                            }`}
                          >
                            {p.isVerified ? "✓ Verified" : "⏳ Pending Verification"}
                          </span>
                        </div>
                        <p className="text-xs text-gray-600">
                          Owner: <span className="font-medium text-gray-900">{p.user?.name}</span> ({p.user?.email} • {p.phone})
                        </p>
                        <p className="text-xs text-gray-500">
                          📍 {p.address}, {p.city}, {p.state} • {p.experienceYears} yrs experience • ₹{p.hourlyRate}/hr
                        </p>
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {p.skills?.map((s) => (
                            <span
                              key={s._id}
                              className="rounded bg-blue-50 px-2 py-0.5 text-[11px] font-medium text-blue-700"
                            >
                              {s.name}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="shrink-0 text-right">
                        {!p.isVerified ? (
                          <button
                            disabled={verifyingId === p._id}
                            onClick={() => handleVerifyProvider(p._id)}
                            className="rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-blue-700 disabled:opacity-50"
                          >
                            {verifyingId === p._id ? "Verifying..." : "Verify Provider"}
                          </button>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-xs font-semibold text-green-700">
                            ✓ Verified Active
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default AdminDashboard;