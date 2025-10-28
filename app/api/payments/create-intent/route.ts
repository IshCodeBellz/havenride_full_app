import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { amount, currency } = await req.json();
  const sk = process.env.STRIPE_SECRET_KEY;
  if (!sk) {
    // dev fallback: return fake client secret
    return NextResponse.json({ clientSecret: 'pi_test_secret' });
  }
  // Lazy import stripe
  const Stripe = (await import('stripe')).default;
  const stripe = new Stripe(sk, { apiVersion: '2024-06-20' as any });
  const intent = await stripe.paymentIntents.create({ amount, currency: (currency || 'gbp').toLowerCase(), automatic_payment_methods: { enabled: true } });
  return NextResponse.json({ clientSecret: intent.client_secret });
}
