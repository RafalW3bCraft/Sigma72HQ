# Firebase Firestore Security Rules

## Configure Security Rules in Firebase Console

To ensure data security and proper access control for Sigma72HQ, you must configure Firestore security rules in the Firebase Console.

### How to Configure

1. Go to Firebase Console (https://console.firebase.google.com/)
2. Select your project
3. Navigate to Firestore Database → Rules
4. Replace the default rules with the rules below
5. Click Publish

### Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    function isAdmin() {
      return request.auth != null && 
             get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    function isValidStatusTransition(oldStatus, newStatus) {
      return (oldStatus == 'pending' && newStatus == 'in-progress') ||
             (oldStatus == 'in-progress' && newStatus == 'completed') ||
             (newStatus == 'cancelled');
    }
    
    match /users/{userId} {
      allow read: if request.auth != null && request.auth.uid == userId;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    match /projects/{projectId} {
      allow read: if request.auth != null && 
                     (request.auth.uid == resource.data.userId || isAdmin());
      allow create: if request.auth != null && 
                       request.auth.uid == request.resource.data.userId;
      allow update: if request.auth != null && 
                       request.auth.uid == resource.data.userId &&
                       isValidStatusTransition(resource.data.status, request.resource.data.status);
      allow delete: if isAdmin();
    }
    
    match /support_messages/{messageId} {
      allow read: if request.auth != null && 
                     (request.auth.uid == resource.data.userId || isAdmin());
      allow create: if request.auth != null && 
                       request.auth.uid == request.resource.data.userId;
      allow update: if request.auth != null && 
                       (request.auth.uid == resource.data.userId || isAdmin());
      allow delete: if isAdmin();
    }
    
    match /contact_submissions/{submissionId} {
      allow create: if true;
      allow read: if isAdmin();
      allow update: if isAdmin();
      allow delete: if isAdmin();
    }
    
    match /portfolio/{itemId} {
      allow read: if true;
      allow write: if isAdmin();
    }
    
    match /testimonials/{itemId} {
      allow read: if true;
      allow write: if isAdmin();
    }
  }
}
```

### Security Features

1. **Authentication Required**: All user data requires authentication
2. **Owner-Only Access**: Regular users can only access their own data
3. **Admin Access**: Users with `role: "admin"` can read/manage all data
4. **Status Pipeline Enforcement**: Project status transitions follow correct order:
   - `pending` → `in-progress`
   - `in-progress` → `completed`
   - Any status → `cancelled` (emergency escape)
5. **Public Data Protection**: Portfolio and testimonials are read-only for regular users
6. **Contact Form**: Public submission allowed, admin-only read access
7. **Role-Based Security**: The `isAdmin()` function checks user role from Firestore

### Testing Security Rules

After configuring, test the rules using:
1. Firebase Console Rules Playground
2. Create a project as an authenticated user
3. Try reading another user's project (should fail)
4. Try invalid status transitions (should fail)

### Important Notes

- Never leave Firestore with default rules in production
- Review security rules regularly
- Enable Firebase security rules monitoring
- Keep user roles properly managed
