# Juan Carlos C. Agacita • Personal Portfolio

A responsive, static portfolio for an Information Technology student aspiring to become a Database Administrator. Built with semantic HTML, vanilla JavaScript, Vite, and CSS3. The supplied portrait is cropped and optimized as a JPEG, without changing the person in the photo.

## 1. Run on your computer

Install Node.js 22.12 or newer (Node.js 24 LTS also works). Extract this folder, open a terminal **inside `juan-carlos-portfolio`**, then run:

```bash
npm ci
npm run dev
```

Open the Local URL printed by Vite. Stop the development server with Ctrl+C. `npm install` is also supported; `npm ci` uses the exact versions in `package-lock.json`.

## 2. Add your contact details

Edit `src/config.js` and replace empty strings with real public values:

```js
export const contact = {
  email: '',
  github: '',
  linkedin: '',
  portfolio: '',
};
```

- Use a real email address, and complete `https://` URLs for the other fields.
- Leave unavailable details blank. Their labeled placeholders remain visible.
- The email-copy buttons are disabled until a valid email is configured.
- Saving a contact works immediately. Empty or invalid fields are omitted from the VCF, so placeholders are never saved as contact information.
- Clipboard copying requires HTTPS (GitHub Pages provides it) or localhost. If browser permissions block it, an on-screen message gives the address to copy manually.
- Contact information is public. Add only information you intend to publish.

## 3. Publish free with GitHub Pages

No Node.js server runs in production. GitHub builds the site and serves static files.

1. Create an empty GitHub repository, for example `juan-carlos-portfolio`. Do not initialize it with another README.
2. In a terminal inside this project folder, run:

```bash
git init
git add .
git commit -m "Create personal portfolio"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git
git push -u origin main
```

Replace `YOUR_USERNAME` and `YOUR_REPOSITORY` with your actual values. These are instructions, not invented contact details.

3. Open the repository's **Settings → Pages → Build and deployment**. Set **Source** to **GitHub Actions**.
4. Open **Actions → Deploy portfolio to GitHub Pages**. If the initial push ran before Pages was enabled, select **Run workflow** for `main` or rerun the failed workflow.
5. Wait for the build and deploy jobs to finish. The deployed URL appears in the deployment and Pages settings.
6. Add that URL, including its final slash, to `contact.portfolio`, commit, and push again.

The workflow deploys every push to `main`, using `npm ci`, `npm run build`, and the generated `dist` folder. GitHub's Pages configuration supplies the correct base path automatically. This supports both a repository site (`/repository-name/`) and a user site (`/`). Use a public repository for GitHub Pages on a free personal account.

### A custom domain later

Set the custom domain in GitHub Pages settings first. The workflow reads the path from GitHub Pages, so no repository name is hardcoded. Keep the domain's DNS configuration separate from this project.

## 4. Build and preview production

```bash
npm run build
npm run preview
```

Open the printed Local URL. Production files are in `dist/`. Do not open `dist/index.html` directly via `file://`; use preview or an HTTP static host.

To simulate a GitHub repository subpath, use the command for your shell:

```bash
# macOS / Linux / Git Bash
BASE_PATH=/juan-carlos-portfolio/ npm run build
npm run preview
```

```powershell
# Windows PowerShell
$env:BASE_PATH='/juan-carlos-portfolio/'
npm run build
npm run preview
# Remove the variable after stopping preview to restore default local builds:
Remove-Item Env:BASE_PATH
```

Visit the preview's `/juan-carlos-portfolio/` path. `vite.config.js` uses `/` by default during development. GitHub Actions sets `BASE_PATH` automatically during deployment.

## 5. Understand the files

```text
juan-carlos-portfolio/
├── public/
│   ├── images/profile.jpg    # Optimized supplied portrait
│   └── favicon.svg          # JCA initials icon
├── src/
│   ├── main.js              # Menu, contacts, flip card, VCF, clipboard
│   ├── style.css            # Plain CSS styles and responsive layouts
│   └── config.js            # Editable contact details
├── .github/workflows/deploy.yml
├── index.html               # All page content and SEO metadata
├── vite.config.js           # Deployment base path
├── package.json
├── package-lock.json
├── .gitignore
└── README.md
```

Semantic CSS classes handle grid layouts, spacing, the portrait, theme, and flip card. All styling is ordinary CSS, with no CSS framework or preprocessor. No UI frameworks, icon libraries, external fonts, tracking, database, or server-dependent contact form are used.

## 6. Customize the design

- **Content:** Edit `index.html`. Keep heading levels and accessible button labels intact.
- **Colors and spacing:** Edit `src/style.css`. The burgundy theme uses `#8e3c4c` with lighter accents for readable text.
- **Photo:** Replace `public/images/profile.jpg`. If dimensions change, update the image's `width`, `height`, and alternative text in `index.html`.
- **Identity:** If adapting for another person, update `index.html`, the name and vCard name fields in `src/main.js`, and `public/favicon.svg`.
- **Footer year:** The requested 2026 copyright is intentionally explicit in `index.html`.

### Search and sharing metadata

The HTML includes a title, description, theme color, Open Graph text, and Twitter text metadata. Once the portfolio URL is configured, JavaScript adds a canonical URL and portrait sharing metadata. Some sharing crawlers do not run JavaScript. For reliable image previews after deployment, also place the actual URLs directly in `<head>` in `index.html`:

```html
<link rel="canonical" href="YOUR_REAL_PORTFOLIO_URL" />
<meta property="og:url" content="YOUR_REAL_PORTFOLIO_URL" />
<meta property="og:image" content="YOUR_REAL_ABSOLUTE_IMAGE_URL" />
<meta property="og:image:alt" content="Portrait of Juan Carlos C. Agacita" />
```

Replace every placeholder before adding those tags. The image URL is the deployed portfolio URL followed by `images/profile.jpg`. This is deliberately not filled with an invented hostname.

## 7. Check before publishing

- Run `npm ci` and `npm run build` successfully.
- Check phone and desktop widths, menu open/close, Escape, and all navigation links.
- Flip the business card with Enter or Space and check that only the visible face receives keyboard focus.
- Download the VCF and import it into your contacts app to confirm its behavior there.
- With real contact details added, test every link and email-copy button on HTTPS or localhost.
- Check reduced motion in your device's accessibility preferences.
- Visit the deployed repository URL and confirm the portrait, favicon, CSS, and JavaScript load.

The site handles missing contact values, clipboard denial, keyboard navigation, reduced motion, and touch interaction. Contact details are inserted as text, and links permit only validated email addresses or HTTPS URLs. Imported contact fields and display behavior can vary between contacts apps.

## Troubleshooting

- **`npm` isn't recognized:** Install Node.js and reopen the terminal.
- **No `package.json`:** Open a terminal inside the extracted project folder.
- **Blank page or missing assets on Pages:** Confirm Pages uses GitHub Actions, then rerun the included workflow. Avoid uploading the source HTML directly as the deployed site.
- **Deployment permissions error:** Ensure Actions is enabled and Pages source is GitHub Actions. Organization policies may restrict workflows.
- **Copy email is disabled:** Add a valid email in `src/config.js` and rebuild.
- **A link stays a placeholder:** Use a complete `https://` URL and no square brackets.
- **VCF lacks an email:** This is expected until a real email is configured.

No paid services or subscriptions are required.

## Validation completed for version 2.0

- Dependency installation, a clean `npm ci`, and the production build passed.
- Both root and repository-subpath builds passed; generated asset paths resolve to files.
- The updated design was inspected in Chromium on desktop and at a 390-pixel phone width.
- The portrait loaded, all eight skills appeared, desktop had no horizontal overflow, the business card flipped, the mobile menu opened, and the download action displayed its success message.
- Direct JavaScript checks passed for missing contact values, URL/email validation, clipboard success and denial, VCF content and filename, UTF-8 line folding, and reversible accessible card state.
- The only direct development dependency is Vite. No CSS framework is installed or required.

A live GitHub Pages deployment, real email-copy permissions, and importing the VCF into a contacts app remain to be checked once actual contact details and a repository are available.
