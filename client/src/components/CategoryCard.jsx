function CategoryCard({ category }) {
  return (
    <div className="group w-[140px] shrink-0 cursor-pointer">

      <div className="h-[130px] w-[140px] overflow-hidden rounded-xl bg-gray-100">

        <img
          src={category.image}
          alt={category.name}
          className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
        />

      </div>

      <p className="mt-3 text-center text-sm font-medium text-gray-800">
        {category.name}
      </p>

    </div>
  );
}

export default CategoryCard;