# Stripe Setup Guide for Jusur Platform

This guide will help you set up Stripe payments for the Jusur donation system.

## 🚀 Quick Setup

### 1. Create a Stripe Account
- Go to [stripe.com](https://stripe.com) and create an account
- Complete the account verification process
- You'll start in **Test Mode** which is perfect for development

### 2. Get Your API Keys
In your Stripe Dashboard:

1. **Navigate to Developers → API keys**
2. Copy the following keys:
   - **Publishable key** (starts with `pk_test_...` for test mode)
   - **Secret key** (starts with `sk_test_...` for test mode) - Click "Reveal live key"

### 3. Set Environment Variables
Create a `.env.local` file in your project root:

```bash
# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_your_secret_key_here
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here

# App Configuration  
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**⚠️ Important:**
- Never commit the `.env.local` file to version control
- The `NEXT_PUBLIC_` prefix makes the publishable key available to the browser
- Keep your secret key secure - it should only be used server-side

### 4. Test the Integration
1. Start your development server: `npm run dev`
2. Navigate to `/donation`
3. Try making a test donation
4. Use Stripe's test card numbers:
   - **Success:** `4242 4242 4242 4242`
   - **Decline:** `4000 0000 0000 0002`
   - Use any future expiry date and any 3-digit CVC

## 🔧 Current Implementation

### API Routes
- **`/api/create-checkout-session`** - Creates Stripe checkout sessions
- Handles donations from $1 to unlimited amounts
- Redirects to success/cancel pages after payment

### Pages
- **`/donation`** - Main donation page with form
- **`/donation/success`** - Success page after payment
- **`/donation/cancelled`** - Shown when user cancels payment

### Security Features
- Server-side API key handling
- Secure payment processing through Stripe
- No sensitive data stored locally
- HTTPS required in production

## 🐛 Troubleshooting

### "Checkout session not working"
This usually means environment variables aren't set up correctly.

**Check:**
1. ✅ `.env.local` file exists in project root
2. ✅ Variable names are exactly as shown above
3. ✅ No spaces around the `=` sign
4. ✅ Keys are the correct test keys from Stripe
5. ✅ Restart your development server after adding env vars

### "Network Error" or "Failed to create checkout session"
**Solutions:**
1. **Check your secret key:** Make sure it starts with `sk_test_`
2. **Verify API key permissions:** Ensure the key has write permissions
3. **Check browser console:** Look for any JavaScript errors
4. **Test with curl:**
   ```bash
   curl -X POST http://localhost:3000/api/create-checkout-session \\
     -H "Content-Type: application/json" \\
     -d '{"amount": 25}'
   ```

### "Invalid request"
- Ensure you're sending a valid amount (minimum $1)
- Check that the API route is receiving the correct data format

## 📋 Test Cards

Use these test card numbers in test mode:

| Card Number | Description |
|-------------|-------------|
| `4242 4242 4242 4242` | Visa - Payment succeeds |
| `4000 0000 0000 0002` | Visa - Payment declined |
| `4000 0000 0000 9995` | Visa - Insufficient funds |
| `4000 0842 0000 0006` | Visa - Expired card |

**For all test cards:**
- Use any future expiry date (e.g., 12/34)
- Use any 3-digit CVC (e.g., 123)
- Use any billing address

## 🌐 Production Setup

### 1. Activate Live Mode
1. Complete Stripe account verification
2. Provide business information and bank details
3. Switch to "Live mode" in Stripe Dashboard

### 2. Get Live API Keys
- Replace test keys with live keys (start with `pk_live_` and `sk_live_`)
- Update environment variables in your production environment

### 3. Domain Configuration
- Update `NEXT_PUBLIC_APP_URL` to your production domain
- Ensure HTTPS is enabled
- Test the full payment flow in production

### 4. Webhooks (Recommended)
For production, set up webhooks to handle successful payments:

1. **Stripe Dashboard → Developers → Webhooks**
2. **Add endpoint:** `https://yourdomain.com/api/stripe/webhook`
3. **Select events:** `checkout.session.completed`
4. **Get webhook secret** and add to environment variables

## 💡 Additional Features

### Custom Amounts
The donation form supports:
- **Preset amounts:** $25, $50, $100, $250, $500
- **Custom amounts:** Users can enter any amount ≥ $1

### Multi-currency Support
To add currency support, modify the API route:
```typescript
const { amount, currency = 'gbp' } = await request.json();
```

### Recurring Donations
To add subscription support, change the mode in the API route:
```typescript
mode: 'subscription', // instead of 'payment'
```

## 📞 Support

If you encounter issues:
1. Check the [Stripe Documentation](https://stripe.com/docs)
2. Review browser console for errors
3. Test with the provided curl command
4. Verify all environment variables are set correctly

## 🔒 Security Checklist

- [ ] Secret key is never exposed to the browser
- [ ] `.env.local` is in `.gitignore`
- [ ] Using HTTPS in production
- [ ] API keys are from the correct Stripe account
- [ ] Test mode is working before going live

## 📚 Next Steps

1. **Test thoroughly** with different amounts and scenarios
2. **Set up webhooks** for production to track successful donations
3. **Configure email receipts** in Stripe Dashboard
4. **Add analytics** to track donation metrics
5. **Consider adding** Apple Pay / Google Pay for mobile users

---

**Need help?** Check the Stripe Dashboard's logs section to see detailed information about any failed requests.