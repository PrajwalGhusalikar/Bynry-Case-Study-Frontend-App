import React, { useState, useEffect } from "react";
import ProfileForm from "../Components/ProfileForm";
import { FaEdit, FaTrash, FaEye } from "react-icons/fa";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useNavigate } from "react-router-dom";

const AdminPanel = () => {
  const [profiles, setProfiles] = useState([]);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const navigate = useNavigate();
  const [mapVisible, setMapVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const savedProfiles = JSON.parse(localStorage.getItem("profiles")) || [];
    setProfiles(savedProfiles);
  }, []);

  const openModal = (profile = null) => {
    setSelectedProfile(profile);
    setIsEditMode(!!profile);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedProfile(null);
    setIsModalOpen(false);
  };

  const addProfile = (newProfile) => {
    const profileWithId = { ...newProfile, id: Date.now() };
    localStorage.setItem(
      "profiles",
      JSON.stringify([...profiles, profileWithId])
    );
    setProfiles([...profiles, profileWithId]);
    closeModal();
  };

  const updateProfile = (updatedProfile) => {
    const updatedProfiles = profiles.map((profile) =>
      profile.id === updatedProfile.id ? updatedProfile : profile
    );
    setProfiles(updatedProfiles);
    closeModal();
  };

  const deleteProfile = (id) => {
    const updatedProfiles = profiles.filter((profile) => profile.id !== id);
    localStorage.setItem("profiles", JSON.stringify(updatedProfiles));
    setProfiles(updatedProfiles);
  };

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

  useEffect(() => {
    if (mapVisible) {
      initializeMap();
    }
  }, [mapVisible, selectedProfile]);

  return (
    <div className="admin-panel p-6">
      <h1 className="text-xl font-bold">Admin Panel</h1>
      <button
        onClick={() => openModal()}
        className="btn bg-blue-500 text-white mt-4"
      >
        Add Profile
      </button>

      <input
        type="text"
        placeholder="Search profiles..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="border p-2 rounded mt-4"
      />

      <div className="mt-6 overflow-x-auto">
        <table className="min-w-full table-auto border-collapse border border-gray-200">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-gray-300 p-2">Sr No.</th>
              <th className="border border-gray-300 p-2">Profile Img</th>
              <th className="border border-gray-300 p-2">Name</th>
              <th className="border border-gray-300 p-2">Description</th>
              <th className="border border-gray-300 p-2">Address</th>
              <th className="border border-gray-300 p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {profiles.map((profile, index) => (
              <tr key={profile.id} className="border-b items-center">
                <td className="border border-gray-300 p-2">{index + 1}</td>
                <td className="border flex justify-center items-center border-gray-300 p-2">
                  <img
                    src={profile?.imageFile}
                    style={{ height: "70px", width: "70px" }}
                    className=" rounded-full h-20 w-20 border-gray-600"
                    alt=""
                  />
                </td>
                <td className="border border-gray-300 p-2">
                  {" "}
                  {highlightText(profile.name)}
                </td>
                <td className="border border-gray-300 p-2">
                  {profile.description}
                </td>
                <td className="border border-gray-300 p-2">
                  {highlightText(profile.address)}
                </td>
                <td className="border border-gray-300 p-2 mx-auto  space-x-2">
                  <button>
                    <FaEye
                      onClick={() => navigate(`/profile/${profile.id}`)}
                      className="text-blue-500"
                      title="View Profile"
                    />
                  </button>

                  <button onClick={() => openModal(profile)}>
                    <FaEdit className="text-yellow-500" title="Edit Profile" />
                  </button>
                  <button onClick={() => deleteProfile(profile.id)}>
                    <FaTrash className="text-red-500" title="Delete Profile" />
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

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <ProfileForm
              onSubmit={isEditMode ? updateProfile : addProfile}
              profile={selectedProfile}
            />
            <button
              onClick={closeModal}
              className="btn mt-4 bg-red-500 text-white"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
