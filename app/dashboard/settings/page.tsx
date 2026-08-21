"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { authClient, useSession } from "@/lib/auth-client";
import { User, Lock, Trash2, LogOut, Save, AlertCircle, CheckCircle2, Settings2, Upload } from "lucide-react";
import { useSettingsStore } from "@/components/visual-editor/settings/settingsStore";
import { CustomImageUpload } from "@/components/visual-editor/settings/CustomImageUpload";

export default function SettingsPage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  
  // Profile state
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  
  // Password state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  // Connected Accounts state
  const [accounts, setAccounts] = useState<any[]>([]);

  // Delete account state
  const [deletePassword, setDeletePassword] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  
  // UI state
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error", text: string } | null>(null);

  // IDE Preferences
  const { autoSave, formatOnSave, theme, setAutoSave, setFormatOnSave, setTheme } = useSettingsStore();

  useEffect(() => {
    if (session?.user?.name) {
      setName(session.user.name);
    }
    if (session?.user?.image) {
      setImage(session.user.image);
    }
  }, [session]);

  useEffect(() => {
    // Fetch connected accounts if needed
    async function fetchAccounts() {
      try {
        const { data, error } = await authClient.listAccounts();
        if (data) {
          setAccounts(data);
        }
      } catch (err) {
        console.error("Failed to fetch accounts", err);
      }
    }
    if (session?.user) {
      fetchAccounts();
    }
  }, [session]);

  if (isPending) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-sm font-mono text-[#888888] animate-pulse">Loading settings...</div>
      </div>
    );
  }

  if (!session?.user) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4">
        <div className="text-sm font-bold text-[#171717]">Please sign in to view your settings.</div>
        <button
          onClick={() => router.push("/login")}
          className="px-4 py-2 bg-[#F26A3D] text-white rounded text-xs font-bold"
        >
          Sign In
        </button>
      </div>
    );
  }

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);
    try {
      const { error } = await authClient.updateUser({ name, image: image || undefined });
      if (error) throw new Error(error.message);
      setMessage({ type: "success", text: "Profile updated successfully." });
    } catch (err: any) {
      setMessage({ type: "error", text: err.message || "Failed to update profile." });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setMessage({ type: "error", text: "New passwords do not match." });
      return;
    }
    if (newPassword.length < 8) {
      setMessage({ type: "error", text: "Password must be at least 8 characters long." });
      return;
    }
    setIsLoading(true);
    setMessage(null);
    try {
      const { error } = await authClient.changePassword({
        newPassword,
        currentPassword,
        revokeOtherSessions: true,
      });
      if (error) throw new Error(error.message);
      setMessage({ type: "success", text: "Password changed successfully." });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      setMessage({ type: "error", text: err.message || "Failed to change password." });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRevokeSessions = async () => {
    if (!confirm("Are you sure you want to sign out of all other devices?")) return;
    setIsLoading(true);
    setMessage(null);
    try {
      const { error } = await authClient.revokeOtherSessions();
      if (error) throw new Error(error.message);
      setMessage({ type: "success", text: "Signed out of all other devices." });
    } catch (err: any) {
      setMessage({ type: "error", text: err.message || "Failed to revoke sessions." });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!deletePassword) {
      setMessage({ type: "error", text: "Password is required to delete account." });
      return;
    }
    setIsLoading(true);
    setMessage(null);
    try {
      const { error } = await authClient.deleteUser({ password: deletePassword });
      if (error) throw new Error(error.message);
      // Account deleted, redirect to login
      router.push("/login");
    } catch (err: any) {
      setMessage({ type: "error", text: err.message || "Failed to delete account." });
      setIsDeleteModalOpen(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto pb-12">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#171717] mb-2">Account Settings</h1>
        <p className="text-sm text-[#888888]">Manage your profile, security, and account preferences.</p>
      </div>

      {message && (
        <div
          className={`mb-6 p-4 rounded flex items-center gap-3 text-sm font-bold ${
            message.type === "success"
              ? "bg-[#287A52]/10 text-[#287A52] border border-[#287A52]/20"
              : "bg-[#C94A45]/10 text-[#C94A45] border border-[#C94A45]/20"
          }`}
        >
          {message.type === "success" ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
          {message.text}
        </div>
      )}

      {/* Profile Section */}
      <section className="bg-white border border-[#D8D4CC] rounded-lg p-6 mb-6 shadow-sm">
        <div className="flex items-center gap-2 mb-4 border-b border-[#F4F1EA] pb-2">
          <User size={18} className="text-[#F26A3D]" />
          <h2 className="text-lg font-bold text-[#171717]">Profile Details</h2>
        </div>
        
        <form onSubmit={handleUpdateProfile} className="space-y-6 max-w-md">
          {/* Professional Avatar Section */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
            <div className="relative group rounded-full shrink-0">
              {image ? (
                <img src={image} alt="Avatar Preview" className="w-20 h-20 rounded-full object-cover border border-[#D8D4CC] shadow-sm" />
              ) : (
                <div className="w-20 h-20 rounded-full bg-[#F4F1EA] border border-[#D8D4CC] flex items-center justify-center shadow-sm">
                  <User size={32} className="text-[#888888]" />
                </div>
              )}
            </div>
            
            <div>
              <h3 className="text-sm font-bold text-[#171717] mb-1">Profile Picture</h3>
              <p className="text-xs text-[#888888] mb-3">Square image recommended. Max 2MB.</p>
              <CustomImageUpload
                currentImage={image || ""}
                onUploadSuccess={async (newUrl: string) => {
                  setImage(newUrl);
                  setIsLoading(true);
                  try {
                    const { error } = await authClient.updateUser({ image: newUrl });
                    if (error) throw new Error(error.message);
                    setMessage({ type: "success", text: "Profile picture updated successfully!" });
                    // Force a hard reload to ensure the navbar fetches the new session avatar
                    window.location.reload();
                  } catch (err: any) {
                    setMessage({ type: "error", text: err.message || "Failed to save profile picture." });
                    setIsLoading(false);
                  }
                }}
              />
            </div>
          </div>

          <div className="space-y-4 pt-2 border-t border-[#F4F1EA]">
            <div>
              <label className="block text-xs font-bold text-[#555555] mb-1">Email Address</label>
              <input
                type="text"
                value={session.user.email}
                disabled
                className="w-full p-2 bg-[#F4F1EA] border border-[#D8D4CC] rounded text-sm text-[#888888] cursor-not-allowed"
              />
              <p className="text-[10px] text-[#888888] mt-1">Email cannot be changed currently.</p>
            </div>
            <div>
              <label className="block text-xs font-bold text-[#555555] mb-1">Display Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Developer"
                required
                className="w-full p-2 bg-white border border-[#D8D4CC] shadow-sm rounded text-sm text-[#171717] focus:outline-none focus:border-[#F26A3D]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading || (name === session.user.name && image === (session.user.image || ""))}
            className="flex items-center gap-2 px-4 py-2 bg-[#F26A3D] text-white rounded shadow-sm text-xs font-bold hover:bg-[#E0592C] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save size={14} />
            Save Profile
          </button>
        </form>
      </section>

      {/* IDE Preferences Section */}
      <section className="bg-white border border-[#D8D4CC] rounded-lg p-6 mb-6 shadow-sm">
        <div className="flex items-center gap-2 mb-4 border-b border-[#F4F1EA] pb-2">
          <Settings2 size={18} className="text-[#F26A3D]" />
          <h2 className="text-lg font-bold text-[#171717]">IDE Preferences</h2>
        </div>
        
        <div className="space-y-6 max-w-md">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-[#171717]">Auto Save</h3>
              <p className="text-[10px] text-[#888888]">Automatically save your projects while typing.</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" checked={autoSave} onChange={(e) => setAutoSave(e.target.checked)} className="sr-only peer" />
              <div className="w-9 h-5 bg-[#D8D4CC] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#287A52]"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-[#171717]">Format on Save</h3>
              <p className="text-[10px] text-[#888888]">Automatically format code when saving.</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" checked={formatOnSave} onChange={(e) => setFormatOnSave(e.target.checked)} className="sr-only peer" />
              <div className="w-9 h-5 bg-[#D8D4CC] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#287A52]"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-[#171717]">Theme</h3>
              <p className="text-[10px] text-[#888888]">Choose your preferred editor theme.</p>
            </div>
            <select
              value={theme}
              onChange={(e) => setTheme(e.target.value as "light" | "dark")}
              className="p-1.5 bg-white border border-[#D8D4CC] rounded text-xs text-[#171717] focus:outline-none focus:border-[#F26A3D]"
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
          </div>
        </div>
      </section>

      {/* Security Section */}
      <section className="bg-white border border-[#D8D4CC] rounded-lg p-6 mb-6 shadow-sm">
        <div className="flex items-center gap-2 mb-4 border-b border-[#F4F1EA] pb-2">
          <Lock size={18} className="text-[#F26A3D]" />
          <h2 className="text-lg font-bold text-[#171717]">Security & Password</h2>
        </div>
        
        <form onSubmit={handleChangePassword} className="space-y-4 max-w-md mb-8">
          <div>
            <label className="block text-xs font-bold text-[#555555] mb-1">Current Password</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
              className="w-full p-2 bg-white border border-[#D8D4CC] rounded text-sm text-[#171717] focus:outline-none focus:border-[#F26A3D]"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-[#555555] mb-1">New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              className="w-full p-2 bg-white border border-[#D8D4CC] rounded text-sm text-[#171717] focus:outline-none focus:border-[#F26A3D]"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-[#555555] mb-1">Confirm New Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full p-2 bg-white border border-[#D8D4CC] rounded text-sm text-[#171717] focus:outline-none focus:border-[#F26A3D]"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading || !currentPassword || !newPassword || !confirmPassword}
            className="flex items-center gap-2 px-4 py-2 bg-[#171717] text-white rounded text-xs font-bold hover:bg-[#333] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Update Password
          </button>
        </form>

        <div className="border-t border-[#F4F1EA] pt-6 mb-8">
          <h3 className="text-sm font-bold text-[#171717] mb-2">Connected Accounts</h3>
          <p className="text-xs text-[#888888] mb-4 max-w-lg">
            Social accounts linked to your TeachFlow profile.
          </p>
          {accounts.length > 0 ? (
            <div className="space-y-2 max-w-md">
              {accounts.map((acc, index) => (
                <div key={index} className="flex items-center justify-between p-3 border border-[#D8D4CC] rounded bg-[#FAF9F5]">
                  <div className="flex flex-col">
                    <span className="text-sm font-bold capitalize text-[#171717]">{acc.provider}</span>
                    <span className="text-xs text-[#888888]">Linked Account</span>
                  </div>
                  <CheckCircle2 size={16} className="text-[#287A52]" />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-sm text-[#888888] italic">No social accounts connected.</div>
          )}
        </div>

        <div className="border-t border-[#F4F1EA] pt-6">
          <h3 className="text-sm font-bold text-[#171717] mb-2">Active Sessions</h3>
          <p className="text-xs text-[#888888] mb-4 max-w-lg">
            If you noticed suspicious activity or logged in on a public device and forgot to log out, you can revoke all other sessions.
          </p>
          <button
            onClick={handleRevokeSessions}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 bg-transparent border border-[#D8D4CC] text-[#555555] rounded text-xs font-bold hover:bg-[#F4F1EA] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <LogOut size={14} />
            Sign Out of All Other Devices
          </button>
        </div>
      </section>

      {/* Danger Zone */}
      <section className="bg-[#FCF5F5] border border-[#F2D6D6] rounded-lg p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-4 border-b border-[#F2D6D6] pb-2">
          <Trash2 size={18} className="text-[#C94A45]" />
          <h2 className="text-lg font-bold text-[#C94A45]">Danger Zone</h2>
        </div>
        <p className="text-xs text-[#C94A45] mb-4 max-w-lg">
          Once you delete your account, there is no going back. All of your projects, collections, and progress will be permanently deleted. Please be certain.
        </p>
        
        {!isDeleteModalOpen ? (
          <button
            onClick={() => setIsDeleteModalOpen(true)}
            className="px-4 py-2 bg-[#C94A45] text-white rounded text-xs font-bold hover:bg-[#A63A36] transition-colors"
          >
            Delete Account
          </button>
        ) : (
          <div className="bg-white p-4 border border-[#F2D6D6] rounded mt-4 max-w-md">
            <h4 className="text-sm font-bold text-[#171717] mb-2">Are you absolutely sure?</h4>
            <p className="text-xs text-[#888888] mb-4">Please type your password to confirm account deletion.</p>
            <form onSubmit={handleDeleteAccount}>
              <input
                type="password"
                value={deletePassword}
                onChange={(e) => setDeletePassword(e.target.value)}
                placeholder="Enter password"
                required
                className="w-full p-2 bg-[#FAF9F5] border border-[#D8D4CC] rounded text-sm text-[#171717] focus:outline-none focus:border-[#C94A45] mb-4"
              />
              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <button
                  type="submit"
                  disabled={isLoading || !deletePassword}
                  className="px-4 py-2 bg-[#C94A45] text-white rounded text-xs font-bold hover:bg-[#A63A36] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Yes, Delete My Account
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsDeleteModalOpen(false);
                    setDeletePassword("");
                  }}
                  className="px-4 py-2 bg-transparent text-[#555555] border border-[#D8D4CC] sm:border-none rounded text-xs font-bold hover:bg-[#F4F1EA] transition-colors text-center"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}
      </section>
    </div>
  );
}
