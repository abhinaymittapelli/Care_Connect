function Footer() {
  return (
    <footer className="mt-16 bg-gray-900 text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-12 md:grid-cols-3">

        <div>
          <h2 className="text-2xl font-bold">
            Care<span className="text-blue-400">Connect</span>
          </h2>

          <p className="mt-4 max-w-sm text-sm leading-6 text-gray-400">
            Trusted home services at your doorstep.
            Find reliable professionals for all your
            home service needs.
          </p>
        </div>

        <div>
          <h3 className="font-semibold">
            Company
          </h3>

          <div className="mt-4 space-y-3 text-sm text-gray-400">
            <p className="cursor-pointer hover:text-white">
              About Us
            </p>
            <p className="cursor-pointer hover:text-white">
              Contact
            </p>
            <p className="cursor-pointer hover:text-white">
              Terms & Conditions
            </p>
          </div>
        </div>

        <div>
          <h3 className="font-semibold">
            Services
          </h3>

          <div className="mt-4 space-y-3 text-sm text-gray-400">
            <p>Plumbing</p>
            <p>Electrical</p>
            <p>Cleaning</p>
            <p>AC Repair</p>
          </div>
        </div>

      </div>

      <div className="border-t border-gray-800 py-5 text-center text-sm text-gray-500">
        © 2026 CareConnect. All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;