import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../services/api";

function ProviderProfile() {
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);

  const [form, setForm] = useState({
    businessName: "",
    bio: "",
    phone: "",
    address: "",
    city: "Hyderabad",
    state: "Telangana",
    experienceYears: "",
    hourlyRate: "",
    skills: [],
  });

  const [loading, setLoading] = useState(false);
  const [loadingCategories, setLoadingCategories] =
    useState(true);

  const [error, setError] = useState("");

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await api.get("/categories");

      setCategories(
        response.data.categories ||
          response.data ||
          []
      );
    } catch (error) {
      console.error(error);

      setError(
        "Unable to load available services."
      );
    } finally {
      setLoadingCategories(false);
    }
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSkillChange = (categoryId) => {
    setForm((prev) => {
      const alreadySelected =
        prev.skills.includes(categoryId);

      if (alreadySelected) {
        return {
          ...prev,
          skills: prev.skills.filter(
            (id) => id !== categoryId
          ),
        };
      }

      return {
        ...prev,
        skills: [
          ...prev.skills,
          categoryId,
        ],
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (!form.businessName.trim()) {
      setError("Business name is required.");
      return;
    }

    if (form.skills.length === 0) {
      setError(
        "Please select at least one service."
      );
      return;
    }

    try {
      setLoading(true);

      await api.post("/providers", {
        businessName:
          form.businessName.trim(),

        bio: form.bio.trim(),

        phone: form.phone,

        address: form.address.trim(),

        city: form.city,

        state: form.state,

        experienceYears:
          Number(form.experienceYears) || 0,

        hourlyRate:
          Number(form.hourlyRate) || 0,

        skills: form.skills,
      });

      alert(
        "Provider profile created successfully!"
      );

      navigate("/dashboard");
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message ||
          "Unable to create provider profile."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">

      <Navbar />

      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6">

        <div className="mb-8">
          <p className="text-sm font-semibold text-blue-600">
            Provider Registration
          </p>

          <h1 className="mt-1 text-3xl font-bold text-gray-900">
            Create your professional profile
          </h1>

          <p className="mt-2 text-gray-500">
            Tell customers about your services and experience.
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl bg-white p-6 shadow-sm sm:p-8"
        >

          {/* Basic Information */}
          <section>
            <h2 className="text-lg font-bold text-gray-900">
              Business Information
            </h2>

            <div className="mt-5 grid gap-5 md:grid-cols-2">

              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Business Name
                </label>

                <input
                  type="text"
                  name="businessName"
                  value={form.businessName}
                  onChange={handleChange}
                  placeholder="Example: Rahul Home Services"
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Phone
                </label>

                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="Phone number"
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
                />
              </div>

            </div>

            <div className="mt-5">
              <label className="mb-2 block text-sm font-semibold">
                About your business
              </label>

              <textarea
                name="bio"
                value={form.bio}
                onChange={handleChange}
                rows="4"
                placeholder="Tell customers about your experience and services..."
                className="w-full resize-none rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
              />
            </div>
          </section>

          {/* Location */}
          <section className="mt-8 border-t border-gray-100 pt-8">

            <h2 className="text-lg font-bold text-gray-900">
              Service Location
            </h2>

            <div className="mt-5">

              <label className="mb-2 block text-sm font-semibold">
                Address
              </label>

              <textarea
                name="address"
                value={form.address}
                onChange={handleChange}
                rows="3"
                placeholder="Your business/service address"
                className="w-full resize-none rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
              />

            </div>

            <div className="mt-5 grid gap-5 md:grid-cols-2">

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

              <div>
                <label className="mb-2 block text-sm font-semibold">
                  State
                </label>

                <input
                  type="text"
                  name="state"
                  value={form.state}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
                />
              </div>

            </div>
          </section>

          {/* Experience */}
          <section className="mt-8 border-t border-gray-100 pt-8">

            <h2 className="text-lg font-bold text-gray-900">
              Experience & Pricing
            </h2>

            <div className="mt-5 grid gap-5 md:grid-cols-2">

              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Experience
                </label>

                <input
                  type="number"
                  name="experienceYears"
                  value={form.experienceYears}
                  onChange={handleChange}
                  min="0"
                  placeholder="Years of experience"
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Hourly Rate
                </label>

                <input
                  type="number"
                  name="hourlyRate"
                  value={form.hourlyRate}
                  onChange={handleChange}
                  min="0"
                  placeholder="₹ per hour"
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
                />
              </div>

            </div>
          </section>

          {/* Skills */}
          <section className="mt-8 border-t border-gray-100 pt-8">

            <h2 className="text-lg font-bold text-gray-900">
              Services You Provide
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Select the services you are qualified to provide.
            </p>

            {loadingCategories ? (
              <p className="mt-5 text-sm text-gray-500">
                Loading services...
              </p>
            ) : categories.length === 0 ? (
              <p className="mt-5 text-sm text-red-500">
                No services available.
              </p>
            ) : (
              <div className="mt-5 grid gap-3 sm:grid-cols-2">

                {categories.map((category) => (
                  <label
                    key={category._id}
                    className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 transition ${
                      form.skills.includes(
                        category._id
                      )
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >

                    <input
                      type="checkbox"
                      checked={form.skills.includes(
                        category._id
                      )}
                      onChange={() =>
                        handleSkillChange(
                          category._id
                        )
                      }
                      className="h-4 w-4 accent-blue-600"
                    />

                    <div>
                      <p className="font-semibold text-gray-900">
                        {category.name}
                      </p>

                      {category.description && (
                        <p className="mt-1 text-xs text-gray-500">
                          {category.description}
                        </p>
                      )}
                    </div>

                  </label>
                ))}

              </div>
            )}
          </section>

          <button
            type="submit"
            disabled={loading}
            className="mt-8 w-full rounded-xl bg-blue-600 px-6 py-4 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading
              ? "Creating profile..."
              : "Create Provider Profile"}
          </button>

        </form>
      </main>
    </div>
  );
}

export default ProviderProfile;