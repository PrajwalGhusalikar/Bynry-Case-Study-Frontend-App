import React, { useState, useEffect } from "react";
import { FaEye } from "react-icons/fa";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useNavigate } from "react-router-dom";

const ProfileList = () => {
  const [profiles, setProfiles] = useState([]);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [mapVisible, setMapVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const savedProfiles = JSON.parse(localStorage.getItem("profiles")) || [];
    setProfiles(savedProfiles);
  }, []);

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
    <div className="admin-panel p-6">
      <h1 className="text-xl font-bold">Profile list</h1>

      <input
        type="text"
        placeholder="Search profiles..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="border p-2 rounded mt-4"
      />

      <div className="mt-6 overflow-x-auto">
        <table className="min-w-full border-collapse border border-gray-200">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-gray-300 p-2">Sr. NO.</th>
              <th className="border border-gray-300 p-2">Profile Img</th>
              <th className="border border-gray-300 p-2">Name</th>
              <th className="border border-gray-300 p-2">Description</th>
              <th className="border border-gray-300 p-2">Address</th>
              <th className="border border-gray-300 p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProfiles.map((profile, index) => (
              <tr key={profile.id} className="border-b">
                <td className="border border-gray-300 p-2">{index + 1}</td>
                <td className="border flex justify-center items-center border-gray-300 p-2">
                  <img
                    src={profile?.imageFile}
                    style={{ height: "70px", width: "70px" }}
                    className="rounded-full h-20 w-20 border-gray-600"
                    alt=""
                  />
                </td>
                <td className="border border-gray-300 p-2">
                  {highlightText(profile.name)}
                </td>
                <td className="border border-gray-300 p-2">
                  {profile.description}
                </td>
                <td className="border border-gray-300 p-2">
                  {highlightText(profile.address)}
                </td>
                <td className="border border-gray-300 p-2 mx-auto  space-x-4">
                  <button>
                    <FaEye
                      onClick={() => navigate(`/profile/${profile.id}`)}
                      className="text-blue-500"
                      title="View Profile"
                    />
                  </button>
                  <button
                    className=" bg-blue-500 p-2 rounded-md text-white hover:bg-blue-600 mx-2"
                    onClick={() => viewProfileDetails(profile)}
                  >
                    <p>Summary </p>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {mapVisible && (
          <div className="fixed top-0 left-0 w-full h-full bg-white z-50">
            <button
              className="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded"
              onClick={handleCloseMap}
            >
              Close Map
            </button>
            <h2 className="text-lg font-bold p-4">
              Location for {selectedProfile.name}
            </h2>
            <div id="map" style={{ height: "400px", width: "100%" }} />
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileList;
