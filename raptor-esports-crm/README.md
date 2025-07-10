# Raptor Esports CRM

A comprehensive esports team management system built with Next.js 14, Supabase, TypeScript, and shadcn/ui components. This CRM system manages player performance data with OCR screenshot processing capabilities.

## 🚀 Features

- **Authentication System** - Email/password authentication with role-based access control
- **User Management** - Admin panel for managing users, teams, and roles
- **Performance Tracking** - Manual data entry and OCR screenshot processing
- **Profile Management** - User profiles with avatar uploads
- **Dashboard** - Overview with statistics and recent activity
- **Responsive Design** - Mobile-first design with modern UI

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript
- **UI Components**: shadcn/ui, Tailwind CSS, Lucide React icons
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **OCR Processing**: Tesseract.js for screenshot data extraction
- **State Management**: React Context for authentication

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account and project

## 🚀 Quick Start

### 1. Clone and Install

```bash
git clone <repository-url>
cd raptor-esports-crm
npm install
```

### 2. Environment Setup

Copy the environment template and add your Supabase credentials:

```bash
cp .env.local.example .env.local
```

Edit `.env.local` with your Supabase details:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Database Setup

Run the SQL scripts in your Supabase SQL editor:

1. **Create Tables**: Run `scripts/01-create-tables.sql`
2. **Setup Storage**: Run `scripts/02-create-storage.sql`

### 4. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 🗄️ Database Schema

### Tables

- **teams** - Team information
- **users** - User profiles (extends Supabase auth)
- **performances** - Match performance data

### Storage Buckets

- **avatars** - User profile pictures (public)
- **ocr_uploads** - Match screenshots for OCR (private)

## 👥 User Roles

- **admin** - Full system access, user management
- **manager** - Team management, performance tracking
- **coach** - Performance tracking, player management
- **player** - View own performance, update profile
- **analyst** - View all performance data, analytics

## 📊 Performance Tracking

### Manual Entry
- Match number and slot
- Map selection (Valorant maps)
- Kills, assists, damage, survival time
- Optional team placement

### OCR Processing
- Upload match screenshots
- Automatic data extraction
- Multiple parsing strategies
- Manual editing capabilities

## 🎮 Supported Games

- **Valorant** (primary focus)
- **PUBG/Battle Royale** games
- **CS2/Counter-Strike** games

## 📱 Mobile Support

- Responsive design
- Touch-friendly interface
- Mobile-optimized OCR processing
- Progressive Web App ready

## 🔧 Development

### Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── dashboard/         # Protected dashboard routes
│   ├── layout.tsx         # Root layout with providers
│   └── page.tsx          # Landing page
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   └── app-sidebar.tsx   # Navigation sidebar
├── hooks/                # Custom React hooks
│   ├── use-auth.tsx      # Authentication context
│   └── use-toast.ts      # Toast notifications
└── lib/                  # Utilities and services
    ├── supabase.ts       # Supabase client
    ├── ocr-service.ts    # OCR processing
    └── utils.ts          # Common utilities
```

### Key Components

- **AuthProvider** - Authentication context and user management
- **AppSidebar** - Role-based navigation
- **OCRService** - Screenshot processing and data extraction
- **Toast System** - User feedback notifications

## 🚀 Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Other Platforms

The app can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## 🔒 Security

- Row Level Security (RLS) policies on all tables
- Role-based access control
- Secure file uploads with proper validation
- Environment variable protection

## 🐛 Troubleshooting

### Common Issues

1. **OCR not working**: Check browser console for errors, ensure image format is supported
2. **Authentication issues**: Verify Supabase credentials and RLS policies
3. **Mobile performance**: OCR processing may be slower on mobile devices

### Development Tips

- Use browser dev tools to debug OCR processing
- Check Supabase logs for database errors
- Test on multiple devices for responsive design

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📞 Support

For support or questions:
- Create an issue in the repository
- Check the troubleshooting section
- Review the Supabase documentation

---

Built with ❤️ for the esports community
