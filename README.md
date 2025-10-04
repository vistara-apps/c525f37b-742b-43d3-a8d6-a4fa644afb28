# HustleScope

Track your side hustle's true ROI — time, money, and momentum.

## Features

- **One-Tap Project Timer**: Mobile-first time tracking widget
- **Real Hourly Rate Calculator**: See your true $/hour after expenses
- **Kill-or-Scale Dashboard**: Data-driven signals for project decisions
- **Automated Insights**: Weekly productivity recommendations
- **Social Proof Loop**: Share wins on Farcaster, earn recognition

## Tech Stack

- Next.js 15 with App Router
- React 19
- OnchainKit for Base integration
- Supabase for real-time data
- Tailwind CSS for styling
- TypeScript for type safety

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.local.example .env.local
```

3. Configure your environment:
- Add Supabase URL and anon key
- Add OnchainKit API key
- Configure Base chain settings

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000)

## Database Setup

Create the following tables in Supabase:

- `users`: User profiles and wallet addresses
- `projects`: Side hustle projects
- `time_sessions`: Time tracking entries
- `income_entries`: Revenue tracking
- `expense_entries`: Expense tracking
- `weekly_insights`: AI-generated insights

## Deployment

Deploy to Vercel:

```bash
vercel deploy
```

## License

MIT
