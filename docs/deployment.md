# Deployment

## GitHub Actions

The workflow in `.github/workflows/ci-cd.yml` runs on pull requests and pushes to `main`.

It verifies:

- `npm run lint`
- `npm run test:run`
- `npm run build`

## Vercel Deployment

To deploy only after GitHub Actions checks pass:

1. Disable automatic Git deployments in the Vercel project.
2. Add GitHub repository secrets:
   - `VERCEL_TOKEN`
   - `VERCEL_ORG_ID`
   - `VERCEL_PROJECT_ID`
3. Add GitHub repository variable:
   - `VERCEL_DEPLOY_ENABLED=true`

When `VERCEL_DEPLOY_ENABLED` is not `true`, the deployment job is skipped and only verification runs.
