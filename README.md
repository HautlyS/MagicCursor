# ✨ Magic Cursor - Fluid Mouse Trail

**Beautiful GPU-accelerated fluid trail that follows your mouse on every website**

Magic Cursor is a production-ready browser extension and desktop application that adds a mesmerizing, physics-based fluid simulation trail to your mouse cursor. Built with React/Vue, TypeScript, and WebGL, it provides a stunning visual effect without interfering with your browsing experience.

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
[![Build Status](https://github.com/magic-cursor/magic-cursor/actions/workflows/build.yml/badge.svg)](https://github.com/magic-cursor/magic-cursor/actions)

## ✨ Features

### Core Features
- 🎨 **GPU-Accelerated Fluid Simulation** - Smooth, realistic fluid dynamics using WebGL
- 🎯 **Non-Intrusive** - Overlay with `pointer-events: none` - never blocks clicks or interactions
- 🌈 **Dynamic Colors** - Automatically cycling rainbow colors
- 📱 **Touch Support** - Works with mouse, trackpad, and touch screens
- ⚡ **Performance Optimized** - Pauses when tab is hidden, handles WebGL context loss
- 🎛️ **Fully Customizable** - Extensive settings for every aspect of the effect

### User Features
- ✅ **Easy Toggle** - Enable/disable with one click from the popup
- ⚙️ **Rich Options Page** - Fine-tune pressure, curl, colors, and more
- 💾 **Settings Sync** - Your preferences sync across devices
- 🌐 **Cross-Browser** - Works on Chrome, Firefox, Opera, Edge, Safari and all Chromium browsers
- 🖥️ **Cross-Platform Desktop** - Native apps for Windows, macOS, and Linux via Tauri

## 🚀 Installation

### Desktop Apps (Recommended)

#### Windows
1. Download `Magic Cursor-x.x.x_x64.exe` from [Releases](https://github.com/magic-cursor/magic-cursor/releases)
2. Run the installer and follow the wizard

#### macOS
1. Download `Magic Cursor-x.x.x_aarch64.dmg` (Apple Silicon) or `Magic Cursor-x.x.x_x64.dmg` (Intel) from [Releases](https://github.com/magic-cursor/magic-cursor/releases)
2. Open the DMG file and drag Magic Cursor to Applications

#### Linux
1. Download `Magic Cursor_x.x.x_amd64.AppImage` from [Releases](https://github.com/magic-cursor/magic-cursor/releases)
2. Make it executable: `chmod +x Magic\ Cursor_x.x.x_amd64.AppImage`
3. Run the AppImage

### Browser Extensions

#### Chrome / Edge / Brave / Opera
1. Download the latest release from the [Releases page](https://github.com/magic-cursor/magic-cursor/releases)
2. Unzip the downloaded file
3. Open `chrome://extensions` (or `edge://extensions`, `opera://extensions`)
4. Enable "Developer mode" (toggle in top right)
5. Click "Load unpacked"
6. Select the `chrome` folder from the unzipped files

#### Firefox
1. Download the `.xpi` file from the [Releases page](https://github.com/magic-cursor/magic-cursor/releases)
2. Open `about:addons`
3. Click the gear icon and select "Install Add-on From File"
4. Select the downloaded `.xpi` file

#### Safari
1. Download the Safari extension from the [Releases page](https://github.com/magic-cursor/magic-cursor/releases)
2. Open Safari Preferences > Extensions
3. Click "Install Extension" and select the downloaded file
4. Enable the extension and grant necessary permissions

### For Developers

#### Prerequisites
- Node.js 18+ and npm or yarn
- Rust toolchain (for Tauri desktop builds)
- Git

#### Setup
```bash
# Clone the repository
git clone https://github.com/magic-cursor/magic-cursor.git
cd magic-cursor

# Install dependencies
npm install
# or
yarn
```

#### Development

**Desktop App (Tauri + Vue.js)**
```bash
# Development server
npm run dev

# Build desktop app
npm run build:tauri
```

**Browser Extension (React + TypeScript)**
```bash
# Chrome (with hot reload)
npm run dev:chrome

# Firefox (with hot reload)
npm run dev:firefox

# Opera (with hot reload)
npm run dev:opera
```

Then load the extension from `extension/<browser>/` directory.

#### Production Build

**Desktop App (all platforms)**
```bash
npm run build:tauri
# Output: src-tauri/target/release/bundle/
```

**Browser Extensions (all browsers)**
```bash
# Build for specific browser
npm run build:chrome
npm run build:firefox
npm run build:opera
npm run build:safari

# Build for all browsers
npm run build
```

Output will be in `extension/<browser>/` and packaged as:
- Chrome/Opera/Safari: `.zip`
- Firefox: `.xpi`

#### GitHub Actions CI/CD

All builds are automated via GitHub Actions on every push:
- **Desktop Apps**: Windows (.exe), macOS (.app), Linux (.AppImage)
- **Browser Extensions**: Chrome (.zip), Firefox (.xpi), Opera (.crx), Safari (.zip)
- **Vue Preview**: Web build for testing

See [`.github/workflows/build.yml`](.github/workflows/build.yml) for details.

## 🎛️ Customization

### Available Settings

#### General
- **Enable/Disable** - Turn the effect on or off
- **3D Shading** - Add depth with lighting effects
- **Transparent Background** - Use transparent or colored background

#### Visual Quality
- **Simulation Resolution** (64-512) - Physics simulation detail
- **Dye Resolution** (256-2048) - Color rendering quality

#### Fluid Behavior
- **Pressure** (0-1) - Fluid pressure intensity
- **Curl** (0-50) - Swirling vorticity strength
- **Density Dissipation** (0-10) - How fast colors fade
- **Velocity Dissipation** (0-10) - How fast motion slows

#### Mouse Interaction
- **Splat Force** (1000-15000) - Mouse movement impact
- **Splat Radius** (0.05-0.5) - Size of trail effect
- **Color Change Speed** (1-50) - Rainbow cycling speed

#### Advanced
- **Pressure Iterations** (1-50) - Simulation accuracy vs performance

## 📁 Project Structure

```
magic-cursor/
├── src/                      # Vue.js desktop app source
│   ├── components/           # Vue components including MagicMouse
│   ├── App.vue              # Main app component
│   └── main.ts              # Entry point
├── src-tauri/               # Tauri desktop app source
│   ├── src/                 # Rust backend code
│   ├── Cargo.toml           # Rust dependencies
│   └── tauri.conf.json      # Tauri configuration
├── source/                   # Browser extension source
│   ├── Background/          # Background service worker
│   ├── ContentScript/       # Injected fluid cursor overlay
│   │   ├── index.tsx       # Entry point with settings integration
│   │   └── magic-mouse.tsx # WebGL fluid simulation
│   ├── Options/            # Settings page
│   ├── Popup/              # Extension popup
│   ├── utils/              # Shared utilities
│   ├── styles/             # Global styles
│   └── manifest.json       # Extension manifest
├── safari/                  # Safari-specific manifest
├── views/                   # HTML templates
├── vite.config.ts           # Vite build config
├── webpack.config.js        # Browser extension webpack config
└── package.json            # Dependencies and scripts
```

## 🔧 Technical Details

### Technologies
- **Vue.js 3 + Tauri 2** - Cross-platform desktop app
- **React 17** - Browser extension UI components
- **TypeScript** - Type safety
- **WebGL 2** - GPU-accelerated rendering
- **Vite 5** - Desktop app bundling
- **Webpack 5** - Browser extension bundling
- **Rust** - Native desktop backend
- **SCSS** - Styling
- **webextension-polyfill** - Cross-browser API

### How It Works
1. Desktop: Tauri loads Vue.js app with MagicMouse component
2. Browser: Content script injects a fixed-position overlay on every page
3. React/Vue component initializes WebGL context and fluid simulation
4. Mouse/touch events create "splats" in the fluid
5. Simulation runs at 60fps with curl, pressure, and advection
6. Settings are stored in `browser.storage.sync` and applied in real-time

### Performance
- Automatically pauses when tab is hidden
- Handles WebGL context loss and restoration
- Optimized shader programs
- Configurable quality settings for different devices

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by fluid simulation techniques from [PavelDoGreat/WebGL-Fluid-Simulation](https://github.com/PavelDoGreat/WebGL-Fluid-Simulation)
- Built with [web-extension-starter](https://github.com/abhijithvijayan/web-extension-starter)

## 📧 Support

- 🐛 [Report a bug](https://github.com/magic-cursor/magic-cursor/issues)
- 💡 [Request a feature](https://github.com/magic-cursor/magic-cursor/issues)
- 📖 [Documentation](https://github.com/magic-cursor/magic-cursor/wiki)

---

Made with ❤️ by the Magic Cursor Team
