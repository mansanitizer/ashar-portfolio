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
            if (isMobile) {
                // Add mobile collapsible class and functionality
                category.classList.add('mobile-collapsible');
                category.setAttribute('tabindex', '0');
                category.setAttribute('role', 'button');
                category.setAttribute('aria-expanded', 'false');
                
                // Add event listeners if not already added
                if (!eventListenersAdded) {
                    category.addEventListener('click', handleSkillClick);
                    category.addEventListener('keydown', handleSkillKeydown);
                }
                
            } else {
                // Remove mobile functionality on desktop
                category.classList.remove('mobile-collapsible', 'expanded');
                category.removeAttribute('tabindex');
                category.removeAttribute('role');
                category.removeAttribute('aria-expanded');
            }
        });
        
        eventListenersAdded = isMobile;
        console.log('📱 Mobile skills collapse', isMobile ? 'enabled' : 'disabled');
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
                
                // PostHog tracking for health checks
                captureAnalytics('health_check_success', {
                    response_time: responseTime,
                    theme: currentTheme
                });
                
            } else {
                throw new Error('Invalid response');
            }
        } catch (error) {
            isHealthy = false;
            heartIcon.className = 'heart-icon unhealthy';
            healthTooltip.textContent = 'backend unavailable';
            
            console.warn('❤️ Backend health check failed:', error.message);
            
            // PostHog tracking for health failures
            captureAnalytics('health_check_failure', {
                error_message: error.message,
                theme: currentTheme
            });
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
        title: 'MF BASKETS & ADMIN ALLOCATION',
        subtitle: 'Personalized Investment System with Dynamic Portfolio Management',
        slides: [
            {
                title: 'PRODUCT STRATEGY & REQUIREMENTS',
                content: {
                    header: 'Data-Driven Personalized Investment Experience',
                    metrics: [
                        { value: '2x', label: 'AUM Growth' },
                        { value: '45%', label: 'SIP Conversion' },
                        { value: '1-6', label: 'Fund Portfolios' }
                    ],
                    sections: [
                        {
                            title: 'STRATEGIC OBJECTIVES',
                            content: `<p>Architected a sophisticated basket-based investment platform to address user acquisition bottlenecks and portfolio management complexity. The system leverages behavioral finance principles to deliver personalized recommendations.</p>
                            <ul>
                                <li><strong>Risk Profiling:</strong> Psychometric assessment determining user risk tolerance</li>
                                <li><strong>Investment Horizon:</strong> Goal-based timeline optimization for asset allocation</li>
                                <li><strong>Financial Objectives:</strong> Life-stage aligned investment strategy mapping</li>
                                <li><strong>Thematic Preferences:</strong> ESG, sectoral, and market-cap preference integration</li>
                            </ul>`
                        }
                    ]
                }
            },
            {
                title: 'IMPLEMENTATION & BUSINESS OUTCOMES',
                content: {
                    header: 'Scalable Admin Operations & User Conversion',
                    sections: [
                        {
                            title: 'OPERATIONAL EXCELLENCE',
                            content: `<p>Developed a rule-based allocation engine enabling administrators to generate optimized 1-6 fund portfolios in real-time. The system dynamically adjusts recommendations based on user input parameters, presenting personalized "Action Plans" for immediate investment execution.</p>`
                        },
                        {
                            title: 'QUANTIFIABLE BUSINESS IMPACT',
                            content: `<p>Delivered measurable outcomes across key performance indicators:</p>
                            <ul>
                                <li><strong>Portfolio Recommendation Accuracy:</strong> Achieved 85% user acceptance rate for generated baskets</li>
                                <li><strong>Onboarding Efficiency:</strong> Reduced time-to-investment from 15 minutes to 3 minutes</li>
                                <li><strong>SIP Conversion Optimization:</strong> Increased systematic investment plan adoption by 45%</li>
                                <li><strong>AUM Acceleration:</strong> Contributed to 2x assets under management growth within 6 months</li>
                            </ul>`
                        }
                    ]
                }
            }
        ]
    },
    'user-growth': {
        title: 'MUTUAL FUNDS & DIRECT SEARCH',
        subtitle: 'Self-Directed Investment Discovery Platform',
        slides: [
            {
                title: 'MARKET OPPORTUNITY & USER RESEARCH',
                content: {
                    header: 'Data-Driven Fund Discovery for Self-Directed Investors',
                    metrics: [
                        { value: '60%', label: 'User Engagement' },
                        { value: '35%', label: 'SIP Conversion' },
                        { value: '4.2/5', label: 'User Rating' }
                    ],
                    sections: [
                        {
                            title: 'STRATEGIC RATIONALE',
                            content: `<p>Identified a critical product-market fit gap through user research: 68% of users preferred self-directed investment decisions but lacked sophisticated comparison tools. Launched comprehensive fund discovery platform to capture this underserved segment.</p>
                            <p>Solution addressed key user pain points including information asymmetry, decision paralysis, and lack of actionable fund analytics in the direct mutual fund investment journey.</p>`
                        }
                    ]
                }
            },
            {
                title: 'PRODUCT EXECUTION & BUSINESS IMPACT',
                content: {
                    header: 'Advanced Fund Discovery & Comparison Engine',
                    sections: [
                        {
                            title: 'FEATURE ARCHITECTURE',
                            content: `<p>Architected and launched a comprehensive Mutual Fund Explorer featuring advanced analytics and comparison capabilities:</p>
                            <ul>
                                <li><strong>Dynamic Search & Filtering:</strong> 15+ filter criteria including fund size, expense ratio, and Sharpe ratio</li>
                                <li><strong>Advanced Performance Analytics:</strong> Multi-period returns with benchmark comparison and rolling return analysis</li>
                                <li><strong>Portfolio Composition Analysis:</strong> Sector allocation visualization and top holdings transparency</li>
                                <li><strong>Risk Assessment Tools:</strong> Volatility metrics, downside protection analysis, and fund manager track record</li>
                            </ul>`
                        },
                        {
                            title: 'MEASURABLE BUSINESS OUTCOMES',
                            content: `<p>Achieved significant improvements across key user engagement and conversion metrics:</p>
                            <ul>
                                <li><strong>User Engagement:</strong> Increased platform engagement by 60% with 3.5x longer session duration</li>
                                <li><strong>Conversion Rate Optimization:</strong> Improved SIP conversion rate by 35% through enhanced decision support</li>
                                <li><strong>User Satisfaction:</strong> Achieved 4.2/5 user rating with 89% feature adoption rate</li>
                                <li><strong>Revenue Impact:</strong> Generated 22% increase in direct investment transaction volume</li>
                            </ul>`
                        }
                    ]
                }
            }
        ]
    },
    'ux-enhancement': {
        title: 'KYC & INTERNAL AUTH AUTOMATION',
        subtitle: 'Digital Onboarding & Compliance Platform',
        slides: [
            {
                title: 'DIGITAL TRANSFORMATION STRATEGY',
                content: {
                    header: 'End-to-End KYC Automation & Compliance Framework',
                    metrics: [
                        { value: '80%', label: 'Process Automation' },
                        { value: '65%', label: 'Time Reduction' },
                        { value: '99.2%', label: 'Compliance Rate' }
                    ],
                    sections: [
                        {
                            title: 'BUSINESS CASE & TRANSFORMATION',
                            content: `<p>Identified critical operational bottlenecks in legacy Google Forms-based KYC process causing 40% user drop-off and 3-day processing delays. Architected comprehensive digital transformation solution integrating best-in-class identity verification APIs with automated compliance workflows.</p>
                            <p>Strategic initiative addressed regulatory requirements, operational efficiency, and user experience optimization through end-to-end process digitization.</p>`
                        }
                    ]
                }
            },
            {
                title: 'PLATFORM ARCHITECTURE & BUSINESS IMPACT',
                content: {
                    header: 'Integrated Compliance & Authentication Platform',
                    sections: [
                        {
                            title: 'TECHNICAL IMPLEMENTATION',
                            content: `<p>Developed comprehensive KYC automation platform integrating multiple third-party services with custom business logic:</p>
                            <ul>
                                <li><strong>Identity Verification:</strong> Hyperverge integration for OCR, liveness detection, and Aadhaar validation</li>
                                <li><strong>Data Processing:</strong> Automated transformation of unstructured inputs into BSE-compliant formats</li>
                                <li><strong>API Integration:</strong> Real-time BSE UCC submission with automated error handling and retry logic</li>
                                <li><strong>Authentication Layer:</strong> ELog Auth implementation with FATCA processing and state management</li>
                            </ul>`
                        },
                        {
                            title: 'OPERATIONAL EXCELLENCE & OUTCOMES',
                            content: `<p>Delivered scalable compliance infrastructure with measurable business impact:</p>
                            <ul>
                                <li><strong>Process Efficiency:</strong> Achieved 80% automation of manual KYC operations with 12-step workflow engine</li>
                                <li><strong>User Experience:</strong> Reduced onboarding time from 3 days to 4 hours, improving conversion by 65%</li>
                                <li><strong>Compliance & Audit:</strong> Implemented comprehensive audit trail with 99.2% regulatory compliance rate</li>
                                <li><strong>Infrastructure Security:</strong> AWS S3-based secure document storage with encryption and access controls</li>
                            </ul>`
                        }
                    ]
                }
            }
        ]
    },
    'upi-autopay': {
        title: 'EVENTS & NOTIFICATIONS',
        subtitle: 'Intelligent User Engagement & Retention Platform',
        slides: [
            {
                title: 'USER ENGAGEMENT STRATEGY',
                content: {
                    header: 'Data-Driven Engagement & Retention Architecture',
                    metrics: [
                        { value: '2x', label: 'Operational Efficiency' },
                        { value: '45%', label: 'User Retention' },
                        { value: '3.2x', label: 'Engagement Rate' }
                    ],
                    sections: [
                        {
                            title: 'BEHAVIORAL ANALYTICS FRAMEWORK',
                            content: `<p>Architected comprehensive user engagement ecosystem leveraging behavioral analytics to optimize conversion funnels and drive sustainable user retention. Implemented predictive modeling to identify user intent and deliver personalized intervention strategies.</p>
                            <p>Strategic initiative addressed declining user engagement post-onboarding and created systematic approach to nurture user relationships throughout the investment lifecycle.</p>`
                        }
                    ]
                }
            },
            {
                title: 'PLATFORM IMPLEMENTATION & OUTCOMES',
                content: {
                    header: 'Omnichannel Engagement Platform',
                    sections: [
                        {
                            title: 'TECHNICAL ARCHITECTURE',
                            content: `<p>Integrated best-in-class analytics and engagement platforms to create unified user experience optimization system:</p>
                            <ul>
                                <li><strong>Behavioral Analytics:</strong> Mixpanel integration for comprehensive user journey mapping and cohort analysis</li>
                                <li><strong>Engagement Automation:</strong> CleverTap implementation for real-time personalized messaging and campaign optimization</li>
                                <li><strong>Content Strategy:</strong> Newsletter and blog communication pipeline with A/B testing capabilities</li>
                                <li><strong>Predictive Triggers:</strong> Event-based automation for proactive user intervention and support</li>
                            </ul>`
                        },
                        {
                            title: 'BUSINESS IMPACT & PERFORMANCE',
                            content: `<p>Delivered significant improvements in user engagement and operational efficiency metrics:</p>
                            <ul>
                                <li><strong>Operational Efficiency:</strong> Achieved 2x improvement in KYC and investment funnel completion rates</li>
                                <li><strong>User Retention:</strong> Increased 30-day retention by 45% through targeted re-engagement campaigns</li>
                                <li><strong>Engagement Optimization:</strong> Delivered 3.2x increase in user engagement through personalized notifications</li>
                                <li><strong>Conversion Rate:</strong> Improved investment completion rate by 28% via strategic nudging and follow-ups</li>
                            </ul>`
                        }
                    ]
                }
            }
        ]
    },
    'analytics': {
        title: 'IPO & SGB FLOWS',
        subtitle: 'Multi-Asset Investment Platform Expansion',
        slides: [
            {
                title: 'PRODUCT STRATEGY & MARKET EXPANSION',
                content: {
                    header: 'Strategic Investment Portfolio Diversification',
                    metrics: [
                        { value: '150%', label: 'Platform Adoption' },
                        { value: '92%', label: 'Application Success' },
                        { value: '2.8x', label: 'Revenue Growth' }
                    ],
                    sections: [
                        {
                            title: 'STRATEGIC MARKET OPPORTUNITY',
                            content: `<p>Identified significant market opportunity in primary market investments through user research indicating 78% demand for IPO and SGB access. Architected comprehensive multi-asset investment platform to capture underserved market segments and increase platform stickiness.</p>
                            <p>Strategic expansion addressed portfolio diversification needs while leveraging existing user base and infrastructure for accelerated market penetration.</p>`
                        }
                    ]
                }
            },
            {
                title: 'PLATFORM DEVELOPMENT & BUSINESS OUTCOMES',
                content: {
                    header: 'Integrated Primary Market Investment Platform',
                    sections: [
                        {
                            title: 'TECHNICAL IMPLEMENTATION',
                            content: `<p>Developed comprehensive primary market investment platform with unified user experience and backend architecture:</p>
                            <ul>
                                <li><strong>IPO Application Engine:</strong> End-to-end IPO investment flows with UPI mandate integration and automated allocation processing</li>
                                <li><strong>SGB Investment Platform:</strong> Sovereign Gold Bond purchase system with lock-in period tracking and maturity optimization</li>
                                <li><strong>Compliance Integration:</strong> Seamless KYC validation and bank verification layer integration</li>
                                <li><strong>Portfolio Management:</strong> Unified holdings view with real-time status updates and performance tracking</li>
                            </ul>`
                        },
                        {
                            title: 'QUANTIFIABLE BUSINESS IMPACT',
                            content: `<p>Achieved substantial growth in user engagement and revenue metrics:</p>
                            <ul>
                                <li><strong>Platform Adoption:</strong> Increased user engagement by 150% with 65% of users utilizing new investment options</li>
                                <li><strong>Application Success Rate:</strong> Achieved 92% successful application completion rate through optimized UX flows</li>
                                <li><strong>Revenue Diversification:</strong> Generated 2.8x revenue growth through expanded product portfolio</li>
                                <li><strong>User Retention:</strong> Improved 90-day retention by 38% through enhanced investment portfolio options</li>
                            </ul>`
                        }
                    ]
                }
            }
        ]
    },
    'compliance': {
        title: 'BRAND REVAMP',
        subtitle: 'Complete UI/UX Transformation & Brand Refresh',
        slides: [
            {
                title: 'DESIGN RESEARCH & STRATEGY',
                content: {
                    header: 'User-Centered Brand Evolution',
                    metrics: [
                        { value: '4→7', label: 'NPS Score' },
                        { value: '85%', label: 'User Satisfaction' },
                        { value: '40%', label: 'Task Completion' }
                    ],
                    sections: [
                        {
                            title: 'RESEARCH FOUNDATION',
                            content: `<p>Comprehensive analysis driving brand transformation:</p>
                            <ul>
                                <li><strong>User Interviews:</strong> 50+ interviews revealing pain points in current design</li>
                                <li><strong>Competitive Analysis:</strong> Analyzed 15 fintech platforms for best practices</li>
                                <li><strong>Usability Testing:</strong> Identified 23 critical UX issues affecting conversion</li>
                                <li><strong>Brand Perception Study:</strong> Assessed market positioning and brand equity</li>
                            </ul>`
                        }
                    ]
                }
            },
            {
                title: 'DESIGN SYSTEM & IMPLEMENTATION',
                content: {
                    header: 'Cohesive Visual Language',
                    sections: [
                        {
                            title: 'VISUAL IDENTITY REFRESH',
                            content: `<p>Modern, trustworthy design language for fintech:</p>
                            <ul>
                                <li><strong>Typography:</strong> Implemented clean, readable font hierarchy for financial data</li>
                                <li><strong>Color Palette:</strong> Introduced trust-building blues with accessible contrast ratios</li>
                                <li><strong>Iconography:</strong> Custom icon set reflecting financial concepts and actions</li>
                                <li><strong>Spacing System:</strong> Consistent 8px grid system for visual harmony</li>
                            </ul>`
                        },
                        {
                            title: 'COMPONENT LIBRARY',
                            content: `<p>Scalable design system implementation:</p>
                            <ul>
                                <li><strong>UI Components:</strong> 45+ reusable components in Figma and code</li>
                                <li><strong>Investment Cards:</strong> Redesigned fund display with clear hierarchy</li>
                                <li><strong>Dashboard Widgets:</strong> Intuitive portfolio overview components</li>
                                <li><strong>Form Patterns:</strong> Simplified onboarding and transaction flows</li>
                            </ul>`
                        }
                    ]
                }
            },
            {
                title: 'IMPACT & RESULTS',
                content: {
                    header: 'Measurable Brand Success',
                    sections: [
                        {
                            title: 'USER EXPERIENCE METRICS',
                            content: `<p>Significant improvements across all user satisfaction metrics:</p>
                            <ul>
                                <li><strong>NPS Improvement:</strong> Increased from 4 to 7, representing 75% growth</li>
                                <li><strong>User Satisfaction:</strong> 85% positive feedback on new design</li>
                                <li><strong>Task Completion:</strong> 40% increase in successful investment flows</li>
                                <li><strong>Support Tickets:</strong> 30% reduction in UI-related queries</li>
                            </ul>`
                        },
                        {
                            title: 'BUSINESS IMPACT',
                            content: `<p>Brand revamp driving measurable business outcomes:</p>
                            <ul>
                                <li><strong>User Retention:</strong> 25% improvement in 30-day retention rates</li>
                                <li><strong>Conversion Rate:</strong> 18% increase in onboarding completion</li>
                                <li><strong>Brand Recognition:</strong> 60% improvement in brand recall studies</li>
                                <li><strong>Market Position:</strong> Elevated perception as modern, trustworthy platform</li>
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