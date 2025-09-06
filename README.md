# Global Internet Pulse 

A real-time internet traffic monitoring dashboard that displays global internet status, outages, and censorship data using free APIs.

![Global Internet Pulse](https://img.shields.io/badge/Next.js-15.4.6-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![TailwindCSS](https://img.shields.io/badge/Tailwind-4.0-38bdf8?style=for-the-badge&logo=tailwindcss)

##  Features:

- **Real-time Dashboard**: Live monitoring of global internet status.
- **Interactive World Map**: Visual representation of internet traffic and outages by country
- **Live Feed**: Real-time stream of network events, outages, and censorship alerts
- **Historical Trends**: Analysis of global internet penetration over time
- **API Integration**: 
  - Cloudflare Radar API for traffic patterns
  - OONI API for censorship data
  - World Bank API for historical internet usage statistics
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Free Deployment**: Ready for Vercel free tier deployment

##  Quick Start:

### Prerequisites

- Node.js 18+ 
- npm, yarn, pnpm, or bun

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd global-internet-pulse
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

##  Development

### Project Structure

```
src/
 app/
    api/
       cloudflare/     # Cloudflare Radar API routes
       ooni/           # OONI censorship API routes
       worldbank/      # World Bank statistics API routes
    trends/             # Historical trends page
    layout.tsx          # Root layout with navigation
    page.tsx            # Main dashboard page
 components/
    WorldMap.tsx        # Interactive world map
    StatisticsPanel.tsx # Charts and global stats
    LiveFeed.tsx        # Real-time events feed
    Navigation.tsx      # Site navigation
```

### Key Technologies

- **Next.js 15.4.6**: React framework with App Router
- **TypeScript**: Type-safe development
- **TailwindCSS**: Utility-first CSS framework
- **Recharts**: Charts and data visualization
- **Leaflet**: Interactive maps
- **Lucide React**: Beautiful icons

### Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

##  API Integration

### Cloudflare Radar API
Provides global internet traffic patterns and statistics.
- **Endpoint**: `https://api.cloudflare.com/client/v4/radar/`
- **Usage**: Public endpoints, no API key required
- **Rate Limits**: Generous for development use

### OONI API
Monitors internet censorship and website blocking worldwide.
- **Endpoint**: `https://api.ooni.io/api/v1/`
- **Usage**: Public API, no authentication required
- **Data**: Real-time censorship measurements

### World Bank API
Historical internet penetration and usage statistics.
- **Endpoint**: `https://api.worldbank.org/v2/`
- **Usage**: Public API, no key required
- **Data**: Internet users per 100 people by country/year

##  Features in Detail

### Dashboard
- Global uptime percentage
- Average response times
- Active outage count
- Live traffic patterns
- Regional traffic distribution

### Interactive World Map
- Color-coded countries by internet status
- Traffic load indicators
- Censorship alerts
- Clickable country details

### Live Feed
- Real-time network events
- Outage notifications
- Censorship detections
- Traffic anomalies
- Event severity indicators

### Trends Page
- Historical internet penetration
- Country comparisons
- Population vs internet growth
- Digital divide analysis
- Regional distribution charts

##  Deployment

### Vercel (Recommended)

1. **Connect your repository to Vercel**
   - Visit [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Configure project settings

2. **Environment Variables**
   No environment variables required - all APIs are public!

3. **Deploy**
   ```bash
   npm run build
   ```

### Alternative Deployment Options

- **Netlify**: Upload the build folder
- **Railway**: Connect GitHub and deploy
- **DigitalOcean App Platform**: One-click deployment

##  Customization

### Adding New Data Sources

1. **Create API route**
   ```typescript
   // src/app/api/newapi/route.ts
   export async function GET() {
     // Fetch and transform data
     return NextResponse.json(data);
   }
   ```

2. **Update components**
   ```typescript
   // Fetch data in your component
   const response = await fetch('/api/newapi');
   const data = await response.json();
   ```

### Styling Customization

The project uses TailwindCSS. Key color scheme:
- Primary: Blue (`blue-400`, `blue-600`)
- Success: Green (`green-400`)
- Warning: Yellow (`yellow-400`)
- Danger: Red (`red-400`)
- Background: Slate (`slate-900`)

### Map Customization

Edit `src/components/WorldMap.tsx`:
- Change map tiles
- Add new markers
- Modify popup content
- Update status colors

##  Responsive Design

The dashboard is fully responsive with breakpoints:
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

##  Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

##  License

This project is open source and available under the [MIT License](LICENSE).

##  Acknowledgments

- **Cloudflare** for Radar API
- **OONI** for censorship monitoring data
- **World Bank** for development statistics
- **OpenStreetMap** for map tiles
- **Vercel** for hosting platform

##  Support

For questions or issues:
- Open an issue on GitHub
- Check the documentation
- Review API documentation links

---

**Built with  for internet freedom and transparency**
