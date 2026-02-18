import React from 'react';
import ReactDOM from 'react-dom';
import { ExclamationCircleOutlined, CloseOutlined } from '@ant-design/icons';
import './DeleteModal.css'

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
}

const DeleteModal: React.FC<DeleteModalProps> = ({ isOpen, onClose, onConfirm, title }) => {
  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className='delete-box'>
      
      {/* 1. BACKDROP CLICK LAYER */}
      <div style={{ position: 'absolute', inset: 0 }} onClick={onClose} />

      {/* 2. THE CARD: Forced dimensions to match image_8d3285 */}
      <div 
        className="animate-slideUp"
      >
        
        {/* CLOSE ICON: Matches image_978567 */}
        <button className='close-icon'
          onClick={onClose} 
        >
          <CloseOutlined />
        </button>

        {/* 3. CONTENT AREA: Side-by-side layout */}
        <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
          <div style={{ flexShrink: 0 }}>
             <ExclamationCircleOutlined style={{ color: '#faad14', fontSize: '24px', marginTop: '4px' }} />
          </div>
          
          <div style={{ flex: 1 }}>
            <h3 style={{ fontSize: '18px', color: '#111827', margin: 0, lineHeight: 1.4 }}>
              Are you sure you want to delete this {title}?
            </h3>
            <p style={{ color: '#6b7280', marginTop: '8px', fontSize: '14px', margin: '8px 0 0' }}>
              This action cannot be undone.
            </p>
          </div>
        </div>

        {/* 4. FOOTER BUTTONS: Right aligned */}
        <div className='footer-button' >
          <button className='footer-cancel-button'
            onClick={onClose}
            onMouseOver={(e) => {e.currentTarget.style.backgroundColor = '#66bb6a'; e.currentTarget.style.border = '66bb6a 2px solid'; e.currentTarget.style.color = '#fff'}}
            onMouseOut={(e) => {e.currentTarget.style.backgroundColor = '#e8e8e8';e.currentTarget.style.border = 'e8e8e8 2px solid'; e.currentTarget.style.color = '#374151'}}
          >
            Cancel
          </button>
          
          <button className='confirm-delete-button'            
            onClick={onConfirm}
            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#cf1322')}
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#ff4d4f')}
          >
          Yes, Delete
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default DeleteModal;