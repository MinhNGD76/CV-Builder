import React, { useEffect, useState } from 'react';

interface ProfileData {
  name: string;
  email: string;
  bio?: string;
}

const Profile: React.FC = () => {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Fetch profile data here
    const fetchProfile = async () => {
      try {
        // Simulate API call
        const response = await fetch('/api/profile'); // Replace with real endpoint
        if (!response.ok) throw new Error('Failed to load profile');
        const data = await response.json();
        setProfile(data);
      } catch (err: any) {
        setError(err.message || 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-white p-6">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-3xl font-bold text-blue-600 mb-6 text-center">My Profile</h2>

        {loading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : error ? (
          <p className="text-center text-red-600">{error}</p>
        ) : (
          profile && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <p className="mt-1 p-3 bg-gray-100 rounded-md">{profile.name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <p className="mt-1 p-3 bg-gray-100 rounded-md">{profile.email}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Bio</label>
                <p className="mt-1 p-3 bg-gray-100 rounded-md">{profile.bio || 'No bio provided.'}</p>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default Profile;
