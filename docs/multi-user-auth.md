# Multi-user authentication and admin

Autonomia uses Supabase Auth for team accounts and a server-mediated workspace model.

## Production activation

Keep authentication disabled until the first Auth user is ready.

Vercel variables:

- `SUPABASE_PUBLISHABLE_KEY` = the project's `sb_publishable_...` key
- `AUTONOMIA_AUTH_REQUIRED=false` during setup
- existing `NEXT_PUBLIC_SUPABASE_URL`
- existing `SUPABASE_SECRET_KEY`

After the first administrator account and workspace are ready, switch:

`AUTONOMIA_AUTH_REQUIRED=true`

No browser code needs the publishable key in V1; it is used by server-side Supabase SSR auth.

## First administrator

1. Create the first user in Supabase Auth.
2. Sign in at `/login`.
3. Open `/admin`.
4. The bootstrap screen creates the first workspace and assigns the current user the `admin` role.
5. Only after this succeeds should production auth be made mandatory.

## Roles

- admin
- direction
- public_markets
- sales
- staffing
- contributor
- viewer

`admin` and `direction` can access account management.

## Invitations

The Admin screen uses Supabase `inviteUserByEmail`.

For SSR email confirmation, configure the relevant Supabase Auth email template so the link targets:

`{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=invite`

The application verifies the token server-side, creates the cookie session, then sends invited users to `/auth/set-password`.

Also set the Supabase Auth Site URL to the production Autonomia URL.

## Security model

- New workspace tables have RLS enabled.
- No browser RLS policies are created in V1: browser roles remain closed by default.
- Authenticated UI routes perform authorization server-side.
- Canonical market data continues to be accessed through the server secret only.
- The final admin cannot be demoted or deactivated through the UI.
- A user cannot deactivate their own membership from the Admin screen.

## Workspace data

- `user_profiles`
- `workspaces`
- `workspace_members`
- `work_items`
- `work_item_comments`
- `activity_log`

`work_items` is intentionally polymorphic so the same collaborative workflow can manage:
- canonical opportunities,
- LinkedIn/Indeed job signals,
- future inbound leads.
