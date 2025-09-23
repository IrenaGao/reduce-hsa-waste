# Sagas Health Platform - Collaborator Setup

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Git

### 1. Clone the Repository
```bash
git clone [YOUR_REPO_URL]
cd reduce-hsa-waste
```

### 2. Install Dependencies
```bash
cd frontend
npm install
```

### 3. Environment Setup
Create `.env.local` file in the `frontend` directory:

```bash
# Stripe Configuration
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
STRIPE_SECRET_KEY=sk_test_your_secret_key_here

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here

# Application URL
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# Google Maps API Key
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
```

### 4. Start Development Server
```bash
npm run dev
```

Visit: http://localhost:3000

## 📁 Project Structure

```
reduce-hsa-waste/
├── frontend/                 # Next.js application
│   ├── src/
│   │   ├── app/             # App router pages
│   │   │   ├── marketplace/ # Marketplace pages
│   │   │   ├── checkout/    # Checkout flow
│   │   │   └── api/         # API routes
│   │   ├── components/      # React components
│   │   └── lib/            # Utilities
│   └── package.json
├── backend/                 # Backend services
└── README.md
```

## 🔧 Key Features

- **Marketplace**: Service discovery with Google Maps integration
- **Health Questionnaire**: 8-step health intake form
- **Stripe Payments**: Full payment processing
- **HSA Integration**: HSA/FSA payment simulation
- **Booking Flow**: Complete booking and confirmation system

## 🛠 Development Notes

- Uses Next.js 15 with App Router
- Stripe integration for payments
- Google Maps for service locations
- Session storage for booking data
- Responsive design with Tailwind CSS

## 📞 Support

For questions or issues, contact the development team.