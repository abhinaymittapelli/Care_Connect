import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../services/api";

function AdminDashboard() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  const [categories, setCategories] = useState([]);

  const [form, setForm] = useState({
    name: "",
    description: "",
  });

  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (!user || user.role !== "admin") {
      navigate("/");
      return;
    }

    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/categories");

      setCategories(response.data.categories || response.data);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to load services."
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

  const handleAddService = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!form.name.trim()) {
      setError("Service name is required.");
      return;
    }

    try {
      setAdding(true);

      const response = await api.post("/categories", {
        name: form.name.trim(),
        description: form.description.trim(),
      });

      const newCategory = response.data.category || response.data;

      setCategories((prev) => [...prev, newCategory]);

      setForm({
        name: "",
        description: "",
      });

      setSuccess("Service added successfully.");
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to add service."
      );
    } finally {
      setAdding(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this service?"
    );

    if (!confirmed) return;

    try {
      await api.delete(`/categories/${id}`);

      setCategories((prev) =>
        prev.filter((category) => category._id !== id)
      );

      setSuccess("Service deleted successfully.");
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to delete service."
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="mx-auto max-w-7xl px-6 py-10 md:px-8">

        {/* Header */}
        <div className="mb-10">
          <p className="text-sm font-semibold uppercase tracking-widest text-blue-600">
            Admin Panel
          </p>

          <h1 className="mt-2 text-3xl font-bold text-gray-900">
            Service Management
          </h1>

          <p className="mt-2 text-gray-500">
            Add and manage the services available on CareConnect.
          </p>
        </div>

        {/* Messages */}
        {error && (
          <div className="mb-6 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700">
            {success}
          </div>
        )}

        <div className="grid gap-8 lg:grid-cols-[380px_1fr]">

          {/* Add service */}
          <div className="h-fit rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

            <h2 className="text-xl font-bold text-gray-900">
              Add a service
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Create a new service category for customers.
            </p>

            <form
              onSubmit={handleAddService}
              className="mt-6 space-y-5"
            >

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Service name
                </label>

                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Example: AC Repair"
                  required
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
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
                  placeholder="Describe this service"
                  rows={4}
                  className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <button
                type="submit"
                disabled={adding}
                className="w-full rounded-lg bg-blue-600 py-3.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400"
              >
                {adding ? "Adding..." : "+ Add Service"}
              </button>

            </form>
          </div>

          {/* Existing services */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

            <div className="flex items-center justify-between">

              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Available services
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  {categories.length} services available
                </p>
              </div>

            </div>

            <div className="mt-6">

              {loading ? (
                <div className="py-10 text-center text-sm text-gray-500">
                  Loading services...
                </div>
              ) : categories.length === 0 ? (
                <div className="rounded-xl bg-gray-50 py-12 text-center">
                  <p className="text-gray-500">
                    No services added yet.
                  </p>

                  <p className="mt-1 text-sm text-gray-400">
                    Add your first service using the form.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">

                  {categories.map((category) => (
                    <div
                      key={category._id}
                      className="flex items-center justify-between rounded-xl border border-gray-200 p-4 transition hover:border-blue-200 hover:bg-blue-50/30"
                    >

                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {category.name}
                        </h3>

                        <p className="mt-1 text-sm text-gray-500">
                          {category.description ||
                            "No description provided"}
                        </p>
                      </div>

                      <button
                        onClick={() =>
                          handleDelete(category._id)
                        }
                        className="rounded-lg px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
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

      </main>
    </div>
  );
}

export default AdminDashboard;