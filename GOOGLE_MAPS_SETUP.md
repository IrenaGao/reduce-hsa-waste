# Google Maps Setup Guide

## 🗺️ **Getting Your Google Maps API Key**

### **Step 1: Create Google Cloud Project**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable billing for your project (Google Maps requires billing to be enabled)

### **Step 2: Enable Required APIs**
1. Go to "APIs & Services" > "Library"
2. Enable the following APIs:
   - **Maps JavaScript API** (required)
   - **Places API** (optional, for enhanced search features)

### **Step 3: Create API Key**
1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "API Key"
3. Copy your API key

### **Step 4: Secure Your API Key (Important!)**
1. Click on your API key to edit it
2. Under "Application restrictions", select "HTTP referrers"
3. Add your domain(s):
   - `localhost:3000/*` (for development)
   - `yourdomain.com/*` (for production)
4. Under "API restrictions", select "Restrict key"
5. Choose only the APIs you enabled above

### **Step 5: Add API Key to Your Project**
1. Create a `.env.local` file in your frontend directory:
   ```bash
   cd frontend
   touch .env.local
   ```

2. Add your API key to the file:
   ```
   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_actual_api_key_here
   ```

3. Restart your development server:
   ```bash
   npm run dev
   ```

## 🎯 **Features Included**

### **Interactive Map**
- Real Google Maps with NYC street layout
- Color-coded markers for different service types
- Clickable markers with detailed info windows
- Smooth zoom and pan controls

### **Service Integration**
- Markers automatically update when filtering services
- Clicking a marker highlights the corresponding service card
- Clicking a service card highlights the marker on the map
- Real-time synchronization between map and service list

### **Professional Features**
- Custom map styling to match your brand
- Responsive design that works on all devices
- Loading states and error handling
- Fallback UI when API key is missing

## 💰 **Cost Information**

### **Google Maps Pricing (as of 2024)**
- **Maps JavaScript API**: $7 per 1,000 loads (first 28,000 loads per month are free)
- **Places API**: $17 per 1,000 requests (first 1,000 requests per month are free)

### **Estimated Monthly Cost**
- **Small app** (1,000 users): ~$0-5/month
- **Medium app** (10,000 users): ~$50-100/month
- **Large app** (100,000 users): ~$500-1000/month

*Note: Google provides $200/month free credit for new accounts*

## 🔧 **Troubleshooting**

### **Map Not Loading**
- Check that your API key is correct
- Verify that Maps JavaScript API is enabled
- Ensure your domain is added to API key restrictions
- Check browser console for error messages

### **Markers Not Showing**
- Verify that your services have valid coordinates
- Check that the map is properly centered on your area
- Ensure the GoogleMap component is receiving the services prop

### **Performance Issues**
- Consider implementing marker clustering for large numbers of services
- Use marker optimization techniques for better performance
- Implement lazy loading for the map component

## 🚀 **Next Steps**

Once you have your API key set up, your Google Maps integration will be fully functional with:
- Real-time service location display
- Interactive marker clicking
- Service card synchronization
- Professional map styling
- Mobile-responsive design

The map will automatically work with your existing service filtering and provide a much better user experience than the placeholder map!
