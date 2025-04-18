
import React, { useState } from 'react';
import SettingsModal from './SettingsModal';
import { Button } from '@/components/ui/button';
import { Settings } from 'lucide-react';
import './SettingsModal.css';

const SettingsModalDemo: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="settings-demo-container">
      <Button 
        onClick={openModal}
        className="settings-button"
      >
        <Settings className="h-4 w-4 mr-2" />
        Open Settings
      </Button>
      
      <SettingsModal 
        isOpen={isModalOpen} 
        onClose={closeModal} 
      />
    </div>
  );
};

export default SettingsModalDemo;
