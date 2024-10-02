import React, { useState, useEffect } from "react";

const ProfileForm = ({ onSubmit, profile }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    address: "",
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
    <div className="profile-form mt-6 p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">
        {profile ? "Update Profile" : "Add Profile"}
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
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
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="textarea border border-gray-300 rounded p-2 w-full"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Address</label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            className="input border border-gray-300 rounded p-2 w-full"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Upload Image</label>
          <input
            type="file"
            name="imageFile"
            onChange={handleChange}
            className="input border border-gray-300 rounded p-2 w-full"
            accept="image/*"
          />
        </div>

        {imagePreview && (
          <div className="mb-4">
            <h3 className="text-gray-700 font-bold">Profile Preview:</h3>
            <div className="border border-gray-300 rounded p-2">
              <img
                src={imagePreview}
                alt="Profile Preview"
                className="w-full h-auto rounded"
                style={{ maxHeight: "200px", objectFit: "cover" }}
              />
              <p className="mt-2">
                <strong>Name:</strong> {formData.name}
              </p>
              <p>
                <strong>Description:</strong> {formData.description}
              </p>
              <p>
                <strong>Address:</strong> {formData.address}
              </p>
            </div>
          </div>
        )}

        <button
          type="submit"
          className="btn mt-4 bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          {profile ? "Update Profile" : "Add Profile"}
        </button>
      </form>
    </div>
  );
};

export default ProfileForm;
