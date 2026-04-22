import { useEffect, useState } from 'react';
import type { Contact } from './types/Contact';
import ContactList from './components/ContactList';
import ContactModal from './components/ContactModal';
import './App.css';
import backIcon from './assets/icons/Back arrow.svg';
import settingsIcon from './assets/icons/Settings.svg';
import profileIcon from './assets/icons/Profile pic.svg';
import lightModeIcon from './assets/icons/Light mode.svg';
import addIcon from './assets/icons/Add.svg';

const API_URL = 'http://localhost:5271/api/contacts';

function App() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);

  const fetchContacts = async () => {
    try {
      const response = await fetch(API_URL);
      if (response.ok) {
        const data = await response.json();
        setContacts(data);
      } else {
        console.error("Nem sikerült lekérni az adatokat az API-tól.");
      }
    } catch (error) {
      console.error("Hálózati hiba:", error);
    }
  };

  const handleOpenAdd = () => {
    setEditingContact(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (contact: Contact) => {
    setEditingContact(contact);
    setIsModalOpen(true);
  };

  const handleSaveContact = async (contactData: Omit<Contact, 'id'>) => {
    if (editingContact) {
      const updatedContact = { ...editingContact, ...contactData };
      
      try {
        const response = await fetch(`${API_URL}/${editingContact.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedContact),
        });

        if (response.ok) {
          setContacts(contacts.map(c => c.id === editingContact.id ? updatedContact : c));
        }
      } catch (error) {
        console.error("Hiba a szerkesztéskor:", error);
      }
    } else {
      try {
        const response = await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(contactData), 
        });

        if (response.ok) {
          const newContact = await response.json();
          setContacts([...contacts, newContact]);
        }
      } catch (error) {
        console.error("Hiba a mentéskor:", error);
      }
    }
    setIsModalOpen(false);
  };

  const handleDeleteContact = async (idToRemove: string) => {
    try {
      const response = await fetch(`${API_URL}/${idToRemove}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setContacts(contacts.filter(contact => contact.id !== idToRemove));
      }
    } catch (error) {
      console.error("Hiba a törléskor:", error);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="header-left">
          <button className="btn-icon-header"><img src={backIcon} alt="Back" /></button>
          <h1 className="title">Contacts</h1>
        </div>
        
        <div className="header-right">
          <button className="btn-icon-header"><img src={settingsIcon} alt="Settings" /></button>
          <button className="btn-icon-header"><img src={profileIcon} alt="Profile" /></button>
          <button className="btn-icon-header"><img src={lightModeIcon} alt="Light Mode" /></button>
          
          <button className="btn-add" onClick={handleOpenAdd}>
            <img src={addIcon} alt="Add" /> 
            <span className="btn-add-text">Add new</span>
          </button>
        </div>
      </header>

      <main>
        <ContactList 
          contacts={contacts} 
          onDelete={handleDeleteContact} 
          onEdit={handleOpenEdit} 
        />
      </main>

      <ContactModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSave={handleSaveContact} 
        initialData={editingContact} 
      />
    </div>
  );
}

export default App;