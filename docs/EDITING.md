# Editing Guide

No admin button is needed.

## Where to edit

Open one of these URLs in your browser:

- `/edit`
- `/admin/config`

Example in local dev:

- `http://localhost:5174/edit`

## How it works

1. Update fields on the config page.
2. Click **Save Config**.
3. Changes are applied immediately across the site (header, footer, CTA, and contact details).

## Password

- The edit page is password-protected.
- Current password: `shubh123`
- After unlocking once, access stays open in this browser until you click **Lock** or clear browser storage.

## Reset

- Click **Reset to Defaults** to clear local overrides and return to default settings.

## Notes

- Saved values are stored in your browser local storage for this site.
- If Storyblok is connected and no local override exists, Storyblok values are used.
- If both local and Storyblok values are unavailable, built-in defaults are used.
