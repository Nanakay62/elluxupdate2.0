# Ellen Luxe Hairs Website

A professional, elegant one-page website for Ellen Luxe Hairs featuring a luxury hair salon aesthetic.

## Files Included

### Main Files
- **index.html** - Main homepage with header, carousel, and product showcase
- **styles.css** - All styling and responsive design
- **script.js** - JavaScript functionality for carousel, search, and mobile menu

### Boilerplate Pages (Ready for Your Content)
Navigation pages:
- hair-type.html
- hair-color.html
- hair-style.html
- gifts.html
- men.html
- sale.html
- cosmetics.html
- hairdressing.html
- accessories.html
- tools.html

Product detail pages:
- product-1.html through product-6.html

## Features

### Header
- Logo on top left (Ellen Luxe Hairs)
- Functional search bar
- Complete navigation menu with all requested sections
- Sticky header that stays visible while scrolling
- Responsive mobile menu

### Hero Carousel
- Landscape carousel supporting both images and videos
- Auto-play with 5-second intervals
- Manual controls (previous/next buttons)
- Clickable indicators
- Keyboard navigation (arrow keys)
- Smooth transitions
- Pause on hover

### Products Section
- 6 featured products with images
- Product badges (New, Sale, Bestseller)
- Hover effects and animations
- Links to individual product pages (boilerplate included)

### Design Features
- Elegant typography (Cormorant Garamond + Montserrat)
- Luxury color scheme (gold accents, sophisticated neutrals)
- Smooth animations and transitions
- Fully responsive (mobile, tablet, desktop)
- Clean, professional aesthetic

## How to Use

1. **View the website**: Open `index.html` in your web browser

2. **Edit the code**: All files are separated for easy editing:
   - HTML structure: `index.html`
   - Styling: `styles.css`
   - Functionality: `script.js`

3. **Customize the carousel**:
   - Replace image URLs in the carousel slides
   - Add your own video files in the `videos/` folder (replace `video-placeholder.mp4`)
   - Videos will auto-play when their slide is active

4. **Add products**:
   - Edit product information in `index.html`
   - Replace product images
   - Update prices and descriptions
   - Link to your product detail pages

5. **Build navigation pages**:
   - Use the boilerplate HTML files as templates
   - Copy the header from `index.html` for consistency
   - Add your content to each page

## Customization Tips

### Change Colors
Edit CSS variables in `styles.css`:
```css
:root {
    --color-primary: #2c2c2c;
    --color-secondary: #8b6f47;
    --color-accent: #d4af37;
    /* etc. */
}
```

### Add More Products
Copy a product card div in `index.html` and modify:
```html
<div class="product-card">
    <!-- Your product content -->
</div>
```

### Modify Search Functionality
Edit the `performSearch()` function in `script.js` to:
- Redirect to a search results page
- Filter products on the page
- Connect to a backend search API

### Add More Carousel Slides
Copy a carousel slide div and add to the carousel track:
```html
<div class="carousel-slide" data-type="image">
    <!-- Your slide content -->
</div>
```

## Video Setup

To add videos to the carousel:
1. Place your video files in the `videos/` folder
2. Update the video source in the carousel slide:
```html
<video class="carousel-video" loop muted playsinline>
    <source src="videos/your-video.mp4" type="video/mp4">
</video>
```

## Browser Compatibility

- Chrome (recommended)
- Firefox
- Safari
- Edge
- Mobile browsers (iOS Safari, Chrome Mobile)

## Structure

```
ellen-luxe-hairs/
├── index.html              (Main homepage)
├── styles.css              (All styles)
├── script.js               (All JavaScript)
├── README.md               (This file)
├── hair-type.html          (Boilerplate)
├── hair-color.html         (Boilerplate)
├── hair-style.html         (Boilerplate)
├── gifts.html              (Boilerplate)
├── men.html                (Boilerplate)
├── sale.html               (Boilerplate)
├── cosmetics.html          (Boilerplate)
├── hairdressing.html       (Boilerplate)
├── accessories.html        (Boilerplate)
├── tools.html              (Boilerplate)
├── product-1.html          (Boilerplate)
├── product-2.html          (Boilerplate)
├── product-3.html          (Boilerplate)
├── product-4.html          (Boilerplate)
├── product-5.html          (Boilerplate)
└── product-6.html          (Boilerplate)
```

## Next Steps

1. Replace placeholder images with your actual product photos
2. Add your brand logo (or style the text logo further)
3. Update product information and prices
4. Add your video content to the carousel
5. Build out the boilerplate navigation pages
6. Implement actual search functionality if needed
7. Add contact information and social media links
8. Set up analytics tracking

## Support

For questions or issues:
- Check browser console for JavaScript errors
- Ensure all file paths are correct
- Test on multiple browsers
- Validate HTML/CSS if issues occur

Enjoy building your Ellen Luxe Hairs website!
