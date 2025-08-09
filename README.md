# Low Tee Golf Blog

A modern, responsive golf blog built with React and Vite. Features expert golf tips, course reviews, equipment guides, and the latest golf news.

## Features

- **Responsive Design**: Beautiful, mobile-first design that works on all devices
- **Golf-Themed UI**: Custom color palette and styling inspired by golf courses
- **Blog System**: Complete blog with categories, individual post pages, and featured posts
- **Navigation**: Smooth navigation with active states and mobile menu
- **SEO Ready**: Proper meta tags and semantic HTML structure
- **Fast Performance**: Built with Vite for optimal loading speeds

## Pages Included

- **Home**: Hero section, featured posts, and newsletter signup
- **Blog**: Filterable blog posts with category navigation
- **Blog Posts**: Individual post pages with rich content formatting
- **About**: Team information and company mission
- **Contact**: Contact form and business information

## Quick Start

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm run dev
   ```

3. **Build for Production**
   ```bash
   npm run build
   ```

## Deployment Options

### Option 1: Netlify (Recommended)

1. **Connect GitHub Repository**
   - Push your code to GitHub
   - Sign up for [Netlify](https://netlify.com)
   - Connect your GitHub repository
   - Set build command: `npm run build`
   - Set publish directory: `dist`

2. **Custom Domain Setup**
   - In Netlify dashboard, go to Domain settings
   - Add your GoDaddy domain
   - Update DNS records in GoDaddy:
     - Add CNAME record: `www` → `your-site.netlify.app`
     - Add A record: `@` → `75.2.60.5`

### Option 2: Vercel

1. **Deploy to Vercel**
   - Push code to GitHub
   - Sign up for [Vercel](https://vercel.com)
   - Import your GitHub repository
   - Vercel will auto-detect the framework

2. **Custom Domain**
   - In Vercel dashboard, add your domain
   - Update DNS in GoDaddy as instructed by Vercel

### Option 3: GitHub Pages

1. **Enable GitHub Pages**
   - In your GitHub repository settings
   - Enable GitHub Pages from Actions

2. **Add GitHub Actions Workflow**
   Create `.github/workflows/deploy.yml`:
   ```yaml
   name: Deploy to GitHub Pages
   on:
     push:
       branches: [ main ]
   jobs:
     build-and-deploy:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v3
         - uses: actions/setup-node@v3
           with:
             node-version: '18'
         - run: npm install
         - run: npm run build
         - uses: peaceiris/actions-gh-pages@v3
           with:
             github_token: ${{ secrets.GITHUB_TOKEN }}
             publish_dir: ./dist
   ```

3. **Custom Domain**
   - Add a `CNAME` file in the `public` folder with your domain
   - Update DNS in GoDaddy to point to GitHub Pages

## GoDaddy DNS Configuration

For any deployment option, you'll need to update your DNS settings in GoDaddy:

1. **Log into GoDaddy**
2. **Go to DNS Management**
3. **Add/Update Records** as specified by your hosting provider

## Customization

### Adding New Blog Posts

Edit `src/data/blogPosts.js` to add new posts:

```javascript
{
  id: 6,
  title: "Your New Post Title",
  slug: "your-new-post-slug",
  excerpt: "Brief description...",
  content: "Full blog post content...",
  author: "Author Name",
  date: "2024-01-20",
  category: "Tips", // Tips, Reviews, Equipment, News
  image: "image-url",
  featured: false
}
```

### Customizing Colors

Edit CSS variables in `src/App.css`:

```css
:root {
  --golf-green: #2c7a2c;
  --golf-green-dark: #1e5a1e;
  /* Add more custom colors */
}
```

### Adding Social Media Links

Update the Footer component in `src/components/Footer.jsx` to add social media icons and links.

## Tech Stack

- **React 18**: Modern React with hooks
- **Vite**: Fast build tool and dev server
- **React Router**: Client-side routing
- **Lucide React**: Beautiful, customizable icons
- **CSS3**: Modern CSS with custom properties

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For questions or support, please contact us at info@lowteegolf.com

---

**Low Tee Golf** - Your premier destination for golf expertise and insights.
