import { NextResponse } from 'next/server';

// Cron job endpoint for daily data updates
// This will be called by a scheduler (Vercel Cron, GitHub Actions, etc.)
export async function POST() {
  try {
    const startTime = Date.now();
    
    // Trigger daily pulse generation
    const dailyPulseUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/daily-pulse`;
    const pulseResponse = await fetch(dailyPulseUrl);
    const pulseData = await pulseResponse.json();
    
    // Store in cache/database (for now we'll use memory, but you'd use Redis/DB)
    await storeDailyPulse(pulseData);
    
    // Generate social media content
    const socialContent = generateSocialMediaContent(pulseData);
    
    // Prepare newsletter content
    const newsletterContent = generateNewsletterContent(pulseData);
    
    const executionTime = Date.now() - startTime;
    
    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      executionTime: `${executionTime}ms`,
      data: {
        healthScore: pulseData.healthScore,
        highlights: pulseData.highlights,
        predictions: pulseData.predictions,
        socialContent,
        newsletterContent: newsletterContent.subject
      }
    });
  } catch (error) {
    console.error('Cron job error:', error);
    return NextResponse.json(
      { error: 'Failed to execute daily update' },
      { status: 500 }
    );
  }
}

async function storeDailyPulse(data: { date: string; [key: string]: unknown }) {
  // In a real app, you'd store this in Redis, PostgreSQL, etc.
  // For now, we'll simulate storage
  console.log(`Storing daily pulse for ${data.date}`);
  
  // You could also send to analytics services, update static files, etc.
  return Promise.resolve();
}

function generateSocialMediaContent(pulseData: any) {
  const healthEmoji = pulseData.healthScore >= 85 ? '🟢' : pulseData.healthScore >= 70 ? '🟡' : '🔴';
  
  return {
    twitter: [
      `${healthEmoji} Global Internet Health Score: ${pulseData.healthScore}/100\n\n${pulseData.highlights.slice(0, 3).join('\n')}\n\n#InternetHealth #DigitalRights #TechNews`,
      
      `🌐 Daily Internet Pulse - ${pulseData.date}\n\n• Traffic: ${formatLargeNumber(pulseData.traffic?.global?.httpRequests || 0)} requests\n• Censorship incidents: ${pulseData.freedom?.incidents?.length || 0}\n• Security threats mitigated: ${formatLargeNumber(pulseData.traffic?.global?.attacks || 0)}\n\n#GlobalInternet`,
      
      `📊 Internet Freedom Alert:\n${pulseData.freedom?.riskCountries?.slice(0, 3).map((c: any) => `• ${c.country}: ${c.riskLevel} risk`).join('\n') || 'No high-risk countries detected'}\n\n#DigitalFreedom #Censorship`
    ],
    
    linkedin: `🌐 Daily Global Internet Pulse - ${pulseData.date}

Internet Health Score: ${pulseData.healthScore}/100 ${healthEmoji}

Key Insights:
${pulseData.highlights.map((h: string) => `• ${h}`).join('\n')}

Predictions for tomorrow:
• Traffic: ${pulseData.predictions?.traffic?.prediction || 'Stable'}
• Security: ${pulseData.predictions?.security?.prediction || 'Normal threat levels'}
• Freedom: ${pulseData.predictions?.censorship?.prediction || 'No major concerns'}

Stay informed about global internet health and digital rights.

#InternetHealth #DigitalRights #TechAnalytics #GlobalConnectivity`,
    
    instagram: {
      caption: `🌐 Global Internet Pulse ${pulseData.date}\n\nHealth Score: ${pulseData.healthScore}/100 ${healthEmoji}\n\n${pulseData.highlights.slice(0, 4).map((h: string) => h).join('\n\n')}\n\n#InternetHealth #DigitalWorld #TechNews #GlobalConnectivity`,
      hashtags: ['#InternetHealth', '#DigitalRights', '#TechNews', '#GlobalConnectivity', '#CyberSecurity', '#DigitalFreedom']
    }
  };
}

function generateNewsletterContent(pulseData: any) {
  const date = new Date(pulseData.date).toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
  
  return {
    subject: `🌐 Internet Pulse ${pulseData.healthScore}/100 - ${date}`,
    
    html: `
    <html>
    <head>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 20px; background: #0f1419; color: #e5e7eb; }
        .container { max-width: 600px; margin: 0 auto; background: #1e293b; border-radius: 12px; overflow: hidden; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; }
        .score { font-size: 48px; font-weight: bold; color: white; margin: 10px 0; }
        .content { padding: 30px; }
        .highlight { background: #374151; padding: 15px; margin: 10px 0; border-radius: 8px; border-left: 4px solid #3b82f6; }
        .prediction { background: #1f2937; padding: 20px; margin: 20px 0; border-radius: 8px; }
        .footer { background: #111827; padding: 20px; text-align: center; font-size: 12px; color: #9ca3af; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Global Internet Pulse</h1>
          <div class="score">${pulseData.healthScore}/100</div>
          <p>${date}</p>
        </div>
        
        <div class="content">
          <h2>🌟 Today's Highlights</h2>
          ${pulseData.highlights.map((highlight: string) => `<div class="highlight">${highlight}</div>`).join('')}
          
          <h2>🔮 Tomorrow's Predictions</h2>
          <div class="prediction">
            <strong>Traffic:</strong> ${pulseData.predictions?.traffic?.prediction || 'Stable patterns expected'}<br>
            <strong>Security:</strong> ${pulseData.predictions?.security?.prediction || 'Normal threat levels'}<br>
            <strong>Freedom:</strong> ${pulseData.predictions?.censorship?.prediction || 'No major concerns'}
          </div>
          
          <h2>📊 Quick Stats</h2>
          <ul>
            <li>Global HTTP Requests: ${formatLargeNumber(pulseData.traffic?.global?.httpRequests || 0)}</li>
            <li>Security Threats Mitigated: ${formatLargeNumber(pulseData.traffic?.global?.attacks || 0)}</li>
            <li>Countries with Censorship Activity: ${pulseData.freedom?.riskCountries?.length || 0}</li>
            <li>Internet Freedom Score: ${pulseData.freedom?.score || 'N/A'}</li>
          </ul>
        </div>
        
        <div class="footer">
          <p>Generated by Global Internet Pulse | <a href="#" style="color: #3b82f6;">View Full Dashboard</a></p>
        </div>
      </div>
    </body>
    </html>
    `,
    
    text: `
Global Internet Pulse - ${date}

Health Score: ${pulseData.healthScore}/100

Today's Highlights:
${pulseData.highlights.map((h: string) => `• ${h}`).join('\n')}

Tomorrow's Predictions:
• Traffic: ${pulseData.predictions?.traffic?.prediction || 'Stable'}
• Security: ${pulseData.predictions?.security?.prediction || 'Normal'}
• Freedom: ${pulseData.predictions?.censorship?.prediction || 'No concerns'}

Quick Stats:
• Global HTTP Requests: ${formatLargeNumber(pulseData.traffic?.global?.httpRequests || 0)}
• Security Threats Mitigated: ${formatLargeNumber(pulseData.traffic?.global?.attacks || 0)}
• Countries with Censorship: ${pulseData.freedom?.riskCountries?.length || 0}

View the full dashboard at: [your-domain.com]
    `
  };
}

function formatLargeNumber(num: number): string {
  if (num >= 1e12) return `${(num / 1e12).toFixed(1)}T`;
  if (num >= 1e9) return `${(num / 1e9).toFixed(1)}B`;
  if (num >= 1e6) return `${(num / 1e6).toFixed(1)}M`;
  if (num >= 1e3) return `${(num / 1e3).toFixed(1)}K`;
  return num.toString();
}

// Endpoint to manually trigger the cron job (useful for testing)
export async function GET() {
  return POST();
}
