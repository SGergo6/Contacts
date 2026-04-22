import type { Contact } from '../types/Contact';
import ContactCard from './ContactCard';
import './ContactList.css';

interface Props {
  contacts: Contact[];
  onDelete: (id: string) => void;
  onEdit: (contact: Contact) => void;
}

export default function ContactList({ contacts, onDelete, onEdit }: Props) {
  return (
    <ul className="contact-list">
      {contacts.map((contact) => (
        <ContactCard 
          key={contact.id} 
          contact={contact} 
          onDelete={onDelete} 
          onEdit={onEdit} 
        />
      ))}
    </ul>
  );
}