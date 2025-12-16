import React, { useState } from 'react';
import Modal from './Modal';
import { apiClient } from '../api/client';
import { FiLink, FiUser, FiCopy, FiCheck, FiX } from 'react-icons/fi';
import clsx from 'clsx';

interface ShareModalProps {
    isOpen: boolean;
    onClose: () => void;
    fileId: string;
    fileName: string;
}

type Tab = 'users' | 'link';

const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, fileId, fileName }) => {
    const [activeTab, setActiveTab] = useState<Tab>('users');
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const [shareLink, setShareLink] = useState('');
    const [copied, setCopied] = useState(false);

    const handleShareUser = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);
        try {
            await apiClient.post(`/files/${fileId}/share-users`, { email }); 
            setMessage({ type: 'success', text: `Shared with ${email} successfully!` });
            setEmail('');
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to share. Please try again.' });
        } finally {
            setLoading(false);
        }
    };

    const handleGenerateLink = async () => {
        setLoading(true);
        setMessage(null);
        setShareLink('');
        try {
            const res = await apiClient.post<{ link: string; shareId: string }>(`/files/${fileId}/share-link`);
            
            
             const link = res.data.link || `${window.location.origin}/view-file/${res.data.shareId}`;
            setShareLink(link);
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to generate link.' });
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
        if(!isOpen) {
            setShareLink('');
            setMessage(null);
            setEmail('');
        }
    }, [isOpen]);

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={`Share "${fileName}"`}>
            <div className="flex border-b border-gray-100 mb-4">
                <button
                    className={clsx(
                        "flex-1 pb-2 text-sm font-medium transition-colors border-b-2",
                        activeTab === 'users' ? "border-primary text-primary" : "border-transparent text-text-muted hover:text-text-main"
                    )}
                    onClick={() => setActiveTab('users')}
                >
                    <div className="flex items-center justify-center gap-2"><FiUser /> Users</div>
                </button>
                <button
                    className={clsx(
                        "flex-1 pb-2 text-sm font-medium transition-colors border-b-2",
                        activeTab === 'link' ? "border-primary text-primary" : "border-transparent text-text-muted hover:text-text-main"
                    )}
                    onClick={() => setActiveTab('link')}
                >
                    <div className="flex items-center justify-center gap-2"><FiLink /> Public Link</div>
                </button>
            </div>

            {activeTab === 'users' ? (
                <form onSubmit={handleShareUser} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-text-main mb-1">Email or Username</label>
                        <input
                            type="text" 
                            required
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                            placeholder="user@example.com"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading || !email}
                        className="w-full bg-primary hover:bg-primary-dark disabled:bg-indigo-300 text-white font-medium py-2 rounded-lg transition-colors"
                    >
                        {loading ? 'Sharing...' : 'Share Access'}
                    </button>
                </form>
            ) : (
                <div className="space-y-4 text-center">
                    <p className="text-sm text-text-muted">Anyone with this link will be able to view this file.</p>
                    
                    {!shareLink ? (
                        <button
                            onClick={handleGenerateLink}
                            disabled={loading}
                            className="w-full bg-primary hover:bg-primary-dark disabled:bg-indigo-300 text-white font-medium py-2 rounded-lg transition-colors"
                        >
                            {loading ? 'Generating...' : 'Generate Link'}
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
                <div className={clsx(
                    "mt-4 p-3 rounded-lg text-sm flex items-center gap-2",
                    message.type === 'success' ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
                )}>
                    {message.type === 'success' ? <FiCheck /> : <FiX />}
                    {message.text}
                </div>
            )}
        </Modal>
    );
};

export default ShareModal;
