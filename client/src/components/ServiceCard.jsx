function ServiceCard({ service }) {
  return (
    <div className="min-w-[240px] overflow-hidden rounded-xl border border-gray-200 bg-white transition duration-300 hover:-translate-y-1 hover:shadow-lg">

      <img
        src={service.image}
        alt={service.name}
        className="h-40 w-full object-cover"
      />

      <div className="p-4">

        <h3 className="font-semibold text-gray-900">
          {service.name}
        </h3>

        <div className="mt-2 flex items-center gap-2 text-sm">
          <span className="rounded bg-green-600 px-2 py-0.5 text-xs font-semibold text-white">
            ★ {service.rating}
          </span>

          <span className="text-gray-500">
            ({service.reviews})
          </span>
        </div>

        <div className="mt-3 flex items-center justify-between">
          <p className="font-semibold text-gray-900">
            ₹{service.price}
          </p>

          <button className="rounded-lg border border-blue-600 px-4 py-2 text-sm font-semibold text-blue-600 transition hover:bg-blue-600 hover:text-white">
            Book
          </button>
        </div>

      </div>
    </div>
  );
}

export default ServiceCard;