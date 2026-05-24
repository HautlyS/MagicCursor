import * as React from "react";
import { browser, Tabs } from "webextension-polyfill-ts";
import {
  getSettings,
  saveSettings,
  DEFAULT_SETTINGS,
  CursorSettings,
  EFFECT_NAMES,
} from "../utils/storage";
import { EffectType, EFFECT_CONFIG, ALL_EFFECTS } from "../ContentScript/effects/types";

import "./styles.scss";

function openWebPage(url: string): Promise<Tabs.Tab> {
  return browser.tabs.create({ url });
}

const Popup: React.FC = () => {
  const [settings, setSettings] = React.useState<CursorSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = React.useState(true);
  const [showSettings, setShowSettings] = React.useState(false);
  const [saved, setSaved] = React.useState(false);

  React.useEffect(() => {
    getSettings().then((loadedSettings) => {
      setSettings(loadedSettings);
      setLoading(false);
    });
  }, []);

  const handleChange = (key: keyof CursorSettings, value: number | boolean | string): void => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    saveSettings(newSettings).then(() => {
      setSaved(true);
      setTimeout(() => setSaved(false), 1500);
    });
  };

  const handleReset = async (): Promise<void> => {
    setSettings(DEFAULT_SETTINGS);
    await saveSettings(DEFAULT_SETTINGS);
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  };

  const openOptions = (): void => {
    openWebPage("options.html").catch(console.error);
  };

  if (loading) {
    return (
      <section id="popup">
        <div className="loading">
          <div className="loading-spinner"></div>
          <span>Loading Magic Cursor...</span>
        </div>
      </section>
    );
  }

  return (
    <section id="popup">
      <div className="header">
        <div className="logo">✨</div>
        <div className="title-area">
          <h1>Magic Cursor</h1>
          <p>Beautiful cursor effects</p>
        </div>
      </div>

      <div className="toggle-container">
        <label className="toggle-switch">
          <input
            type="checkbox"
            checked={settings.enabled}
            onChange={(e): void => handleChange("enabled", e.target.checked)}
          />
          <span className="slider"></span>
        </label>
        <span className="toggle-label">
          {settings.enabled ? "Active" : "Inactive"}
        </span>
      </div>

      <div className="effect-selector">
        <h3>🎭 Choose Effect</h3>
        <div className="effect-grid">
          {ALL_EFFECTS.map((effect) => {
            const config = EFFECT_CONFIG[effect];
            return (
              <button
                key={effect}
                type="button"
                className={`effect-btn ${settings.effectType === effect ? 'active' : ''}`}
                onClick={(): void => handleChange("effectType", effect)}
                title={config.description}
              >
                <span className="effect-emoji">{config.emoji}</span>
                <span className="effect-name">{config.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      <button
        type="button"
        className="btn-settings-toggle"
        onClick={(): void => setShowSettings(!showSettings)}
      >
        {showSettings ? "▲ Hide Settings" : "▼ Quick Settings"}
      </button>

      {showSettings && (
        <div className="settings-panel">
          <div className="settings-section">
            <h3>⚡ Quick Adjust</h3>
            <div className="setting-item">
              <label>
                <span>Trail Size</span>
                <span className="value">{settings.splatRadius.toFixed(2)}</span>
              </label>
              <input
                type="range"
                min="0.05"
                max="0.4"
                step="0.01"
                value={settings.splatRadius}
                onChange={(e): void =>
                  handleChange("splatRadius", parseFloat(e.target.value))
                }
              />
            </div>
            <div className="setting-item">
              <label>
                <span>Trail Strength</span>
                <span className="value">{settings.splatForce}</span>
              </label>
              <input
                type="range"
                min="2000"
                max="12000"
                step="500"
                value={settings.splatForce}
                onChange={(e): void =>
                  handleChange("splatForce", parseInt(e.target.value, 10))
                }
              />
            </div>
          </div>

          <div className="settings-actions">
            <button type="button" className="btn-reset" onClick={handleReset}>
              🔄 Reset
            </button>
            <button type="button" className="btn-advanced" onClick={openOptions}>
              🎛️ Advanced
            </button>
          </div>

          {saved && <div className="save-indicator">✓ Saved!</div>}
        </div>
      )}

      <div className="footer">
        <a href="https://github.com/magic-cursor/magic-cursor" target="_blank" rel="noopener noreferrer">
          🌟 Star on GitHub
        </a>
      </div>
    </section>
  );
};

export default Popup;
