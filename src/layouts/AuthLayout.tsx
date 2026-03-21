import { Outlet } from 'react-router';

export default function AuthLayout() {
  return (
    <>
      {/* Mobile */}
      <div className="md:hidden">
        <Outlet />
      </div>

      {/* Desktop */}
      <div className="hidden md:flex min-h-screen bg-muted/30 items-center justify-center px-8">
        <Outlet />
      </div>
    </>
  );
}