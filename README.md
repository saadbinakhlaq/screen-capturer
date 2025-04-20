# Screenshot Capture App

A cross-platform Electron application for capturing screenshots at regular intervals. The app runs on both Windows and macOS, supports multiple image formats, and can minimize to the system tray.

## Features

- 🖥️ **Cross-platform** - Works on both Windows and macOS
- ⏱️ **Configurable capture interval** - Set time between screenshots (in seconds)
- 📂 **Folder selection** - Choose where to save screenshots
- 🖼️ **Image format options** - Save as PNG or JPEG
- 📸 **Fullscreen captures** - Automatically captures entire screen
- ⏲️ **Timestamped filenames** - Files named with ISO timestamps for easy organization
- 🗔 **System tray integration** - Minimizes to tray and runs in background
- 🔍 **Status feedback** - Shows current status and last capture location

## Setup and Installation

### Prerequisites

- Node.js (v16 or later recommended)
- npm (comes with Node.js)

### Installation Steps

1. **Clone the repository** or download the source code
   ```bash
   git clone https://github.com/your-repo/screen-capturer.git
   cd screen-capturer
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the application**
   ```bash
   npm start
   ```

### Building for Production

To create distributable packages:

```bash
npm run dist
```

This will create installers for your current platform in the `dist` folder.

## Usage Guide

1. **Configure Settings**:
   - Set the capture interval (in seconds)
   - Choose image format (PNG or JPEG)
   - Select destination folder for screenshots

2. **Start Capturing**:
   - Click "Start Capture" to begin automatic screenshot capture
   - The status will change to "Active"

3. **Stop Capturing**:
   - Click "Stop Capture" to pause the process
   - The status will change to "Inactive"

4. **Minimize to Tray**:
   - Close the window to minimize to system tray
   - The app continues running in background while minimized
   - Click the tray icon to restore the window

5. **View Last Capture**:
   - The bottom of the window shows the path of the last captured screenshot

## Troubleshooting

If you encounter issues:

1. Make sure you have the required permissions to access the screenshot functionality
2. Verify the destination folder is writable
3. Check the console for error messages (View → Toggle Developer Tools)

For any other issues, please file a bug report.

## License

This project is open source and available under the MIT License.