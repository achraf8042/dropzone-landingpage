/**
 * DropZone Landing Page JavaScript
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

  // 2. Interactive 1-Click Discount Coupon Copy Logic
  const copyCouponButtons = document.querySelectorAll('.copy-coupon-btn');
  copyCouponButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const code = 'DROPZONE2026';
      
      navigator.clipboard.writeText(code).then(() => {
        const originalHtml = btn.innerHTML;
        btn.innerHTML = '<i class="bi bi-check-circle-fill text-white me-1"></i> Copied!';
        btn.classList.add('bg-success', 'border-success');
        
        // Show temporary toast or feedback
        setTimeout(() => {
          btn.innerHTML = originalHtml;
          btn.classList.remove('bg-success', 'border-success');
        }, 2200);
      }).catch(err => {
        // Fallback for older browsers
        const tempInput = document.createElement('input');
        tempInput.value = code;
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand('copy');
        document.body.removeChild(tempInput);

        const originalHtml = btn.innerHTML;
        btn.innerHTML = '<i class="bi bi-check-circle-fill text-white me-1"></i> Copied!';
        btn.classList.add('bg-success', 'border-success');
        setTimeout(() => {
          btn.innerHTML = originalHtml;
          btn.classList.remove('bg-success', 'border-success');
        }, 2200);
      });
    });
  });

  // 3. Interactive App Window Simulator (Hero Mockup)
  const mockupTabButtons = document.querySelectorAll('.mockup-tab-btn');
  const appDisplayImg = document.getElementById('appScreenDisplay');
  const appWindowTitle = document.getElementById('appWindowTitle');

  const screens = {
    home: {
      src: 'assets/screenshots/app_home.png',
      title: 'DropZone — Home (29 local operations completed · Saved 21.2 MB)'
    },
    images: {
      src: 'assets/screenshots/app_images.png',
      title: 'DropZone — Images (Convert, compress, resize, icons & remove metadata)'
    },
    pdfs: {
      src: 'assets/screenshots/app_pdfs.png',
      title: 'DropZone — PDFs (PDF to Word DOCX, compress, merge, split & rotate)'
    },
    videos: {
      src: 'assets/screenshots/app_videos.png',
      title: 'DropZone — Videos & Audio (Extract audio & H.264 video compression)'
    },
    modal: {
      src: 'assets/screenshots/app_modal_convert.png',
      title: 'DropZone — Convert Format Dialog (WEBP, PNG, JPG, ICO, BMP, TIFF)'
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
  const compDropzoneView = document.getElementById('compDropzoneView');

  compButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      compButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const mode = btn.getAttribute('data-mode');

      if (mode === 'competitor') {
        compCompetitorView.classList.remove('d-none');
        compDropzoneView.classList.add('d-none');
      } else if (mode === 'dropzone') {
        compCompetitorView.classList.add('d-none');
        compDropzoneView.classList.remove('d-none');
      } else {
        compCompetitorView.classList.remove('d-none');
        compDropzoneView.classList.remove('d-none');
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
});
