# Style Fair Events & Decor Hub

A modern, elegant event styling website designed as a premium landing page for lead generation.

## Project Overview

Style Fair Events is a luxury event styling and decoration website focused on converting visitors into inquiries. The site features smooth scroll animations, a premium design aesthetic, and a seamless inquiry form experience.

## Technology Stack

### Frontend
- HTML5
- CSS3
- Vanilla JavaScript
- AOS (Animate On Scroll Library)

### Backend
- Node.js
- Express.js
- Nodemailer

## Project Structure

```
stylefair-events/
├── frontend/
│   ├── pages/
│   ├── assets/
│   └── components/
├── backend/
│   ├── server.js
│   ├── routes/
│   ├── services/
│   └── config/
├── package.json
└── README.md
```

## Installation

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the root directory:
```
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
ADMIN_EMAIL=admin@stylefairevents.com
PORT=3000
```

3. Start the server:
```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

## Features

- **Hero Overlay Navigation** - Transparent navbar that becomes solid on scroll
- **Inquiry Modal** - Global, reusable form across all pages
- **Smooth Animations** - AOS library for scroll-triggered effects
- **Responsive Design** - Mobile, tablet, and desktop optimized
- **Email Integration** - Inquiries sent directly to admin email
- **Luxury Design** - Black and gold color scheme with minimal aesthetic

## Design Philosophy

The site embodies:
- Elegance and sophistication
- Minimal clutter
- Visual focus on high-quality imagery
- Luxury feel with premium branding
- Natural user flow toward inquiry conversion

## Color Palette

- Black: #000000
- Gold: #d4af37
- White: #ffffff
- Light Grey: #f5f5f5

## Pages

1. **Home** - Landing page with service previews
2. **About** - Company story and mission
3. **Services** - Service offerings with inquiry buttons
4. **Gallery** - Masonry grid of past events
5. **Packages** - Package tiers without pricing
6. **Contact** - Contact information and inquiry access

## API Endpoints

### POST /api/inquiry
Submits an event inquiry and sends email to admin.

**Request body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "123-456-7890",
  "service": "Wedding Styling",
  "eventDate": "2024-06-15",
  "guestCount": "150",
  "location": "New York, NY",
  "eventType": "Wedding",
  "message": "Additional details..."
}
```

**Response:**
```json
{
  "success": true,
  "message": "Inquiry received successfully"
}
```

## Performance Optimizations

- Compressed images
- Lazy loading for gallery
- Minimal JavaScript footprint
- Optimized CSS
- Fast page load times

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

ISC
