import React, { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { assets } from '../../assets/assets';
import { fetchUserProfile, setProfilePic } from '../../redux/slices/profileSlice';

const Profile = () => {
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);
  const profile = useSelector((state) => state.profile.userProfile);
  const profilePic = useSelector((state) => state.profile.profilePic);
  const fileInputRef = useRef(null);

  const user = auth.user || {};

  
  const [userData, setUserData] = useState({
    name: user.username || user.name || '',
    email: user.email || '',
    gender: user.gender || '',
    patientId: user.patientId || '',
    image: profilePic || assets.profile_pic,
    phone: '',
    address: { line1: '', line2: '' },
    dob: '',
  });
  const [isEdit, setIsEdit] = useState(false);

 
  useEffect(() => {
    if (user.patientId) {
      dispatch(fetchUserProfile(user.patientId));
    }
  }, [user.patientId, dispatch]);

  useEffect(() => {
    if (profile) {
      setUserData((prev) => ({
        ...prev,
        phone: profile.phone || '',
        address: {
          line1: profile.address?.line1 || '',
          line2: profile.address?.line2 || '',
        },
        dob: profile.dob || '',
        // Use backend image if available, otherwise use profilePic from Redux state (which falls back to default)
        image: profile.image || profilePic || assets.profile_pic,
      }));
    } else {
      // If no backend profile loaded yet, ensure userData image follows Redux profilePic
      setUserData((prev) => ({
        ...prev,
        image: profilePic || assets.profile_pic,
      }));
    }
  }, [profile, profilePic]);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUserData((prev) => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageClick = () => {
    if (isEdit && fileInputRef.current) fileInputRef.current.click();
  };

  const handleSave = async () => {
  const patientId = userData.patientId;
  if (!patientId) {
    alert('Missing Patient ID');
    return;
  }

  const payload = {
    patientId,
    phone: userData.phone,
    address: userData.address,
    dob: userData.dob,
    image: userData.image,
  };

  try {
    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/profile/update`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (res.ok) {
      dispatch(fetchUserProfile(patientId));
      dispatch(setProfilePic(data.image || userData.image));
      setIsEdit(false);
      alert('Profile saved successfully!');
    } else {
      alert(data.error || 'Update failed');
    }
  } catch (error) {
    console.error(error);
    alert('Error saving profile');
  }
};


  return (
    <div className="flex min-h-full bg-gray-50">
      {/* <PatientSidebar /> */}
      <main
        className="flex-1 p-8"
        style={{
          backgroundImage: `url(${assets.profileback})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          minHeight: '100vh',
        }}
      >
        <div className="max-w-lg mx-auto flex flex-col gap-4 text-sm bg-white bg-opacity-80 p-6 rounded-md shadow-md">
          <input
            type="file"
            hidden
            accept="image/*"
            ref={fileInputRef}
            onChange={handleImageChange}
          />
          <div className="w-fit mx-auto">
            <img
              src={userData.image}
              alt="Profile"
              className="w-36 h-36 rounded-full border cursor-pointer hover:opacity-80 mr-[150px]"
              onClick={handleImageClick}
              title={isEdit ? 'Click to change' : undefined}
            />
          </div>

          <div>
            <p className="text-4xl font-medium mb-2">{userData.name}</p>
            <label className="text-1xl font-medium mb-1">Patient-Id</label>
            <p>{userData.patientId}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-medium">Email</label>
              <p className="text-blue-900">{userData.email}</p>
            </div>

            <div>
              <label className="font-medium">Gender</label>
              <p>{userData.gender}</p>
            </div>

            <div>
              <label className="font-medium">Mobile No. </label>
              {isEdit ? (
                <input
                  type="text"
                  maxLength={10}
                  className="mt-1 p-1 border rounded w-full"
                  value={userData.phone}
                  onChange={(e) => {
                    const v = e.target.value;
                    if (/^\d*$/.test(v)) setUserData((prev) => ({ ...prev, phone: v }));
                  }}
                />
              ) : (
                <p>{userData.phone || 'N/A'}</p>
              )}
            </div>

            <div>
              <label className="font-medium">Date of Birth</label>
              {isEdit ? (
                <input
                  type="date"
                  className="mt-1 p-1 border rounded"
                  value={userData.dob?.split('T')[0] || ''}
                  onChange={(e) => setUserData((prev) => ({ ...prev, dob: e.target.value }))}
                />
              ) : (
                <p>{userData.dob ? new Date(userData.dob).toLocaleDateString() : 'N/A'}</p>
              )}
            </div>

            <div className="sm:col-span-2">
              <label className="font-medium">Address</label>
              {isEdit ? (
                <>
                  <input
                    className="mt-1 p-1 border rounded w-full"
                    placeholder="Line 1"
                    value={userData.address.line1}
                    onChange={(e) =>
                      setUserData((prev) => ({
                        ...prev,
                        address: { ...prev.address, line1: e.target.value },
                      }))
                    }
                  />
                  <input
                    className="mt-1 p-1 border rounded w-full"
                    placeholder="Line 2"
                    value={userData.address.line2}
                    onChange={(e) =>
                      setUserData((prev) => ({
                        ...prev,
                        address: { ...prev.address, line2: e.target.value },
                      }))
                    }
                  />
                </>
              ) : (
                <p>
                  {userData.address.line1 || 'N/A'}
                  {userData.address.line2 ? (
                    <>
                      <br />
                      {userData.address.line2}
                    </>
                  ) : null}
                </p>
              )}
            </div>
          </div>

          <div className="mt-6 text-center">
            <button
              onClick={isEdit ? handleSave : () => setIsEdit(true)}
              className="px-6 py-2 border rounded-full bg-blue-100 hover:bg-blue-200"
            >
              {isEdit ? 'Save Changes' : 'Edit Profile'}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;
