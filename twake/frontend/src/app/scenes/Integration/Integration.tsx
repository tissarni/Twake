import React from 'react';
import InitService from 'services/InitService';
import Apps from './Components/Apps.js';
import './Integration.scss';

export default (props: { children: React.ReactNode }): JSX.Element => {
  const [server_infos_loaded, server_infos] = InitService.useWatcher(async () => [
    InitService.server_infos_loaded,
    InitService.server_infos,
  ]) || [false, {}];

  if (!server_infos_loaded) {
    return <>{props.children}</>;
  }

  let branding = server_infos?.branding || {};

  if (!(branding || {}).name) {
    return <>{props.children}</>;
  }

  if (branding.style && branding.style.color) {
    document.documentElement.style.setProperty('--primary', branding.style.color);
    document.documentElement.style.setProperty(
      '--primary-background',
      branding.style.color.substr(0, 7) + '22',
    );
    document.documentElement.style.setProperty(
      '--primary-hover',
      branding.style.color.substr(0, 7) + 'AA',
    );
    document.documentElement.style.setProperty('--secondary', '#38383d');
  }
  if (branding.style && branding.style.default_border_radius) {
    document.documentElement.style.setProperty(
      '--default-border-radius',
      branding.style.default_border_radius + 'px',
    );
  }

  return (
    <div className="integration">
      {branding.header && (
        <div className="integration-header">
          {(branding.header.logo || branding.logo) && (
            <div
              className="logo"
              style={{ backgroundImage: 'url(' + (branding.header.logo || branding.logo) + ')' }}
            />
          )}
          <div className="apps">
            <Apps apps={branding.header.apps} />
          </div>
        </div>
      )}
      <div className="integrated-app">{props.children}</div>
    </div>
  );
};
