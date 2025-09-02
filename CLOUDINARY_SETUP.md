# Cloudinary Setup Instructions

## 1. Create Free Cloudinary Account

1. Go to [https://cloudinary.com](https://cloudinary.com)
2. Click **"Sign Up for Free"**
3. Fill in your details and create account
4. Verify your email

## 2. Get Your Credentials

1. After login, go to your **Dashboard**
2. You'll see your credentials in the **Account Details** section:
   ```
   Cloud Name: your_cloud_name
   API Key: your_api_key  
   API Secret: your_api_secret
   ```

## 3. Configure Railway Environment Variables

1. Go to your **Railway Project Dashboard**
2. Click on your **bekker-fine-art** service
3. Go to **Variables** tab
4. Add these environment variables:

```env
CLOUDINARY_CLOUD_NAME=your_cloud_name_here
CLOUDINARY_API_KEY=your_api_key_here  
CLOUDINARY_API_SECRET=your_api_secret_here
```

**Important**: Replace the values with your actual Cloudinary credentials!

## 4. Deploy Changes

The system is already coded to:
- ✅ **Try Cloudinary first** (if configured)
- ✅ **Fallback to base64** (if Cloudinary not configured)
- ✅ **Handle 10MB files** (much larger than before)
- ✅ **Auto-optimize images** (better performance)

## 5. Benefits After Setup

- 🚀 **25GB free storage** (vs 5-10MB localStorage)
- 🌍 **Global CDN** (faster image loading)
- 🔄 **Survives deployments** (images never lost)
- 📱 **Auto-optimization** (perfect sizes for web)
- 💰 **$0/month** (free tier)

## 6. Test the Setup

1. Upload image in admin panel
2. Check that storage type shows "cloudinary" (not "local-base64")
3. Image URLs will be: `https://res.cloudinary.com/your_cloud_name/...`

---

**Note**: Without Cloudinary setup, the system still works with base64 fallback, but you'll hit storage limits quickly.