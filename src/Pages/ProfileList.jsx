import React, { useState, useEffect } from "react";
import { FaEye } from "react-icons/fa";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useLocation, useNavigate } from "react-router-dom";

const ProfileList = () => {
  const [profiles, setProfiles] = useState([]);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [mapVisible, setMapVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const savedProfiles = JSON.parse(localStorage.getItem("profiles")) || [];
    setProfiles(savedProfiles);
  }, []);

  useEffect(() => {
    handleCloseMap();
  }, [location.pathname]);

  const viewProfileDetails = (profile) => {
    setSelectedProfile(profile);
    setMapVisible(true);
  };

  const handleCloseMap = () => {
    setMapVisible(false);
    setSelectedProfile(null);
  };

  const initializeMap = () => {
    if (selectedProfile) {
      const map = L.map("map").setView([51.505, -0.09], 13);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
      }).addTo(map);

      const geocodeURL = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        selectedProfile.address
      )}`;

      fetch(geocodeURL)
        .then((response) => response.json())
        .then((data) => {
          if (data.length > 0) {
            const { lat, lon } = data[0];
            map.setView([lat, lon], 13);
            L.marker([lat, lon]).addTo(map);
          } else {
            console.error("Address not found");
          }
        })
        .catch((error) => console.error("Error fetching geocode:", error));
    }
  };

  useEffect(() => {
    if (mapVisible) {
      initializeMap();
    }
    // eslint-disable-next-line
  }, [mapVisible, selectedProfile]);

  const filteredProfiles = profiles.filter(
    (profile) =>
      profile.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      profile.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const highlightText = (text) => {
    const regex = new RegExp(`(${searchQuery})`, "gi");
    return text.split(regex).map((part, index) =>
      part.toLowerCase() === searchQuery.toLowerCase() ? (
        <span key={index} className="bg-yellow-200">
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  return (
    <div className="admin-panel p-6 min-h-screen bg-gradient-to-r from-blue-50 to-blue-200">
      <h1 className="text-3xl font-bold text-blue-700 mb-4">Profile List</h1>

      <input
        type="text"
        placeholder="Search profiles..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="border border-gray-300 p-3 rounded-lg w-full max-w-md mb-6 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
      />

      {filteredProfiles.length === 0 ? (
        <div className="text-center text-red-500 italic mt-8">
          No profiles to show.
          <div className="text-xl mb-1 ">
            {" "}
            <p className="my-2">
              You can create one by navigating to Admin Pannel:
            </p>
            <button
              onClick={() => navigate("/admin")}
              className="p-2 rounded-md bg-blue-500 hover:bg-blue-600 text-white"
            >
              Go To Admin Pannel
            </button>
          </div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse bg-white rounded-lg shadow-md">
            <thead>
              <tr className="bg-blue-100">
                <th className="border p-4 text-blue-700 w-32">Sr. NO.</th>
                <th className="border p-4 text-blue-700 w-32">Profile Image</th>
                <th className="border p-4 text-blue-700">Name</th>
                <th className="border p-4 text-blue-700">Email</th>
                <th className="border p-4 text-blue-700 w-80">Description</th>
                <th className="border p-4 text-blue-700">Address</th>
                <th className="border p-4 text-blue-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProfiles.map((profile, index) => (
                <tr
                  key={profile.id}
                  className="border-b hover:bg-blue-50 transition duration-150"
                >
                  <td className="border p-4 text-center">{index + 1}</td>
                  <td
                    onClick={() => navigate(`/profile/${profile.id}`)}
                    className="border cursor-pointer flex justify-center p-4 text-center"
                  >
                    <img
                      src={profile?.imageFile}
                      style={{ height: "70px", width: "70px" }}
                      className="rounded-full shadow-md"
                      alt="Profile"
                    />
                  </td>
                  <td className="border p-4">{highlightText(profile.name)}</td>
                  <td className="border p-4">{highlightText(profile.email)}</td>
                  <td st className="border p-4 text-wrap">
                    {profile.description}
                  </td>
                  <td className="border p-4">
                    {highlightText(profile.address)}
                  </td>
                  <td className="border p-4 text-center space-x-4 text-xl">
                    <button
                      className="text-teal-600"
                      onClick={() => navigate(`/profile/${profile.id}`)}
                    >
                      <FaEye title="View Profile" />
                    </button>
                    <button
                      className="bg-blue-500 text-white text-base py-1 px-2 rounded hover:bg-blue-600 "
                      onClick={() => viewProfileDetails(profile)}
                    >
                      Summary
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {mapVisible && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 z-50 flex items-center justify-center">
          <div className="relative bg-white rounded shadow-lg p-6 w-11/12 max-w-4xl">
            <button
              className="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded"
              onClick={handleCloseMap}
            >
              Close Map
            </button>
            <h2 className="text-2xl  w-40 md:w-60  font-bold mb-4">
              {selectedProfile.name.split(" ")[0]}'s Location
            </h2>
            <div id="map" className="h-96 w-full"></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileList;
