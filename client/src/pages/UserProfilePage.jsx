import { useState } from 'react';
import { ArrowLeft, Camera, User, Bell, Globe, Lock, HelpCircle, LogOut } from 'lucide-react';
import { Link } from 'react-router-dom';

const UserProfilePage = () => {
  const [profileImage, setProfileImage] = useState(null);
  const [userName, setUserName] = useState('John Doe');
  const [userEmail, setUserEmail] = useState('johndoe@example.com');

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const menuItems = [
    { icon: User, label: 'Account', path: '/profile/account' },
    { icon: Bell, label: 'Notifications', path: '/profile/notifications' },
    { icon: Globe, label: 'Language', path: '/profile/language' },
    { icon: Lock, label: 'Privacy', path: '/profile/privacy' },
    { icon: HelpCircle, label: 'Help & Support', path: '/profile/help' },
    { icon: LogOut, label: 'Logout', path: '/logout' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-gray-600">
            <ArrowLeft size={24} />
          </Link>
          <h1 className="text-lg font-semibold">Profile</h1>
          <div className="w-6" /> {/* Spacer for alignment */}
        </div>
      </div>

      {/* Profile Section */}
      <div className="p-6">
        <div className="flex flex-col items-center">
          <div className="relative">
            <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200">
              {profileImage ? (
                <img 
                  src={profileImage} 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <User size={48} className="text-gray-400" />
                </div>
              )}
            </div>
            <label 
              htmlFor="profile-image"
              className="absolute bottom-0 right-0 bg-blue-500 text-white p-2 rounded-full cursor-pointer hover:bg-blue-600 transition-colors"
            >
              <Camera size={20} />
              <input
                id="profile-image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
          </div>
          
          <div className="mt-4 text-center">
            <h2 className="text-xl font-semibold">{userName}</h2>
            <p className="text-gray-500">{userEmail}</p>
          </div>
        </div>

        {/* Menu Items */}
        <div className="mt-8 space-y-4">
          {menuItems.map((item, index) => (
            <Link
              key={index}
              to={item.path}
              className="flex items-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                <item.icon size={20} className="text-gray-600" />
              </div>
              <span className="ml-4 font-medium">{item.label}</span>
              <div className="ml-auto">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="24" 
                  height="24" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                  className="text-gray-400"
                >
                  <path d="M9 18l6-6-6-6"/>
                </svg>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage; 