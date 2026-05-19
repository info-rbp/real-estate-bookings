import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-gray-900" aria-labelledby="footer-heading">
      <div className="mx-auto max-w-7xl px-6 pb-8 pt-16 sm:pt-24 lg:px-8 lg:pt-32">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          <div className="space-y-8">
            <p className="text-sm leading-6 text-gray-300">BookPro: Streamlining property inspections and bookings for real estate professionals.</p>
          </div>
          <div className="mt-16 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold leading-6 text-white">Solutions</h3>
                <ul role="list" className="mt-6 space-y-4">
                  <li><Link to="/pricing" className="text-sm leading-6 text-gray-300 hover:text-white">Pricing</Link></li>
                  <li><Link to="/about" className="text-sm leading-6 text-gray-300 hover:text-white">About</Link></li>
                </ul>
              </div>
              <div className="mt-10 md:mt-0">
                <h3 className="text-sm font-semibold leading-6 text-white">Support</h3>
                <ul role="list" className="mt-6 space-y-4">
                  <li><Link to="/engage-us" className="text-sm leading-6 text-gray-300 hover:text-white">Contact</Link></li>
                  <li><Link to="/terms" className="text-sm leading-6 text-gray-300 hover:text-white">Terms</Link></li>
                  <li><Link to="/privacy" className="text-sm leading-6 text-gray-300 hover:text-white">Privacy</Link></li>
                </ul>
              </div>
            </div>
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold leading-6 text-white">Company</h3>
                <ul role="list" className="mt-6 space-y-4">
                  <li><Link to="/admin/login" className="text-sm leading-6 text-gray-300 hover:text-white">Admin Login</Link></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-16 border-t border-white/10 pt-8 sm:mt-20 lg:mt-24">
          <p className="text-xs leading-5 text-gray-400">&copy; 2024 BookPro Inc. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
