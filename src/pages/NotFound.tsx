
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
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="text-center max-w-md mx-auto">
        <h1 className="text-3xl sm:text-4xl font-bold mb-3 sm:mb-4">404</h1>
        <p className="text-lg sm:text-xl text-gray-600 mb-3 sm:mb-4">Oops! Page not found</p>
        <a 
          href="/" 
          className="text-blue-500 hover:text-blue-700 underline inline-block min-h-[44px] flex items-center justify-center px-4 py-2 rounded"
        >
          Return to Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;
