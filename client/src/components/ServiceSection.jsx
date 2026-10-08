import ServiceCard from "./ServiceCard";

function ServiceSection({ title, services }) {
  return (
    <section className="py-10">

      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">
          {title}
        </h2>

        <button className="text-sm font-semibold text-blue-600 hover:underline">
          See all
        </button>
      </div>

      <div className="flex gap-5 overflow-x-auto pb-4 scrollbar-hide">
        {services.map((service) => (
          <ServiceCard
            key={service.id}
            service={service}
          />
        ))}
      </div>

    </section>
  );
}

export default ServiceSection;