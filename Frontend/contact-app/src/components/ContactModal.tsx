import { useState, useEffect, useRef } from 'react';
import type { Contact } from '../types/Contact';
import './ContactModal.css';
import addIcon from '../assets/icons/Add.svg';
import deleteIcon from '../assets/icons/Delete.svg';
import changeIcon from '../assets/icons/Change.svg';
import profilePicIcon from '../assets/images/Default.jpg';

const API_BASE_URL = 'http://localhost:5271';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (contactData: Omit<Contact, 'id'>) => void;
  initialData?: Contact | null; 
}

export default function ContactModal({ isOpen, onClose, onSave, initialData }: Props) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');

  const [profilePicUrl, setProfilePicUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && initialData) {
      setName(initialData.name);
      setPhone(initialData.phone || '');
      setEmail(initialData.email || '');
      setProfilePicUrl(initialData.profilePicUrl || null);
    } else if (isOpen && !initialData) {
      setName('');
      setPhone('');
      setEmail('');
      setProfilePicUrl(null);
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleDone = () => {
    if (name.trim() === '') return;
    onSave({ name, phone, email, profilePicUrl: profilePicUrl || undefined });
  };

  const handleCancel = () => {
    onClose();
  };

  const handleAddPictureClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(`${API_BASE_URL}/api/contacts/upload-image`, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setProfilePicUrl(data.url); 
      } else {
        console.error("Nem sikerült a kép feltöltése.");
      }
    } catch (error) {
      console.error("Hiba a kép feltöltésekor:", error);
    }
  };

  const handleDeletePicture = async () => {
    if (!profilePicUrl) return;

    try {
      const response = await fetch(`${API_BASE_URL}/api/contacts/delete-image?url=${encodeURIComponent(profilePicUrl)}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setProfilePicUrl(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error("Hiba a kép törlésekor:", error);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2 className="modal-title">{initialData ? 'Edit contact' : 'Add contact'}</h2>

        <input 
          type="file" 
          ref={fileInputRef} 
          style={{ display: 'none' }} 
          accept="image/jpeg, image/png, image/svg+xml" 
          onChange={handleFileChange} 
        />
        
        <div className="picture-row">
          <img 
            src={profilePicUrl ? `${API_BASE_URL}${profilePicUrl}` : profilePicIcon} 
            alt="Profile" 
            className="picture-placeholder" 
          />

          {!profilePicUrl ? (
            <button className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }} onClick={handleAddPictureClick}>
              <img src={addIcon} alt="" /> Add picture
            </button>
          ) : (
            <>
              <button className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }} onClick={handleAddPictureClick}>
                <img src={changeIcon} alt="" /> Change picture
              </button>
              <button className="btn-icon" onClick={handleDeletePicture}>
                <img src={deleteIcon} alt="Delete" />
              </button>
            </>
          )}
        </div>

        <div className="form-group">
          <label className="input-label">
            Name
            <input 
              type="text" 
              className="input-field"
              placeholder="Jamie Wright" 
              value={name} 
              onChange={(e) => setName(e.target.value)}
            />
          </label>

          <label className="input-label">
            Phone number
            <input 
              type="text" 
              className="input-field"
              placeholder="+01 234 5678" 
              value={phone} 
              onChange={(e) => setPhone(e.target.value)}
            />
          </label>

          <label className="input-label">
            Email address
            <input 
              type="email" 
              className="input-field"
              placeholder="jamie.wright@mail.com" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>
        </div>

        <div className="modal-actions">
          <button className="btn-cancel" onClick={handleCancel}>Cancel</button>
          <button 
            className="btn-done"
            onClick={handleDone} 
            disabled={!name.trim()}
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}