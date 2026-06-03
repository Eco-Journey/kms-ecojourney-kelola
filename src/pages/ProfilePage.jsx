import React, { useState } from 'react';
import { Pencil, LogOut, Check, X, User } from 'lucide-react';

export default function ProfilePage({ user, onUpdateUser, onLogout, onNavigate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(user?.name || 'Budi');
  const [editedEmail, setEditedEmail] = useState(user?.email || 'budi@example.com');
  const [editedUsername, setEditedUsername] = useState(user?.username || '@budijagobanget');

  const handleSave = () => {
    onUpdateUser({
      ...user,
      name: editedName,
      email: editedEmail,
      username: editedUsername
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedName(user?.name || 'Budi');
    setEditedEmail(user?.email || 'budi@example.com');
    setEditedUsername(user?.username || '@budijagobanget');
    setIsEditing(false);
  };

  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-kms-gray-bg py-16 px-4 w-full">
      <div className="w-full max-w-lg bg-white rounded-[5px] p-8 md:p-12 shadow-sm border border-gray-200/50 flex flex-col items-center">
        
        {/* Large Avatar */}
        <div className="w-28 h-28 rounded-full bg-[#E5D7FA] flex items-center justify-center border-4 border-[#C084FC]/30 shadow-inner mb-6 relative">
          <User className="w-14 h-14 text-[#6B21A8]" />
        </div>

        {/* User Identity */}
        {isEditing ? (
          <div className="w-full max-w-xs space-y-3 mb-6 text-center">
            <input
              type="text"
              value={editedName}
              onChange={(e) => setEditedName(e.target.value)}
              className="w-full text-center text-xl font-extrabold border-b-2 border-kms-blue-accent pb-1 focus:outline-none"
              placeholder="Name"
            />
            <input
              type="text"
              value={editedUsername}
              onChange={(e) => setEditedUsername(e.target.value)}
              className="w-full text-center text-sm text-gray-500 border-b border-gray-300 pb-1 focus:outline-none"
              placeholder="Username"
            />
          </div>
        ) : (
          <div className="text-center mb-8">
            <h2 className="text-2xl font-extrabold text-gray-900 leading-tight">
              {user?.name || 'Budi'}
            </h2>
            <span className="text-sm text-gray-500 block mt-1">
              {user?.username || '@budijagobanget'}
            </span>
          </div>
        )}

        {/* Profile Attributes Section */}
        <div className="w-full max-w-md space-y-6 mb-10 text-left">
          
          {/* Email Item */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between py-1">
            <span className="text-sm md:text-base font-extrabold text-gray-800 min-w-28 mb-1 sm:mb-0">
              Email:
            </span>
            <div className="flex-1 border-b border-gray-400 pb-1 text-right sm:text-left sm:pl-4">
              {isEditing ? (
                <input
                  type="email"
                  value={editedEmail}
                  onChange={(e) => setEditedEmail(e.target.value)}
                  className="w-full bg-transparent text-sm md:text-base text-gray-700 outline-none"
                />
              ) : (
                <span className="text-sm md:text-base text-gray-700 font-normal">
                  {user?.email || 'budi@example.com'}
                </span>
              )}
            </div>
          </div>

          {/* Password Item */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between py-1">
            <span className="text-sm md:text-base font-extrabold text-gray-800 min-w-28 mb-1 sm:mb-0">
              Password:
            </span>
            <div className="flex-1 border-b border-gray-400 pb-1 text-right sm:text-left sm:pl-4">
              <span className="text-sm md:text-base text-gray-700 font-mono tracking-widest">
                ••••••••
              </span>
            </div>
          </div>

          {/* Role Item */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between py-1">
            <span className="text-sm md:text-base font-extrabold text-gray-800 min-w-28 mb-1 sm:mb-0">
              Role:
            </span>
            <div className="flex-1 border-b border-gray-400 pb-1 text-right sm:text-left sm:pl-4">
              <span className="text-sm md:text-base text-gray-700 font-normal">
                {user?.role || 'Administrator'}
              </span>
            </div>
          </div>

        </div>

        {/* Buttons Action Group */}
        <div className="flex flex-wrap items-center justify-center gap-4">
          {isEditing ? (
            <>
              <button
                onClick={handleSave}
                className="bg-kms-green-dark hover:bg-emerald-800 active:scale-95 text-white text-sm font-semibold px-6 py-2.5 rounded-full shadow-md transition-all duration-200 cursor-pointer flex items-center"
              >
                <Check className="w-4 h-4 mr-2" />
                Simpan
              </button>
              <button
                onClick={handleCancel}
                className="bg-kms-red hover:bg-red-700 active:scale-95 text-white text-sm font-semibold px-6 py-2.5 rounded-full shadow-md transition-all duration-200 cursor-pointer flex items-center"
              >
                <X className="w-4 h-4 mr-2" />
                Batal
              </button>
            </>
          ) : (
            <>
              {/* Edit Profile Button (color #384166) */}
              <button
                onClick={() => setIsEditing(true)}
                className="bg-kms-blue-edit hover:bg-[#2A3152] active:scale-95 text-white text-sm font-semibold px-6 py-2.5 rounded-full shadow-md transition-all duration-200 cursor-pointer flex items-center"
              >
                <Pencil className="w-4 h-4 mr-2" />
                Edit Profile
              </button>
              
              {/* Log Out Button (color #EB3131) */}
              <button
                onClick={onLogout}
                className="bg-kms-red hover:bg-red-700 active:scale-95 text-white text-sm font-semibold px-6 py-2.5 rounded-full shadow-md transition-all duration-200 cursor-pointer flex items-center"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Log Out
              </button>
            </>
          )}
        </div>

      </div>
    </div>
  );
}
