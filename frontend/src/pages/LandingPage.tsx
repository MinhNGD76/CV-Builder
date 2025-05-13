import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
            Build Your Professional CV
          </h1>
          <p className="mt-5 max-w-xl mx-auto text-xl text-gray-500">
            Create, edit and share professional CVs with our easy-to-use platform.
            Version tracking, beautiful templates, and real-time editing.
          </p>
          <div className="mt-8 flex justify-center">
            <div className="inline-flex rounded-md shadow">
              <Link
                to="/register"
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                Get started
              </Link>
            </div>
            <div className="ml-3 inline-flex">
              <Link
                to="/login"
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-gray-50"
              >
                Log in
              </Link>
            </div>
          </div>
        </div>
        
        <div className="mt-20">
          <h2 className="text-center text-3xl font-extrabold text-gray-900">
            Key Features
          </h2>
          <div className="mt-10 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-medium text-gray-900">Professional Templates</h3>
                <p className="mt-2 text-base text-gray-500">
                  Choose from a variety of professional templates designed to impress employers.
                </p>
              </div>
            </div>
            
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-medium text-gray-900">Version Control</h3>
                <p className="mt-2 text-base text-gray-500">
                  Track changes and revert to previous versions of your CV at any time.
                </p>
              </div>
            </div>
            
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-medium text-gray-900">Easy Editing</h3>
                <p className="mt-2 text-base text-gray-500">
                  User-friendly interface to create and update your CV with real-time preview.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
