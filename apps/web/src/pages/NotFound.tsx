import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background to-primary/5">
      <div className="page-container">
        <div className="mx-auto max-w-md text-center">
          <h1 className="page-title mb-4">404</h1>
          <p className="page-lead mb-4 text-gray-600">Oops! Page not found</p>
          <a href="/" className="text-primary hover:underline">
            Return to Home
          </a>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
