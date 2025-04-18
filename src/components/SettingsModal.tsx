import React, { useState } from 'react';
import { X, Check, Moon, Volume2, Globe, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('appearance');
  const [theme, setTheme] = useState('dark');
  const [notifications, setNotifications] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [volume, setVolume] = useState([70]);
  const [language, setLanguage] = useState('english');

  if (!isOpen) return null;

  const handleVolumeChange = (value: number[]) => {
    setVolume(value);
  };

  const handleSave = () => {
    // Save settings logic would go here
    onClose();
  };

  const createCopyButton = (contentId: string) => {
    const copyToClipboard = () => {
      const element = document.getElementById(contentId);
      if (element) {
        navigator.clipboard.writeText(element.textContent || '');
      }
    };

    return (
      <Button 
        variant="outline" 
        size="sm" 
        onClick={copyToClipboard}
        className="copy-button"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="9" y="9" width="13" height="13" rx="2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M5 15H4C2.89543 15 2 14.1046 2 13V4C2 2.89543 2.89543 2 4 2H13C14.1046 2 15 2.89543 15 4V5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <span className="sr-only">Copy</span>
      </Button>
    );
  };

  return (
    <div className="settings-modal-overlay" onClick={onClose}>
      <div 
        className="settings-modal" 
        onClick={(e) => e.stopPropagation()}
      >
        <div className="settings-modal-header">
          <h2>Settings</h2>
          <Button variant="ghost" size="icon" onClick={onClose} className="close-button">
            <X className="h-5 w-5" />
          </Button>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="settings-tabs">
          <TabsList className="settings-tabs-list">
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="sound">Sound</TabsTrigger>
            <TabsTrigger value="language">Language</TabsTrigger>
          </TabsList>
          
          <TabsContent value="appearance" className="settings-tab-content">
            <div className="settings-section">
              <div className="settings-section-header">
                <Moon className="h-5 w-5" />
                <h3>Theme</h3>
              </div>
              <div className="settings-option">
                <RadioGroup 
                  value={theme} 
                  onValueChange={setTheme}
                  className="theme-radio-group"
                >
                  <div className="radio-item">
                    <RadioGroupItem value="dark" id="dark" />
                    <label htmlFor="dark">Dark</label>
                  </div>
                  <div className="radio-item">
                    <RadioGroupItem value="system" id="system" />
                    <label htmlFor="system">System</label>
                  </div>
                  <div className="radio-item">
                    <RadioGroupItem value="light" id="light" />
                    <label htmlFor="light">Light</label>
                  </div>
                </RadioGroup>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="notifications" className="settings-tab-content">
            <div className="settings-section">
              <div className="settings-section-header">
                <Bell className="h-5 w-5" />
                <h3>Notification Settings</h3>
              </div>
              <div className="settings-option">
                <label htmlFor="notifications">Enable notifications</label>
                <Switch 
                  id="notifications" 
                  checked={notifications} 
                  onCheckedChange={setNotifications} 
                />
              </div>
              <p className="settings-description">
                Receive notifications about new messages, updates, and system alerts.
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="sound" className="settings-tab-content">
            <div className="settings-section">
              <div className="settings-section-header">
                <Volume2 className="h-5 w-5" />
                <h3>Sound Settings</h3>
              </div>
              <div className="settings-option">
                <label htmlFor="sound-enabled">Enable sounds</label>
                <Switch 
                  id="sound-enabled" 
                  checked={soundEnabled} 
                  onCheckedChange={setSoundEnabled} 
                />
              </div>
              
              <div className="settings-option volume-slider">
                <label htmlFor="volume-slider">Volume</label>
                <Slider
                  id="volume-slider"
                  min={0}
                  max={100}
                  step={1}
                  value={volume}
                  onValueChange={handleVolumeChange}
                  disabled={!soundEnabled}
                  className="w-full"
                />
                <span className="volume-value">{volume}%</span>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="language" className="settings-tab-content">
            <div className="settings-section">
              <div className="settings-section-header">
                <Globe className="h-5 w-5" />
                <h3>Language Settings</h3>
              </div>
              <div className="settings-option">
                <RadioGroup 
                  value={language} 
                  onValueChange={setLanguage}
                  className="language-radio-group"
                >
                  <div className="radio-item">
                    <RadioGroupItem value="english" id="english" />
                    <label htmlFor="english">English</label>
                  </div>
                  <div className="radio-item">
                    <RadioGroupItem value="hindi" id="hindi" />
                    <label htmlFor="hindi">हिन्दी (Hindi)</label>
                  </div>
                  <div className="radio-item">
                    <RadioGroupItem value="spanish" id="spanish" />
                    <label htmlFor="spanish">Spanish</label>
                  </div>
                  <div className="radio-item">
                    <RadioGroupItem value="french" id="french" />
                    <label htmlFor="french">French</label>
                  </div>
                  <div className="radio-item">
                    <RadioGroupItem value="german" id="german" />
                    <label htmlFor="german">German</label>
                  </div>
                  <div className="radio-item">
                    <RadioGroupItem value="japanese" id="japanese" />
                    <label htmlFor="japanese">Japanese</label>
                  </div>
                </RadioGroup>
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="settings-modal-footer">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave}>
            <Check className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        </div>
        
        <div className="code-blocks">
          <div className="code-block">
            <div className="code-block-header">
              <h4>HTML</h4>
              {createCopyButton('html-code')}
            </div>
            <pre id="html-code" className="language-html">
              {`<div class="settings-modal-overlay">
  <div class="settings-modal">
    <div class="settings-modal-header">
      <h2>Settings</h2>
      <button class="close-button">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
    </div>
    
    <div class="settings-tabs">
      <div class="settings-tabs-list">
        <button class="tab-button active" data-tab="appearance">Appearance</button>
        <button class="tab-button" data-tab="notifications">Notifications</button>
        <button class="tab-button" data-tab="sound">Sound</button>
        <button class="tab-button" data-tab="language">Language</button>
      </div>
      
      <div class="settings-tab-content active" id="appearance">
        <div class="settings-section">
          <div class="settings-section-header">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-moon">
              <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path>
            </svg>
            <h3>Theme</h3>
          </div>
          <div class="settings-option">
            <div class="radio-group">
              <div class="radio-item">
                <input type="radio" id="dark" name="theme" value="dark" checked>
                <label for="dark">Dark</label>
              </div>
              <div class="radio-item">
                <input type="radio" id="system" name="theme" value="system">
                <label for="system">System</label>
              </div>
              <div class="radio-item">
                <input type="radio" id="light" name="theme" value="light">
                <label for="light">Light</label>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="settings-tab-content" id="language">
        <div class="settings-section">
          <div class="settings-section-header">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-globe">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="2" y1="12" x2="22" y2="12"></line>
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
            </svg>
            <h3>Language Settings</h3>
          </div>
          <div class="settings-option">
            <div class="radio-group">
              <div class="radio-item">
                <input type="radio" id="english" name="language" value="english" checked>
                <label for="english">English</label>
              </div>
              <div class="radio-item">
                <input type="radio" id="hindi" name="language" value="hindi">
                <label for="hindi">हिन्दी (Hindi)</label>
              </div>
              <div class="radio-item">
                <input type="radio" id="spanish" name="language" value="spanish">
                <label for="spanish">Spanish</label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <div class="settings-modal-footer">
      <button class="button button-outline">Cancel</button>
      <button class="button button-primary">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
        Save Changes
      </button>
    </div>
  </div>
</div>`}
            </pre>
          </div>
          
          <div className="code-block">
            <div className="code-block-header">
              <h4>CSS</h4>
              {createCopyButton('css-code')}
            </div>
            <pre id="css-code" className="language-css">
              {`/* Settings Modal Styles */
.settings-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.75);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.settings-modal {
  background-color: #1a1a1a;
  color: #e0e0e0;
  border-radius: 8px;
  width: 90%;
  max-width: 550px;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5);
}

.settings-modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #333;
}

.settings-modal-header h2 {
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0;
}

.close-button {
  background: transparent;
  border: none;
  color: #999;
  cursor: pointer;
  padding: 6px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s, color 0.2s;
}

.close-button:hover {
  background-color: rgba(255, 255, 255, 0.1);
  color: #fff;
}

/* Tabs */
.settings-tabs {
  width: 100%;
}

.settings-tabs-list {
  display: flex;
  border-bottom: 1px solid #333;
  padding: 0 20px;
  overflow-x: auto;
  scrollbar-width: thin;
}

.tab-button {
  padding: 12px 16px;
  background: transparent;
  border: none;
  color: #999;
  cursor: pointer;
  font-size: 0.9rem;
  position: relative;
  transition: color 0.2s;
}

.tab-button::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background-color: transparent;
}

.tab-button:hover {
  color: #e0e0e0;
}

.tab-button.active {
  color: #8c66ff;
}

.tab-button.active::after {
  background-color: #8c66ff;
}

/* Tab Content */
.settings-tab-content {
  display: none;
  padding: 20px;
}

.settings-tab-content.active {
  display: block;
}

/* Settings Sections */
.settings-section {
  margin-bottom: 24px;
}

.settings-section-header {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
}

.settings-section-header svg {
  margin-right: 10px;
  color: #8c66ff;
}

.settings-section-header h3 {
  font-size: 1rem;
  font-weight: 500;
  margin: 0;
}

/* Settings Options */
.settings-option {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
}

.settings-description {
  font-size: 0.85rem;
  color: #888;
  margin-top: 8px;
}

/* Radio Groups */
.radio-group {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.radio-item {
  display: flex;
  align-items: center;
}

.radio-item input[type="radio"] {
  margin-right: 8px;
  /* Custom radio styling would go here */
}

/* Volume Slider */
.volume-slider {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
}

.volume-slider input[type="range"] {
  width: 100%;
  background: #333;
  height: 5px;
  border-radius: 2px;
  appearance: none;
}

.volume-slider input[type="range"]::-webkit-slider-thumb {
  appearance: none;
  width: 16px;
  height: 16px;
  background: #8c66ff;
  border-radius: 50%;
  cursor: pointer;
}

.volume-value {
  font-size: 0.85rem;
  color: #888;
}

/* Footer */
.settings-modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 16px 20px;
  border-top: 1px solid #333;
}

.button {
  padding: 8px 16px;
  border-radius: 4px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s;
}

.button svg {
  margin-right: 8px;
}

.button-outline {
  background-color: transparent;
  border: 1px solid #444;
  color: #e0e0e0;
}

.button-outline:hover {
  background-color: rgba(255, 255, 255, 0.05);
}

.button-primary {
  background-color: #8c66ff;
  border: 1px solid #8c66ff;
  color: #fff;
}

.button-primary:hover {
  background-color: #7d57e6;
}

/* Code Blocks */
.code-blocks {
  margin-top: 20px;
  padding: 0 20px 20px;
}

.code-block {
  margin-bottom: 16px;
  border: 1px solid #333;
  border-radius: 6px;
  overflow: hidden;
}

.code-block-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  background-color: #222;
  border-bottom: 1px solid #333;
}

.code-block-header h4 {
  font-size: 0.9rem;
  font-weight: 600;
  margin: 0;
}

.copy-button {
  background: transparent;
  border: none;
  color: #888;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s;
}

.copy-button:hover {
  color: #e0e0e0;
}

pre {
  margin: 0;
  padding: 12px;
  background-color: #111;
  color: #e0e0e0;
  font-family: monospace;
  font-size: 0.85rem;
  line-height: 1.5;
  overflow-x: auto;
  max-height: 300px;
}

/* Responsive Adjustments */
@media (max-width: 640px) {
  .settings-modal {
    width: 95%;
    max-height: 90vh;
  }
  
  .settings-tabs-list {
    padding: 0 12px;
  }
  
  .tab-button {
    padding: 12px 10px;
    font-size: 0.8rem;
  }
  
  .settings-option {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
  
  .radio-group {
    width: 100%;
  }
}

/* Ensure the modal doesn't overflow on very small screens */
@media (max-height: 600px) {
  .settings-modal {
    max-height: 95vh;
  }
}`}
            </pre>
          </div>
          
          <div className="code-block">
            <div className="code-block-header">
              <h4>JavaScript</h4>
              {createCopyButton('js-code')}
            </div>
            <pre id="js-code" className="language-javascript">
              {`// Settings Modal Functionality
document.addEventListener('DOMContentLoaded', function() {
  // Elements
  const modalOverlay = document.querySelector('.settings-modal-overlay');
  const closeButton = document.querySelector('.close-button');
  const tabButtons = document.querySelectorAll('.tab-button');
  const tabContents = document.querySelectorAll('.settings-tab-content');
  const cancelButton = document.querySelector('.button-outline');
  const saveButton = document.querySelector('.button-primary');
  const copyButtons = document.querySelectorAll('.copy-button');
  
  // Function to open modal
  function openModal() {
    modalOverlay.style.display = 'flex';
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
  }
  
  // Function to close modal
  function closeModal() {
    modalOverlay.style.display = 'none';
    document.body.style.overflow = ''; // Restore scrolling
  }
  
  // Function to switch tabs
  function switchTab(tabId) {
    // Remove active class from all tabs
    tabButtons.forEach(button => button.classList.remove('active'));
    tabContents.forEach(content => content.classList.remove('active'));
    
    // Add active class to selected tab
    const selectedButton = document.querySelector(\`[data-tab="\${tabId}"]\`);
    const selectedContent = document.getElementById(tabId);
    
    if (selectedButton && selectedContent) {
      selectedButton.classList.add('active');
      selectedContent.classList.add('active');
    }
  }
  
  // Function to copy code
  function copyToClipboard(codeId) {
    const codeElement = document.getElementById(codeId);
    if (codeElement) {
      const textToCopy = codeElement.textContent;
      navigator.clipboard.writeText(textToCopy)
        .then(() => {
          // Visual feedback when copied
          const button = document.querySelector(\`[data-code="\${codeId}"]\`);
          if (button) {
            const originalText = button.innerHTML;
            button.innerHTML = 'Copied!';
            setTimeout(() => {
              button.innerHTML = originalText;
            }, 2000);
          }
        })
        .catch(err => {
          console.error('Failed to copy text: ', err);
        });
    }
  }
  
  // Event Listeners
  if (modalOverlay) {
    modalOverlay.addEventListener('click', function(e) {
      if (e.target === modalOverlay) {
        closeModal();
      }
    });
  }
  
  if (closeButton) {
    closeButton.addEventListener('click', closeModal);
  }
  
  if (cancelButton) {
    cancelButton.addEventListener('click', closeModal);
  }
  
  if (saveButton) {
    saveButton.addEventListener('click', function() {
      // Save settings logic would go here
      closeModal();
    });
  }
  
  // Tab switching
  tabButtons.forEach(button => {
    button.addEventListener('click', function() {
      const tabId = this.getAttribute('data-tab');
      switchTab(tabId);
    });
  });
  
  // Copy buttons
  copyButtons.forEach(button => {
    button.addEventListener('click', function() {
      const codeId = this.getAttribute('data-code');
      copyToClipboard(codeId);
    });
  });
  
  // Example function to open the modal programmatically
  window.openSettingsModal = openSettingsModal;
  function openSettingsModal() {
    openModal();
  }
});`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
