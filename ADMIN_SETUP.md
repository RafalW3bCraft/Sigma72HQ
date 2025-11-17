# Admin User Setup Guide

## Creating Your First Admin User

This application uses Firebase Authentication and Firestore. You must manually create the first admin user in Firebase Console for security.

### Steps to Create Admin User

1. **Register via the Application**
   - Go to your Sigma72HQ website
   - Click "Sign Up" and create a new account
   - Use your preferred admin email and password
   - Fill in Company Name and Phone Number
   - Complete the registration

2. **Upgrade to Admin Role in Firebase Console**
   - Go to Firebase Console (https://console.firebase.google.com/)
   - Select your Sigma72HQ project
   - Navigate to Firestore Database
   - Find the `users` collection
   - Locate the document with your admin email
   - Click on the document to edit it
   - Find the `role` field (currently set to "user")
   - Change the value from `"user"` to `"admin"`
   - Save the changes

3. **Verify Admin Access**
   - Log out from your application
   - Log back in with the admin credentials
   - You should now see admin dashboard option in navigation
   - Navigate to `/admin` to access the admin panel

### Admin Capabilities

As an admin, you can:
- View all user projects and their statuses
- Access support tickets from all users
- View contact form submissions
- Manage portfolio items
- Manage testimonials
- Update project statuses
- Delete projects if needed

### Security Best Practices

- Use a strong, unique password
- Do not share admin credentials
- Consider creating multiple admin users
- Regularly audit admin activities
- Keep Firebase security rules properly configured

### Troubleshooting

**Issue**: Cannot access admin dashboard after updating role

**Solution**: Clear browser cache and log out/log in again

**Issue**: Role field does not exist in user document

**Solution**: Add a new field called `role` with the value `"admin"` (including quotes)

**Issue**: Still seeing "Access Denied" on admin page

**Solution**: Check that role is exactly `"admin"` (lowercase) and verify Firestore security rules are properly configured
