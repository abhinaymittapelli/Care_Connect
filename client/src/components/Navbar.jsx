import { useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white">
      <div className="mx-auto flex h-20 w-full max-w-7xl items-center justify-between px-6">

        {/* Logo */}
        <button
          onClick={() => navigate("/")}
          className="shrink-0 text-2xl font-bold tracking-tight"
        >
          <span className="text-gray-900">Care</span>
          <span className="text-blue-600">Connect</span>
        </button>

        {/* Location */}
        <button className="hidden items-center gap-2 md:flex">
          <span className="text-lg">📍</span>

          <div className="text-left">
            <p className="text-xs text-gray-400">
              Location
            </p>

            <p className="text-sm font-medium text-gray-800">
              Hyderabad
            </p>
          </div>
        </button>

        {/* Search */}
        <div className="mx-8 hidden max-w-md flex-1 md:block">
          <div className="flex items-center rounded-lg border border-gray-300 bg-gray-50 px-4 py-2.5">
            <span className="mr-3 text-gray-400">
              🔍
            </span>

            <input
              type="text"
              placeholder="Search for services"
              className="w-full bg-transparent text-sm text-gray-800 outline-none placeholder:text-gray-400"
            />
          </div>
        </div>

     {/* Right side */}
<div className="flex shrink-0 items-center gap-3">

  {token && user ? (
    <>
      {/* Profile */}
      <button
        onClick={() => navigate("/dashboard")}
        className="flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-800 transition hover:bg-gray-50"
      >
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-600">
          {user.name?.charAt(0).toUpperCase()}
        </span>

        <span className="hidden sm:block">
          {user.name}
        </span>
      </button>

      {/* Logout */}
      <button
        onClick={() => {
          localStorage.removeItem("token");
          localStorage.removeItem("user");

          navigate("/login");
        }}
        className="rounded-lg px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
      >
        Logout
      </button>
    </>
  ) : (
    /* Login */
    <button
      onClick={() => navigate("/login")}
      className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-800 transition hover:bg-gray-50"
    >
      Login
    </button>
  )}

</div>
      </div>
    </nav>
  );
}

export default Navbar;