# Daily Update Configuration for Global Internet Pulse

## Overview
This document outlines the automated daily data mashup system that combines:
- **Cloudflare Radar API**: Global internet traffic, security threats, performance metrics
- **OONI API**: Internet censorship data, freedom measurements, blocked content
- **World Bank API**: Internet penetration statistics, digital divide analysis

## Automation Schedule

### Vercel Cron (Recommended)
Add to `vercel.json`:
```json
{
  "crons": [
    {
      "path": "/api/cron/daily-update",
      "schedule": "0 6 * * *"
    }
  ]
}
```

### GitHub Actions Alternative
Create `.github/workflows/daily-update.yml`:
```yaml
name: Daily Internet Pulse Update
on:
  schedule:
    - cron: '0 6 * * *'  # 6 AM UTC daily
  workflow_dispatch:  # Manual trigger

jobs:
  update-data:
    runs-on: ubuntu-latest
    steps:
      - name: Trigger Daily Update
        run: |
          curl -X POST "${{ secrets.APP_URL }}/api/cron/daily-update" \
            -H "Authorization: Bearer ${{ secrets.CRON_SECRET }}"
```

### Manual Trigger
For development/testing:
```bash
curl -X POST http://localhost:3000/api/cron/daily-update
```

## Data Sources & Freshness

### Cloudflare Radar API
- **Endpoint**: `https://api.cloudflare.com/client/v4/radar/*`
- **Update Frequency**: Real-time (hourly aggregation)
- **Rate Limit**: 1,000 requests/day (no auth required)
- **Data Points**:
  - Global HTTP request volume
  - Attack patterns and mitigation
  - Internet performance metrics
  - Regional traffic distribution

### OONI API
- **Endpoint**: `https://api.ooni.io/api/v1/*`
- **Update Frequency**: Continuous (new measurements every few minutes)
- **Rate Limit**: No official limit (be respectful)
- **Data Points**:
  - Website blocking measurements
  - Censorship incidents
  - Country-level internet freedom
  - Real-time protest/event impacts

### World Bank API
- **Endpoint**: `https://api.worldbank.org/v2/*`
- **Update Frequency**: Annual (some quarterly indicators)
- **Rate Limit**: No official limit
- **Data Points**:
  - Internet penetration by country
  - Mobile subscription rates
  - Digital development indicators
  - Economic connectivity metrics

## Generated Content

### Daily Pulse Dashboard
- Global Internet Health Score (0-100)
- Traffic volume and trends
- Security threat landscape
- Internet freedom assessment
- Digital divide analysis
- Tomorrow's predictions

### Social Media Content
- **Twitter**: 3 auto-generated tweets with key metrics
- **LinkedIn**: Professional analysis post
- **Instagram**: Visual story-friendly content

### Newsletter Content
- HTML email template with daily insights
- Plain text version for accessibility
- Subscription management integration ready

## Implementation Benefits

### 1. Fresh Content Daily
- Automated data collection ensures current information
- Unique daily insights keep visitors returning
- SEO benefits from frequently updated content

### 2. Cross-Platform Engagement
- Social media automation drives traffic
- Newsletter builds subscriber base
- Shareable daily highlights increase reach

### 3. Data Reliability
- Multiple source triangulation
- Fallback data prevents empty states
- Error handling maintains uptime

### 4. Scalability
- API-driven architecture supports growth
- Modular components easy to extend
- Cloud-native deployment ready

## Environment Variables

Add to `.env.local`:
```env
# Required for cron jobs
NEXT_PUBLIC_APP_URL=https://your-domain.com
CRON_SECRET=your-secret-key

# Optional: Enhanced API access
CLOUDFLARE_API_TOKEN=your-token
WORLD_BANK_API_KEY=your-key

# Social media automation (optional)
TWITTER_API_KEY=your-key
TWITTER_API_SECRET=your-secret
LINKEDIN_API_TOKEN=your-token

# Email newsletter (optional)
SENDGRID_API_KEY=your-key
MAILCHIMP_API_KEY=your-key
```

## Monitoring & Analytics

### Health Checks
- Monitor API response times
- Track data freshness
- Alert on failed updates

### Usage Analytics
- Track daily active users
- Monitor social media engagement
- Measure newsletter open rates

### Performance Metrics
- API call success rates
- Data processing times
- User engagement patterns

## Future Enhancements

### Phase 2: Advanced Analytics
- Machine learning trend predictions
- Anomaly detection algorithms
- Sentiment analysis of internet freedom

### Phase 3: User Personalization
- Country-specific dashboards
- Industry-focused insights
- Custom alert preferences

### Phase 4: Community Features
- User-submitted reports
- Crowdsourced verification
- Regional expert insights

## Quick Start

1. **Deploy the APIs**:
   ```bash
   npm run dev
   # Test endpoints:
   # http://localhost:3000/api/daily-pulse
   # http://localhost:3000/api/cron/daily-update
   ```

2. **Set up Cron Jobs**:
   - For Vercel: Add `vercel.json` configuration
   - For self-hosted: Set up system cron or PM2

3. **Configure Social Media** (optional):
   - Set up API keys for automated posting
   - Customize content templates

4. **Monitor Performance**:
   - Check logs for successful updates
   - Verify data freshness daily
   - Monitor user engagement metrics

This system provides a robust foundation for daily-updating content that keeps your Global Internet Pulse website fresh and engaging while providing real value to visitors interested in global internet health and freedom.
