import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const ProfileDetails = () => {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const storedProfiles = JSON.parse(localStorage.getItem("profiles"));
    if (storedProfiles) {
      const foundProfile = storedProfiles.find(
        (profile) => profile.id === parseInt(id)
      );

      if (foundProfile) {
        setProfile(foundProfile);
        setLoading(false);
      } else {
        setError("Profile not found");
        setLoading(false);
      }
    } else {
      setError("No profiles found in storage");
      setLoading(false);
    }
  }, [id]);

  if (loading)
    return <div className="text-center mt-10">Loading profile details...</div>;
  if (error)
    return <div className="text-center mt-10 text-red-500">{error}</div>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-gray-900 via-purple-900 to-black p-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 max-w-xl w-full sm:flex sm:flex-col sm:items-center">
        {/* Profile Image */}
        <div className="flex flex-col items-center">
          {profile.imageFile && (
            <img
              src={profile.imageFile}
              alt={`${profile.name}'s Profile`}
              className="w-40 h-40 rounded-full object-cover border-4 border-white shadow-lg mb-4"
            />
          )}

          {/* Profile Name */}
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 text-center mb-2">
            {profile.name}
          </h2>
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 text-center mb-2">
            {profile.email}
          </h2>

          <h2 className="text-lg text-gray-600 dark:text-gray-300 mb-2">
            <strong>Interests:</strong> {profile.interests}
          </h2>

          <div className="w-full text-center">
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-2">
              <strong>Address:</strong> {profile.address}
            </p>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              <strong>Description:</strong> {profile.description}
            </p>
          </div>
        </div>

        <div className="mt-6 flex justify-center space-x-4">
          <p className="bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300">
            Contact No.: {profile.phone}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProfileDetails;
