import React from 'react';
import ReactDOM from 'react-dom';
import SplashCursor from './magic-mouse';
import ParticleEffect from './effects/ParticleEffect';
import { getSettings, onSettingsChanged, CursorSettings, EFFECT_NAMES } from '../utils/storage';
import { EffectType, EFFECT_CONFIG, ALL_EFFECTS } from './effects/types';

(async function init(): Promise<void> {
  // Load settings
  const settings = await getSettings();

  // Create container for our overlay
  const containerId = '__magic_mouse_container__';
  let container = document.getElementById(containerId);
  if (!container) {
    container = document.createElement('div');
    container.id = containerId;
    // Ensure the container itself does not block pointer events
    container.style.pointerEvents = 'none';
    // Append to body
    document.body.appendChild(container);
  }

  // Current effect ref for quick access
  let currentEffectType: EffectType = settings.effectType || 'fluid';
  let isEnabled = settings.enabled;

  // Render function with effect support
  const render = (currentSettings: CursorSettings): void => {
    currentEffectType = currentSettings.effectType || 'fluid';
    isEnabled = currentSettings.enabled;

    if (!currentSettings.enabled) {
      ReactDOM.render(<></>, container!);
      return;
    }

    // Use particle effects for non-fluid effects
    if (currentEffectType !== 'fluid') {
      const effectConfig = EFFECT_CONFIG[currentEffectType] || EFFECT_CONFIG.fluid;
      ReactDOM.render(
        <ParticleEffect
          effectType={currentEffectType}
          colorScheme={effectConfig.colorScheme}
          splatRadius={currentSettings.splatRadius}
          splatForce={currentSettings.splatForce}
        />,
        container
      );
    } else {
      // Use WebGL fluid simulation for 'fluid' effect
      ReactDOM.render(
        <SplashCursor
          SIM_RESOLUTION={currentSettings.simResolution}
          DYE_RESOLUTION={currentSettings.dyeResolution}
          DENSITY_DISSIPATION={currentSettings.densityDissipation}
          VELOCITY_DISSIPATION={currentSettings.velocityDissipation}
          PRESSURE={currentSettings.pressure}
          PRESSURE_ITERATIONS={currentSettings.pressureIterations}
          CURL={currentSettings.curl}
          SPLAT_RADIUS={currentSettings.splatRadius}
          SPLAT_FORCE={currentSettings.splatForce}
          SHADING={currentSettings.shading}
          COLOR_UPDATE_SPEED={currentSettings.colorUpdateSpeed}
          TRANSPARENT={currentSettings.transparent}
        />,
        container
      );
    }
  };

  // Initial render
  render(settings);

  // Listen for settings changes
  onSettingsChanged((newSettings) => {
    render(newSettings);
  });
})();

export {};
