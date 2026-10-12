<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Application architecture
- Use TanStack file routes for each page and a shared shell in the root route so navigation and page metadata remain independent.
- Keep this prototype presentation-only: shared typed demo data lives in a browser-safe module, with no persistence or authentication calls, to allow later service integration without misleading users.
- Use the shared design system and Button component for interactive controls; global semantic tokens own all visual colors.
- Private pages live under src/routes/_authenticated/ (client-only gate redirecting to /connexion); every user-owned table carries user_id with owner-only RLS, so access control never depends on client code.
