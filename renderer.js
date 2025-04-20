document.addEventListener('DOMContentLoaded', () => {
    const startBtn = document.getElementById('start-btn');
    const stopBtn = document.getElementById('stop-btn');
    const intervalInput = document.getElementById('interval');
    const formatSelect = document.getElementById('format');
    const folderInput = document.getElementById('folder');
    const selectFolderBtn = document.getElementById('select-folder');
    const statusText = document.getElementById('status');
    const lastCaptureText = document.getElementById('last-capture');
    
    // Load current settings
    window.electronAPI.getSettings().then(settings => {
      intervalInput.value = settings.interval / 1000;
      formatSelect.value = settings.format;
      folderInput.value = settings.folder;
      updateStatus(settings.active);
    });
    
    // Start capture
    startBtn.addEventListener('click', () => {
      const settings = {
        interval: parseInt(intervalInput.value) * 1000,
        format: formatSelect.value,
        folder: folderInput.value
      };
      
      window.electronAPI.startCapture(settings).then(result => {
        if (result.success) {
          updateStatus(true);
        }
      });
    });
    
    // Stop capture
    stopBtn.addEventListener('click', () => {
      window.electronAPI.stopCapture().then(result => {
        if (result.success) {
          updateStatus(false);
        }
      });
    });
    
    // Select folder
    selectFolderBtn.addEventListener('click', () => {
      window.electronAPI.selectFolder().then(result => {
        if (result.folder) {
          folderInput.value = result.folder;
        }
      });
    });
    
    // Capture events
    window.electronAPI.onCaptureSuccess((event, filePath) => {
      lastCaptureText.textContent = `Last capture: ${filePath}`;
    });
    
    window.electronAPI.onCaptureError((event, error) => {
      lastCaptureText.textContent = `Error: ${error}`;
    });
    
    function updateStatus(isActive) {
      if (isActive) {
        statusText.textContent = 'Status: Active';
        statusText.className = 'status-active';
        startBtn.disabled = true;
        stopBtn.disabled = false;
      } else {
        statusText.textContent = 'Status: Inactive';
        statusText.className = 'status-inactive';
        startBtn.disabled = false;
        stopBtn.disabled = true;
      }
    }
  });