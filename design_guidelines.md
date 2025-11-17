# Sigma72HQ Platform Design Guidelines

## Design Approach

Reference-based system drawing from modern SaaS platforms (Linear, Stripe, Notion). Professional B2B platform requiring efficiency and trust-building through clean, structured interfaces.

## Color System

Dark Red & Abyss Black Theme:
- **Primary Red**: `#DC143C` (Crimson) - CTAs, accents, borders, hover states
- **Primary Background**: `#0D1B2A` (Abyss Black) - Main background
- **Secondary Background**: `#1B263B` (Dark Slate) - Cards, sections
- **Text Primary**: `#FFFFFF` (White) - Headings, important text
- **Text Secondary**: `#E8E8E8` (Light Gray) - Body text, descriptions
- **Hover Red**: `#C41E3A` (Darker crimson)
- **Gradient Accents**: Subtle gradients from `#DC143C` to `#C41E3A`

## Typography

- **Font Stack**: `-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`
- **Hero Heading**: 4rem (64px), font-weight 700, line-height 1.2
- **Section Headings**: 2.5rem (40px), font-weight 700
- **Subheadings**: 1.5rem (24px), font-weight 600
- **Body Text**: 1rem (16px), font-weight 400, line-height 1.6
- **Spacing Units**: 2rem, 1.5rem, 1rem, 0.5rem

## Layout System

**Container Max-Widths**: 1200px for content sections

**Section Padding**: 6rem vertical, 2rem horizontal

**Grid Systems**:
- Services: 4-column grid (repeat(auto-fit, minmax(250px, 1fr)))
- Portfolio: 3-column grid (repeat(auto-fit, minmax(300px, 1fr)))
- Business Plan: 3-column grid (repeat(auto-fit, minmax(200px, 1fr)))

**Responsive Breakpoints**:
- Mobile: < 768px (single column, hamburger menu)
- Tablet: 768px - 1024px (2 columns)
- Desktop: > 1024px (full multi-column layouts)

## Navigation

**Fixed Header**: 
- Dark background `rgba(13, 27, 42, 0.95)` with backdrop-filter blur
- 2px solid `#DC143C` bottom border
- Logo (40x40px) + text on left
- Center navigation links with red underline animation on hover
- Right side: Language toggle, Register button
- Mobile: Hamburger menu with animated icon

## Hero Section

**Full-Viewport Hero** (100vh - header height):
- Dark gradient background with animated blur circles
- No hero image - focus on typography and gradient effects
- Content centered, max-width 800px
- Headline 4rem white text with fade-in-up animation
- Subheading 1.5rem light gray
- CTA Buttons: Primary (red fill) + Secondary (red outline)

## Component Library

### Cards (Services/Portfolio/Reviews)
- Background: `#0D1B2A` on `#1B263B` sections
- Border: 2px solid `#DC143C`
- Border-radius: 8px
- Padding: 2rem
- Hover: translateY(-10px), enhanced box-shadow with red glow
- Transition: all 0.3s ease

### Buttons
- **Primary**: Red background, white text, 0.9rem padding vertical, 2rem horizontal
- **Secondary**: Transparent background, red border (2px), red text
- **Hover**: Both lift with translateY(-3px), primary darkens, secondary fills red
- Border-radius: 6px

### Forms (Registration/Contact/Project Creation)
- Input fields: Dark background `#1B263B`, white text, 1px `#DC143C` border
- Focus state: 2px `#DC143C` border, subtle red glow
- Labels: Light gray, above inputs
- Submit buttons: Red primary style
- Validation messages: Red for errors, green for success

### Dashboard Modal
- Full-screen overlay with semi-transparent dark background
- Sidebar: Left-aligned, 250px width, dark background with red accents
- 4 Tabs: Create Project, Project Status, Support, Information
- Active tab: Red background indicator
- Main panel: Right side, white/light background
- Close button: Top-right, white X on dark background

### Project Status Pipeline
- Visual Pipeline: Horizontal stages with connecting lines
- Stages: Pending (gray) → In Progress (yellow/orange) → Completed (green)
- Active stage: Highlighted with red border
- Display as cards with project name, date, status badge

## Business Plan Section
- Section background: `#1B263B`
- Header: Centered, white heading + red subtitle
- Infographic: 2px red border, rounded corners, shadow
- Details Grid: 3-column layout
- Priority Cards: Icon, heading, description

## Portfolio Section
- Grid layout: 3 columns on desktop, 1 on mobile
- Portfolio items: Gradient placeholder, project title, description
- Link: "View Details" with red border, hover fills red
- Hover effect: Lift card, enhance shadow

## Reviews/Testimonials
- 3-column grid on desktop
- Card design: Dark background, 5-star rating
- Quote: Italic, white text
- Attribution: Client name (bold white) + company (gray)
- Subtle left border: Red accent (4px)

## Images Strategy
- Hero: No large image - use gradient backgrounds
- Portfolio placeholders: Gradient backgrounds with numbers
- Logo: Red square with white 'S' letter (40x40px)
- Business Plan Infographic: Placeholder for diagram
- Focus on typography, color, and layout

## Animations
- Minimal approach: Only essential interactions
- Hero fade-in: Content animates up on load (1s ease)
- Card hovers: Lift and shadow effects (0.3s ease)
- Navigation underlines: Width transition on hover
- No scroll animations for performance

## Accessibility
- High contrast: White text on dark backgrounds meets WCAG AA
- Focus states: All interactive elements have visible red focus rings
- Keyboard navigation: Full support for tab navigation
- ARIA labels: Proper labeling for modals, forms, dashboard tabs

This design creates a professional, modern, trust-building platform with strong visual identity through the red/black color scheme while maintaining excellent usability for B2B clients.
