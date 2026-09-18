/**
 * DropSpher Landing Page JavaScript
 * Pure Bootstrap 5 integration: Interactive app preview, metadata demo, discount code copy, and comparison toggles.
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Sticky Navbar & Sticky Conversion Bar Scroll Logic
  const stickyBar = document.getElementById('stickyCtaBar');
  const heroSection = document.getElementById('hero');

  window.addEventListener('scroll', () => {
    const scrollPos = window.scrollY;

    if (heroSection && stickyBar) {
      const heroBottom = heroSection.offsetTop + heroSection.offsetHeight;
      if (scrollPos > heroBottom - 150) {
        stickyBar.classList.add('visible');
      } else {
        stickyBar.classList.remove('visible');
      }
    }
  });

  // 3. Interactive App Window Simulator (Hero Mockup)
  const mockupTabButtons = document.querySelectorAll('.mockup-tab-btn');
  const appDisplayImg = document.getElementById('appScreenDisplay');
  const appWindowTitle = document.getElementById('appWindowTitle');

  const screens = {
    home: {
      src: 'assets/screenshots/app_home.png',
      title: 'DropSpher — Home (34 local operations completed · Saved 148.6 MB)'
    },
    images: {
      src: 'assets/screenshots/app_images.png',
      title: 'DropSpher — Image Studio (Convert, compress, resize, favicons & EXIF scrubber)'
    },
    pdfs: {
      src: 'assets/screenshots/app_pdfs.png',
      title: 'DropSpher — PDF Suite (PDF to Word DOCX, 300 DPI images, compress, merge & split)'
    },
    videos: {
      src: 'assets/screenshots/app_videos.png',
      title: 'DropSpher — Video & Audio (FFmpeg compression, audio extraction & GIF creator)'
    },
    modal: {
      src: 'assets/screenshots/app_modal_convert.png',
      title: 'DropSpher — Convert Format Modal (Lossless native offline engines)'
    }
  };

  mockupTabButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      mockupTabButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const target = btn.getAttribute('data-screen');
      if (screens[target] && appDisplayImg) {
        appDisplayImg.style.opacity = '0.35';
        setTimeout(() => {
          appDisplayImg.src = screens[target].src;
          if (appWindowTitle) appWindowTitle.textContent = screens[target].title;
          appDisplayImg.style.opacity = '1';
        }, 120);
      }
    });
  });

  // 4. Interactive Metadata Stripper Demo
  const metaCleanBtn = document.getElementById('metaCleanToggle');
  const metaExposedList = document.getElementById('metaExposedList');
  const metaCleanedList = document.getElementById('metaCleanedList');
  const metaStatusBadge = document.getElementById('metaStatusBadge');

  if (metaCleanBtn) {
    let isCleaned = false;
    metaCleanBtn.addEventListener('click', () => {
      isCleaned = !isCleaned;
      if (isCleaned) {
        metaExposedList.classList.add('d-none');
        metaCleanedList.classList.remove('d-none');
        metaCleanBtn.innerHTML = '<i class="bi bi-arrow-counterclockwise me-1"></i> Reset to Exposed State';
        metaCleanBtn.className = 'btn btn-outline-light btn-sm w-100';
        metaStatusBadge.textContent = '100% Sanitized & Clean';
        metaStatusBadge.className = 'badge bg-success text-white py-1 px-2';
      } else {
        metaExposedList.classList.remove('d-none');
        metaCleanedList.classList.add('d-none');
        metaCleanBtn.innerHTML = '<i class="bi bi-shield-slash-fill me-1"></i> Strip Metadata Locally Now';
        metaCleanBtn.className = 'btn btn-primary btn-sm w-100';
        metaStatusBadge.textContent = 'Private EXIF Data Exposed';
        metaStatusBadge.className = 'badge bg-danger text-white py-1 px-2';
      }
    });
  }

  // 5. PDF to Word Comparison Interactive Switcher
  const compButtons = document.querySelectorAll('.comp-switch-btn');
  const compCompetitorView = document.getElementById('compCompetitorView');
  const compDropspherView = document.getElementById('compDropspherView');

  compButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      compButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const mode = btn.getAttribute('data-mode');

      if (mode === 'competitor') {
        compCompetitorView.classList.remove('d-none');
        compDropspherView.classList.add('d-none');
      } else if (mode === 'dropspher') {
        compCompetitorView.classList.add('d-none');
        compDropspherView.classList.remove('d-none');
      } else {
        compCompetitorView.classList.remove('d-none');
        compDropspherView.classList.remove('d-none');
      }
    });
  });

  // 6. Lightbox Modal image loader
  const modalScreenshot = document.getElementById('screenshotModalImage');
  const modalTriggers = document.querySelectorAll('[data-lightbox-src]');

  modalTriggers.forEach(trigger => {
    trigger.addEventListener('click', () => {
      const src = trigger.getAttribute('data-lightbox-src');
      const title = trigger.getAttribute('data-lightbox-title');
      const modalTitle = document.getElementById('screenshotModalLabel');

      if (modalScreenshot) modalScreenshot.src = src;
      if (modalTitle && title) modalTitle.textContent = title;
    });
  });

  // 7. In-Browser 100% Client-Side Image Converter & Compressor with LocalStorage
  const dropArea = document.getElementById('webToolDropArea');
  const fileInput = document.getElementById('webToolFileInput');
  const controls = document.getElementById('webToolControls');
  const selectedName = document.getElementById('webToolSelectedFileName');
  const origSizeBadge = document.getElementById('webToolOriginalSize');
  const formatSelect = document.getElementById('webToolFormat');
  const qualitySlider = document.getElementById('webToolQuality');
  const qualityVal = document.getElementById('webToolQualityVal');
  const resizeSelect = document.getElementById('webToolResize');
  const processBtn = document.getElementById('webToolProcessBtn');
  const outputBox = document.getElementById('webToolOutput');
  const resultImg = document.getElementById('webToolResultImg');
  const outputStats = document.getElementById('webToolOutputStats');
  const savingsBadge = document.getElementById('webToolSavingsBadge');
  const outOrigSize = document.getElementById('outOrigSize');
  const outNewSize = document.getElementById('outNewSize');
  const outSavedBytes = document.getElementById('outSavedBytes');
  const downloadBtn = document.getElementById('webToolDownloadBtn');
  const localFilesCount = document.getElementById('localFilesCount');
  const localBytesSaved = document.getElementById('localBytesSaved');
  const historyList = document.getElementById('webToolHistoryList');
  const clearHistoryBtn = document.getElementById('webToolClearHistoryBtn');

  let currentLoadedImage = null;
  let currentFile = null;

  // Format bytes helper
  function formatBytes(bytes) {
    if (!bytes || bytes <= 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  }

  // LocalStorage Helpers
  function getStoredStats() {
    try {
      const data = localStorage.getItem('dropspher_web_stats');
      return data ? JSON.parse(data) : { count: 0, savedBytes: 0 };
    } catch (e) {
      return { count: 0, savedBytes: 0 };
    }
  }

  function getStoredHistory() {
    try {
      const data = localStorage.getItem('dropspher_web_history');
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  }

  function saveStoredStats(stats) {
    try {
      localStorage.setItem('dropspher_web_stats', JSON.stringify(stats));
    } catch (e) {}
  }

  function saveStoredHistory(history) {
    try {
      localStorage.setItem('dropspher_web_history', JSON.stringify(history.slice(0, 10)));
    } catch (e) {}
  }

  function renderLocalStats() {
    if (!localFilesCount || !localBytesSaved || !historyList) return;
    const stats = getStoredStats();
    const history = getStoredHistory();

    localFilesCount.textContent = stats.count.toString();
    localBytesSaved.textContent = formatBytes(stats.savedBytes);

    if (history.length === 0) {
      historyList.innerHTML = '<div class="text-secondary small text-center py-3 fst-italic">No conversions yet. Drop an image above!</div>';
    } else {
      historyList.innerHTML = history.map(item => {
        return `
          <div class="history-item d-flex justify-content-between align-items-center">
            <div class="text-truncate me-2" style="max-width: 170px;">
              <strong class="text-white">${item.name}</strong>
              <div class="text-secondary small" style="font-size: 0.75rem;">${item.format.toUpperCase()} · ${item.time}</div>
            </div>
            <div class="text-end text-nowrap">
              <span class="badge ${item.percent > 0 ? 'bg-success' : 'bg-primary'} text-white small">${item.percent > 0 ? '-' + item.percent + '%' : 'Converted'}</span>
              <div class="text-secondary small" style="font-size: 0.75rem;">${formatBytes(item.newSize)}</div>
            </div>
          </div>
        `;
      }).join('');
    }
  }

  // Clear history
  if (clearHistoryBtn) {
    clearHistoryBtn.addEventListener('click', () => {
      localStorage.removeItem('dropspher_web_stats');
      localStorage.removeItem('dropspher_web_history');
      renderLocalStats();
    });
  }

  // Initial render of stats
  renderLocalStats();

  // Quality slider listener
  if (qualitySlider && qualityVal) {
    qualitySlider.addEventListener('input', () => {
      qualityVal.textContent = qualitySlider.value + '%';
    });
  }

  // File drop & select handling
  if (dropArea && fileInput) {
    dropArea.addEventListener('click', () => fileInput.click());

    dropArea.addEventListener('dragover', (e) => {
      e.preventDefault();
      dropArea.classList.add('dragover');
    });

    ['dragleave', 'dragend'].forEach(type => {
      dropArea.addEventListener(type, () => dropArea.classList.remove('dragover'));
    });

    dropArea.addEventListener('drop', (e) => {
      e.preventDefault();
      dropArea.classList.remove('dragover');
      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        handleFileSelect(e.dataTransfer.files[0]);
      }
    });

    fileInput.addEventListener('change', () => {
      if (fileInput.files && fileInput.files.length > 0) {
        handleFileSelect(fileInput.files[0]);
      }
    });
  }

  function handleFileSelect(file) {
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file (PNG, JPG, WEBP, BMP, GIF).');
      return;
    }

    currentFile = file;
    selectedName.textContent = file.name;
    origSizeBadge.textContent = formatBytes(file.size);
    controls.classList.remove('d-none');
    if (outputBox) outputBox.classList.add('d-none');

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        currentLoadedImage = img;
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  }

  // Process image on client-side canvas
  if (processBtn) {
    processBtn.addEventListener('click', () => {
      if (!currentLoadedImage || !currentFile) {
        alert('Please drop or choose an image first.');
        return;
      }

      processBtn.disabled = true;
      processBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-1"></span> Processing Locally...';

      setTimeout(() => {
        try {
          const canvas = document.createElement('canvas');
          let width = currentLoadedImage.naturalWidth || currentLoadedImage.width;
          let height = currentLoadedImage.naturalHeight || currentLoadedImage.height;

          // Resize constraint if specified
          const resizeSetting = resizeSelect ? resizeSelect.value : 'original';
          if (resizeSetting !== 'original') {
            const maxWidth = parseInt(resizeSetting, 10);
            if (width > maxWidth) {
              const ratio = maxWidth / width;
              width = maxWidth;
              height = Math.round(height * ratio);
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          
          // Smooth rendering
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';

          // White background for JPEG if transparency
          const mimeType = formatSelect.value;
          if (mimeType === 'image/jpeg') {
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(0, 0, width, height);
          }

          ctx.drawImage(currentLoadedImage, 0, 0, width, height);

          const quality = (parseInt(qualitySlider.value, 10) || 80) / 100;

          canvas.toBlob((blob) => {
            if (!blob) {
              alert('Conversion failed in browser canvas.');
              processBtn.disabled = false;
              processBtn.innerHTML = '<i class="bi bi-lightning-charge-fill me-1"></i> Convert & Compress';
              return;
            }

            const originalBytes = currentFile.size;
            const newBytes = blob.size;
            const bytesDifference = originalBytes - newBytes;
            const savedPercentage = bytesDifference > 0 ? Math.round((bytesDifference / originalBytes) * 100) : 0;

            const objectUrl = URL.createObjectURL(blob);
            resultImg.src = objectUrl;

            // Update display metrics
            outOrigSize.textContent = formatBytes(originalBytes);
            outNewSize.textContent = formatBytes(newBytes);
            outSavedBytes.textContent = bytesDifference > 0 ? formatBytes(bytesDifference) : '0 B (Optimized)';
            
            if (savedPercentage > 0) {
              savingsBadge.textContent = `${savedPercentage}% Saved!`;
              savingsBadge.className = 'badge bg-success text-white';
            } else {
              savingsBadge.textContent = 'Converted';
              savingsBadge.className = 'badge bg-primary text-white';
            }

            outputStats.textContent = `${width}x${height}px · ${formatBytes(newBytes)}`;

            // Extension mapping
            let ext = 'webp';
            if (mimeType === 'image/jpeg') ext = 'jpg';
            if (mimeType === 'image/png') ext = 'png';
            const baseName = currentFile.name.substring(0, currentFile.name.lastIndexOf('.')) || 'image';
            const downloadFilename = `dropspher_${baseName}.${ext}`;

            downloadBtn.href = objectUrl;
            downloadBtn.download = downloadFilename;

            outputBox.classList.remove('d-none');

            // Save to localStorage
            const stats = getStoredStats();
            stats.count += 1;
            if (bytesDifference > 0) stats.savedBytes += bytesDifference;
            saveStoredStats(stats);

            const history = getStoredHistory();
            const now = new Date();
            const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            history.unshift({
              name: currentFile.name,
              origSize: originalBytes,
              newSize: newBytes,
              format: ext,
              percent: savedPercentage,
              time: timeString
            });
            saveStoredHistory(history);

            renderLocalStats();

            processBtn.disabled = false;
            processBtn.innerHTML = '<i class="bi bi-check-circle-fill text-success me-1"></i> Done! Convert Again';
          }, mimeType, quality);

        } catch (err) {
          console.error(err);
          alert('Error processing image in browser.');
          processBtn.disabled = false;
          processBtn.innerHTML = '<i class="bi bi-lightning-charge-fill me-1"></i> Convert & Compress';
        }
      }, 150);
    });
  }
});

