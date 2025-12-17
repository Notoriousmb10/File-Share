export interface FileItem {
  _id: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  uploadedAt: string;
  isOwner: boolean;
}

export interface ShareResponse {
  shareLink: string;
}

export interface User {
  _id: string;
  name: string;
  email: string;
}

export interface AuthResponse {
  message: string;
  token: string;
  data: User;
  status: number;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
}
