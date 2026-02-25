import { useState } from 'react';
import '../styles/InteractiveControls.css';

interface ControlsProps {
  onSettingsChange?: (settings: ControlSettings) => void;
}

export interface ControlSettings {
  rotationSpeed: number;
  lightIntensity: number;
  autoRotate: boolean;
  wireframe: boolean;
}

export const InteractiveControls = ({ onSettingsChange }: ControlsProps) => {
  const [settings, setSettings] = useState<ControlSettings>({
    rotationSpeed: 1,
    lightIntensity: 1,
    autoRotate: true,
    wireframe: false,
  });

  const handleChange = (key: keyof ControlSettings, value: number | boolean) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    if (onSettingsChange) {
      onSettingsChange(newSettings);
    }
  };

  return (
    <div className="controls-panel">
      <h2>🎮 Interactive Controls</h2>
      
      <div className="control-group">
        <label htmlFor="rotation">Kecepatan Rotasi</label>
        <input
          id="rotation"
          type="range"
          min="0"
          max="2"
          step="0.1"
          value={settings.rotationSpeed}
          onChange={(e) => handleChange('rotationSpeed', parseFloat(e.target.value))}
        />
        <span className="value">{settings.rotationSpeed.toFixed(1)}x</span>
      </div>

      <div className="control-group">
        <label htmlFor="light">Intensitas Cahaya</label>
        <input
          id="light"
          type="range"
          min="0"
          max="2"
          step="0.1"
          value={settings.lightIntensity}
          onChange={(e) => handleChange('lightIntensity', parseFloat(e.target.value))}
        />
        <span className="value">{settings.lightIntensity.toFixed(1)}x</span>
      </div>

      <div className="control-group checkbox">
        <label htmlFor="autoRotate">
          <input
            id="autoRotate"
            type="checkbox"
            checked={settings.autoRotate}
            onChange={(e) => handleChange('autoRotate', e.target.checked)}
          />
          Auto Rotasi
        </label>
      </div>

      <div className="control-group checkbox">
        <label htmlFor="wireframe">
          <input
            id="wireframe"
            type="checkbox"
            checked={settings.wireframe}
            onChange={(e) => handleChange('wireframe', e.target.checked)}
          />
          Mode Wireframe
        </label>
      </div>

      <div className="info-section">
        <h3>💡 Informasi</h3>
        <ul>
          <li>✨ 5 objek 3D yang berputar</li>
          <li>🔦 Sistem pencahayaan dinamis</li>
          <li>📱 Responsif untuk semua ukuran</li>
          <li>⚡ Performa tinggi dengan WebGL</li>
          <li>🎨 Material Phong yang realistis</li>
        </ul>
      </div>
    </div>
  );
};
