'use client';

export function FooterSection() {
  return (
    <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Product</h4>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li><a href="#" className="hover:text-gray-900 dark:hover:text-white">Features</a></li>
              <li><a href="#" className="hover:text-gray-900 dark:hover:text-white">Pricing</a></li>
              <li><a href="#" className="hover:text-gray-900 dark:hover:text-white">Integrations</a></li>
              <li><a href="#" className="hover:text-gray-900 dark:hover:text-white">Changelog</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li><a href="#" className="hover:text-gray-900 dark:hover:text-white">About</a></li>
              <li><a href="#" className="hover:text-gray-900 dark:hover:text-white">Blog</a></li>
              <li><a href="#" className="hover:text-gray-900 dark:hover:text-white">Careers</a></li>
              <li><a href="#" className="hover:text-gray-900 dark:hover:text-white">Contact</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Resources</h4>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li><a href="#" className="hover:text-gray-900 dark:hover:text-white">Documentation</a></li>
              <li><a href="#" className="hover:text-gray-900 dark:hover:text-white">Help Center</a></li>
              <li><a href="#" className="hover:text-gray-900 dark:hover:text-white">API Reference</a></li>
              <li><a href="#" className="hover:text-gray-900 dark:hover:text-white">Status</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li><a href="#" className="hover:text-gray-900 dark:hover:text-white">Privacy</a></li>
              <li><a href="#" className="hover:text-gray-900 dark:hover:text-white">Terms</a></li>
              <li><a href="#" className="hover:text-gray-900 dark:hover:text-white">Security</a></li>
              <li><a href="#" className="hover:text-gray-900 dark:hover:text-white">GDPR</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-md flex items-center justify-center">
              <span className="text-white font-bold text-xs">S</span>
            </div>
            <span className="text-sm font-semibold text-gray-900 dark:text-white">StudentHub</span>
          </div>
          <p className="text-sm text-gray-500">© {new Date().getFullYear()} StudentHub. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
