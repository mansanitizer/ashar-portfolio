// Enhanced Portfolio JavaScript with Modern Features
// Import CSS styles
import './styles/main.css';

// Import API client for future backend integration
import { api, apiUtils } from './utils/api.js';

// Import sharing utilities
import { 
    openPlatformShare, 
    copyToClipboard, 
    SHARE_PLATFORMS, 
    SHARE_CONTEXTS 
} from './utils/sharing.js';

// DOM Elements
const settingsToggle = document.getElementById('settings-toggle');
const settingsMenu = document.getElementById('settings-menu');
const themeToggle = document.getElementById('theme-toggle');
const colorblindToggle = document.getElementById('colorblind-toggle');
const analyticsToggle = document.getElementById('analytics-toggle');
const randomizer = document.getElementById('randomizer');

// Mobile settings elements
const settingsToggleMobile = document.getElementById('settings-toggle-mobile');
const settingsMenuMobile = document.getElementById('settings-menu-mobile');
const themeToggleMobile = document.getElementById('theme-toggle-mobile');
const colorblindToggleMobile = document.getElementById('colorblind-toggle-mobile');
const analyticsToggleMobile = document.getElementById('analytics-toggle-mobile');
const randomizerMobile = document.getElementById('randomizer-mobile');
const accentColors = document.querySelectorAll('.accent-color');
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
let currentAccent = localStorage.getItem('accent') || '#FF6600';
let colorblindMode = localStorage.getItem('colorblindMode') === 'true' || false;
let trackingEnabled = localStorage.getItem('trackingEnabled') !== 'false';

// Resume download functionality (view feature removed)

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
    initializeAIQuery();
    initializeHealthStatus();
    initializePortfolioSharing();
    
    // Initialize work modal after everything else is loaded
    setTimeout(() => {
        initializeWorkModal();
    }, 100);
    initializeSkillsCollapse();
    
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
    // Initialize desktop settings if elements exist
    if (settingsToggle && settingsMenu) {
        initializeSettingsDropdown(settingsToggle, settingsMenu, {
            themeToggle: themeToggle,
            colorblindToggle: colorblindToggle,
            analyticsToggle: analyticsToggle,
            randomizer: randomizer
        }, 'desktop');
    }
    
    // Initialize mobile settings if elements exist
    if (settingsToggleMobile && settingsMenuMobile) {
        initializeSettingsDropdown(settingsToggleMobile, settingsMenuMobile, {
            themeToggle: themeToggleMobile,
            colorblindToggle: colorblindToggleMobile,
            analyticsToggle: analyticsToggleMobile,
            randomizer: randomizerMobile
        }, 'mobile');
    }
    
    console.log('⚙️ Settings initialized for both desktop and mobile');
}

// Reusable settings dropdown initialization function
function initializeSettingsDropdown(settingsToggle, settingsMenu, settingsElements, context) {
    // Settings dropdown toggle
    settingsToggle.addEventListener('click', () => {
        const isOpening = !settingsMenu.classList.contains('show');
        settingsMenu.classList.toggle('show');
        
        // Update ARIA state
        settingsToggle.setAttribute('aria-expanded', isOpening.toString());
        
        // PostHog Analytics
        captureAnalytics('settings_dropdown_toggled', {
            action: isOpening ? 'opened' : 'closed',
            context: context,
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
    if (settingsElements.themeToggle) {
        updateToggleState(settingsElements.themeToggle, currentTheme === 'dark');
        updateThemeToggleText(settingsElements.themeToggle);
        initializeThemeToggle(settingsElements.themeToggle, context);
    }
    
    if (settingsElements.colorblindToggle) {
        updateToggleState(settingsElements.colorblindToggle, colorblindMode);
        initializeColorblindToggle(settingsElements.colorblindToggle, context);
    }
    
    if (settingsElements.analyticsToggle) {
        updateToggleState(settingsElements.analyticsToggle, trackingEnabled);
        initializeAnalyticsToggle(settingsElements.analyticsToggle, context);
    }
    
    if (settingsElements.randomizer) {
        initializeRandomizer(settingsElements.randomizer, context);
    }
    
    // Initialize accent colors (shared between desktop and mobile)
    if (context === 'desktop') {
        initializeAccentColors();
    }
    
    console.log(`⚙️ ${context} settings dropdown initialized`);
}

function updateToggleState(toggleButton, isActive) {
    const toggleSwitch = toggleButton.querySelector('.toggle-switch');
    if (isActive) {
        toggleSwitch.classList.add('active');
    } else {
        toggleSwitch.classList.remove('active');
    }
}

function updateThemeToggleText(themeToggleElement) {
    const themeText = themeToggleElement.querySelector('span');
    themeText.textContent = currentTheme === 'dark' ? 'Dark Mode' : 'Light Mode';
}

// Theme Toggle Functionality
function initializeThemeToggle(themeToggleElement, context) {
    themeToggleElement.addEventListener('click', () => {
        const previousTheme = currentTheme;
        currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
        localStorage.setItem('theme', currentTheme);
        
        document.documentElement.setAttribute('data-theme', currentTheme);
        
        // Update both desktop and mobile toggles
        if (themeToggle) {
            updateToggleState(themeToggle, currentTheme === 'dark');
            updateThemeToggleText(themeToggle);
        }
        if (themeToggleMobile) {
            updateToggleState(themeToggleMobile, currentTheme === 'dark');
            updateThemeToggleText(themeToggleMobile);
        }
        
        // PostHog Analytics
        captureAnalytics('theme_changed', {
            from_theme: previousTheme,
            to_theme: currentTheme,
            context: context,
            colorblind_mode: colorblindMode
        });
        
        // Add click animation
        themeToggleElement.style.transform = 'scale(0.98)';
        setTimeout(() => {
            themeToggleElement.style.transform = '';
        }, 150);
    });
}

// Colorblind Toggle Functionality
function initializeColorblindToggle(colorblindToggleElement, context) {
    colorblindToggleElement.addEventListener('click', () => {
        const previousMode = colorblindMode;
        colorblindMode = !colorblindMode;
        localStorage.setItem('colorblindMode', colorblindMode);
        
        // Update both desktop and mobile toggles
        if (colorblindToggle) updateToggleState(colorblindToggle, colorblindMode);
        if (colorblindToggleMobile) updateToggleState(colorblindToggleMobile, colorblindMode);
        
        document.documentElement.setAttribute('data-colorblind', colorblindMode);
        
        if (colorblindMode) {
            // Disable accent color picker
            accentColors.forEach(color => {
                color.style.pointerEvents = 'none';
                color.style.opacity = '0.5';
            });
            if (randomizer) {
                randomizer.style.pointerEvents = 'none';
                randomizer.style.opacity = '0.5';
            }
            if (randomizerMobile) {
                randomizerMobile.style.pointerEvents = 'none';
                randomizerMobile.style.opacity = '0.5';
            }
        } else {
            // Re-enable accent colors
            document.documentElement.style.setProperty('--accent-color', currentAccent);
            accentColors.forEach(color => {
                color.style.pointerEvents = 'all';
                color.style.opacity = '1';
            });
            if (randomizer) {
                randomizer.style.pointerEvents = 'all';
                randomizer.style.opacity = '1';
            }
            if (randomizerMobile) {
                randomizerMobile.style.pointerEvents = 'all';
                randomizerMobile.style.opacity = '1';
            }
        }
        
        // PostHog Analytics
        captureAnalytics('colorblind_mode_toggled', {
            colorblind_mode: colorblindMode,
            theme: currentTheme,
            context: context,
            previous_mode: previousMode
        });
        
        // Add click animation
        colorblindToggleElement.style.transform = 'scale(0.98)';
        setTimeout(() => {
            colorblindToggleElement.style.transform = '';
        }, 150);
    });
}

// Analytics Toggle Functionality
function initializeAnalyticsToggle(analyticsToggleElement, context) {
    // Analytics toggle click handler
    analyticsToggleElement.addEventListener('click', () => {
        const previousState = trackingEnabled;
        trackingEnabled = !trackingEnabled;
        localStorage.setItem('trackingEnabled', trackingEnabled);
        
        // Update both desktop and mobile toggles
        if (analyticsToggle) updateToggleState(analyticsToggle, trackingEnabled);
        if (analyticsToggleMobile) updateToggleState(analyticsToggleMobile, trackingEnabled);
        
        // Update PostHog state
        if (typeof posthog !== 'undefined') {
            if (trackingEnabled) {
                posthog.opt_in_capturing();
                // Capture the opt-in event after enabling
                posthog.capture('analytics_opt_in', {
                    previous_state: previousState ? 'enabled' : 'disabled',
                    new_state: 'enabled',
                    context: context,
                    theme: currentTheme,
                    colorblind_mode: colorblindMode
                });
            } else {
                // Capture the opt-out event before disabling
                posthog.capture('analytics_opt_out', {
                    previous_state: previousState ? 'enabled' : 'disabled',
                    new_state: 'disabled',
                    context: context,
                    theme: currentTheme,
                    colorblind_mode: colorblindMode
                });
                posthog.opt_out_capturing();
            }
        }
        
        // Add click animation
        analyticsToggleElement.style.transform = 'scale(0.98)';
        setTimeout(() => {
            analyticsToggleElement.style.transform = '';
        }, 150);
    });
}

// Randomizer Functionality
function initializeRandomizer(randomizerElement, context) {
    randomizerElement.addEventListener('click', () => {
        if (colorblindMode) return; // Don't randomize in colorblind mode
        
        const randomAccent = colorPalettes[Math.floor(Math.random() * colorPalettes.length)];
        currentAccent = randomAccent;
        localStorage.setItem('accent', currentAccent);
        document.documentElement.style.setProperty('--accent-color', currentAccent);
        
        // Update accent color display
        accentColors.forEach(color => {
            color.classList.remove('active');
            if (color.dataset.color === currentAccent) {
                color.classList.add('active');
            }
        });
        
        // PostHog Analytics
        captureAnalytics('accent_randomized', {
            new_color: currentAccent,
            context: context,
            theme: currentTheme,
            colorblind_mode: colorblindMode
        });
        
        // Add click animation
        randomizerElement.style.transform = 'scale(0.95)';
        setTimeout(() => {
            randomizerElement.style.transform = '';
        }, 150);
    });
}

// Accent Colors Initialization (shared function)
function initializeAccentColors() {
    accentColors.forEach(color => {
        color.addEventListener('click', () => {
            if (colorblindMode) return; // Don't allow color change in colorblind mode
            
            const previousAccent = currentAccent;
            currentAccent = color.dataset.color;
            localStorage.setItem('accent', currentAccent);
            document.documentElement.style.setProperty('--accent-color', currentAccent);
            
            // Update active state
            accentColors.forEach(c => c.classList.remove('active'));
            color.classList.add('active');
            
            // PostHog Analytics
            captureAnalytics('accent_color_changed', {
                from_color: previousAccent,
                to_color: currentAccent,
                theme: currentTheme,
                colorblind_mode: colorblindMode
            });
            
            // Add click animation
            color.style.transform = 'scale(0.9)';
            setTimeout(() => {
                color.style.transform = '';
            }, 150);
        });
        
        // Set initial active state
        if (color.dataset.color === currentAccent) {
            color.classList.add('active');
        }
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
    '/src/assets/certificates/cert1.jpg',
    '/src/assets/certificates/cert2.jpg',
    '/src/assets/certificates/cert3.jpg'
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
    certImage.src = certificateImages[currentCertIndex] || '/src/assets/certificates/placeholder.jpg';
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
        
        // Enhanced error handling with fallback support
        heroVideo.addEventListener('error', (e) => {
            console.log('Video loading error:', e);
            handleVideoError();
        });
        
        // Handle various video failure scenarios
        heroVideo.addEventListener('stalled', () => {
            console.log('Video stalled - network issues detected');
            setTimeout(() => {
                if (heroVideo.readyState < 3) { // Not enough data loaded
                    handleVideoError();
                }
            }, 5000); // Wait 5 seconds before falling back
        });
        
        // Fallback for extremely slow connections
        setTimeout(() => {
            if (heroVideo.readyState === 0) { // Nothing loaded
                console.log('Video failed to load within timeout - showing fallback');
                handleVideoError();
            }
        }, 10000); // 10 second timeout
        
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

// Video Error Handling Function
function handleVideoError() {
    console.log('🚨 Video loading failed - implementing fallback strategy');
    
    const videoControls = document.querySelector('.video-controls');
    const videoShortcutDesktop = document.getElementById('video-shortcut-desktop');
    const videoShortcutMobile = document.getElementById('video-shortcut-mobile');
    const videoContainer = document.querySelector('.video-container');
    const heroVideo = document.getElementById('hero-video');
    
    // Hide video controls and shortcuts
    if (videoControls) {
        videoControls.style.display = 'none';
    }
    if (videoShortcutDesktop) {
        videoShortcutDesktop.style.display = 'none';
    }
    if (videoShortcutMobile) {
        videoShortcutMobile.style.display = 'none';
    }
    
    // Check if GIF fallback exists and show it
    const gifFallback = videoContainer?.querySelector('img[src*="hero-video.gif"]');
    if (gifFallback) {
        console.log('🎬 Showing GIF fallback');
        gifFallback.style.display = 'block';
        gifFallback.style.zIndex = '2'; // Show above video
        
        // Hide the video element
        if (heroVideo) {
            heroVideo.style.display = 'none';
        }
    } else {
        // No GIF fallback, show poster image
        console.log('🖼️ Showing poster image fallback');
        if (heroVideo) {
            heroVideo.poster = 'hero-poster.jpg';
            heroVideo.style.display = 'block';
        }
    }
    
    // Analytics tracking
    if (typeof posthog !== 'undefined') {
        posthog.capture('video_fallback_activated', {
            fallback_type: gifFallback ? 'gif' : 'poster',
            theme: currentTheme,
            colorblind_mode: colorblindMode
        });
    }
    
    console.log('✅ Video fallback implemented successfully');
}

// Skills Collapse Functionality (Mobile Only)
function initializeSkillsCollapse() {
    const skillCategories = document.querySelectorAll('.skill-category');
    let eventListenersAdded = false;
    
    function handleSkillClick(e) {
        e.preventDefault();
        e.stopPropagation();
        
        const category = e.currentTarget;
        
        // Only work if mobile-collapsible class is present
        if (!category.classList.contains('mobile-collapsible')) return;
        
        // Toggle expanded state
        category.classList.toggle('expanded');
        const isExpanded = category.classList.contains('expanded');
        category.setAttribute('aria-expanded', isExpanded);
        
        console.log('📱 Skill toggled:', category.querySelector('h3')?.textContent, 'Expanded:', isExpanded);
        
        // Analytics tracking
        if (typeof posthog !== 'undefined') {
            posthog.capture('mobile_skill_toggle', {
                skill_name: category.querySelector('h3')?.textContent,
                expanded: isExpanded,
                theme: currentTheme,
                colorblind_mode: colorblindMode
            });
        }
    }
    
    function handleSkillKeydown(e) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleSkillClick(e);
        }
    }
    
    function updateMobileState() {
        const isMobile = window.innerWidth <= 768;
        
        skillCategories.forEach(category => {
            // Always add collapsible functionality (desktop and mobile)
            category.classList.add('mobile-collapsible');
            category.setAttribute('tabindex', '0');
            category.setAttribute('role', 'button');
            category.setAttribute('aria-expanded', 'false');
            
            // Add event listeners if not already added
            if (!eventListenersAdded) {
                category.addEventListener('click', handleSkillClick);
                category.addEventListener('keydown', handleSkillKeydown);
            }
        });
        
        eventListenersAdded = true;
        console.log('🖥️ Skills collapse enabled on all devices');
    }
    
    // Initialize on load
    updateMobileState();
    
    // Handle window resize
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(updateMobileState, 100);
    });
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
    const heroResumeBtn = document.getElementById('resume-download-btn-hero');
    
    // Initialize main resume button
    if (resumeBtn) {
        updateResumeButtonText();
        resumeBtn.addEventListener('click', handleResumeDownload);
    }
    
    // Initialize hero resume button
    if (heroResumeBtn) {
        updateHeroResumeButtonText();
        heroResumeBtn.addEventListener('click', handleResumeDownload);
    }
}

function updateResumeButtonText() {
    const resumeBtn = document.getElementById('resume-download-btn');
    if (resumeBtn) {
        resumeBtn.textContent = 'DOWNLOAD CV';
    }
}

function updateHeroResumeButtonText() {
    const heroResumeBtn = document.getElementById('resume-download-btn-hero');
    if (heroResumeBtn) {
        heroResumeBtn.textContent = 'DOWNLOAD CV';
    }
}

function handleResumeDownload(e) {
    e.preventDefault();
    
    const resumeBtn = e.target;
    
    // Direct download only - no viewing
    forceDownloadResume();
    
    // PostHog Analytics
    if (typeof posthog !== 'undefined') {
        posthog.capture('resume_downloaded', { 
            action: 'direct_download',
            theme: currentTheme, 
            colorblind_mode: colorblindMode 
        });
    }
    
    // Show thumbs up effect
    createThumbsUpEffect(resumeBtn);
}

function forceDownloadResume() {
    const link = document.createElement('a');
    link.href = 'resume.pdf';
    link.download = 'Ashar_RM_PM_CV_iarm.xyz.pdf';
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
        
        // C + V: Download CV (standalone combination)
        if (this.activeKeys.has('c') && this.activeKeys.has('v') && keys.length === 2) {
            e.preventDefault();
            this.executeShortcut('download-cv', 'Download CV');
            return;
        }
        
        // Z-based combinations
        if (this.activeKeys.has('z')) {
            // Z + C: Get in Touch
            if (this.activeKeys.has('c') && keys.length === 2) {
                e.preventDefault();
                this.executeShortcut('get-in-touch', 'Get in Touch');
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

// AI Query Functions
function initializeAIQuery() {
    const aiQueryInput = document.getElementById('ai-query-input');
    const aiQuerySubmit = document.getElementById('ai-query-submit');
    const aiQueryClear = document.getElementById('ai-query-clear');
    const aiQueryResponse = document.getElementById('ai-query-response');
    const aiResponseContent = document.getElementById('ai-response-content');
    
    if (!aiQueryInput || !aiQuerySubmit) return;
    
    // Enable/disable submit button based on input
    aiQueryInput.addEventListener('input', () => {
        const hasText = aiQueryInput.value.trim().length > 0;
        aiQuerySubmit.disabled = !hasText;
    });
    
    // Clear button functionality
    if (aiQueryClear) {
        aiQueryClear.addEventListener('click', () => {
            aiQueryInput.value = '';
            aiQuerySubmit.disabled = true;
            aiQueryResponse.classList.add('hidden');
            aiQueryInput.focus();
        });
    }
    
    // Submit query
    aiQuerySubmit.addEventListener('click', handleAIQuery);
    
    // Enter key submission
    aiQueryInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !aiQuerySubmit.disabled) {
            handleAIQuery();
        }
    });
}

async function handleAIQuery() {
    const aiQueryInput = document.getElementById('ai-query-input');
    const aiQuerySubmit = document.getElementById('ai-query-submit');
    const aiQueryResponse = document.getElementById('ai-query-response');
    const aiResponseContent = document.getElementById('ai-response-content');
    const btnText = aiQuerySubmit.querySelector('.btn-text');
    const btnLoading = aiQuerySubmit.querySelector('.btn-loading');
    
    const query = aiQueryInput.value.trim();
    if (!query) return;
    
    // Show loading state
    btnText.classList.add('hidden');
    btnLoading.classList.remove('hidden');
    aiQuerySubmit.disabled = true;
    
    try {
        // Make API call to backend
        const response = await api.query(query);
        
        // Show response
        aiResponseContent.textContent = response.response;
        aiQueryResponse.classList.remove('hidden');
        
        // PostHog analytics
        captureAnalytics('ai_query_submitted', {
            query_length: query.length,
            theme: currentTheme,
            colorblind_mode: colorblindMode
        });
        
        // Clear input
        aiQueryInput.value = '';
        
    } catch (error) {
        console.error('AI Query Error:', error);
        
        // Show error message
        aiResponseContent.textContent = 'Sorry, I encountered an error processing your request. Please try again.';
        aiQueryResponse.classList.remove('hidden');
        
        // PostHog error tracking
        captureAnalytics('ai_query_error', {
            error_message: error.message,
            theme: currentTheme,
            colorblind_mode: colorblindMode
        });
    } finally {
        // Reset button state
        btnText.classList.remove('hidden');
        btnLoading.classList.add('hidden');
        aiQuerySubmit.disabled = query.length === 0;
    }
}

// Health Status Monitor
function initializeHealthStatus() {
    const healthStatus = document.getElementById('health-status');
    const heartIcon = document.getElementById('heart-icon');
    const healthTooltip = document.getElementById('health-tooltip');
    
    if (!healthStatus || !heartIcon || !healthTooltip) {
        console.log('ℹ️ Health status elements not found (expected on game page)');
        return;
    }
    
    let healthCheckInterval;
    let lastCheckTime = null;
    let isHealthy = null;
    
    // Check health status
    async function checkHealth() {
        try {
            const startTime = Date.now();
            const result = await api.healthCheck();
            const responseTime = Date.now() - startTime;
            lastCheckTime = new Date();
            
            if (result && result.status === 'ok') {
                isHealthy = true;
                heartIcon.className = 'heart-icon healthy';
                healthTooltip.textContent = `backend is healthy @ 2bpm (${responseTime}ms)`;
                
                // Health check successful (no analytics tracking)
                
            } else {
                throw new Error('Invalid response');
            }
        } catch (error) {
            isHealthy = false;
            heartIcon.className = 'heart-icon unhealthy';
            healthTooltip.textContent = 'backend unavailable';
            
            console.warn('❤️ Backend health check failed:', error.message);
            
            // Health check failed (no analytics tracking)
        }
    }
    
    // Show tooltip on click/tap (for mobile)
    healthStatus.addEventListener('click', () => {
        healthStatus.classList.toggle('show-tooltip');
        
        // Hide tooltip after 3 seconds on mobile
        setTimeout(() => {
            healthStatus.classList.remove('show-tooltip');
        }, 3000);
        
        // PostHog tracking
        captureAnalytics('health_status_clicked', {
            is_healthy: isHealthy,
            theme: currentTheme
        });
    });
    
    // Prevent tooltip from closing when clicking on it
    healthTooltip.addEventListener('click', (e) => {
        e.stopPropagation();
    });
    
    // Initial health check
    checkHealth();
    
    // Set up 30-second interval (2 beats per minute)
    healthCheckInterval = setInterval(checkHealth, 30000);
    
    console.log('❤️ Health status monitor initialized - checking every 30 seconds');
}

// Portfolio Sharing Functions
function initializePortfolioSharing() {
    // Desktop elements
    const shareToggle = document.getElementById('share-toggle');
    const shareMenu = document.getElementById('share-menu');
    const shareButtons = {
        linkedin: document.getElementById('share-portfolio-linkedin'),
        twitter: document.getElementById('share-portfolio-twitter'),
        whatsapp: document.getElementById('share-portfolio-whatsapp'),
        copy: document.getElementById('share-portfolio-copy')
    };
    
    // Mobile elements
    const shareToggleMobile = document.getElementById('share-toggle-mobile');
    const shareMenuMobile = document.getElementById('share-menu-mobile');
    const shareButtonsMobile = {
        linkedin: document.getElementById('share-portfolio-linkedin-mobile'),
        twitter: document.getElementById('share-portfolio-twitter-mobile'),
        whatsapp: document.getElementById('share-portfolio-whatsapp-mobile'),
        copy: document.getElementById('share-portfolio-copy-mobile')
    };
    
    // Debug: Check what elements we found
    console.log('🔍 Share elements found:', {
        desktop: {
            shareToggle: !!shareToggle,
            shareMenu: !!shareMenu,
            shareButtons: Object.fromEntries(Object.entries(shareButtons).map(([k, v]) => [k, !!v]))
        },
        mobile: {
            shareToggleMobile: !!shareToggleMobile,
            shareMenuMobile: !!shareMenuMobile,
            shareButtonsMobile: Object.fromEntries(Object.entries(shareButtonsMobile).map(([k, v]) => [k, !!v]))
        }
    });

    // Initialize desktop sharing if elements exist
    if (shareToggle && shareMenu && Object.values(shareButtons).every(btn => btn)) {
        console.log('✅ Initializing desktop share');
        initializeShareDropdown(shareToggle, shareMenu, shareButtons, 'desktop');
    } else {
        console.log('❌ Desktop share not initialized - missing elements');
    }
    
    // Initialize mobile sharing if elements exist
    if (shareToggleMobile && shareMenuMobile && Object.values(shareButtonsMobile).every(btn => btn)) {
        console.log('✅ Initializing mobile share');
        initializeShareDropdown(shareToggleMobile, shareMenuMobile, shareButtonsMobile, 'mobile');
    } else {
        console.log('❌ Mobile share not initialized - missing elements');
    }
    
    console.log('🔗 Portfolio sharing initialized');
}

// Reusable share dropdown initialization function
function initializeShareDropdown(shareToggle, shareMenu, shareButtons, context) {
    // Share dropdown toggle (copying settings pattern exactly)
    shareToggle.addEventListener('click', () => {
        const isOpening = !shareMenu.classList.contains('show');
        shareMenu.classList.toggle('show');
        
        // Update ARIA state
        shareToggle.setAttribute('aria-expanded', isOpening.toString());
        
        console.log('🔗 Share menu toggled', { 
            context: context,
            isOpening: isOpening,
            menuHasShow: shareMenu.classList.contains('show'),
            menuId: shareMenu.id
        });
    });
    
    // Close share menu when clicking outside (copying settings pattern)
    document.addEventListener('click', (e) => {
        if (!shareToggle.contains(e.target) && !shareMenu.contains(e.target)) {
            shareMenu.classList.remove('show');
            shareToggle.setAttribute('aria-expanded', 'false');
        }
    });
    
    // Close on escape key (copying settings pattern)
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && shareMenu.classList.contains('show')) {
            shareMenu.classList.remove('show');
            shareToggle.setAttribute('aria-expanded', 'false');
            shareToggle.focus();
        }
    });
    
    // LinkedIn sharing
    shareButtons.linkedin.addEventListener('click', (e) => {
        console.log('🔗 LinkedIn share clicked!');
        e.preventDefault();
        e.stopPropagation();
        openPlatformShare(SHARE_PLATFORMS.LINKEDIN, SHARE_CONTEXTS.PORTFOLIO);
        shareMenu.classList.remove('show');
        shareToggle.setAttribute('aria-expanded', 'false');
        captureAnalytics('portfolio_shared', {
            platform: 'linkedin',
            method: 'platform_specific',
            context: context,
            theme: currentTheme
        });
    });
    
    // Twitter sharing
    shareButtons.twitter.addEventListener('click', () => {
        console.log('Twitter share clicked', { platform: SHARE_PLATFORMS.TWITTER, context: SHARE_CONTEXTS.PORTFOLIO });
        openPlatformShare(SHARE_PLATFORMS.TWITTER, SHARE_CONTEXTS.PORTFOLIO);
        shareMenu.classList.remove('show');
        shareToggle.setAttribute('aria-expanded', 'false');
        captureAnalytics('portfolio_shared', {
            platform: 'twitter',
            method: 'platform_specific',
            context: context,
            theme: currentTheme
        });
    });
    
    // WhatsApp sharing
    shareButtons.whatsapp.addEventListener('click', () => {
        console.log('WhatsApp share clicked', { platform: SHARE_PLATFORMS.WHATSAPP, context: SHARE_CONTEXTS.PORTFOLIO });
        openPlatformShare(SHARE_PLATFORMS.WHATSAPP, SHARE_CONTEXTS.PORTFOLIO);
        shareMenu.classList.remove('show');
        shareToggle.setAttribute('aria-expanded', 'false');
        captureAnalytics('portfolio_shared', {
            platform: 'whatsapp',
            method: 'platform_specific',
            context: context,
            theme: currentTheme
        });
    });
    
    // Copy to clipboard
    shareButtons.copy.addEventListener('click', async () => {
        console.log('Copy share clicked', { context: SHARE_CONTEXTS.PORTFOLIO });
        try {
            const result = await copyToClipboard(SHARE_CONTEXTS.PORTFOLIO, SHARE_PLATFORMS.LINKEDIN);
            
            if (result.success) {
                showShareNotification('Portfolio link copied to clipboard!');
                shareMenu.classList.remove('show');
                shareToggle.setAttribute('aria-expanded', 'false');
                captureAnalytics('portfolio_shared', {
                    platform: 'clipboard',
                    method: 'copy',
                    context: context,
                    theme: currentTheme
                });
            } else {
                throw new Error(result.error);
            }
        } catch (error) {
            console.error('Copy to clipboard failed:', error);
            showShareNotification('Failed to copy link');
        }
    });
    
    console.log(`🔗 ${context} share dropdown initialized`);
}

// Share notification function
function showShareNotification(message) {
    // Create notification element if it doesn't exist
    let notification = document.getElementById('share-notification');
    if (!notification) {
        notification = document.createElement('div');
        notification.id = 'share-notification';
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--accent-color);
            color: var(--bg-color);
            padding: 12px 20px;
            border: 2px solid var(--border-color);
            box-shadow: 4px 4px 0px var(--shadow-color);
            font-family: 'Space Grotesk', sans-serif;
            font-weight: 600;
            font-size: 14px;
            z-index: 9999;
            opacity: 0;
            transform: translateX(100%);
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        `;
        document.body.appendChild(notification);
    }
    
    notification.textContent = message;
    
    // Show notification
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Hide notification after 3 seconds
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(100%)';
    }, 3000);
}

// =====================================
// Work Modal System
// =====================================

// Work data structure
const workData = {
    'product-launches': {
        title: 'MUTUAL FUNDS BASKETS & ADMIN ALLOCATION',
        subtitle: 'Goal-Based Investment Baskets for First-Time Investors',
        slides: [
            {
                title: 'PRODUCT STRATEGY & USER PROBLEM',
                content: {
                    header: 'Solving Investment Decision Paralysis',
                    sections: [
                        {
                            title: 'COMPANY PIVOT & USER RESEARCH',
                            content: `<p>During our strategic pivot towards mutual funds, I identified a core user problem through interviews and support tickets: users didn't know what to buy, when to sell, or which funds to pick for their goals.</p>
                            <p>Working as the solo PM with 2 engineers and 1 designer, I chose a basket-based approach to allow users to invest in diversified portfolios that could be adjusted over time based on specific goals like retirement, house purchase, or emergency funds.</p>
                            <ul>
                                <li><strong>Goal-Based Design:</strong> Simple goal selection to improve user confidence in investment decisions</li>
                                <li><strong>Diversification Made Easy:</strong> Pre-built baskets to allow users to avoid single-fund risk</li>
                                <li><strong>Admin Flexibility:</strong> Manual basket creation to allow admins to adjust allocations based on market conditions</li>
                            </ul>`
                        }
                    ]
                }
            },
            {
                title: 'IMPLEMENTATION & TEAM COLLABORATION',
                content: {
                    header: 'Building with Limited Resources',
                    sections: [
                        {
                            title: 'PRODUCT EXECUTION',
                            content: `<p>Led end-to-end product development including user research, requirement documentation, wireframing, and stakeholder coordination. Given our small team size, I had to balance feature scope with technical bandwidth.</p>
                            <ul>
                                <li><strong>Technical Constraints:</strong> Built simple admin interface to allow manual basket creation due to limited engineering resources</li>
                                <li><strong>User Experience:</strong> Collaborated with our designer to create intuitive goal selection flow to improve conversion rates</li>
                                <li><strong>Strategic Planning:</strong> Prioritized core functionality over advanced features to allow faster time-to-market during company pivot</li>
                            </ul>`
                        },
                        {
                            title: 'TEAMWORK & RESULTS',
                            content: `<p>Coordinated closely with engineering and design teams to ensure smooth execution despite resource constraints:</p>
                            <ul>
                                <li><strong>Engineering Collaboration:</strong> Worked with 2-person dev team to balance feature complexity with delivery timelines</li>
                                <li><strong>Design Partnership:</strong> Collaborated on user flows and wireframes to improve user experience within design bandwidth</li>
                                <li><strong>Stakeholder Management:</strong> Regular updates to leadership on progress and pivot strategy alignment</li>
                                <li><strong>User Impact:</strong> Successfully launched goal-based investment solution that improved user decision-making confidence</li>
                            </ul>`
                        }
                    ]
                }
            }
        ]
    },
    'user-growth': {
        title: 'MUTUAL FUNDS DIRECT SEARCH',
        subtitle: 'Fund Discovery Platform for Advanced Investors',
        slides: [
            {
                title: 'STRATEGIC CONTEXT & USER RESEARCH',
                content: {
                    header: 'Building for Advanced Self-Directed Investors',
                    sections: [
                        {
                            title: 'PIVOT STRATEGY & USER SEGMENTATION',
                            content: `<p>As our first major feature during the mutual funds pivot, I identified a segment of advanced users who wanted full control over fund selection rather than pre-built baskets. These users had investment experience but lacked access to comprehensive fund data and comparison tools.</p>
                            <p>The challenge was building an entire mutual funds platform in just 2 months with our small team, while integrating with BSE StaR MF platform for real-time fund data and transactions.</p>
                            <ul>
                                <li><strong>User Segmentation:</strong> Focused on experienced investors to allow them to make informed independent decisions</li>
                                <li><strong>Data Integration:</strong> BSE StaR MF API integration to allow real-time fund information and transaction processing</li>
                                <li><strong>Search & Discovery:</strong> Comprehensive filtering system to improve decision-making for fund selection</li>
                            </ul>`
                        }
                    ]
                }
            },
            {
                title: 'EXECUTION UNDER PRESSURE',
                content: {
                    header: 'Rapid Development with Technical Constraints',
                    sections: [
                        {
                            title: 'TECHNICAL CHALLENGES',
                            content: `<p>Led product development under intense time pressure, managing data integration complexities while coordinating with our 2-engineer team to build the entire platform from scratch.</p>
                            <ul>
                                <li><strong>Data Integration Challenge:</strong> BSE StaR MF API had complex data structures requiring careful mapping to allow seamless user experience</li>
                                <li><strong>Performance Optimization:</strong> Search functionality needed to handle large fund databases to improve user search experience</li>
                                <li><strong>Technical Bandwidth:</strong> Prioritized core search and filter features over advanced analytics due to development timeline constraints</li>
                            </ul>`
                        },
                        {
                            title: 'TEAM COLLABORATION & DELIVERY',
                            content: `<p>Successfully delivered the platform within the 2-month deadline through effective team coordination and strategic feature prioritization:</p>
                            <ul>
                                <li><strong>Engineering Partnership:</strong> Daily standups with dev team to balance feature complexity with delivery timelines</li>
                                <li><strong>Strategic Vision:</strong> Focused on essential fund discovery features to allow users to research and invest independently</li>
                                <li><strong>Design Coordination:</strong> Worked with designer to create intuitive search interface despite complex underlying data structure</li>
                                <li><strong>Stakeholder Communication:</strong> Regular progress updates to leadership during critical pivot period to improve company strategic alignment</li>
                            </ul>`
                        }
                    ]
                }
            }
        ]
    },
    'ux-enhancement': {
        title: 'KYC & INTERNAL AUTH AUTOMATION',
        subtitle: 'Digital Onboarding for Mutual Funds Compliance',
        slides: [
            {
                title: 'COMPLIANCE & BUSINESS STRATEGY',
                content: {
                    header: 'Enabling Mutual Funds Pivot Through Digital KYC',
                    sections: [
                        {
                            title: 'REGULATORY REQUIREMENT & BUSINESS NEED',
                            content: `<p>As part of our strategic pivot to mutual funds, KYC compliance became mandatory for user onboarding. The existing manual process was creating significant friction in user acquisition and time-to-value delivery.</p>
                            <p>I led the design and implementation of a digital KYC system to allow users to complete onboarding in minutes rather than hours, while ensuring full regulatory compliance for mutual fund investments.</p>
                            <ul>
                                <li><strong>Compliance Mandate:</strong> KYC required for all mutual fund transactions to meet regulatory standards</li>
                                <li><strong>User Acquisition:</strong> Streamlined onboarding to improve conversion and reduce drop-off rates</li>
                                <li><strong>Time to Value:</strong> Fast user verification to allow immediate investment capability</li>
                            </ul>`
                        }
                    ]
                }
            },
            {
                title: 'TECHNICAL EXECUTION & INTEGRATION',
                content: {
                    header: 'Building Seamless Digital Identity Verification',
                    sections: [
                        {
                            title: 'INTEGRATION CHALLENGES',
                            content: `<p>Coordinated complex third-party integrations while managing technical constraints and ensuring smooth user experience across the verification flow.</p>
                            <ul>
                                <li><strong>HyperVerge Integration:</strong> OCR and liveness detection to allow instant document verification</li>
                                <li><strong>CVL KRA Integration:</strong> KYC record access and validation to improve onboarding accuracy</li>
                                <li><strong>Technical Bandwidth:</strong> Managed integration complexity with limited engineering resources during pivot period</li>
                            </ul>`
                        },
                        {
                            title: 'PRODUCT DELIVERY & IMPACT',
                            content: `<p>Successfully launched digital KYC system that transformed user onboarding experience while maintaining regulatory compliance:</p>
                            <ul>
                                <li><strong>Engineering Collaboration:</strong> Worked closely with dev team to manage multiple API integrations and error handling</li>
                                <li><strong>User Experience Design:</strong> Simplified multi-step verification process to improve completion rates</li>
                                <li><strong>Strategic Planning:</strong> Prioritized core verification features to allow faster go-to-market during company pivot</li>
                                <li><strong>Business Impact:</strong> Reduced onboarding time from hours to minutes, significantly improving user acquisition metrics</li>
                            </ul>`
                        }
                    ]
                }
            }
        ]
    },
    'upi-autopay': {
        title: 'EVENTS & NOTIFICATIONS',
        subtitle: 'Core Infrastructure for Product Analytics & User Communication',
        slides: [
            {
                title: 'PRODUCT ANALYTICS & COMMUNICATION STRATEGY',
                content: {
                    header: 'Building Data-Driven Product Development Infrastructure',
                    sections: [
                        {
                            title: 'CORE INFRASTRUCTURE DEVELOPMENT',
                            content: `<p>Built comprehensive events and notifications system as core product infrastructure to enable data-driven product development through the build-measure-learn cycle. This system became essential for product discovery, user behavior analysis, and automated user communication.</p>
                            <p>Designed system to handle three critical areas: user engagement tracking, system monitoring for bug detection, and transaction notifications to improve user trust and transparency.</p>
                            <ul>
                                <li><strong>Product Analytics:</strong> Event tracking system to allow data-driven feature decisions and user behavior insights</li>
                                <li><strong>User Communication:</strong> Multi-channel notification system to improve user engagement and transaction transparency</li>
                                <li><strong>System Monitoring:</strong> Custom event API to allow proactive bug detection and system health monitoring</li>
                            </ul>`
                        }
                    ]
                }
            },
            {
                title: 'TECHNICAL IMPLEMENTATION & INTEGRATION',
                content: {
                    header: 'Multi-Service Integration for Comprehensive Coverage',
                    sections: [
                        {
                            title: 'INTEGRATION CHALLENGES & SOLUTIONS',
                            content: `<p>Coordinated multiple third-party integrations and custom development to create comprehensive events and notifications infrastructure that supported all product and business needs.</p>
                            <ul>
                                <li><strong>User Engagement:</strong> CleverTap integration to allow personalized user communication and behavior-based messaging</li>
                                <li><strong>Transaction Notifications:</strong> Multi-channel approach using 2Factor for SMS, CleverTap for push notifications, and Amazon SES for email to improve transaction transparency</li>
                                <li><strong>System Monitoring:</strong> Custom event API development to allow real-time bug detection and system health tracking</li>
                                <li><strong>Analytics Integration:</strong> Event tracking system to enable build-measure-learn cycles and data-driven product decisions</li>
                            </ul>`
                        },
                        {
                            title: 'PRODUCT DEVELOPMENT & TEAM IMPACT',
                            content: `<p>Successfully implemented core infrastructure that became essential for product development, user communication, and operational efficiency across the organization.</p>
                            <ul>
                                <li><strong>Product Discovery:</strong> Event tracking enabled data-driven feature prioritization and user behavior insights for better product decisions</li>
                                <li><strong>Engineering Collaboration:</strong> Worked with dev team to balance custom development with third-party integrations given technical bandwidth constraints</li>
                                <li><strong>User Experience:</strong> Multi-channel communication system improved user trust through timely transaction updates and engagement</li>
                                <li><strong>Strategic Planning:</strong> Built scalable foundation that supported future product expansion and user growth initiatives</li>
                            </ul>`
                        }
                    ]
                }
            }
        ]
    },
    'analytics': {
        title: 'IPO & SGB FLOWS',
        subtitle: 'Primary Market Investment Platform for Stocks & ETFs Users',
        slides: [
            {
                title: 'PRODUCT STRATEGY & MARKET OPPORTUNITY',
                content: {
                    header: 'Expanding Beyond Secondary Market Trading',
                    sections: [
                        {
                            title: 'EXPANDING INVESTMENT OPTIONS',
                            content: `<p>During our stocks and ETFs phase, I identified an opportunity to expand into primary market investments by offering IPO and Sovereign Gold Bond (SGB) access to our existing user base who were already trading in secondary markets.</p>
                            <p>The challenge was implementing IPO ASBA (Applications Supported by Blocked Amount), which required a completely different transaction flow compared to regular stock trading, along with NSE API integration for DEMAT form investments.</p>
                            <ul>
                                <li><strong>User Research:</strong> Existing users wanted access to IPOs and SGB investments to allow portfolio diversification beyond stocks and ETFs</li>
                                <li><strong>Technical Challenge:</strong> ASBA implementation required unique transaction handling to allow fund blocking instead of immediate debit</li>
                                <li><strong>Integration Complexity:</strong> NSE API integration for DEMAT form processing to improve investment accessibility</li>
                            </ul>`
                        }
                    ]
                }
            },
            {
                title: 'TECHNICAL IMPLEMENTATION & CHALLENGES',
                content: {
                    header: 'Building ASBA and NSE Integration Infrastructure',
                    sections: [
                        {
                            title: 'ASBA & API INTEGRATION CHALLENGES',
                            content: `<p>Led the technical implementation of IPO ASBA and SGB investment flows, coordinating with engineering team to handle the unique transaction requirements and NSE API integration complexities.</p>
                            <ul>
                                <li><strong>ASBA Implementation:</strong> Built fund blocking mechanism for IPO applications to allow users to participate without immediate fund debit</li>
                                <li><strong>NSE API Integration:</strong> Coordinated integration with NSE systems for DEMAT form processing to improve investment execution</li>
                                <li><strong>User Experience Design:</strong> Simplified complex IPO application process to allow users to understand and complete applications easily</li>
                                <li><strong>Technical Constraints:</strong> Managed API limitations and processing delays while maintaining smooth user experience</li>
                            </ul>`
                        },
                        {
                            title: 'PRODUCT EXECUTION & TEAM COLLABORATION',
                            content: `<p>Successfully launched primary market investment capabilities despite complex technical requirements and integration challenges, working closely with development and design teams.</p>
                            <ul>
                                <li><strong>Engineering Partnership:</strong> Collaborated with dev team to handle ASBA transaction complexities and NSE API integration challenges</li>
                                <li><strong>User Education:</strong> Created intuitive flows to allow users to understand IPO application process and SGB investment benefits</li>
                                <li><strong>Strategic Planning:</strong> Prioritized core IPO and SGB functionality to allow faster market entry for primary investments</li>
                                <li><strong>Business Impact:</strong> Expanded investment options for existing stocks and ETFs users, improving platform value proposition</li>
                            </ul>`
                        }
                    ]
                }
            }
        ]
    },
    'compliance': {
        title: 'BRAND REVAMP',
        subtitle: 'Complete App Redesign from Inherited MVP',
        slides: [
            {
                title: 'INHERITED MVP & STRATEGIC REDESIGN',
                content: {
                    header: 'Transforming Non-User-Friendly MVP into Polished Product',
                    sections: [
                        {
                            title: 'MVP ASSESSMENT & REDESIGN STRATEGY',
                            content: `<p>When I joined, I inherited an MVP that was functional but not user-friendly. The app needed a complete redesign to meet modern UX standards and user expectations before we could focus on feature development.</p>
                            <p>The challenge was massive - redesigning the entire app experience with limited design and development resources while maintaining existing functionality during the transition.</p>
                            <ul>
                                <li><strong>MVP Analysis:</strong> Identified core usability issues preventing user adoption and engagement</li>
                                <li><strong>User Research:</strong> Conducted interviews to understand pain points with existing interface</li>
                                <li><strong>Resource Planning:</strong> Coordinated redesign timeline with limited team capacity to allow systematic transformation</li>
                                <li><strong>Strategic Priority:</strong> Complete UI/UX overhaul required before pursuing growth initiatives</li>
                            </ul>`
                        }
                    ]
                }
            },
            {
                title: 'MASSIVE REDESIGN WITH LIMITED RESOURCES',
                content: {
                    header: 'Coordinating Complete App Transformation',
                    sections: [
                        {
                            title: 'DESIGN SYSTEM DEVELOPMENT',
                            content: `<p>Led the creation of a complete design system from scratch to transform the inherited MVP into a professional, user-friendly application that could compete in the fintech market.</p>
                            <ul>
                                <li><strong>Design System Creation:</strong> Built comprehensive UI components and patterns to allow consistent redesign across the entire app</li>
                                <li><strong>Visual Identity:</strong> Developed modern, trustworthy design language to improve user confidence and engagement</li>
                                <li><strong>Team Coordination:</strong> Worked closely with our single designer to prioritize screen redesigns and component development</li>
                                <li><strong>Technical Constraints:</strong> Managed design implementation with limited engineering bandwidth during the transformation</li>
                            </ul>`
                        },
                        {
                            title: 'IMPLEMENTATION & TEAM MANAGEMENT',
                            content: `<p>Successfully executed the complete app transformation through strategic planning, team coordination, and careful resource management despite significant scope and resource constraints.</p>
                            <ul>
                                <li><strong>Engineering Partnership:</strong> Coordinated with dev team to implement new designs without breaking existing functionality</li>
                                <li><strong>Design Collaboration:</strong> Worked with designer to create scalable component library for consistent user experience</li>
                                <li><strong>Strategic Phasing:</strong> Prioritized critical user flows to allow immediate UX improvements while continuing broader redesign</li>
                                <li><strong>Quality Management:</strong> Ensured design consistency and usability standards throughout the massive transformation</li>
                            </ul>`
                        }
                    ]
                }
            },
            {
                title: 'TRANSFORMATION RESULTS & FOUNDATION',
                content: {
                    header: 'Building Foundation for Product Growth',
                    sections: [
                        {
                            title: 'SUCCESSFUL TRANSFORMATION & TEAM IMPACT',
                            content: `<p>Successfully transformed the inherited MVP into a professional, user-friendly application that became the foundation for all future product development and growth initiatives.</p>
                            <ul>
                                <li><strong>Foundation Building:</strong> Created design system and UI standards that enabled faster feature development and consistent user experience</li>
                                <li><strong>Team Empowerment:</strong> Established design processes and component library to allow more efficient product development cycles</li>
                                <li><strong>User Experience:</strong> Transformed app from basic MVP to professional fintech application to improve user trust and engagement</li>
                                <li><strong>Strategic Vision:</strong> Redesign became the foundation that enabled all subsequent product features and business growth initiatives</li>
                            </ul>`
                        }
                    ]
                }
            }
        ]
    }
};

function initializeWorkModal() {
    const workCards = document.querySelectorAll('.work-card');
    const workModal = document.getElementById('work-modal');
    const closeWorkBtn = document.getElementById('close-work');
    
    let currentWorkId = null;
    let currentSlideIndex = 0;
    let workItems = Object.keys(workData);
    let currentWorkIndex = 0;

    // Add click listeners to work cards and their buttons
    workCards.forEach((card) => {
        // Handle card click (but not if clicking the button)
        card.addEventListener('click', (e) => {
            // Don't trigger if clicking the view details button
            if (e.target.closest('.view-details-btn')) {
                return;
            }
            
            e.preventDefault();
            e.stopPropagation();
            
            const workId = card.getAttribute('data-work-id');
            if (workId && workData[workId]) {
                openWorkModal(workId);
            }
        });
        
        // Handle button click specifically
        const detailsBtn = card.querySelector('.view-details-btn');
        if (detailsBtn) {
            detailsBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                const workId = card.getAttribute('data-work-id');
                if (workId && workData[workId]) {
                    openWorkModal(workId);
                }
            });
        }
        
        // Add pointer cursor
        card.style.cursor = 'pointer';
    });
    
    // Return early if modal elements don't exist
    if (!workModal || !closeWorkBtn) {
        return;
    }

    // Close modal listeners
    closeWorkBtn.addEventListener('click', closeWorkModal);
    workModal.addEventListener('click', (e) => {
        if (e.target === workModal) {
            closeWorkModal();
        }
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (!workModal.classList.contains('active')) return;
        
        switch (e.key) {
            case 'Escape':
                closeWorkModal();
                break;
            case 'ArrowLeft':
                e.preventDefault();
                previousSlide();
                break;
            case 'ArrowRight':
                e.preventDefault();
                nextSlide();
                break;
        }
    });

    // Slide navigation
    const prevSlideBtn = document.getElementById('work-prev-slide');
    const nextSlideBtn = document.getElementById('work-next-slide');
    const prevItemBtn = document.getElementById('work-prev-item');
    const nextItemBtn = document.getElementById('work-next-item');

    if (prevSlideBtn) prevSlideBtn.addEventListener('click', previousSlide);
    if (nextSlideBtn) nextSlideBtn.addEventListener('click', nextSlide);
    if (prevItemBtn) prevItemBtn.addEventListener('click', previousWorkItem);
    if (nextItemBtn) nextItemBtn.addEventListener('click', nextWorkItem);

    function openWorkModal(workId) {
        currentWorkId = workId;
        currentSlideIndex = 0;
        currentWorkIndex = workItems.indexOf(workId);
        
        updateModalContent();
        workModal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Analytics
        if (typeof posthog !== 'undefined') {
            posthog.capture('work_modal_opened', {
                work_item: workId,
                theme: currentTheme,
                colorblind_mode: colorblindMode
            });
        }
    }

    function closeWorkModal() {
        workModal.classList.remove('active');
        document.body.style.overflow = '';
        currentWorkId = null;
    }

    function updateModalContent() {
        if (!currentWorkId || !workData[currentWorkId]) return;

        const work = workData[currentWorkId];
        const slide = work.slides[currentSlideIndex];
        
        // Update modal title
        const titleElement = document.getElementById('work-title');
        if (titleElement) {
            titleElement.textContent = `${work.title} - ${slide.title}`;
        }

        // Update slide content
        const slideContent = document.getElementById('work-slide-content');
        if (slideContent && slide.content) {
            slideContent.innerHTML = generateSlideHTML(slide.content);
        }

        // Update slide indicators
        updateSlideIndicators();
        
        // Update navigation buttons
        updateNavigationButtons();
        
        // Update work item info
        const workItemInfo = document.getElementById('work-item-info');
        if (workItemInfo) {
            workItemInfo.textContent = `${currentWorkIndex + 1} of ${workItems.length}`;
        }
    }

    function generateSlideHTML(content) {
        let html = `
            <div class="slide-header">
                <h2 class="slide-title">${content.header || ''}</h2>
            </div>
        `;

        if (content.metrics) {
            html += '<div class="slide-metrics">';
            content.metrics.forEach(metric => {
                html += `
                    <div class="slide-metric">
                        <span class="metric-value">${metric.value}</span>
                        <span class="metric-label">${metric.label}</span>
                    </div>
                `;
            });
            html += '</div>';
        }

        if (content.sections) {
            html += '<div class="slide-content">';
            content.sections.forEach(section => {
                html += `
                    <div class="slide-section">
                        <h4>${section.title}</h4>
                        ${section.content}
                    </div>
                `;
            });
            html += '</div>';
        }

        return html;
    }

    function updateSlideIndicators() {
        const indicatorsContainer = document.getElementById('work-slide-indicators');
        if (!indicatorsContainer || !currentWorkId) return;

        const slides = workData[currentWorkId].slides;
        indicatorsContainer.innerHTML = '';

        slides.forEach((_, index) => {
            const dot = document.createElement('div');
            dot.className = `slide-dot ${index === currentSlideIndex ? 'active' : ''}`;
            dot.addEventListener('click', () => goToSlide(index));
            indicatorsContainer.appendChild(dot);
        });
    }

    function updateNavigationButtons() {
        if (!currentWorkId) return;

        const slides = workData[currentWorkId].slides;
        const prevSlideBtn = document.getElementById('work-prev-slide');
        const nextSlideBtn = document.getElementById('work-next-slide');
        const prevItemBtn = document.getElementById('work-prev-item');
        const nextItemBtn = document.getElementById('work-next-item');

        if (prevSlideBtn) {
            prevSlideBtn.disabled = currentSlideIndex === 0;
        }
        if (nextSlideBtn) {
            nextSlideBtn.disabled = currentSlideIndex === slides.length - 1;
        }
        if (prevItemBtn) {
            prevItemBtn.disabled = currentWorkIndex === 0;
        }
        if (nextItemBtn) {
            nextItemBtn.disabled = currentWorkIndex === workItems.length - 1;
        }
    }

    function previousSlide() {
        if (currentSlideIndex > 0) {
            currentSlideIndex--;
            updateModalContent();
        }
    }

    function nextSlide() {
        if (currentWorkId && currentSlideIndex < workData[currentWorkId].slides.length - 1) {
            currentSlideIndex++;
            updateModalContent();
        }
    }

    function goToSlide(index) {
        currentSlideIndex = index;
        updateModalContent();
    }

    function previousWorkItem() {
        if (currentWorkIndex > 0) {
            currentWorkIndex--;
            currentWorkId = workItems[currentWorkIndex];
            currentSlideIndex = 0;
            updateModalContent();
        }
    }

    function nextWorkItem() {
        if (currentWorkIndex < workItems.length - 1) {
            currentWorkIndex++;
            currentWorkId = workItems[currentWorkIndex];
            currentSlideIndex = 0;
            updateModalContent();
        }
    }
}

console.log('Modern Neobrutal Portfolio Ready!');
console.log('Mobile Optimized | Video Controls | Work Modal System | Certificate Gallery | Get in Touch | AI Query | Health Monitor | Portfolio Sharing | Accessibility Enhanced');