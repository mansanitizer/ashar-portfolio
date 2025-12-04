// Platform-specific sharing utilities with context-aware messaging
// Optimized for HR/hiring manager forwarding and professional sharing

const SHARE_PLATFORMS = {
    LINKEDIN: 'linkedin',
    TWITTER: 'twitter', 
    WHATSAPP: 'whatsapp'
};

const SHARE_CONTEXTS = {
    PORTFOLIO: 'portfolio',
    GAME: 'game'
};

/**
 * Platform-specific share messages optimized for different audiences
 */
const SHARE_MESSAGES = {
    [SHARE_CONTEXTS.PORTFOLIO]: {
        [SHARE_PLATFORMS.LINKEDIN]: "🚀 Check out Ashar Rai Mujeeb's portfolio - Associate Product Manager with proven track record in user growth and data-driven decision making. Perfect for product management roles!",
        
        [SHARE_PLATFORMS.TWITTER]: "💼 Impressive PM portfolio from Ashar Rai - legal background turned product manager with strong results in user growth & UX",
        
        [SHARE_PLATFORMS.WHATSAPP]: "Hey! Found this solid PM portfolio - Ashar has great experience and his interactive game shows attention to detail. Worth checking out for our open positions!"
    },
    
    [SHARE_CONTEXTS.GAME]: {
        [SHARE_PLATFORMS.LINKEDIN]: (score, accuracy) => 
            `🎯 Just tested my eye for detail with Spot the Fake CV! Scored ${score} points with ${accuracy}% accuracy identifying AI-generated resume bullets. Fun challenge that tests your attention to detail! Try it yourself!`,
        
        [SHARE_PLATFORMS.TWITTER]: (score, accuracy) => 
            `🧠 Can you spot fake CV bullets? Just scored ${score}/20 with ${accuracy}% accuracy on this AI detection game! Fun brain teaser - can you spot the fake? #GameChallenge #AttentionToDetail`,
        
        [SHARE_PLATFORMS.WHATSAPP]: (score, accuracy) => 
            `Just tried this CV game - scored ${score} points with ${accuracy}% accuracy! Really fun challenge that shows how tricky AI content can be!`
    }
};

/**
 * Platform-specific URL generators
 */
const PLATFORM_URLS = {
    [SHARE_PLATFORMS.LINKEDIN]: (text, url) => {
        const params = new URLSearchParams({
            mini: 'true',
            url: url,
            title: text
        });
        return `https://www.linkedin.com/sharing/share-offsite/?${params.toString()}`;
    },
    
    [SHARE_PLATFORMS.TWITTER]: (text, url) => {
        const params = new URLSearchParams({
            text: `${text} ${url}`,
            hashtags: 'ProductManager,Portfolio'
        });
        return `https://twitter.com/intent/tweet?${params.toString()}`;
    },
    
    [SHARE_PLATFORMS.WHATSAPP]: (text, url) => {
        const message = encodeURIComponent(`${text} ${url}`);
        return `https://wa.me/?text=${message}`;
    }
};

/**
 * Generate platform-specific share URL with optimized messaging
 * @param {string} platform - The sharing platform
 * @param {string} context - The sharing context (portfolio or game)
 * @param {Object} data - Additional data (score, accuracy for game)
 * @returns {string} The share URL
 */
export function generateShareUrl(platform, context, data = {}) {
    // Use production domain instead of window.location.origin
    const baseUrl = 'https://iarm.me';
    let shareUrl = baseUrl;
    let shareText = '';
    
    // Determine the URL to share
    if (context === SHARE_CONTEXTS.GAME) {
        shareUrl = `${baseUrl}/game.html`;
        const messageGenerator = SHARE_MESSAGES[context][platform];
        shareText = typeof messageGenerator === 'function' 
            ? messageGenerator(data.score || 0, data.accuracy || 0)
            : messageGenerator;
    } else {
        shareUrl = baseUrl;
        shareText = SHARE_MESSAGES[context][platform];
    }
    
    return PLATFORM_URLS[platform](shareText, shareUrl);
}

/**
 * Share content using native Web Share API with fallback
 * @param {string} context - The sharing context
 * @param {Object} data - Share data including title, text, url, files
 * @returns {Promise} Promise that resolves when share is complete
 */
export async function nativeShare(context, data = {}) {
    const { title, text, url, files } = data;
    
    try {
        if (navigator.share && (!files || navigator.canShare?.({ files }))) {
            const shareData = { title, text, url };
            if (files && files.length > 0) {
                shareData.files = files;
            }
            
            await navigator.share(shareData);
            return { success: true, method: 'native' };
        } else {
            // Fallback to clipboard
            const shareText = `${text} ${url}`;
            await navigator.clipboard.writeText(shareText);
            return { success: true, method: 'clipboard', text: shareText };
        }
    } catch (error) {
        console.error('Share failed:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Open platform-specific share dialog
 * @param {string} platform - The sharing platform
 * @param {string} context - The sharing context
 * @param {Object} data - Additional data for message generation
 */
export function openPlatformShare(platform, context, data = {}) {
    console.log('🔗 openPlatformShare called', { platform, context, data });
    const shareUrl = generateShareUrl(platform, context, data);
    console.log('🔗 Generated share URL:', shareUrl);
    
    // Open in new window/tab
    const windowFeatures = 'width=600,height=400,resizable=yes,scrollbars=yes';
    const newWindow = window.open(shareUrl, '_blank', windowFeatures);
    console.log('🔗 Window opened:', !!newWindow);
    
    // Analytics tracking
    if (typeof posthog !== 'undefined') {
        posthog.capture('platform_share_clicked', {
            platform,
            context,
            share_data: data,
            user_agent: navigator.userAgent,
            timestamp: new Date().toISOString()
        });
    }
}

/**
 * Copy share text to clipboard
 * @param {string} context - The sharing context
 * @param {string} platform - The platform (for message formatting)
 * @param {Object} data - Additional data for message generation
 * @returns {Promise} Promise that resolves with copied text
 */
export async function copyToClipboard(context, platform, data = {}) {
    const baseUrl = 'https://iarm.me';
    const shareUrl = context === SHARE_CONTEXTS.GAME ? `${baseUrl}/game.html` : baseUrl;
    
    let shareText = '';
    if (context === SHARE_CONTEXTS.GAME) {
        const messageGenerator = SHARE_MESSAGES[context][platform];
        shareText = typeof messageGenerator === 'function' 
            ? messageGenerator(data.score || 0, data.accuracy || 0)
            : messageGenerator;
    } else {
        shareText = SHARE_MESSAGES[context][platform];
    }
    
    const fullText = `${shareText} ${shareUrl}`;
    
    try {
        await navigator.clipboard.writeText(fullText);
        return { success: true, text: fullText };
    } catch (error) {
        console.error('Clipboard copy failed:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Capture screenshot for sharing
 * @param {string} elementId - ID of element to capture
 * @param {Object} options - Screenshot options
 * @returns {Promise<Blob>} Promise that resolves with image blob
 */
export async function captureScreenshot(elementId, options = {}) {
    const {
        width = 1200,
        height = 630,
        backgroundColor = '#ffffff',
        quality = 0.9
    } = options;
    
    // Load html2canvas if not already loaded
    if (!window.html2canvas) {
        await loadHtml2Canvas();
    }
    
    const element = document.getElementById(elementId);
    if (!element) {
        throw new Error(`Element with ID "${elementId}" not found`);
    }
    
    try {
        const canvas = await html2canvas(element, {
            backgroundColor,
            width,
            height,
            scale: 2, // High DPI
            useCORS: true,
            allowTaint: false,
            removeContainer: true
        });
        
        return new Promise(resolve => {
            canvas.toBlob(resolve, 'image/png', quality);
        });
    } catch (error) {
        console.error('Screenshot capture failed:', error);
        throw error;
    }
}

/**
 * Dynamically load html2canvas library
 * @returns {Promise} Promise that resolves when library is loaded
 */
async function loadHtml2Canvas() {
    return new Promise((resolve, reject) => {
        if (window.html2canvas) {
            resolve();
            return;
        }
        
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
        script.onload = () => resolve();
        script.onerror = () => reject(new Error('Failed to load html2canvas'));
        document.head.appendChild(script);
    });
}

/**
 * Create shareable image with profile/game branding
 * @param {string} context - The sharing context
 * @param {Object} data - Data for image generation
 * @returns {Promise<Blob>} Promise that resolves with branded image
 */
export async function createBrandedShareImage(context, data = {}) {
    // Create a temporary container for the branded share image
    const container = document.createElement('div');
    container.style.cssText = `
        position: fixed;
        top: -9999px;
        left: -9999px;
        width: 1200px;
        height: 630px;
        background: #ffffff;
        font-family: 'Space Grotesk', sans-serif;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        padding: 60px;
        box-sizing: border-box;
    `;
    
    if (context === SHARE_CONTEXTS.PORTFOLIO) {
        container.innerHTML = `
            <div style="text-align: center; color: #000000;">
                <h1 style="font-size: 72px; font-weight: 900; margin: 0 0 20px 0; color: #000000;">ASHAR RAI MUJEEB</h1>
                <p style="font-size: 32px; font-weight: 600; margin: 0 0 40px 0; color: #666666;">ASSOCIATE PRODUCT MANAGER</p>
                <div style="background: #0066FF; color: white; padding: 20px 40px; font-size: 24px; font-weight: 700; border: 4px solid #000000; box-shadow: 8px 8px 0 #000000;">
                    Portfolio & Interactive CV Game
                </div>
            </div>
        `;
    } else if (context === SHARE_CONTEXTS.GAME) {
        container.innerHTML = `
            <div style="text-align: center; color: #000000;">
                <h1 style="font-size: 56px; font-weight: 900; margin: 0 0 20px 0; color: #000000;">SPOT THE FAKE CV</h1>
                <p style="font-size: 28px; font-weight: 600; margin: 0 0 30px 0; color: #666666;">Final Score: ${data.score || 0} points</p>
                <p style="font-size: 24px; font-weight: 600; margin: 0 0 40px 0; color: #666666;">Accuracy: ${data.accuracy || 0}%</p>
                <div style="background: #FF0000; color: white; padding: 20px 40px; font-size: 20px; font-weight: 700; border: 4px solid #000000; box-shadow: 8px 8px 0 #000000;">
                    Can you identify AI-generated resume bullets?
                </div>
            </div>
        `;
    }
    
    document.body.appendChild(container);
    
    try {
        const blob = await captureScreenshot(container.id || 'temp-share-container');
        document.body.removeChild(container);
        return blob;
    } catch (error) {
        document.body.removeChild(container);
        throw error;
    }
}

// Export constants for use in other modules
export { SHARE_PLATFORMS, SHARE_CONTEXTS };