import { calculators } from "@/data/calculators"
import { ImageResponse } from 'next/og'

export const dynamic = 'force-static'

export function generateStaticParams() {
   return calculators.map(calc => ({
       category: calc.category,
       slug: calc.slug
   }))
}

export const alt = 'Docket One Calculator'
export const size = {
  width: 1200,
  height: 630,
}

export const contentType = 'image/png'

interface Props {
  params: Promise<{
    category: string
    slug: string
  }>
}

export default async function Image({ params }: Props) {
  const { category, slug } = await params
  const calculatorData = calculators.find(c => c.slug === slug && c.category === category)

  if (!calculatorData) {
    return new ImageResponse(
      (
        <div style={{ display: 'flex', width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center', backgroundColor: '#020617', color: 'white' }}>
          <h1>Docket One</h1>
        </div>
      ),
      { ...size }
    )
  }

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#020617',
          backgroundImage: 'radial-gradient(circle at top right, #312e81 0%, transparent 40%), radial-gradient(circle at bottom left, #4c1d95 0%, transparent 40%)',
          padding: '40px 60px',
          position: 'relative',
        }}
      >
        {/* Border / Frame */}
        <div
          style={{
            position: 'absolute',
            inset: '30px',
            border: '2px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '40px',
          }}
        />

        {/* Content Container */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            gap: '20px',
          }}
        >
          {/* Icon/Logo area */}
          <div
            style={{
              display: 'flex',
              padding: '24px',
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '24px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              marginBottom: '10px',
              fontSize: '64px',
            }}
          >
            {calculatorData.icon || '🚀'}
          </div>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
            }}
          >
            <h1
              style={{
                fontSize: '72px',
                fontWeight: 900,
                color: 'white',
                letterSpacing: '-0.05em',
                margin: 0,
                lineHeight: 1.1,
              }}
            >
              {calculatorData.title}
            </h1>
            <p
              style={{
                fontSize: '28px',
                color: '#94a3b8',
                maxWidth: '800px',
                margin: '0 auto',
                lineHeight: 1.4,
              }}
            >
              {calculatorData.description}
            </p>
          </div>
        </div>

        {/* Branding Footer */}
        <div
            style={{
                position: 'absolute',
                bottom: '80px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                padding: '12px 24px',
                borderRadius: '999px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
            }}
        >
            <span style={{ color: 'white', fontSize: '20px', fontWeight: 800, letterSpacing: '-0.02em' }}>
                Docket One
            </span>
            <span style={{ color: '#6366f1', fontSize: '20px' }}>•</span>
            <span style={{ color: '#94a3b8', fontSize: '18px', fontWeight: 500 }}>
                {calculatorData.category.replace(/_/g, ' ')}
            </span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
