import React, { useState, useEffect } from "react";
import Modal from "./Modal";
import { apiClient } from "../api/client";
import {
  FiLink,
  FiUser,
  FiCopy,
  FiCheck,
  FiX,
  FiCalendar,
} from "react-icons/fi";
import clsx from "clsx";

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  fileId: string;
  fileName: string;
}

interface User {
  _id: string;
  name: string;
  email: string;
}

type Tab = "users" | "link";

const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  fileId,
  fileName,
}) => {
  const [activeTab, setActiveTab] = useState<Tab>("users");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [shareLink, setShareLink] = useState("");
  const [copied, setCopied] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [fetchingUsers, setFetchingUsers] = useState(false);

  // Expiration states
  const [userExpiresAt, setUserExpiresAt] = useState("");
  const [linkExpiresIn, setLinkExpiresIn] = useState(24);

  useEffect(() => {
    if (isOpen && activeTab === "users") {
      fetchUsers();
    }
  }, [isOpen, activeTab]);

  const fetchUsers = async () => {
    setFetchingUsers(true);
    try {
      const res = await apiClient.get<User[]>("/auth/users");
      setUsers(res.data);
    } catch (error) {
      console.error("Failed to fetch users", error);
    } finally {
      setFetchingUsers(false);
    }
  };

  const handleUserSelect = (userId: string) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const handleShareUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedUsers.length === 0) return;

    setLoading(true);
    setMessage(null);
    try {
      await apiClient.post(`/files/${fileId}/share-users`, {
        users: selectedUsers,
        expiresAt: userExpiresAt || null,
      });
      setMessage({
        type: "success",
        text: `Shared with ${selectedUsers.length} user(s) successfully!`,
      });
      setSelectedUsers([]);
      setUserExpiresAt("");
    } catch (error) {
      setMessage({ type: "error", text: "Failed to share. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateLink = async () => {
    setLoading(true);
    setMessage(null);
    setShareLink("");
    try {
      const res = await apiClient.post<{ shareUrl: string; shareId: string }>(
        `/files/${fileId}/share-link`,
        { expiresInHours: linkExpiresIn }
      );

      const link = res.data.shareUrl;
      setShareLink(link);
    } catch (error) {
      setMessage({ type: "error", text: "Failed to generate link." });
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (shareLink) {
      navigator.clipboard.writeText(shareLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  React.useEffect(() => {
    if (!isOpen) {
      setShareLink("");
      setMessage(null);
      setSelectedUsers([]);
      setUserExpiresAt("");
      setLinkExpiresIn(24);
    }
  }, [isOpen]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Share "${fileName}"`}>
      <div className="flex border-b border-gray-100 mb-4">
        <button
          className={clsx(
            "flex-1 pb-2 text-sm font-medium transition-colors border-b-2",
            activeTab === "users"
              ? "border-primary text-primary"
              : "border-transparent text-text-muted hover:text-text-main"
          )}
          onClick={() => setActiveTab("users")}
        >
          <div className="flex items-center justify-center gap-2">
            <FiUser /> Users
          </div>
        </button>
        <button
          className={clsx(
            "flex-1 pb-2 text-sm font-medium transition-colors border-b-2",
            activeTab === "link"
              ? "border-primary text-primary"
              : "border-transparent text-text-muted hover:text-text-main"
          )}
          onClick={() => setActiveTab("link")}
        >
          <div className="flex items-center justify-center gap-2">
            <FiLink /> Public Link
          </div>
        </button>
      </div>

      {activeTab === "users" ? (
        <form onSubmit={handleShareUser} className="space-y-4">
          <div className="max-h-60 overflow-y-auto border border-gray-200 rounded-lg">
            {fetchingUsers ? (
              <div className="p-4 text-center text-text-muted text-sm">
                Loading users...
              </div>
            ) : users.length === 0 ? (
              <div className="p-4 text-center text-text-muted text-sm">
                No users found.
              </div>
            ) : (
              <ul className="divide-y divide-gray-100">
                {users.map((user) => (
                  <li
                    key={user._id}
                    className={clsx(
                      "flex items-center px-4 py-3 cursor-pointer hover:bg-gray-50 transition-colors",
                      selectedUsers.includes(user._id) && "bg-primary/5"
                    )}
                    onClick={() => handleUserSelect(user._id)}
                  >
                    <input
                      type="checkbox"
                      className="form-checkbox h-4 w-4 text-primary rounded border-gray-300 focus:ring-primary"
                      checked={selectedUsers.includes(user._id)}
                      readOnly
                    />
                    <div className="ml-3">
                      <p className="text-sm font-medium text-text-main">
                        {user.name}
                      </p>
                      <p className="text-xs text-text-muted">{user.email}</p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-text-main mb-1">
              Expiration (Optional)
            </label>
            <div className="relative">
              <FiCalendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="datetime-local"
                className="w-full border border-gray-300 rounded-lg pl-10 pr-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none"
                value={userExpiresAt}
                onChange={(e) => setUserExpiresAt(e.target.value)}
                min={new Date(
                  Date.now() - new Date().getTimezoneOffset() * 60000
                )
                  .toISOString()
                  .slice(0, 16)}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || selectedUsers.length === 0}
            className="w-full bg-primary hover:bg-primary-dark disabled:bg-indigo-300 text-white font-medium py-2 rounded-lg transition-colors"
          >
            {loading ? "Sharing..." : "Share Access"}
          </button>
        </form>
      ) : (
        <div className="space-y-4 text-center">
          <div className="text-left">
            <label className="block text-sm font-medium text-text-main mb-1">
              Link Expiration
            </label>
            <select
              value={linkExpiresIn}
              onChange={(e) => setLinkExpiresIn(Number(e.target.value))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none"
              disabled={!!shareLink}
            >
              <option value={1}>1 Hour</option>
              <option value={24}>24 Hours</option>
              <option value={72}>3 Days</option>
              <option value={168}>7 Days</option>
            </select>
          </div>

          <p className="text-sm text-text-muted">
            Anyone with this link will be able to view this file.
          </p>

          {!shareLink ? (
            <button
              onClick={handleGenerateLink}
              disabled={loading}
              className="w-full bg-gray-100 text-black hover:bg-gray-200 disabled:bg-indigo-300 font-medium py-2 rounded-lg transition-colors"
            >
              {loading ? "Generating..." : "Generate Link"}
            </button>
          ) : (
            <div className="relative">
              <input
                readOnly
                value={shareLink}
                className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-3 pr-10 py-2 text-sm text-text-muted font-mono"
              />
              <button
                onClick={handleCopy}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-gray-400 hover:text-primary transition-colors"
                title="Copy to clipboard"
              >
                {copied ? <FiCheck className="text-green-500" /> : <FiCopy />}
              </button>
            </div>
          )}
        </div>
      )}

      {message && (
        <div
          className={clsx(
            "mt-4 p-3 rounded-lg text-sm flex items-center gap-2",
            message.type === "success"
              ? "bg-green-50 text-green-700"
              : "bg-red-50 text-red-700"
          )}
        >
          {message.type === "success" ? <FiCheck /> : <FiX />}
          {message.text}
        </div>
      )}
    </Modal>
  );
};

export default ShareModal;
