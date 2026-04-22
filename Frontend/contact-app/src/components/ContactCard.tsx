import { useState, useRef, useEffect } from 'react';
import type { Contact } from '../types/Contact';
import './ContactCard.css';
import moreIcon from '../assets/icons/More.svg';
import muteIcon from '../assets/icons/Mute.svg';
import callIcon from '../assets/icons/Call.svg';
import favIcon from '../assets/icons/Favourite.svg';
import deleteIcon from '../assets/icons/Delete.svg';
import editIcon from '../assets/icons/Settings.svg';
import profilePicIcon from '../assets/images/Default.jpg';

const API_BASE_URL = 'http://localhost:5271';

interface Props {
  contact: Contact;
  onDelete: (id: string) => void;
  onEdit: (contact: Contact) => void;
}

export default function ContactCard({ contact, onDelete, onEdit }: Props) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  const handleRemoveClick = () => {
    onDelete(contact.id);
    setIsMenuOpen(false);
  };

  const handleEditClick = () => {
    onEdit(contact);
    setIsMenuOpen(false);
  };

  return (
    <li className="contact-item">
      
        <div className="contact-info-wrapper">
            <img 
                src={contact.profilePicUrl ? `${API_BASE_URL}${contact.profilePicUrl}` : profilePicIcon} 
                alt={contact.name} 
                className="profile-pic" 
            />
            
            <div className="contact-details">
                <h3 className="contact-name">{contact.name}</h3>
                
                <div className="contact-meta">
                {contact.phone && <span>{contact.phone}</span>}
                </div>
            </div>
        </div>

        <div className={`contact-actions-right ${isMenuOpen ? 'force-show' : ''}`}>
            <button className="btn-icon-card">
                <img src={muteIcon} alt="Mute" />
            </button>
            <button className="btn-icon-card">
                <img src={callIcon} alt="Call" />
            </button>

            <div ref={menuRef} style={{ position: 'relative' }}>
                <button className="btn-icon-card" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                <img src={moreIcon} alt="More" />
                </button>

                {isMenuOpen && (
                <div className="dropdown-menu">
                    <button className="dropdown-item" onClick={handleEditClick}>
                    <img src={editIcon} alt="" /> Edit
                    </button>
                    <button className="dropdown-item no-function">
                    <img src={favIcon} alt="" /> Favourite
                    </button>
                    <button className="dropdown-item danger" onClick={handleRemoveClick}>
                    <img src={deleteIcon} alt="" /> Remove
                    </button>
                </div>
                )}
            </div>
        </div>

    </li>
  );
}