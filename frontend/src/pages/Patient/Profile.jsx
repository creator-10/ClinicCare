import React, { useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import { assets } from '../assets/assets';

const Profile = () => {
  const auth = useSelector((state) => state.auth);

  const fileInputRef = useRef(null);

  // Initialize userData with safe defaults and fallback values
  const [userData, setUserData] = useState({
    name: auth.userName || auth.name || "",
    image: auth.profilePic || assets.profile_pic,
    email: auth.email || "",
    phone: auth.phone || "",
    address: {
      line1: auth.address?.line1 || "",
      line2: auth.address?.line2 || ""
    },
    gender: auth.gender || "",
    dob: auth.dob || "",
    patientId: auth.patientId || ""
  });

  const [isEdit, setIsEdit] = useState(false);

  // Handle image file selection
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      // Create a preview URL for the selected image
      const imageUrl = URL.createObjectURL(file);
      setUserData(prev => ({ ...prev, image: imageUrl }));
      // Optionally, save file to state if you want to upload later
      // setUserData(prev => ({ ...prev, imageFile: file, image: imageUrl }));
    }
  };

  // Trigger file input click when profile image clicked in edit mode
  const handleImageClick = () => {
    if (isEdit && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className='max-w-lg flex flex-col gap-2 text-sm'>
      {/* Hidden file input */}
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleImageChange}
        style={{ display: 'none' }}
      />

      {/* Profile image clickable in edit mode */}
      <img
        className='w-36 rounded cursor-pointer'
        src={userData.image}
        alt="Profile"
        onClick={handleImageClick}
        title={isEdit ? "Click to change profile picture" : ""}
      />

      {isEdit ? (
        <input
          className='bg-gray-50 text-3xl font-medium max-w-60 mt-4'
          type="text"
          value={userData.name}
          onChange={e => setUserData(prev => ({ ...prev, name: e.target.value }))}
        />
      ) : (
        <p className='font-medium text-3xl text-neutral-800 mt-4'>{userData.name}</p>
      )}

      <hr className='bg-zinc-400 h-[1px] border-none' />
      <p className='text-neutral-500 underline mt-3'>PATIENT INFORMATION</p>
      <p className='font-medium text-gray-700 mt-1'>Patient ID:</p>
      <p className='text-black-400 font-bold'>{userData.patientId}</p>

      <p className='text-neutral-500 underline mt-3'>CONTACT INFORMATION</p>
      <div className='grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3 text-neutral-700'>
        <p className='font-medium'>Email id:</p>
        {isEdit ? (
          <input
            className='bg-gray-100 max-w-52'
            type="text"
            value={userData.email}
            onChange={e => setUserData(prev => ({ ...prev, email: e.target.value }))}
          />
        ) : (
          <p className='text-blue-400'>{auth.email || ""}</p>
        )}

        <p className='font-medium'>Mobile number:</p>
        {isEdit ? (
          <input
            className='bg-gray-100 max-w-52'
            type="text"
            value={userData.phone}
            onChange={e => setUserData(prev => ({ ...prev, phone: e.target.value }))}
          />
        ) : (
          <p className='text-blue-400'>{auth.phone || ""}</p>
        )}

        <p className='font-medium'>Address:</p>
        {isEdit ? (
          <div>
            <input
              className='bg-gray-50'
              value={userData.address.line1}
              onChange={e => setUserData(prev => ({
                ...prev,
                address: { ...prev.address, line1: e.target.value }
              }))}
              type="text"
              placeholder="Line 1"
            />
            <br />
            <input
              className='bg-gray-50 mt-1'
              value={userData.address.line2}
              onChange={e => setUserData(prev => ({
                ...prev,
                address: { ...prev.address, line2: e.target.value }
              }))}
              type="text"
              placeholder="Line 2"
            />
          </div>
        ) : (
          <p className='text-gray-500'>
            {auth.address?.line1 || "N/A"}<br />
            {auth.address?.line2 || ""}
          </p>
        )}
      </div>

      <p className='text-neutral-500 underline mt-3'>BASIC INFORMATION</p>
      <div className='grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3 text-neutral-700'>
        <p className='font-medium'>Gender:</p>
        {isEdit ? (
          <select
            className='max-w-20 bg-gray-100'
            value={userData.gender}
            onChange={e => setUserData(prev => ({ ...prev, gender: e.target.value }))}
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        ) : (
          <p className='text-gray-400'>{auth.gender || "N/A"}</p>
        )}

        <p className='font-medium'>Date of Birth:</p>
        {isEdit ? (
          <input
            className='max-w-28 bg-gray-100'
            type="date"
            value={userData.dob ? userData.dob.split("T")[0] : ""}
            onChange={e => setUserData(prev => ({ ...prev, dob: e.target.value }))}
          />
        ) : (
          <p className='text-gray-400'>
            {auth.dob ? new Date(auth.dob).toLocaleDateString() : "N/A"}
          </p>
        )}
      </div>

      <div className='mt-10'>
        <button
          className='border border-primary text-black px-8 py-2 rounded-full hover:bg-blue-700 transition-all'
          onClick={() => setIsEdit(!isEdit)}
          type="button"
        >
          {isEdit ? "Save Information" : "Edit"}
        </button>
      </div>
    </div>
  );
};

export default Profile;
