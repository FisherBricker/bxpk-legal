# Backpack Weight Tracker: legal documents

The site for the Backpack Weight Tracker iOS app, published at <https://fisherbricker.github.io/bxpk-legal/>.
Built with Astro. The privacy policy, terms and support page are `src/content/legal/*.md`. Their paths
(`/privacy`, `/terms`, `/support`) are compiled into shipped builds of the app, so never rename them.
Pushing to `main` publishes to GitHub Pages through `.github/workflows/deploy.yml`.

When the terms change in a way that matters, the app must ask people to accept them again: bump the
terms version in the app (`TermsOfServiceView.swift` in the bxpk repository) in the same release.

    npm install
    npm run dev      # http://localhost:4321/bxpk-legal/
    npm test         # unit tests
    npm run test:e2e # browser tests
