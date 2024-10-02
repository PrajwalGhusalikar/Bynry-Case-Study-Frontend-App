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
    <div className="container mx-auto p-6 bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 min-h-screen flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
        <h2 className="text-3xl font-bold mb-4 text-center text-gray-800">
          {profile.name}
        </h2>
        <div className="flex items-center mb-4 justify-center">
          {/* Image */}
          {profile.imageFile && (
            <img
              src={profile.imageFile}
              alt={`${profile.name}'s Profile`}
              className="w-40 h-40 rounded-full object-cover mr-4 border-4 border-white shadow-md"
            />
          )}
          <div className="text-left">
            <p className="text-lg mb-1">
              <strong>Address:</strong> {profile.address}
            </p>
            <p className="text-md">
              <strong>Description:</strong> {profile.description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileDetails;
