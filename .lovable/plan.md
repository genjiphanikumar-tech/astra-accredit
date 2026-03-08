

## Plan: Wire Up Auth + Dashboard with Real Data

### 1. Auth System

**Create `src/contexts/AuthContext.tsx`**
- AuthProvider wrapping the app with `onAuthStateChange` listener (set up before `getSession()`)
- Expose `user`, `session`, `loading`, `signIn`, `signUp`, `signOut`, `resetPassword`
- Fetch user profile and role from `profiles` and `user_roles` tables after auth

**Create `src/pages/Auth.tsx`**
- Login/Signup tabbed form (email + password + display name on signup)
- Glassmorphism card matching the dark space design
- Uses react-hook-form + zod validation
- Toast feedback on success/error
- Email verification notice after signup (no auto-confirm)

**Create `src/pages/ResetPassword.tsx`**
- Form to set new password after clicking email link
- Checks for `type=recovery` in URL hash

**Create `src/components/ProtectedRoute.tsx`**
- Wraps authenticated routes, redirects to `/auth` if not logged in
- Shows loading skeleton while checking session

**Update `src/App.tsx`**
- Wrap with `AuthProvider`
- Add `/auth` and `/reset-password` routes
- Wrap dashboard routes with `ProtectedRoute`

**Update `src/components/dashboard/DashboardLayout.tsx`**
- Show user display name + avatar in header
- Add logout button
- Show notification count from real data

### 2. Dashboard with Real Data

**Update `src/pages/Dashboard.tsx`**
- Fetch `criteria` table via React Query for the progress bars and compliance ring
- Compute KPI values from real data (criteria completed, evidence count, gaps count, days to deadline from institution's `submission_deadline`)

**Update `src/components/dashboard/KPICards.tsx`**
- Accept props from parent (or use React Query hooks directly) instead of hardcoded values

**Update `src/components/dashboard/ActivityFeed.tsx`**
- Query `notifications` table for the current user, show real activity

**Update `src/components/dashboard/ComplianceRing.tsx`**
- Accept computed percentage from criteria data

### 3. Institution Setup

On first login (no institution linked), show a setup modal/page to create an institution record. This seeds the `institutions` table and links the user as admin.

### 4. Database Migration

- Add a `handle_new_user` trigger fix: the trigger exists but has no actual trigger attachment (the context shows "no triggers"). Need to create the trigger on `auth.users`.

### Technical Notes

- All RLS policies use `RESTRICTIVE` (Permissive: No), which means they AND together. The SELECT policies allow any authenticated user to view, and ALL policies allow admins/editors to manage. This is correct.
- The `handle_new_user` function exists but the trigger binding to `auth.users` needs verification — if missing, signup will fail to create profiles/roles.
- Email confirmation is NOT auto-enabled (correct default behavior).

### Files to Create/Edit

| Action | File |
|--------|------|
| Create | `src/contexts/AuthContext.tsx` |
| Create | `src/pages/Auth.tsx` |
| Create | `src/pages/ResetPassword.tsx` |
| Create | `src/components/ProtectedRoute.tsx` |
| Create | `src/hooks/useInstitution.ts` (React Query hook) |
| Create | `src/hooks/useCriteria.ts` |
| Create | `src/hooks/useNotifications.ts` |
| Edit | `src/App.tsx` |
| Edit | `src/pages/Dashboard.tsx` |
| Edit | `src/components/dashboard/KPICards.tsx` |
| Edit | `src/components/dashboard/ActivityFeed.tsx` |
| Edit | `src/components/dashboard/DashboardLayout.tsx` |
| Migration | Re-create `handle_new_user` trigger if missing |

