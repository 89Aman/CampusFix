# CampusFix Website

A modern, professional monotone-themed website for the CampusFix platform - built with Next.js 14 and Tailwind CSS.

## 🎨 Design Features

- **Monotone Professional Theme**: Sleek black/white/gray color palette
- **Modern Animations**: Smooth Framer Motion animations throughout
- **Responsive Design**: Mobile-first approach, works on all devices
- **Glassmorphism Effects**: Subtle glass and blur effects
- **Grid Background Pattern**: Subtle geometric background pattern
- **Gradient Accents**: Tasteful gradient text and glow effects

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Fonts**: Inter & JetBrains Mono (Google Fonts)
- **Deployment**: Vercel

## 📁 Project Structure

```
website/
├── src/
│   ├── app/
│   │   ├── globals.css      # Global styles
│   │   ├── layout.tsx       # Root layout
│   │   └── page.tsx         # Home page
│   └── components/
│       ├── Navbar.tsx       # Navigation bar
│       ├── Hero.tsx         # Hero section with mockup
│       ├── Features.tsx     # Features grid
│       ├── HowItWorks.tsx   # Process steps
│       ├── Safety.tsx       # Safety tools section
│       ├── Stats.tsx        # Animated statistics
│       ├── TechStack.tsx    # Technology stack
│       ├── CTA.tsx          # Call to action
│       └── Footer.tsx       # Footer with links
├── public/                  # Static assets
├── package.json
├── tailwind.config.ts
├── next.config.js
├── tsconfig.json
└── vercel.json             # Vercel deployment config
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Navigate to the website folder:
   ```bash
   cd website
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

## 🌐 Deployment to Vercel

### Option 1: Vercel CLI

1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Deploy:
   ```bash
   vercel
   ```

### Option 2: GitHub Integration

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your repository
4. Set the root directory to `website`
5. Deploy!

## 📱 Sections

1. **Hero** - Main banner with app mockup and CTAs
2. **Features** - 8 key features in a grid layout
3. **How It Works** - 4-step process explanation
4. **Safety** - Emergency tools showcase
5. **Stats** - Animated statistics counter
6. **Tech Stack** - Technology overview
7. **CTA** - Download and GitHub links
8. **Footer** - Navigation and social links

## 🎯 Customization

### Colors
Edit the color palette in `tailwind.config.ts`:
```ts
colors: {
  primary: {
    50: '#fafafa',
    // ... customize shades
    950: '#09090b',
  },
}
```

### Content
Update text content directly in each component file under `src/components/`.

### Animations
Modify Framer Motion variants in components for different animation effects.

## 📄 License

This project is part of the CampusFix platform. See the main repository for license details.

---

Built with ❤️ by the CampusFix Team
