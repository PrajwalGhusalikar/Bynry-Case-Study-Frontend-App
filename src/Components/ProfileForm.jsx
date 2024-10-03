import React, { useState, useEffect } from "react";

const ProfileForm = ({ onSubmit, profile, closeModal }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    address: "",
    email: "",
    phone: "",
    interests: "",
    imageFile: "",
  });
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    if (profile) {
      setFormData(profile);
      setImagePreview(profile.imageFile ? profile.imageFile : null);
    } else {
      setFormData({
        name: "",
        description: "",
        address: "",
        email: "",
        phone: "",
        interests: "",
        imageFile: "",
      });
      setImagePreview(null);
    }
  }, [profile]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "imageFile") {
      const file = files[0];

      if (file) {
        const imageUrl = URL.createObjectURL(file);

        setFormData({ ...formData, imageFile: imageUrl });
        setImagePreview(imageUrl);
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className=" relative profile-form p-4  bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">
        {profile ? "Update Profile" : "Add Profile"}
      </h2>
      <form
        onSubmit={handleSubmit}
        className="h-[600px] overflow-y-scroll mb-10"
      >
        <div className=" grid-cols-1 md:grid-cols-2 gap-4">
          <div className=" col-span-2">
            <label className="block text-gray-700 mb-2">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="input border border-gray-300 rounded p-2 w-full"
              required
            />
          </div>
          <div className=" col-span-2">
            <label className="block text-gray-700 mb-2">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="textarea border border-gray-300 rounded p-2 w-full"
              required
            />
          </div>
          <div className=" col-span-2">
            <label className="block text-gray-700 mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="input border border-gray-300 rounded p-2 w-full"
              required
            />
          </div>
          <div className=" ">
            <label className="block text-gray-700 mb-2">City</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="input border border-gray-300 rounded p-2 w-full"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Phone</label>
            <input
              type="number"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="input border border-gray-300 rounded p-2 w-full"
              required
            />
          </div>
          <div className=" col-span-2">
            <label className="block text-gray-700 mb-2">Interests</label>
            <textarea
              name="interests"
              value={formData.interests}
              onChange={handleChange}
              className="textarea border border-gray-300 rounded p-2 w-full"
              required
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-gray-700 mb-2">
              Upload Profile Image
            </label>
            <input
              type="file"
              name="imageFile"
              onChange={handleChange}
              className="input border border-gray-300 rounded p-2 w-full"
              accept="image/*"
            />
          </div>
        </div>

        {imagePreview && (
          <div className="mt-4 flex justify-start items-center">
            <div className="border border-gray-300 rounded p-2">
              <img
                src={imagePreview}
                alt="Profile Preview"
                className="w-24 h-24 rounded"
              />
            </div>
            <div className="ml-4">
              <p>This is the uploaded profile image.</p>
            </div>
          </div>
        )}

        <div className=" absolute bottom-0  right-0 flex space-x-2 justify-end items-center mt-4">
          <button
            onClick={closeModal}
            className="btn bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition"
          >
            Close
          </button>
          <button
            type="submit"
            className="btn bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition"
          >
            {profile ? "Update Profile" : "Add Profile"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileForm;
