import React from "react";
import { useAuthStore } from "../store/useAuthStore";
import { FiLogOut } from "react-icons/fi";

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { logout } = useAuthStore();

  return (
    <div className="min-h-screen bg-background text-text-main p-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-primary tracking-tight">
            FileShare
          </h1>
          <button
            onClick={logout}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-text-muted hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Logout"
          >
            <FiLogOut className="text-lg" />
            <span>Logout</span>
          </button>
        </header>
        <main>{children}</main>
      </div>
    </div>
  );
};

export default Layout;
