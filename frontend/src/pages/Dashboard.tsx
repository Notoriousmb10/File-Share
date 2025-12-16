import React, { useEffect, useState } from 'react';
import { useFileStore } from '../store/useFileStore';
import type { FileItem } from '../types';
import FileUpload from '../components/FileUpload';
import ShareModal from '../components/ShareModal';
import { FiFileText, FiImage, FiVideo, FiEye, FiShare2 } from 'react-icons/fi';
import { format } from 'date-fns';

const Dashboard: React.FC = () => {
  const { files, fetchFiles, isLoading, error } = useFileStore();
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);

  useEffect(() => {
    fetchFiles();
  }, [fetchFiles]);

  const handleShare = (file: FileItem) => {
    setSelectedFile(file);
    setShareModalOpen(true);
  };

  const handleView = (file: FileItem) => {
    if (file.url) {
        window.open(file.url, '_blank');
    } else {
        alert("Preview not available (Mock)");
    }
  };

  const getFileIcon = (type: string) => {
      if (type.startsWith('image')) return <FiImage className="text-purple-500" />;
      if (type.startsWith('video')) return <FiVideo className="text-pink-500" />;
      return <FiFileText className="text-blue-500" />;
  };

  const formatSize = (bytes: number) => {
      if (bytes === 0) return '0 B';
      const k = 1024;
      const sizes = ['B', 'KB', 'MB', 'GB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6 animate-fade-in-up">

      <FileUpload />

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-text-main">Your Files</h2>
        <div className="text-sm text-text-muted">
            {files.length} items
        </div>
      </div>
      
      {error && (
          <div className="p-4 bg-red-50 text-red-600 rounded-lg">{error}</div>
      )}

      {isLoading ? (
        <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
        </div>
      ) : files.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl border border-gray-100 shadow-sm">
          <FiFileText className="mx-auto h-12 w-12 text-gray-300 mb-3" />
          <h3 className="text-lg font-medium text-text-main">No files yet</h3>
          <p className="text-text-muted">Upload your first file to get started.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="min-w-full divide-y divide-gray-100">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-text-muted uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-text-muted uppercase tracking-wider">Size</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-text-muted uppercase tracking-wider">Uploaded</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-text-muted uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {files.map((file) => (
                <tr key={file.id} className="hover:bg-gray-50 transition-colors group">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 rounded-lg bg-gray-50 flex items-center justify-center text-xl">
                        {getFileIcon(file.type)}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-text-main group-hover:text-primary transition-colors">{file.name}</div>
                        <div className="text-xs text-text-muted">{file.type}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-text-muted">
                    {formatSize(file.size)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-text-muted">
                     {}
                    {isNaN(new Date(file.uploadDate).getTime()) ? 'Unknown' : format(new Date(file.uploadDate), 'MMM d, yyyy')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                    <button 
                        onClick={() => handleView(file)}
                        className="text-text-muted hover:text-primary bg-transparent text-lg p-2 rounded-full hover:bg-primary/10 transition-all"
                        title="View"
                    >
                        <FiEye />
                    </button>
                    <button 
                        onClick={() => handleShare(file)}
                        className="text-text-muted hover:text-green-600 bg-transparent text-lg p-2 rounded-full hover:bg-green-50 transition-all"
                        title="Share"
                    >
                        <FiShare2 />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selectedFile && (
          <ShareModal 
            isOpen={shareModalOpen} 
            onClose={() => setShareModalOpen(false)} 
            fileId={selectedFile.id}
            fileName={selectedFile.name}
          />
      )}
    </div>
  );
};

export default Dashboard;
