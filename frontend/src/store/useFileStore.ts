import { create } from 'zustand';
import { apiClient } from '../api/client';
import type { FileItem } from '../types';

interface FileState {
  files: FileItem[];
  isLoading: boolean;
  error: string | null;
  fetchFiles: () => Promise<void>;
  addFile: (file: FileItem) => void;
}

export const useFileStore = create<FileState>((set) => ({
  files: [],
  isLoading: false,
  error: null,
  fetchFiles: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.get<FileItem[]>('/files');
      set({ files: response.data });
    } catch (err: any) {
      set({ error: err.message || 'Failed to fetch files' });
    } finally {
      set({ isLoading: false });
    }
  },
  addFile: (file) => set((state) => ({ files: [file, ...state.files] })),
}));
