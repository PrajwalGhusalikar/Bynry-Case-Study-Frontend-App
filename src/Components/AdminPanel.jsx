import React, { useState, useEffect } from "react";
import ProfileForm from "../Components/ProfileForm";
import { FaEdit, FaTrash, FaEye } from "react-icons/fa";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const AdminPanel = () => {
  const [profiles, setProfiles] = useState([]);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [mapVisible, setMapVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [profileToDelete, setProfileToDelete] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchProfiles = async () => {
      setLoading(true);
      try {
        const savedProfiles =
          JSON.parse(localStorage.getItem("profiles")) || [];
        setProfiles(savedProfiles);
      } catch (error) {
        console.error("Error fetching profiles:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfiles();
  }, []);

  useEffect(() => {
    handleCloseMap();
  }, [location.pathname]);

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
    localStorage.setItem("profiles", JSON.stringify([...updatedProfiles]));
    setProfiles(updatedProfiles);
    closeModal();
  };

  const confirmDeleteProfile = (profile) => {
    setProfileToDelete(profile);
    setIsDeleteModalOpen(true);
  };

  const deleteProfile = async () => {
    setLoading(true);
    try {
      const updatedProfiles = profiles.filter(
        (profile) => profile.id !== profileToDelete.id
      );
      localStorage.setItem("profiles", JSON.stringify(updatedProfiles));
      setProfiles(updatedProfiles);
    } catch (error) {
      console.error("Error deleting profile:", error);
    } finally {
      setLoading(false);
      setIsDeleteModalOpen(false);
    }
  };

  const viewProfileDetails = (profile) => {
    setSelectedProfile(profile);
    setMapVisible(true);
  };

  const handleCloseMap = () => {
    setMapVisible(false);
    setSelectedProfile(null);
  };

  const initializeMap = async () => {
    if (selectedProfile) {
      // setLoading(true);
      try {
        const map = L.map("map").setView([51.505, -0.09], 13);
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          maxZoom: 19,
        }).addTo(map);

        const geocodeURL = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          selectedProfile.address
        )}`;

        const response = await axios.get(geocodeURL);
        const data = response.data;
        if (data.length > 0) {
          const { lat, lon } = data[0];
          map.setView([lat, lon], 13);
          L.marker([lat, lon]).addTo(map);
        } else {
          console.error("Address not found");
        }
      } catch (error) {
        console.error("Error fetching geocode:", error);
      } finally {
        setLoading(false);
      }
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
    // eslint-disable-next-line
  }, [mapVisible, selectedProfile]);

  return (
    <div className="admin-panel p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Admin Panel</h1>
        <button
          onClick={() => openModal()}
          className="btn bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition"
        >
          Add Profile
        </button>
      </div>

      <input
        type="text"
        placeholder="Search profiles..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="border p-2 rounded w-full max-w-md mb-6"
      />

      {loading ? (
        <div className="text-center">Loading...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse border border-gray-200 rounded-lg shadow-sm">
            <thead>
              <tr className="bg-indigo-100">
                <th className="border border-gray-300 p-3 text-left">Sr No.</th>
                <th className="border border-gray-300 p-3 text-left">
                  Profile Img
                </th>
                <th className="border border-gray-300 p-3 text-left">Name</th>
                <th className="border border-gray-300 p-3 text-left">Email</th>
                <th className="border text-wrap border-gray-300 p-3 text-left">
                  Description
                </th>
                <th className="border border-gray-300 p-3 text-left">
                  Address
                </th>
                <th className="border border-gray-300 p-3 text-center">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredProfiles.map((profile, index) => (
                <tr key={profile.id} className="border-b items-center">
                  <td className="border border-gray-300 p-3">{index + 1}</td>
                  <td
                    onClick={() => navigate(`/profile/${profile.id}`)}
                    className="border cursor-pointer border-gray-300 flex justify-center items-center p-2"
                  >
                    <img
                      src={profile?.imageFile}
                      className="rounded-full h-16 w-16 object-cover"
                      alt="Profile"
                    />
                  </td>
                  <td className="border border-gray-300 p-3">
                    {highlightText(profile.name)}
                  </td>
                  <td className="border border-gray-300 p-3">
                    {highlightText(profile.email)}
                  </td>
                  <td className="border w-80 text-wrap border-gray-300 p-3">
                    {profile.description}
                  </td>
                  <td className="border border-gray-300 p-3">
                    {highlightText(profile.address)}
                  </td>
                  <td className="border border-gray-300 p-4 text-center space-x-4 text-xl">
                    <button
                      className="text-teal-600"
                      onClick={() => navigate(`/profile/${profile.id}`)}
                    >
                      <FaEye title="View Profile" />
                    </button>
                    <button
                      className="text-yellow-500"
                      onClick={() => openModal(profile)}
                    >
                      <FaEdit title="Edit Profile" />
                    </button>
                    <button
                      className="text-red-500"
                      onClick={() => confirmDeleteProfile(profile)}
                    >
                      <FaTrash title="Delete Profile" />
                    </button>
                    <button
                      className="bg-blue-500 text-white text-base py-1 px-2 rounded hover:bg-blue-600 transition"
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
            <h2 className="text-2xl w-40 md:w-60 font-bold mb-4">
              {selectedProfile.name.split(" ")[0]}'s Location
            </h2>
            <div id="map" className="h-96 w-full"></div>
          </div>
        </div>
      )}

      {/* Profile Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg max-w-xl">
            <ProfileForm
              onSubmit={isEditMode ? updateProfile : addProfile}
              profile={selectedProfile}
              closeModal={closeModal}
            />
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-40">
          <div className="bg-white p-6 rounded shadow-md">
            <h2 className="text-xl font-semibold">Confirm Deletion</h2>
            <p className="mt-2">
              Are you sure you want to delete this profile?
            </p>
            <div className="mt-4 flex justify-end space-x-4">
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded"
                onClick={() => setIsDeleteModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="bg-red-500 text-white px-4 py-2 rounded"
                onClick={deleteProfile}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
