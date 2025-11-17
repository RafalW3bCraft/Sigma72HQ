# Sigma72HQ - Full-Cycle IT Solutions Platform

A modern business showcase and client management platform for IT solutions companies. Combines a marketing website with an authenticated client portal for project management and support.

## Features

### Public Marketing Website
- Hero Section with animated cyber-themed effects
- Services Showcase for IT solutions
- Portfolio Gallery with project case studies
- Business Plans and pricing presentation
- Client Reviews and testimonials
- Contact Form for lead generation
- Full English and Russian language support
- SEO optimized with meta tags and Open Graph

### Client Dashboard
- Project Creation and submission
- Project Status Tracking (Pending → In Progress → Completed)
- Support Ticket system
- Profile Management

### Admin Dashboard
- Contact Management and lead tracking
- Support Ticket oversight
- Project Overview across all clients
- Analytics Dashboard

### Design Features
- Modern cyber-themed dark aesthetic with neon red and cyan accents
- Responsive design for mobile, tablet, and desktop
- Smooth Framer Motion animations
- Glassmorphism effects with backdrop blur
- Optimized particle animations

## Tech Stack

### Frontend
- React 18 with TypeScript
- Vite for fast development and builds
- Wouter for client-side routing
- TanStack Query for server state management
- Shadcn/ui component library
- Tailwind CSS for styling
- Framer Motion for animations
- Lucide React for icons

### Backend
- Firebase Authentication
- Cloud Firestore database
- Express.js server
- Firestore Security Rules for access control

### Development Tools
- TypeScript for type checking
- ESBuild for server bundling
- PostCSS with Autoprefixer
- Drizzle Zod for schema validation

## Prerequisites

- Node.js 20+ installed
- npm package manager
- Firebase project (create at https://console.firebase.google.com/)
- Git for version control

## Setup Instructions

### 1. Clone and Install

```bash
npm install
```

### 2. Firebase Configuration

#### Create a Firebase Project
1. Go to Firebase Console (https://console.firebase.google.com/)
2. Click "Add project" and follow setup wizard
3. Enable Authentication → Email/Password provider
4. Create Firestore Database in production mode
5. Register a web app to get configuration

#### Configure Firestore Security Rules
1. Navigate to Firestore Database → Rules
2. Copy contents from `FIRESTORE_SECURITY_RULES.md`
3. Paste into Firebase Console rules editor
4. Click Publish

### 3. Environment Variables

Set the following environment variables:

```env
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_PROJECT_ID=your_project_id_here
VITE_FIREBASE_APP_ID=your_app_id_here
```

Find these values in: Firebase Console → Project Settings → General → Your apps → Web app

### 4. Running the Application

```bash
npm run dev
```

Application available at `http://localhost:5000`

- Frontend served by Vite with hot module replacement
- Backend Express server handles API routes
- Both run on port 5000

## Admin User Setup

Users cannot self-register as admin for security. Admin role must be assigned manually through Firebase Console.

### Creating the First Admin User

1. Register a Regular User through the signup form
2. Open Firebase Console → Firestore Database
3. Navigate to `users` collection
4. Find the User Document by email or UID
5. Edit Document and change `role: "user"` to `role: "admin"`
6. Log Out and Log Back In
7. Access Admin Dashboard at `/admin` route

### Admin Capabilities

Admin users can:
- View all contact form submissions
- View all support tickets from all users
- View all projects from all users
- Manage portfolio items
- Manage testimonials
- Update support ticket statuses
- Delete projects or support tickets

## Project Structure

```
sigma72hq/
├── client/                    
│   ├── public/               
│   └── src/
│       ├── components/       
│       ├── contexts/        
│       ├── hooks/           
│       ├── lib/             
│       ├── pages/           
│       ├── App.tsx          
│       ├── index.css        
│       └── main.tsx         
├── server/                   
│   ├── index.ts            
│   ├── routes.ts           
│   └── vite.ts             
├── shared/                  
│   └── schema.ts           
├── FIRESTORE_SECURITY_RULES.md
├── ADMIN_SETUP.md
├── design_guidelines.md
├── HEROKU.md
├── package.json
└── README.md
```

## Key Functionality

### Authentication Flow
1. User registers with email, password, company name, and phone number
2. Firebase Authentication creates user account
3. User profile stored in Firestore with role "user"
4. JWT tokens managed automatically by Firebase SDK
5. Auth state persists across tabs and sessions

### Project Management
1. Authenticated users create projects via dashboard
2. Projects stored in Firestore with status "pending"
3. Status pipeline: pending → in-progress → completed
4. Only project owner can view/modify their projects
5. Firestore rules enforce status transition validation

### Support System
1. Users submit support tickets via dashboard
2. Tickets stored in Firestore with status "open"
3. Only ticket owner can view their tickets
4. Admin can view all tickets

### Contact Form
1. Public endpoint, no authentication required
2. Submissions stored in Firestore
3. Admin-only read access via Firestore rules

## Database Schema

### Users Collection
```typescript
{
  uid: string;
  email: string;
  companyName: string;
  phoneNumber: string;
  role: "user" | "admin";
  createdAt: number;
}
```

### Projects Collection
```typescript
{
  id: string;
  userId: string;
  serviceType: string;
  projectName: string;
  description: string;
  timeline?: string;
  budget?: string;
  status: "pending" | "in-progress" | "completed" | "cancelled";
  createdAt: number;
  updatedAt: number;
}
```

### Support Messages Collection
```typescript
{
  id: string;
  userId: string;
  projectId?: string;
  subject: string;
  message: string;
  status: "open" | "in-progress" | "resolved";
  createdAt: number;
}
```

### Contact Submissions Collection
```typescript
{
  id: string;
  name: string;
  email: string;
  message: string;
  status: "new" | "read" | "responded";
  createdAt: number;
  respondedAt?: number;
}
```

## Security Considerations

### Authentication
- Password minimum length: 6 characters
- Passwords hashed by Firebase Authentication
- JWT tokens automatically managed
- Session persistence configurable

### Authorization
- Firestore Security Rules enforce row-level security
- Users can only access their own data
- Admin role checked server-side via Firestore rules
- No sensitive data in client-side code

### Data Validation
- Client-side validation with Zod schemas
- Server-side validation via Firestore rules
- XSS protection through React default escaping
- CSRF protection through Firebase token validation

## Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm start            # Start production server
```

### Adding a New Page

1. Create component in `client/src/pages/`
2. Add route in `client/src/App.tsx`
3. Update navigation in `client/src/components/Header.tsx`
4. Add translations in `client/src/lib/translations.ts`

### Modifying Firestore Schema

1. Update types in `shared/schema.ts`
2. Update API functions in `client/src/lib/api.ts`
3. Update Firestore Security Rules in Firebase Console
4. Test with authenticated and unauthenticated users

### Adding Translations

Edit `client/src/lib/translations.ts`:

```typescript
export const translations = {
  en: {
    new_key: "English text",
  },
  ru: {
    new_key: "Русский текст",
  }
}
```

Use in components:
```typescript
const { t } = useLanguage();
<p>{t('new_key')}</p>
```

## Deployment

### Heroku Deployment

See detailed instructions in `HEROKU.md`

### Replit Deployment
1. Set environment variables in Replit Secrets
2. Click "Publish" button in Replit
3. Application available at `*.replit.app`

### Other Platforms
1. Build the application: `npm run build`
2. Set environment variables in platform settings
3. Deploy the `dist` directory
4. Ensure Firebase Security Rules are configured

## Troubleshooting

### Firebase Connection Issues
- Verify environment variables are set correctly
- Check Firebase Console → Authentication is enabled
- Ensure Firestore database is created
- Verify Security Rules are published

### Admin Access Not Working
- Confirm user role is set to "admin" in Firestore
- Log out and log back in after role change
- Clear browser cache and cookies
- Check browser console for errors

### Build Errors
- Delete `node_modules` and reinstall
- Clear Vite cache: `rm -rf node_modules/.vite`
- Verify Node.js version is 20+

## License

Proprietary - Sigma72HQ Platform

## Support

For issues or questions:
- Check Firebase Console for database/auth errors
- Review Firestore Security Rules
- Contact support through platform contact form
