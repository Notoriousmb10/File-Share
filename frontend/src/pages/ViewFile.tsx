import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { apiClient } from "../api/client";
import { FiFile } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";

const ViewFile: React.FC = () => {
  const { shareId } = useParams<{ shareId: string }>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();
  const isAuth = useAuthStore((state) => state.isAuthenticated);

  useEffect(() => {
    const fetchFile = async () => {
      try {
        if (!isAuth) {
          if (shareId) {
            localStorage.setItem("redirect", shareId);
          }
          navigate("/login");
          return;
        }
        const response = await apiClient.get(`/view-file/${shareId}`);
        if (response.data && response.data.signedUrl) {
          console.log(response.data, "response.data");
          window.location.href = response.data.signedUrl;
        } else {
          setError("Invalid response from server.");
        }
      } catch (err) {
        setError("Access denied or file not found.");
      } finally {
        setLoading(false);
      }
    };

    if (shareId) {
      fetchFile();
    }
  }, [shareId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center flex-col gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <p className="text-text-muted font-medium">Authorizing access...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center">
          <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <FiFile className="text-red-500 text-2xl" />
          </div>
          <h1 className="text-xl font-bold text-text-main mb-2">
            Access Error
          </h1>
          <p className="text-text-muted mb-6">{error}</p>
          <a
            href="/"
            className="inline-block bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-dark transition-colors"
          >
            Go to Dashboard
          </a>
        </div>
      </div>
    );
  }

  return null;
};

export default ViewFile;
