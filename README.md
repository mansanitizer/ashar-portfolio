# Neobrutal Portfolio for Ashar Rai Mujeeb

A minimal, neobrutal-style portfolio website for a product manager, featuring a modern design with dark/light mode switching, accent color picker, and mobile optimization.

## 🎯 Features

- **Hero Video Section**: Autoplay video with full controls (play/pause, volume, captions, speed)
- **Theme Switching**: Dark/Light mode toggle with localStorage persistence
- **Accent Color Picker**: 6 vibrant color options for personalization
- **Bento Box Layout**: Modern grid-based design with hover effects
- **Mobile Optimized**: Responsive design focused on iPhone/modern devices
- **Interactive Elements**: Smooth animations, scroll effects, and touch gestures
- **Keyboard Shortcuts**: Space (play/pause), T (theme), M (mute), C (captions)
- **Touch Gestures**: Swipe left/right to change theme on mobile

## 📁 Files Structure

```
portfolio/
├── index.html          # Main HTML structure
├── style.css           # Neobrutal CSS styling
├── script.js           # JavaScript functionality
├── README.md           # This file
└── assets/             # Add your media files here
    ├── hero-video.mp4  # Your hero video
    ├── captions.vtt    # Video captions file
    ├── resume.pdf      # Your resume PDF
    └── images/         # Personal gallery images
        ├── fitness-placeholder.jpg
        ├── tech-placeholder.jpg
        └── legal-placeholder.jpg
```

## 🚀 Getting Started

1. **Add Your Video**: Replace `hero-video.mp4` with your actual video file
2. **Add Your Resume**: Replace `resume.pdf` with your actual resume
3. **Add Personal Images**: Replace placeholder images in the personal gallery
4. **Create Captions**: Add a `captions.vtt` file for video accessibility

### Sample Captions File (captions.vtt):
```
WEBVTT

00:00:00.000 --> 00:00:03.000
Hi, I'm Ashar Rai Mujeeb, a Product Manager

00:00:03.000 --> 00:00:06.000
I specialize in launching innovative products

00:00:06.000 --> 00:00:09.000
and driving user growth through data-driven decisions
```

## 🎨 Design System

### Color Schemes

**Dark Mode:**
- Background: `#222222`
- Text: `#ffffff`
- Default Accent: `#FFFF00` (Yellow)

**Light Mode:**
- Background: `#f0f0f0`
- Text: `#000000`
- Default Accent: `#00008B` (Dark Blue)

### Accent Colors Available:
- Yellow: `#FFFF00`
- Green: `#00FF00`
- Magenta: `#FF00FF`
- Cyan: `#00FFFF`
- Orange Red: `#FF4500`
- Purple: `#9400D3`

## 📱 Mobile Optimization

- **Responsive Grid**: Single column layout on mobile
- **Touch Gestures**: Swipe to change themes
- **Optimized Controls**: Compact video controls for mobile
- **iPhone Focus**: Specifically optimized for modern mobile devices

## 🎮 Interactive Features

### Keyboard Shortcuts:
- `Space`: Play/pause video
- `T`: Toggle theme
- `M`: Toggle mute
- `C`: Toggle captions

### Mouse Interactions:
- Hover effects on all interactive elements
- Smooth scroll animations
- Parallax effect on hero section

### Touch Gestures:
- Swipe left: Switch to dark theme
- Swipe right: Switch to light theme

## 🔧 Customization

### Adding New Sections:
1. Add HTML structure in `index.html`
2. Add styling in `style.css`
3. Add any JavaScript functionality in `script.js`

### Changing Colors:
1. Update CSS custom properties in `:root`
2. Add new accent colors in the accent picker
3. Update the JavaScript color mappings

### Adding New Work Items:
Update the `.work-grid` section in `index.html` with new `.work-item` elements.

## 🌟 Neobrutal Design Principles

- **High Contrast**: Bold color combinations
- **Sharp Edges**: No rounded corners
- **Bold Typography**: Heavy font weights
- **Distinct Shadows**: Hard drop shadows instead of soft blur
- **Vibrant Colors**: Saturated, eye-catching colors
- **Minimal Gradients**: Flat design approach

## 🚀 Performance Features

- **Throttled Scroll Events**: Optimized for smooth scrolling
- **Intersection Observer**: Efficient scroll-based animations
- **LocalStorage**: Theme and accent preferences persist
- **Lazy Loading Ready**: Structure supports lazy loading implementation

## 📧 Contact Integration

The portfolio includes:
- Direct email link
- Phone number with tel: protocol
- LinkedIn profile link
- Resume download button

## 🔍 SEO Ready

- Semantic HTML structure
- Proper meta tags
- Descriptive alt attributes
- Accessible color contrast ratios

## 📱 Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- iOS Safari (optimized)
- Android Chrome (optimized)
- Progressive enhancement for older browsers

## 🎯 Next Steps

1. Add your actual video file
2. Update personal images
3. Add your resume PDF
4. Create captions file for accessibility
5. Test on your target devices
6. Deploy to your hosting platform

## 🛠️ Technical Notes

- Uses modern CSS features (Grid, Custom Properties, Flexbox)
- Vanilla JavaScript (no frameworks required)
- Mobile-first responsive design
- Accessibility considerations built-in
- Performance optimized with throttling and intersection observers

---

**Ready to showcase your product management skills with style! 🚀**