import Navbar from "../components/Navbar";
import CategoryCard from "../components/CategoryCard";
import ServiceSection from "../components/ServiceSection";
import Footer from "../components/Footer";

const categories = [
  {
    name: "Home Cleaning",
    image:
      "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=500",
  },
  {
    name: "Plumbing",
    image:
      "https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=500",
  },
  {
    name: "Electrical",
    image:
      "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=500",
  },
  {
  name: "AC Repair",
  image:
    "https://ncrcoolingcentre.in/images/services/ac-repair.jpg"
},
{
  name: "Painting",
  image:
    "https://images.unsplash.com/photo-1562259949-e8e7689d7828?auto=format&fit=crop&w=800&q=80"
},
  {
    name: "Appliance Repair",
    image:
      "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=500",
  },
];

const popularServices = [
  {
    id: 1,
    name: "Full Home Cleaning",
    rating: "4.8",
    reviews: "1.2k",
    price: 799,
    image:
      "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600",
  },
  {
    id: 2,
    name: "Bathroom Cleaning",
    rating: "4.7",
    reviews: "890",
    price: 499,
    image:
      "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=600",
  },
  {
    id: 3,
    name: "AC Service",
    rating: "4.8",
    reviews: "2.1k",
    price: 599,
    image:
      "https://ncrcoolingcentre.in/images/services/ac-repair.jpg",
  },
  {
    id: 4,
    name: "Electrician",
    rating: "4.6",
    reviews: "760",
    price: 299,
    image:
      "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=600",
  },
];

function Home() {
  return (
    <div className="min-h-screen w-full bg-white">

      <Navbar />

      {/* HERO */}
      <section className="bg-[#f7f7f7]">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-14 md:grid-cols-2 md:px-8 md:py-20">

          <div className="max-w-xl">

            <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-blue-600">
              CareConnect Home Services
            </p>

            <h1 className="text-4xl font-bold leading-[1.1] tracking-tight text-gray-900 md:text-5xl">
              Home services
              <br />
              at your doorstep
            </h1>

            <p className="mt-5 max-w-lg text-base leading-7 text-gray-600 md:text-lg">
              Book trusted professionals for cleaning,
              repairs, maintenance and other home services.
            </p>

            {/* SEARCH */}
            <div className="mt-8 flex w-full items-center rounded-xl border border-gray-300 bg-white p-1.5 shadow-sm">

              <span className="px-3 text-lg text-gray-400">
                🔍
              </span>

              <input
                type="text"
                placeholder="Search for a service"
                className="min-w-0 flex-1 bg-transparent px-2 py-3 text-sm outline-none placeholder:text-gray-400"
              />

              <button className="rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700">
                Search
              </button>

            </div>

          </div>

          {/* HERO IMAGE */}
          <div className="overflow-hidden rounded-2xl">
            <img
              src="https://images.unsplash.com/photo-1556911220-bff31c812dba?w=1200"
              alt="Professional home service"
              className="h-[320px] w-full object-cover md:h-[400px]"
            />
          </div>

        </div>
      </section>

      {/* MAIN */}
      <main className="mx-auto max-w-7xl px-6 md:px-8">

        {/* POPULAR SERVICES */}
        <section className="py-12">

          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Popular services
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Services people book most often
            </p>
          </div>

          <div className="flex gap-6 overflow-x-auto pb-4">
            {popularServices.map((service) => (
              <CategoryCard
                key={service.id}
                category={{
                  name: service.name,
                  image: service.image,
                }}
              />
            ))}
          </div>

        </section>

        {/* CATEGORIES */}
        <section className="border-t border-gray-100 py-12">

          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Browse all services
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Find the right professional for your home
            </p>
          </div>

          <div className="flex gap-8 overflow-x-auto pb-4">
            {categories.map((category) => (
              <CategoryCard
                key={category.name}
                category={category}
              />
            ))}
          </div>

        </section>

        {/* PROMO BANNER */}
        <section className="my-4 overflow-hidden rounded-2xl bg-blue-600">

          <div className="flex flex-col items-start justify-between gap-8 px-8 py-10 md:flex-row md:items-center md:px-12">

            <div className="max-w-2xl text-white">

              <p className="text-sm font-semibold uppercase tracking-wider text-blue-100">
                CARECONNECT
              </p>

              <h2 className="mt-2 text-2xl font-bold md:text-3xl">
                Trusted professionals.
                <br />
                Quality service at your doorstep.
              </h2>

              <p className="mt-3 text-sm leading-6 text-blue-100 md:text-base">
                Easy booking, transparent quotations and
                reliable service professionals.
              </p>

            </div>

            <button className="shrink-0 rounded-lg bg-white px-7 py-3 text-sm font-semibold text-blue-600 transition hover:bg-gray-100">
              Explore Services
            </button>

          </div>

        </section>

        {/* SERVICE SECTIONS */}
        <ServiceSection
          title="New and noteworthy"
          services={popularServices}
        />

        <ServiceSection
          title="Most booked services"
          services={[...popularServices].reverse()}
        />

      </main>

      <Footer />

    </div>
  );
}

export default Home;