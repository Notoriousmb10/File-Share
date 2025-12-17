import React, { useCallback, useState, useRef } from "react";
import { useFileStore } from "../store/useFileStore";
import { FiUploadCloud } from "react-icons/fi";
import { apiClient } from "../api/client";

//The fileupload was majorly written by chatgpt :)
const FileUpload: React.FC = () => {
  const { fetchFiles } = useFileStore();
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [filesToUpload, setFilesToUpload] = useState<File[]>([]);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = useCallback((e: React.DragEvent) => {
    setError(null);
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragging(true);
    } else if (e.type === "dragleave") {
      setIsDragging(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    setError(null);
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      for (const file of e.dataTransfer.files) {
        if (file.size > 1024 * 1024 * 10) {
          setError("File size too large");
          setTimeout(() => setError(null), 3000);
          return;
        }
      }
      setFilesToUpload(Array.from(e.dataTransfer.files));
    }
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      for (const file of e.target.files) {
        if (file.size > 1024 * 1024 * 10) {
          setError("File size too large");
          setTimeout(() => setError(null), 3000);
          return;
        }
      }
      setFilesToUpload(Array.from(e.target.files));
    }
  };

  const handleUpload = async () => {
    if (filesToUpload.length === 0) return;
    setUploading(true);
    setProgress(0);

    const formData = new FormData();
    filesToUpload.forEach((file) => {
      formData.append("files", file);
    });

    try {
      await apiClient.post("/files/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (progressEvent) => {
          const total = progressEvent.total || 1;
          const current = progressEvent.loaded;
          setProgress(Math.round((current / total) * 100));
        },
      });

      setFilesToUpload([]);
      fetchFiles();
    } catch (error) {
      console.error("Upload failed", error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-6">
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
          isDragging
            ? "border-primary bg-primary/5"
            : "border-gray-300 hover:border-primary"
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <div className="flex flex-col items-center justify-center space-y-3">
          <FiUploadCloud className="w-10 h-10 text-primary" />
          <p className="text-text-main font-medium">
            Drag & Drop files here or
            <span className="mx-1 text-primary hover:text-primary-dark font-semibold">
              Browse
            </span>
          </p>
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            multiple
            onChange={handleFileSelect}
          />
          <p className="text-sm text-text-muted">Supports multiple files</p>
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </div>
      </div>

      {filesToUpload.length > 0 && (
        <div className="mt-4 space-y-3">
          <div className="flex justify-between items-center">
            <span className="font-medium text-text-main">
              Selected Files ({filesToUpload.length})
            </span>
            <button
              onClick={() => setFilesToUpload([])}
              className="text-red-500 text-sm hover:underline"
            >
              Clear
            </button>
          </div>
          <ul className="space-y-2 max-h-40 overflow-y-auto">
            {filesToUpload.map((file, idx) => (
              <li
                key={idx}
                className="flex justify-between items-center bg-gray-50 px-3 py-2 rounded text-sm text-text-muted"
              >
                <span className="truncate max-w-xs">{file.name}</span>
                <span className="text-xs">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </span>
              </li>
            ))}
          </ul>
          <div className="pt-2">
            {uploading ? (
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-text-muted">
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                    <span>Uploading...</span>
                  </div>
                  <span>{progress}%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all duration-300 ease-out"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>
            ) : (
              <button
                onClick={handleUpload}
                className="w-full bg-gray-200 text-black cursor-pointer hover:bg-gray-300 py-2 rounded-lg font-medium transition-colors shadow-sm shadow-primary/20"
              >
                Upload Files
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
