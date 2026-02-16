import '../styles/globals.css'
import Head from 'next/head'
import { ClerkProvider } from '@clerk/nextjs'
import { AuthProvider } from '../context/AuthContext'

const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || 'pk_test_cHVtcGVkLXNhaWxmaXNoLTQ3LmNsZXJrLmFjY291bnRzLmRldiQ'

export default function App({ Component, pageProps }) {
  return (
    <ClerkProvider publishableKey={publishableKey} {...pageProps}>
      <AuthProvider>
        <Head>
          <title>IntentFlow - Unified AI Omnibox</title>
          <meta name="description" content="One interface for every AI model. Local, Cloud, HuggingFace - all in one place." />
          <meta name="keywords" content="AI, omnibox, local models, cloud models, BYOK, GPT, Claude, Llama" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <meta property="og:title" content="IntentFlow - Unified AI Omnibox" />
          <meta property="og:description" content="One interface for every AI model" />
          <meta property="og:type" content="website" />
          <meta name="twitter:card" content="summary_large_image" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <Component {...pageProps} />
      </AuthProvider>
    </ClerkProvider>
  )
}
