// Enhanced Portfolio JavaScript with Modern Features
// Import CSS styles
import './styles/main.css';

// Import API client for future backend integration
import { api, apiUtils } from './utils/api.js';

// DOM Elements
const settingsToggle = document.getElementById('settings-toggle');
const settingsMenu = document.getElementById('settings-menu');
const themeToggle = document.getElementById('theme-toggle');
const colorblindToggle = document.getElementById('colorblind-toggle');
const analyticsToggle = document.getElementById('analytics-toggle');
const randomizer = document.getElementById('randomizer');
const accentColors = document.querySelectorAll('.accent-color');
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');

// Get in Touch Elements
const contactInput = document.getElementById('contact-input');
const submitContact = document.getElementById('submit-contact');
const getTouchSection = document.querySelector('.get-in-touch');

// Video Elements
const heroVideo = document.getElementById('hero-video');
const playPauseBtn = document.getElementById('play-pause');
const volumeToggleBtn = document.getElementById('volume-toggle');
const captionsToggleBtn = document.getElementById('captions-toggle');
const speedControl = document.getElementById('speed-control');
const captionsTrack = document.getElementById('captions-track');

// Modal Elements
const pdfModal = document.getElementById('pdf-modal');
const certModal = document.getElementById('cert-modal');
const closePdfBtn = document.getElementById('close-pdf');
const closeCertBtn = document.getElementById('close-cert');

// Project and Certificate Elements
const projectCards = document.querySelectorAll('.project-card');
const certCards = document.querySelectorAll('.cert-card');

// Theme Management
let currentTheme = localStorage.getItem('theme') || 'dark';
let currentAccent = localStorage.getItem('accent') || '#0066FF';
let colorblindMode = localStorage.getItem('colorblindMode') === 'true' || false;
let trackingEnabled = localStorage.getItem('trackingEnabled') !== 'false';

// Resume Download State
let hasViewedResume = localStorage.getItem('hasViewedResume') === 'true' || false;

// Enhanced Color Palettes
const colorPalettes = [
    '#0066FF', '#FF1493', '#32CD32', '#FF6600', 
    '#8A2BE2', '#20B2AA', '#FFD700', '#FF69B4',
    '#00CED1', '#FF4500', '#9932CC', '#FF1493',
    '#1E90FF', '#00FF7F', '#DC143C', '#FF8C00'
];

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initializeTheme();
    initializeSettings();
    initializeNavigation();
    initializeAnimations();
    initializeModals();
    initializeVideoControls();
    initializePostHog();
    initializeGetInTouch();
    initializeResumeDownload();
    initializeKeyboardShortcuts();
    initializeBentoGrid();
    initializeProjectsExpand();
    
    // Add initial loading state
    document.body.style.opacity = '0';
    
    // Smooth fade in
    setTimeout(() => {
        document.body.style.opacity = '1';
        document.body.style.transition = 'opacity 0.8s ease';
    }, 100);
});

// PostHog Analytics Functions
function captureAnalytics(eventName, properties = {}) {
    if (typeof posthog !== 'undefined' && trackingEnabled) {
        posthog.capture(eventName, properties);
    }
}

function initializePostHog() {
    // Get PostHog configuration from environment variables
    const posthogKey = import.meta.env.VITE_POSTHOG_KEY;
    const posthogHost = import.meta.env.VITE_POSTHOG_HOST || 'https://us.posthog.com';
    
    if (posthogKey && window.location.protocol !== 'file:') {
        // Initialize PostHog with environment variables
        !function(t,e){var o,n,p,r;e.__SV||(window.posthog=e,e._i=[],e.init=function(i,s,a){function g(t,e){var o=e.split(".");2==o.length&&(t=t[o[0]],e=o[1]);t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}}(p=t.createElement("script")).type="text/javascript",p.async=!0,p.src=s.api_host+"/static/array.js",(r=t.getElementsByTagName("script")[0]).parentNode.insertBefore(p,r);var u=e;for(void 0!==a?u=e[a]=[]:a="posthog",u.people=u.people||[],u.toString=function(t){var e="posthog";return"posthog"!==a&&(e+="."+a),t||(e+=" (stub)"),e},u.people.toString=function(){return u.toString(1)+".people (stub)";},o="capture identify alias people.set people.set_once set_config register register_once unregister opt_out_capturing has_opted_out_capturing opt_in_capturing reset isFeatureEnabled onFeatureFlags getFeatureFlag getFeatureFlagPayload reloadFeatureFlags group updateEarlyAccessFeatureEnrollment getEarlyAccessFeatures getActiveMatchingSurveys getSurveys".split(" "),n=0;n<o.length;n++)g(u,o[n]);e._i.push([i,s,a])},e.__SV=1)}(document,window.posthog||[]);
        posthog.init(posthogKey, {api_host: posthogHost});
        
        // Set initial opt-out state based on user preference
        if (trackingEnabled) {
            posthog.opt_in_capturing();
            // Only capture if tracking is enabled
            captureAnalytics('portfolio_loaded', {
                theme: currentTheme,
                accent_color: currentAccent,
                colorblind_mode: colorblindMode,
                user_agent: navigator.userAgent,
                screen_resolution: `${window.screen.width}x${window.screen.height}`,
                viewport_size: `${window.innerWidth}x${window.innerHeight}`
            });
        } else {
            posthog.opt_out_capturing();
        }
    } else {
        // Create dummy PostHog object for local development
        window.posthog = {
            capture: function() { /* no-op */ },
            identify: function() { /* no-op */ },
            opt_in_capturing: function() { /* no-op */ },
            opt_out_capturing: function() { /* no-op */ }
        };
        console.log('📊 PostHog disabled - no API key or running on file:// protocol');
    }
}

// Theme Management Functions
function initializeTheme() {
    document.documentElement.setAttribute('data-theme', currentTheme);
    document.documentElement.setAttribute('data-colorblind', colorblindMode);
    
    if (!colorblindMode) {
        document.documentElement.style.setProperty('--accent-color', currentAccent);
    }
    
    // Update active accent color
    updateActiveAccentColor();
}

function updateActiveAccentColor() {
    accentColors.forEach(color => {
        color.classList.remove('active');
        if (color.dataset.color === currentAccent) {
            color.classList.add('active');
        }
    });
}

// Settings Management Functions
function initializeSettings() {
    // Settings dropdown toggle
    settingsToggle.addEventListener('click', () => {
        const isOpening = !settingsMenu.classList.contains('show');
        settingsMenu.classList.toggle('show');
        
        // Update ARIA state
        settingsToggle.setAttribute('aria-expanded', isOpening.toString());
        
        // PostHog Analytics
        captureAnalytics('settings_dropdown_toggled', {
            action: isOpening ? 'opened' : 'closed',
            theme: currentTheme,
            colorblind_mode: colorblindMode
        });
        
        // Add click animation
        settingsToggle.style.transform = 'scale(0.95)';
        setTimeout(() => {
            settingsToggle.style.transform = '';
        }, 150);
    });
    
    // Close settings when clicking outside
    document.addEventListener('click', (e) => {
        if (!settingsToggle.contains(e.target) && !settingsMenu.contains(e.target)) {
            settingsMenu.classList.remove('show');
            settingsToggle.setAttribute('aria-expanded', 'false');
        }
    });
    
    // Initialize toggle states
    updateToggleState(themeToggle, currentTheme === 'dark');
    updateToggleState(colorblindToggle, colorblindMode);
    updateToggleState(analyticsToggle, trackingEnabled);
    
    // Update theme toggle text
    updateThemeToggleText();
    
    // Initialize analytics toggle
    initializeAnalyticsToggle();
}

function updateToggleState(toggleButton, isActive) {
    const toggleSwitch = toggleButton.querySelector('.toggle-switch');
    if (isActive) {
        toggleSwitch.classList.add('active');
    } else {
        toggleSwitch.classList.remove('active');
    }
}

function updateThemeToggleText() {
    const themeText = themeToggle.querySelector('span');
    themeText.textContent = currentTheme === 'dark' ? 'Dark Mode' : 'Light Mode';
}

// Theme Toggle Functionality
themeToggle.addEventListener('click', () => {
    const previousTheme = currentTheme;
    currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('theme', currentTheme);
    
    document.documentElement.setAttribute('data-theme', currentTheme);
    updateToggleState(themeToggle, currentTheme === 'dark');
    updateThemeToggleText();
    
    // PostHog Analytics
    captureAnalytics('theme_changed', {
        from_theme: previousTheme,
        to_theme: currentTheme,
        colorblind_mode: colorblindMode
    });
    
    // Add click animation
    themeToggle.style.transform = 'scale(0.98)';
    setTimeout(() => {
        themeToggle.style.transform = '';
    }, 150);
});

// Colorblind Toggle Functionality
colorblindToggle.addEventListener('click', () => {
    const previousMode = colorblindMode;
    colorblindMode = !colorblindMode;
    localStorage.setItem('colorblindMode', colorblindMode);
    
    updateToggleState(colorblindToggle, colorblindMode);
    document.documentElement.setAttribute('data-colorblind', colorblindMode);
    
    if (colorblindMode) {
        // Disable accent color picker
        accentColors.forEach(color => {
            color.style.pointerEvents = 'none';
            color.style.opacity = '0.5';
        });
        randomizer.style.pointerEvents = 'none';
        randomizer.style.opacity = '0.5';
    } else {
        // Re-enable accent colors
        document.documentElement.style.setProperty('--accent-color', currentAccent);
        accentColors.forEach(color => {
            color.style.pointerEvents = 'all';
            color.style.opacity = '1';
        });
        randomizer.style.pointerEvents = 'all';
        randomizer.style.opacity = '1';
    }
    
    // PostHog Analytics
    captureAnalytics('colorblind_mode_toggled', {
        colorblind_mode: colorblindMode,
        theme: currentTheme,
        previous_mode: previousMode
    });
    
    // Add click animation
    colorblindToggle.style.transform = 'scale(0.98)';
    setTimeout(() => {
        colorblindToggle.style.transform = '';
    }, 150);
});

// Analytics Toggle Functionality
function initializeAnalyticsToggle() {
    // Analytics toggle click handler
    analyticsToggle.addEventListener('click', () => {
        const previousState = trackingEnabled;
        trackingEnabled = !trackingEnabled;
        localStorage.setItem('trackingEnabled', trackingEnabled);
        
        updateToggleState(analyticsToggle, trackingEnabled);
        
        // Update PostHog state
        if (typeof posthog !== 'undefined') {
            if (trackingEnabled) {
                posthog.opt_in_capturing();
                // Capture the opt-in event after enabling
                posthog.capture('analytics_opt_in', {
                    previous_state: previousState ? 'enabled' : 'disabled',
                    new_state: 'enabled',
                    theme: currentTheme,
                    colorblind_mode: colorblindMode
                });
            } else {
                // Capture the opt-out event before disabling
                posthog.capture('analytics_opt_out', {
                    previous_state: previousState ? 'enabled' : 'disabled',
                    new_state: 'disabled',
                    theme: currentTheme,
                    colorblind_mode: colorblindMode
                });
                posthog.opt_out_capturing();
            }
        }
        
        // Add click animation
        analyticsToggle.style.transform = 'scale(0.98)';
        setTimeout(() => {
            analyticsToggle.style.transform = '';
        }, 150);
    });
}

// Accent Color Picker Functionality
accentColors.forEach(color => {
    color.addEventListener('click', () => {
        if (colorblindMode) return; // Don't allow color changes in colorblind mode
        
        const previousAccent = currentAccent;
        currentAccent = color.dataset.color;
        localStorage.setItem('accent', currentAccent);
        
        // Update CSS custom property with animation
        document.documentElement.style.setProperty('--accent-color', currentAccent);
        
        // Update active state with animation
        updateActiveAccentColor();
        
        // PostHog Analytics
        if (typeof posthog !== 'undefined') {
            posthog.capture('accent_color_changed', {
                from_color: previousAccent,
                to_color: currentAccent,
                theme: currentTheme,
                selection_method: 'color_picker'
            });
        }
        
        // Add click effect
        color.style.transform = 'scale(1.2) rotate(10deg)';
        setTimeout(() => {
            color.style.transform = '';
        }, 200);
        
        // Trigger color change animation
        triggerColorChangeAnimation();
    });
});

// Randomizer Functionality
randomizer.addEventListener('click', () => {
    if (colorblindMode) return; // Don't allow color changes in colorblind mode
    
    const previousAccent = currentAccent;
    const randomColor = colorPalettes[Math.floor(Math.random() * colorPalettes.length)];
    currentAccent = randomColor;
    localStorage.setItem('accent', currentAccent);
    
    // Update CSS with animation
    document.documentElement.style.setProperty('--accent-color', currentAccent);
    updateActiveAccentColor();
    
    // PostHog Analytics
    if (typeof posthog !== 'undefined') {
        posthog.capture('accent_color_changed', {
            from_color: previousAccent,
            to_color: currentAccent,
            theme: currentTheme,
            selection_method: 'randomizer'
        });
    }
    
    // Special randomizer animation
    randomizer.style.transform = 'rotate(360deg) scale(1.1)';
    setTimeout(() => {
        randomizer.style.transform = '';
    }, 600);
    
    // Trigger dramatic color change
    triggerColorChangeAnimation();
    
    // Add confetti effect (visual feedback)
    createConfettiEffect();
});

// Color Change Animation
function triggerColorChangeAnimation() {
    const elements = document.querySelectorAll('.bento-box, .work-item, .project-card, .cert-card');
    elements.forEach((element, index) => {
        setTimeout(() => {
            element.style.transform = 'scale(1.02)';
            setTimeout(() => {
                element.style.transform = '';
            }, 200);
        }, index * 50);
    });
}

// Confetti Effect for Randomizer
function createConfettiEffect() {
    for (let i = 0; i < 20; i++) {
        const confetti = document.createElement('div');
        confetti.style.position = 'fixed';
        confetti.style.width = '10px';
        confetti.style.height = '10px';
        confetti.style.backgroundColor = colorPalettes[Math.floor(Math.random() * colorPalettes.length)];
        confetti.style.left = Math.random() * window.innerWidth + 'px';
        confetti.style.top = '-10px';
        confetti.style.pointerEvents = 'none';
        confetti.style.zIndex = '9999';
        confetti.style.borderRadius = '50%';
        
        document.body.appendChild(confetti);
        
        // Animate confetti
        const fallDuration = Math.random() * 3000 + 2000;
        confetti.animate([
            { transform: 'translateY(0) rotate(0deg)', opacity: 1 },
            { transform: `translateY(${window.innerHeight + 100}px) rotate(720deg)`, opacity: 0 }
        ], {
            duration: fallDuration,
            easing: 'ease-in'
        }).onfinish = () => confetti.remove();
    }
}

// Navigation Functions
function initializeNavigation() {
    // Mobile menu toggle
    const toggleNavMenu = () => {
        const isOpening = !navMenu.classList.contains('active');
        navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
        
        // Update ARIA state
        navToggle.setAttribute('aria-expanded', isOpening.toString());
        
        // Animate hamburger
        navToggle.style.transform = 'scale(0.9)';
        setTimeout(() => {
            navToggle.style.transform = '';
        }, 150);
    };
    
    navToggle.addEventListener('click', toggleNavMenu);
    
    // Keyboard support for nav toggle
    navToggle.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggleNavMenu();
        }
    });
    
    // Smooth scroll for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const offsetTop = targetElement.offsetTop - 80; // Account for fixed nav
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
                
                // Close mobile menu
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
            }
        });
    });
    
    // Active nav link highlighting
    window.addEventListener('scroll', throttle(updateActiveNavLink, 100));
}

function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPos = window.scrollY + 100;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

// Animation Functions
function initializeAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                
                // Stagger animation for items within the container
                const animateItems = entry.target.querySelectorAll('.animate-item, .animate-card');
                animateItems.forEach((item, index) => {
                    setTimeout(() => {
                        item.classList.add('in-view');
                    }, index * 100);
                });
            } else {
                // Remove in-view class when element leaves viewport
                entry.target.classList.remove('in-view');
            }
        });
    }, observerOptions);
    
    // Observe all animated elements including get-in-touch
    document.querySelectorAll('.animate-box, .animate-item, .animate-card, .get-in-touch').forEach(element => {
        observer.observe(element);
    });
    
    // Add hover animations to buttons
    document.querySelectorAll('.animate-btn').forEach(btn => {
        btn.addEventListener('mouseenter', () => {
            btn.style.transform = 'translateY(-3px) scale(1.02)';
        });
        
        btn.addEventListener('mouseleave', () => {
            btn.style.transform = '';
        });
        
        btn.addEventListener('click', () => {
            btn.style.transform = 'scale(0.98)';
            setTimeout(() => {
                btn.style.transform = '';
            }, 150);
        });
    });
    
    // Add micro-interactions to all interactive elements
    addMicroInteractions();
}

function addMicroInteractions() {
    // Add ripple effect to clickable elements
    document.querySelectorAll('button, .project-card, .cert-card, .work-item, .accent-color').forEach(element => {
        element.addEventListener('click', createRippleEffect);
    });
    
    // Add hover effects to cards
    document.querySelectorAll('.bento-box').forEach(box => {
        box.addEventListener('mouseenter', () => {
            box.style.transform = 'translate(-4px, -4px) scale(1.01)';
        });
        
        box.addEventListener('mouseleave', () => {
            box.style.transform = '';
        });
    });
}

function createRippleEffect(e) {
    const button = e.currentTarget;
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;
    
    const ripple = document.createElement('div');
    ripple.style.position = 'absolute';
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    ripple.style.background = 'rgba(255, 255, 255, 0.3)';
    ripple.style.borderRadius = '50%';
    ripple.style.pointerEvents = 'none';
    ripple.style.transform = 'scale(0)';
    ripple.style.transition = 'transform 0.6s ease';
    
    button.style.position = 'relative';
    button.style.overflow = 'hidden';
    button.appendChild(ripple);
    
    setTimeout(() => {
        ripple.style.transform = 'scale(1)';
        ripple.style.opacity = '0';
    }, 10);
    
    setTimeout(() => {
        ripple.remove();
    }, 600);
}

// Modal Functions
function initializeModals() {
    // Project cards - PDF viewer
    projectCards.forEach(card => {
        card.addEventListener('click', () => {
            const pdfPath = card.dataset.pdf;
            const projectTitle = card.querySelector('h3').textContent;
            openPDFModal(pdfPath, projectTitle);
        });
    });
    
    // Certificate cards - Gallery viewer
    certCards.forEach(card => {
        card.addEventListener('click', () => {
            const certPath = card.dataset.cert;
            const certTitle = card.querySelector('h3').textContent;
            openCertModal(certPath, certTitle);
        });
    });
    
    // Close modals
    closePdfBtn.addEventListener('click', closePDFModal);
    closeCertBtn.addEventListener('click', closeCertModal);
    
    // Close on backdrop click
    pdfModal.addEventListener('click', (e) => {
        if (e.target === pdfModal) closePDFModal();
    });
    
    certModal.addEventListener('click', (e) => {
        if (e.target === certModal) closeCertModal();
    });
    
    // Close on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closePDFModal();
            closeCertModal();
        }
    });
}

// PDF Modal Functions
let currentPDF = null;
let currentPage = 1;
let totalPages = 1;
let currentScale = 1.0;

function openPDFModal(pdfPath, title) {
    document.getElementById('pdf-title').textContent = title;
    pdfModal.classList.add('show');
    document.body.style.overflow = 'hidden';
    
    // Focus trapping setup
    setupFocusTrap(pdfModal);
    
    // Focus the close button for accessibility
    setTimeout(() => {
        const closeButton = pdfModal.querySelector('#close-pdf');
        if (closeButton) closeButton.focus();
    }, 100);
    
    // PostHog Analytics - different events for resume vs projects
    if (typeof posthog !== 'undefined') {
        if (pdfPath === 'resume.pdf') {
            posthog.capture('resume_pdf_viewed', {
                title: title,
                theme: currentTheme,
                colorblind_mode: colorblindMode
            });
        } else {
            posthog.capture('project_pdf_viewed', {
                project_title: title,
                pdf_path: pdfPath,
                theme: currentTheme,
                colorblind_mode: colorblindMode
            });
        }
    }
    
    // Load PDF with PDF.js
    loadPDF(pdfPath);
    
    // Initialize PDF controls
    initializePDFControls();
}

function closePDFModal() {
    pdfModal.classList.remove('show');
    document.body.style.overflow = '';
    currentPDF = null;
    
    // Remove focus trap and restore focus
    removeFocusTrap(pdfModal);
}

async function loadPDF(pdfPath) {
    try {
        // Handle resume.pdf differently (it's in root, not assets/pdfs/)
        const fullPath = pdfPath === 'resume.pdf' ? './resume.pdf' : `assets/pdfs/${pdfPath}`;
        console.log('Loading PDF from path:', fullPath);
        
        const loadingTask = pdfjsLib.getDocument(fullPath);
        currentPDF = await loadingTask.promise;
        totalPages = currentPDF.numPages;
        currentPage = 1;
        
        renderPDFPage();
        updatePageInfo();
        console.log('PDF loaded successfully:', totalPages, 'pages');
    } catch (error) {
        console.error('Error loading PDF:', error);
        console.error('Failed path was:', pdfPath);
        
        // Show fallback message
        const canvas = document.getElementById('pdf-canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = 600;
        canvas.height = 800;
        ctx.fillStyle = '#f0f0f0';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#666';
        ctx.font = '18px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Resume Preview', canvas.width / 2, canvas.height / 2 - 20);
        ctx.fillText('Available on live site', canvas.width / 2, canvas.height / 2 + 20);
    }
}

async function renderPDFPage() {
    if (!currentPDF) return;
    
    const page = await currentPDF.getPage(currentPage);
    const canvas = document.getElementById('pdf-canvas');
    const ctx = canvas.getContext('2d');
    
    const viewport = page.getViewport({ scale: currentScale });
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    
    const renderContext = {
        canvasContext: ctx,
        viewport: viewport
    };
    
    await page.render(renderContext).promise;
}

function initializePDFControls() {
    document.getElementById('prev-page').onclick = () => {
        if (currentPage > 1) {
            currentPage--;
            renderPDFPage();
            updatePageInfo();
        }
    };
    
    document.getElementById('next-page').onclick = () => {
        if (currentPage < totalPages) {
            currentPage++;
            renderPDFPage();
            updatePageInfo();
        }
    };
    
    document.getElementById('zoom-in').onclick = () => {
        currentScale = Math.min(currentScale + 0.25, 3.0);
        renderPDFPage();
    };
    
    document.getElementById('zoom-out').onclick = () => {
        currentScale = Math.max(currentScale - 0.25, 0.5);
        renderPDFPage();
    };
    
    document.getElementById('download-pdf').onclick = () => {
        const link = document.createElement('a');
        link.href = `assets/pdfs/${document.getElementById('pdf-title').textContent}.pdf`;
        link.download = `${document.getElementById('pdf-title').textContent}.pdf`;
        link.click();
    };
}

function updatePageInfo() {
    document.getElementById('page-info').textContent = `Page ${currentPage} of ${totalPages}`;
}

// Certificate Modal Functions
const certificateImages = [
    'assets/certificates/cert1.jpg',
    'assets/certificates/cert2.jpg',
    'assets/certificates/cert3.jpg'
];

let currentCertIndex = 0;

function openCertModal(certPath, title) {
    document.getElementById('cert-title').textContent = title;
    
    // Find certificate index
    currentCertIndex = certificateImages.findIndex(img => img.includes(certPath));
    if (currentCertIndex === -1) currentCertIndex = 0;
    
    // PostHog Analytics
    if (typeof posthog !== 'undefined') {
        posthog.capture('certificate_viewed', {
            certificate_title: title,
            cert_path: certPath,
            theme: currentTheme,
            colorblind_mode: colorblindMode
        });
    }
    
    updateCertImage();
    certModal.classList.add('show');
    document.body.style.overflow = 'hidden';
    
    // Focus trapping setup
    setupFocusTrap(certModal);
    
    // Focus the close button for accessibility
    setTimeout(() => {
        const closeButton = certModal.querySelector('#close-cert');
        if (closeButton) closeButton.focus();
    }, 100);
    
    initializeCertControls();
}

function closeCertModal() {
    certModal.classList.remove('show');
    document.body.style.overflow = '';
    
    // Remove focus trap and restore focus
    removeFocusTrap(certModal);
}

function updateCertImage() {
    const certImage = document.getElementById('cert-image');
    certImage.src = certificateImages[currentCertIndex] || 'assets/certificates/placeholder.jpg';
    certImage.onerror = () => {
        // Fallback placeholder
        certImage.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjZjBmMGYwIi8+Cjx0ZXh0IHg9IjIwMCIgeT0iMTUwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjNjY2IiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTgiPkNlcnRpZmljYXRlIFByZXZpZXc8L3RleHQ+Cjwvc3ZnPg==';
    };
}

function initializeCertControls() {
    document.getElementById('cert-prev').onclick = () => {
        currentCertIndex = (currentCertIndex - 1 + certificateImages.length) % certificateImages.length;
        updateCertImage();
    };
    
    document.getElementById('cert-next').onclick = () => {
        currentCertIndex = (currentCertIndex + 1) % certificateImages.length;
        updateCertImage();
    };
    
    document.getElementById('cert-zoom').onclick = () => {
        const certImage = document.getElementById('cert-image');
        if (certImage.style.transform === 'scale(2)') {
            certImage.style.transform = 'scale(1)';
        } else {
            certImage.style.transform = 'scale(2)';
        }
    };
}

// Video Control Functions
function initializeVideoControls() {
    const videoControls = document.querySelector('.video-controls');
    const videoShortcutDesktop = document.getElementById('video-shortcut-desktop');
    const videoShortcutMobile = document.getElementById('video-shortcut-mobile');
    
    // Initially hide controls and shortcuts - will show them only if video loads successfully
    if (videoControls) {
        videoControls.style.display = 'none';
    }
    if (videoShortcutDesktop) {
        videoShortcutDesktop.style.display = 'none';
    }
    if (videoShortcutMobile) {
        videoShortcutMobile.style.display = 'none';
    }
    
    // Check if video element exists and has a valid source
    if (!heroVideo) {
        console.log('Video element not found - controls and shortcuts will remain hidden');
        return;
    }
    
    let isPlaying = true;
    let isMuted = true;
    let captionsEnabled = false;
    
    // Play/Pause functionality
    if (playPauseBtn && heroVideo) {
        playPauseBtn.addEventListener('click', () => {
            if (heroVideo.paused) {
                heroVideo.play().then(() => {
                    playPauseBtn.textContent = 'PAUSE';
                    isPlaying = true;
                }).catch(e => {
                    console.error('Error playing video:', e);
                });
                
                // PostHog Analytics
                if (typeof posthog !== 'undefined') {
                    posthog.capture('video_played', {
                        theme: currentTheme,
                        colorblind_mode: colorblindMode
                    });
                }
            } else {
                heroVideo.pause();
                playPauseBtn.textContent = 'PLAY';
                isPlaying = false;
                
                // PostHog Analytics
                if (typeof posthog !== 'undefined') {
                    posthog.capture('video_paused', {
                        theme: currentTheme,
                        colorblind_mode: colorblindMode
                    });
                }
            }
        });
    }
    
    // Volume toggle functionality
    if (volumeToggleBtn && heroVideo) {
        volumeToggleBtn.addEventListener('click', () => {
            if (heroVideo.muted) {
                heroVideo.muted = false;
                volumeToggleBtn.textContent = 'MUTE';
                isMuted = false;
                
                // PostHog Analytics
                if (typeof posthog !== 'undefined') {
                    posthog.capture('video_unmuted', {
                        theme: currentTheme,
                        colorblind_mode: colorblindMode
                    });
                }
            } else {
                heroVideo.muted = true;
                volumeToggleBtn.textContent = 'UNMUTE';
                isMuted = true;
                
                // PostHog Analytics
                if (typeof posthog !== 'undefined') {
                    posthog.capture('video_muted', {
                        theme: currentTheme,
                        colorblind_mode: colorblindMode
                    });
                }
            }
        });
    }
    
    // Captions toggle functionality
    if (captionsToggleBtn && captionsTrack) {
        captionsToggleBtn.addEventListener('click', () => {
            if (captionsEnabled) {
                captionsTrack.mode = 'hidden';
                captionsToggleBtn.style.opacity = '0.6';
                captionsEnabled = false;
                
                // PostHog Analytics
                if (typeof posthog !== 'undefined') {
                    posthog.capture('captions_disabled', {
                        theme: currentTheme,
                        colorblind_mode: colorblindMode
                    });
                }
            } else {
                captionsTrack.mode = 'showing';
                captionsToggleBtn.style.opacity = '1';
                captionsEnabled = true;
                
                // PostHog Analytics
                if (typeof posthog !== 'undefined') {
                    posthog.capture('captions_enabled', {
                        theme: currentTheme,
                        colorblind_mode: colorblindMode
                    });
                }
            }
        });
    }
    
    // Speed control functionality (button cycling through speeds)
    if (speedControl && heroVideo) {
        const speeds = [0.5, 0.75, 1, 1.25, 1.5, 2];
        let currentSpeedIndex = 2; // Start at 1x (index 2)
        
        speedControl.addEventListener('click', () => {
            currentSpeedIndex = (currentSpeedIndex + 1) % speeds.length;
            const newSpeed = speeds[currentSpeedIndex];
            
            heroVideo.playbackRate = newSpeed;
            speedControl.textContent = `${newSpeed}x`;
            speedControl.setAttribute('data-speed', newSpeed);
            
            // PostHog Analytics
            if (typeof posthog !== 'undefined') {
                posthog.capture('video_speed_changed', {
                    new_speed: newSpeed,
                    theme: currentTheme,
                    colorblind_mode: colorblindMode
                });
            }
        });
    }
    
    // Video event listeners
    if (heroVideo) {
        // Show controls and shortcuts when video is ready to play
        heroVideo.addEventListener('canplay', () => {
            console.log('Video can play - showing controls and shortcuts');
            if (videoControls) {
                videoControls.style.display = 'flex';
            }
            if (videoShortcutDesktop) {
                videoShortcutDesktop.style.display = 'list-item';
            }
            if (videoShortcutMobile) {
                videoShortcutMobile.style.display = 'inline-block';
            }
        });
        
        heroVideo.addEventListener('loadedmetadata', () => {
            heroVideo.currentTime = 0;
        });
        
        heroVideo.addEventListener('ended', () => {
            if (playPauseBtn) {
                playPauseBtn.textContent = 'PLAY';
                isPlaying = false;
            }
        });
        
        // Enhanced error handling
        heroVideo.addEventListener('error', (e) => {
            console.log('Video loading error:', e);
            if (videoControls) {
                videoControls.style.display = 'none';
            }
            if (videoShortcutDesktop) {
                videoShortcutDesktop.style.display = 'none';
            }
            if (videoShortcutMobile) {
                videoShortcutMobile.style.display = 'none';
            }
        });
        
        // Handle case where video fails to load initially
        heroVideo.addEventListener('loadstart', () => {
            console.log('Video loading started');
        });
        
        // Fallback: if video doesn't fire canplay within 3 seconds, check if it's actually playable
        setTimeout(() => {
            if (heroVideo.readyState >= 3) { // HAVE_FUTURE_DATA or higher
                console.log('Video ready (fallback check) - showing controls and shortcuts');
                if (videoControls) {
                    videoControls.style.display = 'flex';
                }
                if (videoShortcutDesktop) {
                    videoShortcutDesktop.style.display = 'list-item';
                }
                if (videoShortcutMobile) {
                    videoShortcutMobile.style.display = 'inline-block';
                }
            } else if (heroVideo.networkState === 3) { // NETWORK_NO_SOURCE
                console.log('Video has no source - keeping controls and shortcuts hidden');
                if (videoControls) {
                    videoControls.style.display = 'none';
                }
                if (videoShortcutDesktop) {
                    videoShortcutDesktop.style.display = 'none';
                }
                if (videoShortcutMobile) {
                    videoShortcutMobile.style.display = 'none';
                }
            }
        }, 3000);
    }
}

// Legacy Keyboard Shortcuts (kept for T, M, C, X keys)
document.addEventListener('keydown', (e) => {
    // Don't trigger shortcuts when typing in inputs
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
    
    // Don't trigger video shortcuts when buttons are focused
    const isButtonFocused = e.target.tagName === 'BUTTON' || 
                           e.target.tagName === 'A' || 
                           e.target.classList.contains('animate-btn') ||
                           e.target.id === 'submit-contact' ||
                           e.target.id === 'resume-download-btn';
    
    switch (e.code) {
        // Space key is now handled by the keyboard shortcuts system
        case 'KeyT':
            e.preventDefault();
            themeToggle.click();
            break;
        case 'KeyM':
            e.preventDefault();
            if (volumeToggleBtn) volumeToggleBtn.click();
            break;
        case 'KeyC':
            e.preventDefault();
            if (captionsToggleBtn) captionsToggleBtn.click();
            break;
        case 'KeyX':
            e.preventDefault();
            randomizer.click();
            break;
    }
});

// Touch Gestures for Mobile
let touchStartX = 0;
let touchStartY = 0;

document.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
}, { passive: true });

document.addEventListener('touchend', (e) => {
    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;
    
    const deltaX = touchEndX - touchStartX;
    const deltaY = touchEndY - touchStartY;
    
    // Swipe gestures for theme switching
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
        if (deltaX > 0 && currentTheme === 'dark') {
            themeToggle.click();
        } else if (deltaX < 0 && currentTheme === 'light') {
            themeToggle.click();
        }
    }
}, { passive: true });

// Parallax Effect
window.addEventListener('scroll', throttle(() => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    const heroContent = document.querySelector('.hero-content');
    
    if (hero && heroContent && scrolled < window.innerHeight) {
        heroContent.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
}, 16));

// Utility Functions
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Loading Animation
window.addEventListener('load', () => {
    // Add staggered loading animation
    const elements = document.querySelectorAll('.bento-box');
    elements.forEach((element, index) => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            element.style.transition = 'all 0.6s ease';
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }, index * 100);
    });
});

// Performance Monitoring
const performanceObserver = new PerformanceObserver((list) => {
    list.getEntries().forEach((entry) => {
        if (entry.entryType === 'measure') {
            console.log(`Performance: ${entry.name} took ${entry.duration}ms`);
        }
    });
});

performanceObserver.observe({ entryTypes: ['measure'] });

// Error Handling
window.addEventListener('error', (e) => {
    console.error('Portfolio Error:', e.error);
});

// Console Art
console.log(`
╔═══════════════════════════════════════════╗
║        ASHAR'S PORTFOLIO LOADED           ║
║                                           ║
║  Keyboard Shortcuts:                      ║
║  • /: Show shortcuts panel                ║
║  • Space: Play/Pause Video                ║
║  • Z+C: Get in Touch                      ║
║  • Z+X: Random Color                      ║
║  • Z+N: Toggle Theme                      ║
║                                           ║
║  Look for the /shortcuts button!          ║
╚═══════════════════════════════════════════╝
`);

// Local development notes
if (window.location.protocol === 'file:') {
    console.log('🔧 Local Development Mode');
    console.log('• Missing media files are expected (placeholders)');
    console.log('• PDF viewer requires HTTP server for testing');
    console.log('• PostHog analytics disabled');
    console.log('• Deploy to Netlify for full functionality');
}

// Get in Touch Functions
function initializeGetInTouch() {
    if (!contactInput || !submitContact) return;
    
    // Store original button text
    const originalButtonText = submitContact.textContent;
    
    // Add vibration animation on focus
    contactInput.addEventListener('focus', () => {
        triggerVibrationAnimation();
    });
    
    // Real-time validation on input
    contactInput.addEventListener('input', () => {
        const value = contactInput.value;
        
        // Check if first character is '/' - trigger keyboard shortcuts
        if (value === '/') {
            // Clear the input
            contactInput.value = '';
            
            // Focus out of the text box
            contactInput.blur();
            
            // Toggle keyboard shortcuts panel
            if (typeof keyboardShortcuts !== 'undefined') {
                keyboardShortcuts.togglePanel();
                
                // Track this unique shortcut method
                if (typeof posthog !== 'undefined') {
                    posthog.capture('keyboard_shortcuts_opened_via_contact_input', {
                        method: 'contact_input_slash',
                        theme: currentTheme,
                        colorblind_mode: colorblindMode
                    });
                }
            }
            
            // Reset button state
            submitContact.textContent = originalButtonText;
            submitContact.style.background = '';
            submitContact.style.color = '';
            contactInput.style.borderColor = '';
            
            return;
        }
        
        const trimmedValue = value.trim();
        const validationMessage = document.getElementById('contact-validation');
        
        if (trimmedValue) {
            const validation = validateContactInput(trimmedValue);
            if (validation.isValid) {
                // Show success state
                submitContact.textContent = 'PRESS ENTER ↵';
                submitContact.style.background = 'var(--accent-color)';
                submitContact.style.color = 'var(--bg-color)';
                contactInput.style.borderColor = 'var(--accent-color)';
                contactInput.setAttribute('aria-invalid', 'false');
                
                // Accessible success feedback
                if (validationMessage) {
                    validationMessage.textContent = `Valid ${validation.type} format`;
                    validationMessage.className = 'validation-message success';
                }
            } else {
                // Show error state
                submitContact.textContent = originalButtonText;
                submitContact.style.background = '';
                submitContact.style.color = '';
                contactInput.style.borderColor = '#ff4444';
                contactInput.setAttribute('aria-invalid', 'true');
                
                // Accessible error feedback
                if (validationMessage) {
                    validationMessage.textContent = 'Please enter a valid email address or phone number';
                    validationMessage.className = 'validation-message error';
                }
            }
        } else {
            // Reset to default state when empty
            submitContact.textContent = originalButtonText;
            submitContact.style.background = '';
            submitContact.style.color = '';
            contactInput.style.borderColor = '';
            contactInput.setAttribute('aria-invalid', 'false');
            
            // Clear validation message
            if (validationMessage) {
                validationMessage.textContent = '';
                validationMessage.className = 'validation-message';
            }
        }
    });
    
    // Form submission
    submitContact.addEventListener('click', handleContactSubmission);
    
    // Enter key submission
    contactInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleContactSubmission();
        }
    });
}

function handleContactSubmission() {
    const contactValue = contactInput.value.trim();
    
    if (!contactValue) {
        triggerVibrationAnimation();
        contactInput.focus();
        return;
    }
    
    const validation = validateContactInput(contactValue);
    if (!validation.isValid) {
        triggerVibrationAnimation();
        contactInput.style.borderColor = '#ff4444';
        setTimeout(() => {
            contactInput.style.borderColor = '';
        }, 2000);
        return;
    }
    
    // Create explosive animation
    createExplosiveAnimation();
    
    // Send to PostHog as person
    sendToPostHog(contactValue);
    
    // Show success feedback
    showSuccessFeedback();
}

function validateContactInput(value) {
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    // Check if it's a valid email first
    if (emailRegex.test(value)) {
        return { isValid: true, type: 'email' };
    }
    
    // Remove all non-digit characters for number validation
    const digitsOnly = value.replace(/\D/g, '');
    
    // Check if it's exactly 10 digits for Indian mobile number
    if (digitsOnly.length === 10 && /^[6-9]\d{9}$/.test(digitsOnly)) {
        return { isValid: true, type: 'mobile' };
    }
    
    // Check if it's a valid international phone number (with country code)
    // Must have + sign and be between 10-15 digits total
    if (value.startsWith('+') && digitsOnly.length >= 10 && digitsOnly.length <= 15) {
        const internationalPhoneRegex = /^\+[1-9]\d{9,14}$/;
        if (internationalPhoneRegex.test(value.replace(/[\s\-\(\)]/g, ''))) {
            return { isValid: true, type: 'phone' };
        }
    }
    
    return { isValid: false, type: null };
}

function sendToPostHog(contactValue) {
    if (typeof posthog === 'undefined') return;
    
    // Get validation details
    const validation = validateContactInput(contactValue);
    const contactType = validation.type;
    
    // Identify the person in PostHog
    if (contactType === 'email') {
        posthog.identify(contactValue, {
            email: contactValue,
            source: 'portfolio_get_in_touch',
            submission_time: new Date().toISOString(),
            theme: currentTheme,
            colorblind_mode: colorblindMode
        });
    } else if (contactType === 'mobile' || contactType === 'phone') {
        posthog.identify(contactValue, {
            phone: contactValue,
            source: 'portfolio_get_in_touch',
            submission_time: new Date().toISOString(),
            theme: currentTheme,
            colorblind_mode: colorblindMode
        });
    }
    
    // Track the contact submission event
    posthog.capture('contact_submitted', {
        contact_type: contactType,
        theme: currentTheme,
        colorblind_mode: colorblindMode,
        submission_time: new Date().toISOString()
    });
}

function triggerVibrationAnimation() {
    if (!getTouchSection) return;
    
    getTouchSection.style.animation = 'vibrate 0.5s ease-in-out';
    setTimeout(() => {
        getTouchSection.style.animation = '';
    }, 500);
}

function createExplosiveAnimation() {
    // Store original button text
    const originalText = submitContact.textContent;
    
    // Button feedback animation with thumbs up
    submitContact.style.transform = 'scale(1.1)';
    submitContact.style.background = currentAccent;
    submitContact.style.color = 'white';
    submitContact.textContent = '👍';
    
    setTimeout(() => {
        submitContact.style.transform = '';
        submitContact.style.background = '';
        submitContact.style.color = '';
        submitContact.textContent = originalText;
    }, 1000);
}

function showSuccessFeedback() {
    contactInput.value = '';
    contactInput.placeholder = 'Thanks! I\'ll get back to you soon 🚀';
    contactInput.style.background = currentAccent;
    contactInput.style.color = 'white';
    
    setTimeout(() => {
        contactInput.placeholder = 'Your email or phone number...';
        contactInput.style.background = '';
        contactInput.style.color = '';
    }, 3000);
}

// Resume Download Functions
function initializeResumeDownload() {
    const resumeBtn = document.getElementById('resume-download-btn');
    if (!resumeBtn) return;
    
    // Set initial button text based on download state
    updateResumeButtonText();
    
    // Add click event listener
    resumeBtn.addEventListener('click', handleResumeDownload);
}

function updateResumeButtonText() {
    const resumeBtn = document.getElementById('resume-download-btn');
    if (resumeBtn) {
        resumeBtn.textContent = hasViewedResume ? 'DOWNLOAD' : 'VIEW RESUME';
    }
}

function handleResumeDownload(e) {
    e.preventDefault();
    
    const resumeBtn = e.target;
    
    if (!hasViewedResume) {
        // First time - open PDF viewer
        openPDFModal('resume.pdf', 'Ashar\'s Resume');
        hasViewedResume = true;
        localStorage.setItem('hasViewedResume', 'true');
        
        // PostHog Analytics
        if (typeof posthog !== 'undefined') {
            posthog.capture('resume_viewed', { 
                action: 'pdf_modal_opened',
                theme: currentTheme, 
                colorblind_mode: colorblindMode 
            });
        }
        
        // Show thumbs up and update text
        createThumbsUpEffect(resumeBtn, () => {
            updateResumeButtonText();
        });
    } else {
        // Second time - force download
        forceDownloadResume();
        
        // PostHog Analytics
        if (typeof posthog !== 'undefined') {
            posthog.capture('resume_downloaded', { 
                action: 'force_download',
                theme: currentTheme, 
                colorblind_mode: colorblindMode 
            });
        }
        
        // Show thumbs up
        createThumbsUpEffect(resumeBtn);
    }
}

function forceDownloadResume() {
    const link = document.createElement('a');
    link.href = 'resume.pdf';
    link.download = 'Ashar_Rai_Mujeeb_Resume.pdf';
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}


// Thumbs up effect for any button (updated to support callback)
function createThumbsUpEffect(button, callback = null) {
    // Store original button text
    const originalText = button.textContent;
    const originalBackground = button.style.background;
    const originalColor = button.style.color;
    
    // Button feedback animation with thumbs up
    button.style.transform = 'scale(1.1)';
    button.style.background = currentAccent;
    button.style.color = 'white';
    button.textContent = '👍';
    
    setTimeout(() => {
        button.style.transform = '';
        button.style.background = originalBackground;
        button.style.color = originalColor;
        button.textContent = originalText;
        
        // Execute callback if provided
        if (callback && typeof callback === 'function') {
            callback();
        }
    }, 1000);
}

// Keyboard Shortcuts System
const keyboardShortcuts = {
    panel: null,
    trigger: null,
    notification: null,
    activeKeys: new Set(),
    isShortcutsPanelVisible: false,
    
    // Initialize keyboard shortcuts
    init() {
        // Only initialize on desktop browsers
        if (window.innerWidth <= 768 || 'ontouchstart' in window) {
            return;
        }
        
        this.panel = document.getElementById('keyboard-shortcuts');
        this.trigger = document.getElementById('shortcuts-trigger');
        this.notification = document.getElementById('shortcut-notification');
        
        if (!this.panel || !this.trigger || !this.notification) {
            console.warn('Keyboard shortcuts elements not found');
            return;
        }
        
        this.trigger.setAttribute('tabindex', '-1'); // Prevent focus on click
        this.bindEvents();
        this.setupAccessibility();
        this.setupMobileButtons();
        
        // Enforce initial position
        this.enforceButtonPosition();
        
        // Add additional protection against focus events
        this.addFocusProtection();
        
        console.log('⌨️  Keyboard shortcuts initialized');
    },
    
    // Bind all keyboard and click events
    bindEvents() {
        // Keyboard events
        document.addEventListener('keydown', this.handleKeyDown.bind(this));
        document.addEventListener('keyup', this.handleKeyUp.bind(this));
        
        // Panel toggle events
        this.trigger.addEventListener('mousedown', function(e) {
            e.preventDefault(); // Prevent focus on click
            e.stopPropagation(); // Stop event bubbling
            e.stopImmediatePropagation(); // Stop all propagation
            
            // Temporarily disable pointer events to prevent any browser focus behavior
            keyboardShortcuts.trigger.style.pointerEvents = 'none';
            setTimeout(() => {
                keyboardShortcuts.trigger.style.pointerEvents = 'auto';
            }, 100);
        });
        
        this.trigger.addEventListener('click', function(e) {
            e.preventDefault(); // Prevent default behavior
            e.stopPropagation(); // Stop event bubbling
            e.stopImmediatePropagation(); // Stop all event propagation
            
            // Preserve scroll position and viewport state
            const scrollPosition = window.pageYOffset;
            const scrollLeft = window.pageXOffset;
            
            // Enforce button position before any potential browser interference
            keyboardShortcuts.enforceButtonPosition();
            
            // Toggle panel
            keyboardShortcuts.togglePanel();
            
            // Restore scroll position and enforce button position again
            setTimeout(() => {
                window.scrollTo(scrollLeft, scrollPosition);
                keyboardShortcuts.enforceButtonPosition();
            }, 0);
            
            // Additional enforcement after a short delay
            setTimeout(() => {
                keyboardShortcuts.enforceButtonPosition();
            }, 10);
        });
        document.getElementById('shortcuts-close').addEventListener('click', () => this.hidePanel());
        
        // Close on escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isShortcutsPanelVisible) {
                this.hidePanel();
            }
        });
        
        // Close when clicking outside
        document.addEventListener('click', (e) => {
            if (this.isShortcutsPanelVisible && 
                !this.panel.contains(e.target) && 
                !this.trigger.contains(e.target)) {
                this.hidePanel();
            }
        });
    },
    
    // Handle key down events
    handleKeyDown(e) {
        // Ignore if typing in inputs
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
            return;
        }
        
        // Check if buttons are focused (disable video shortcuts)
        this.isButtonFocused = e.target.tagName === 'BUTTON' || 
                              e.target.tagName === 'A' || 
                              e.target.classList.contains('animate-btn') ||
                              e.target.id === 'submit-contact' ||
                              e.target.id === 'resume-download-btn' ||
                              e.target.classList.contains('shortcut-btn') ||
                              e.target.classList.contains('shortcuts-trigger');
        
        const key = e.key.toLowerCase();
        this.activeKeys.add(key);
        
        // Check for shortcut combinations
        this.checkShortcuts(e);
    },
    
    // Handle key up events
    handleKeyUp(e) {
        const key = e.key.toLowerCase();
        this.activeKeys.delete(key);
    },
    
    // Check for specific shortcut combinations
    checkShortcuts(e) {
        const keys = Array.from(this.activeKeys);
        
        // Single key shortcuts
        if (e.key === '/' && keys.length === 1) {
            e.preventDefault();
            this.togglePanel();
            return;
        }
        
        // Spacebar for video play/pause (only if no buttons are focused)
        if (e.key === ' ' && keys.length === 1 && !this.isButtonFocused) {
            e.preventDefault();
            this.executeShortcut('video-play-pause', 'Video Play/Pause');
            return;
        }
        
        // Z-based combinations
        if (this.activeKeys.has('z')) {
            // Z + C: Get in Touch
            if (this.activeKeys.has('c') && !this.activeKeys.has('v') && keys.length === 2) {
                e.preventDefault();
                this.executeShortcut('get-in-touch', 'Get in Touch');
            }
            
            // Z + C + V: Download CV
            else if (this.activeKeys.has('c') && this.activeKeys.has('v') && keys.length === 3) {
                e.preventDefault();
                this.executeShortcut('download-cv', 'Download CV');
            }
            
            // Z + X: Random Color
            else if (this.activeKeys.has('x') && keys.length === 2) {
                e.preventDefault();
                this.executeShortcut('random-color', 'Random Color');
            }
            
            // Z + N: Toggle Theme (Night mode)
            else if (this.activeKeys.has('n') && keys.length === 2) {
                e.preventDefault();
                this.executeShortcut('toggle-theme', 'Theme Toggled');
            }
            
            // Z + R: Report Problem
            else if (this.activeKeys.has('r') && keys.length === 2) {
                e.preventDefault();
                this.executeShortcut('report-problem', 'Report Problem');
            }
        }
    },
    
    // Execute specific shortcut actions
    executeShortcut(action, label) {
        switch (action) {
            case 'get-in-touch':
                this.scrollToGetInTouch();
                break;
            case 'download-cv':
                this.downloadCV();
                break;
            case 'random-color':
                this.randomColor();
                break;
            case 'toggle-theme':
                this.toggleTheme();
                break;
            case 'report-problem':
                this.reportProblem();
                break;
            case 'video-play-pause':
                this.videoPlayPause();
                break;
        }
        
        this.showNotification(label);
        this.trackShortcut(action);
    },
    
    // Shortcut actions
    scrollToGetInTouch() {
        const getInTouchSection = document.getElementById('get-in-touch');
        if (getInTouchSection) {
            getInTouchSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
            
            // Focus on the input field
            setTimeout(() => {
                const input = document.getElementById('contact-input');
                if (input) {
                    input.focus();
                }
            }, 500);
        }
    },
    
    downloadCV() {
        const resumeBtn = document.getElementById('resume-download-btn');
        if (resumeBtn) {
            resumeBtn.click();
        }
    },
    
    randomColor() {
        const randomizerBtn = document.getElementById('randomizer');
        if (randomizerBtn) {
            randomizerBtn.click();
        }
    },
    
    toggleTheme() {
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            themeToggle.click();
        }
    },
    
    reportProblem() {
        // Placeholder for future implementation
        const message = "Report Problem feature coming soon!\n\nFor now, please contact directly:\n• Email: asharrm18@gmail.com\n• Phone: +91-7378666101";
        this.showNotification("Feature Coming Soon", 3000);
        
        // Optional: Could open email client
        setTimeout(() => {
            if (confirm(message + "\n\nWould you like to send an email now?")) {
                window.location.href = "mailto:asharrm18@gmail.com?subject=Portfolio%20Issue%20Report";
            }
        }, 1000);
    },
    
    videoPlayPause() {
        const video = document.getElementById('hero-video');
        const playPauseBtn = document.getElementById('play-pause');
        
        if (video && playPauseBtn) {
            // Direct video control instead of relying on button click
            if (video.paused) {
                video.play().catch(e => console.log('Video play failed:', e));
                playPauseBtn.textContent = 'PAUSE';
            } else {
                video.pause();
                playPauseBtn.textContent = 'PLAY';
            }
        } else {
            console.log('Video or play/pause button not found');
        }
    },
    
    // Panel visibility controls
    togglePanel() {
        if (this.isShortcutsPanelVisible) {
            this.hidePanel();
        } else {
            this.showPanel();
        }
    },
    
    showPanel() {
        this.panel.classList.add('show');
        this.isShortcutsPanelVisible = true;
        
        // Track panel opening
        if (typeof posthog !== 'undefined') {
            posthog.capture('keyboard_shortcuts_panel_opened');
        }
    },
    
    hidePanel() {
        this.panel.classList.remove('show');
        this.isShortcutsPanelVisible = false;
    },
    
    // Show notification for executed shortcuts
    showNotification(message, duration = 1500) {
        this.notification.textContent = message;
        this.notification.classList.add('show');
        
        setTimeout(() => {
            this.notification.classList.remove('show');
        }, duration);
    },
    
    // Analytics tracking for shortcuts
    trackShortcut(action) {
        if (typeof posthog !== 'undefined') {
            posthog.capture('keyboard_shortcut_used', {
                shortcut_action: action,
                theme: currentTheme,
                colorblind_mode: colorblindMode
            });
        }
    },
    
    // Setup accessibility features
    setupAccessibility() {
        // Add ARIA labels
        this.panel.setAttribute('role', 'dialog');
        this.panel.setAttribute('aria-label', 'Keyboard shortcuts');
        this.trigger.setAttribute('aria-expanded', 'false');
        
        // Update aria-expanded when panel visibility changes
        const observer = new MutationObserver(() => {
            this.trigger.setAttribute('aria-expanded', this.isShortcutsPanelVisible.toString());
        });
        
        observer.observe(this.panel, { attributes: true, attributeFilter: ['class'] });
    },
    
    // Force button to stay in correct position
    enforceButtonPosition() {
        if (!this.trigger) return;
        
        // Reset any potential style changes
        this.trigger.style.position = 'fixed';
        this.trigger.style.bottom = '20px';
        this.trigger.style.right = '20px';
        this.trigger.style.left = 'auto';
        this.trigger.style.top = 'auto';
        this.trigger.style.transform = 'none';
        this.trigger.style.zIndex = '2002';
        this.trigger.style.width = 'auto';
        this.trigger.style.minWidth = '130px';
        this.trigger.style.height = '44px';
        
        // Prevent focus and blur
        if (document.activeElement === this.trigger) {
            this.trigger.blur();
        }
    },
    
    // Add comprehensive focus protection
    addFocusProtection() {
        if (!this.trigger) return;
        
        // Prevent all focus-related events that could cause scrolling
        ['focus', 'focusin', 'blur', 'focusout'].forEach(eventType => {
            this.trigger.addEventListener(eventType, (e) => {
                e.preventDefault();
                e.stopPropagation();
                e.stopImmediatePropagation();
                this.enforceButtonPosition();
            });
        });
        
        // Monitor for any DOM changes that might affect positioning
        const observer = new MutationObserver(() => {
            this.enforceButtonPosition();
        });
        
        observer.observe(this.trigger, {
            attributes: true,
            attributeFilter: ['style', 'class']
        });
        
        // Periodic position enforcement (as a last resort)
        setInterval(() => {
            if (this.trigger) {
                this.enforceButtonPosition();
            }
        }, 1000);
    },
    
    // Setup mobile shortcut buttons
    setupMobileButtons() {
        const mobileButtons = document.querySelectorAll('.shortcut-btn');
        
        mobileButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const action = button.getAttribute('data-action');
                
                // Execute the shortcut action
                this.executeShortcut(action, button.textContent);
                
                // Close the panel after action
                this.hidePanel();
                
                // Track mobile button usage
                if (typeof posthog !== 'undefined') {
                    posthog.capture('mobile_shortcut_button_clicked', {
                        action: action,
                        button_text: button.textContent,
                        theme: currentTheme,
                        colorblind_mode: colorblindMode
                    });
                }
            });
        });
    }
};

// Add to existing initialization function
function initializeKeyboardShortcuts() {
    keyboardShortcuts.init();
}

// Bento Grid with Muuri
// let bentoGrid = null;

function initializeBentoGrid() {
    // const gridElement = document.getElementById('bento-grid');
    // if (!gridElement) return;
    // bentoGrid = new Muuri(gridElement, {
    //     items: '.bento-item',
    //     layoutDuration: 500,
    //     layoutEasing: 'ease',
    //     dragEnabled: false,
    //     layout: { fillGaps: true }
    // });
    // No JS grid layout needed; CSS grid handles layout.
}

// Projects Expand/Collapse Functionality (only filters project cards)
function initializeProjectsExpand() {
    const projectsGrid = document.getElementById('projects-grid');
    const expandBtn = document.getElementById('projects-expand-btn');
    if (!projectsGrid || !expandBtn) return;
    let isExpanded = false;
    function filterProjects() {
        const items = projectsGrid.querySelectorAll('.project-item');
        items.forEach(item => {
            const show = isExpanded || item.getAttribute('data-category') === 'visible';
            item.style.display = show ? '' : 'none';
        });
    }
    filterProjects();
    expandBtn.addEventListener('click', () => {
        const btnText = expandBtn.querySelector('span');
        if (!isExpanded) {
            isExpanded = true;
            btnText.textContent = 'VIEW LESS';
            expandBtn.classList.add('expanded');
            expandBtn.setAttribute('aria-expanded', 'true');
            expandBtn.setAttribute('aria-label', 'Show fewer projects');
            if (typeof posthog !== 'undefined') posthog.capture('projects_expanded');
        } else {
            isExpanded = false;
            btnText.textContent = 'VIEW MORE';
            expandBtn.classList.remove('expanded');
            expandBtn.setAttribute('aria-expanded', 'false');
            expandBtn.setAttribute('aria-label', 'Show more projects');
            // Remove the scrollIntoView call to prevent jarring jump
            // setTimeout(() => {
            //     document.getElementById('projects').scrollIntoView({ behavior: 'smooth', block: 'start' });
            // }, 200);
            if (typeof posthog !== 'undefined') posthog.capture('projects_collapsed');
        }
        filterProjects();
        expandBtn.style.transform = 'scale(0.95)';
        setTimeout(() => { expandBtn.style.transform = ''; }, 150);
    });
}

// Focus Trapping Functions for Accessibility
let focusTrapElements = [];
let lastFocusedElement = null;

function setupFocusTrap(modal) {
    // Store the currently focused element to restore later
    lastFocusedElement = document.activeElement;
    
    // Get all focusable elements within the modal
    const focusableSelectors = [
        'button:not([disabled])',
        'input:not([disabled])',
        'select:not([disabled])',
        'textarea:not([disabled])',
        'a[href]',
        '[tabindex]:not([tabindex="-1"])'
    ];
    
    focusTrapElements = modal.querySelectorAll(focusableSelectors.join(', '));
    
    // Add event listener for tab key
    modal.addEventListener('keydown', handleFocusTrap);
}

function handleFocusTrap(e) {
    if (e.key !== 'Tab') return;
    
    if (focusTrapElements.length === 0) return;
    
    const firstElement = focusTrapElements[0];
    const lastElement = focusTrapElements[focusTrapElements.length - 1];
    
    if (e.shiftKey) {
        // Shift + Tab (backward)
        if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
        }
    } else {
        // Tab (forward)
        if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
        }
    }
}

function removeFocusTrap(modal) {
    // Remove the event listener
    modal.removeEventListener('keydown', handleFocusTrap);
    
    // Clear the focusable elements array
    focusTrapElements = [];
    
    // Restore focus to the element that was focused before the modal opened
    if (lastFocusedElement) {
        lastFocusedElement.focus();
        lastFocusedElement = null;
    }
}

console.log('Modern Neobrutal Portfolio Ready!');
console.log('Mobile Optimized | Video Controls | PDF Viewer | Certificate Gallery | Get in Touch | Accessibility Enhanced');