import { NavLink, Outlet } from 'react-router-dom';

export default function AppLayout() {
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-800">HBMP Tools</h1>
        </div>
        
        <nav className="flex-1 p-4">
          <div className="mb-6">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
              Tools
            </h2>
            <ul className="space-y-1">
              <li>
                <NavLink
                  to="/tools/docs"
                  className={({ isActive }) =>
                    `block px-4 py-2 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-blue-50 text-blue-700 font-medium'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`
                  }
                >
                  Docs
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/tools/sheets"
                  className={({ isActive }) =>
                    `block px-4 py-2 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-blue-50 text-blue-700 font-medium'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`
                  }
                >
                  Sheets
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/tools/forms"
                  className={({ isActive }) =>
                    `block px-4 py-2 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-blue-50 text-blue-700 font-medium'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`
                  }
                >
                  Forms
                </NavLink>
              </li>
            </ul>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
