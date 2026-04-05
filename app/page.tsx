'use client';
import { useSession, signOut } from 'next-auth/react';


import Link from 'next/link';

const CATEGORIES = [
  { name: 'Haircuts & Barbering', icon: '✂️' },
  { name: 'Sewing & Fashion', icon: '🧵' },
  { name: 'Tutoring', icon: '📚' },
  { name: 'Laptop & Tech Repair', icon: '💻' },
  { name: 'Graphic Design', icon: '🎨' },
  { name: 'Photography', icon: '📷' },
  { name: 'Food & Catering', icon: '🍲' },
  { name: 'Other', icon: '⭐' },
];

export default function HomePage() {
  const { data: session } = useSession();
  return (
    <main style={{
      minHeight: '100vh',
      backgroundColor: '#ffffff',
      color: '#111111',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      lineHeight: '1.6',
    }}>

      {/* Navbar — minimal, clean */}
      <nav style={{
        padding: '0 32px',
        height: '60px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid #f0f0f0',
        position: 'sticky',
        top: 0,
        backgroundColor: '#ffffff',
        zIndex: 100,
      }}>
        <span style={{ fontWeight: '700', fontSize: '17px', letterSpacing: '-0.3px' }}>
          UniTalent Bridge
        </span>
        <div style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
          <Link href="/services" style={{ color: '#555', textDecoration: 'none', fontSize: '14px' }}>Services</Link>
          <Link href="/requests" style={{ color: '#555', textDecoration: 'none', fontSize: '14px' }}>Requests</Link>
          <Link href="/post-service" style={{ color: '#555', textDecoration: 'none', fontSize: '14px' }}>Post a Service</Link>
          {session ? (
  <button onClick={() => signOut()} style={{
    backgroundColor: '#111',
    color: '#fff',
    padding: '8px 16px',
    borderRadius: '8px',
    border: 'none',
    fontSize: '13px',
    fontWeight: '500',
    cursor: 'pointer',
  }}>
    Sign out ({session.user?.name})
  </button>
) : (
  <Link href="/auth/signin" style={{
    backgroundColor: '#111',
    color: '#fff',
    padding: '8px 16px',
    borderRadius: '8px',
    textDecoration: 'none',
    fontSize: '13px',
    fontWeight: '500',
  }}>
    Sign in
  </Link>
)}
        </div>
      </nav>

      {/* Hero — lots of space, simple message */}
      <section style={{
        maxWidth: '680px',
        margin: '0 auto',
        padding: '96px 24px 80px',
        textAlign: 'center',
      }}>
        <div style={{
          display: 'inline-block',
          fontSize: '13px',
          color: '#888',
          backgroundColor: '#f5f5f5',
          padding: '5px 12px',
          borderRadius: '20px',
          marginBottom: '28px',
          fontWeight: '500',
        }}>
          Universities of talents, connecting students on campus  
        </div>

        <h1 style={{
          fontSize: '48px',
          fontWeight: '700',
          letterSpacing: '-1.5px',
          lineHeight: '1.15',
          marginBottom: '20px',
          color: '#111',
        }}>
          Student skills,<br />ready to help you.
        </h1>

        <p style={{
          fontSize: '18px',
          color: '#777',
          marginBottom: '40px',
          fontWeight: '400',
        }}>
          Find trusted students for tutoring, haircuts,<br />
          design, repairs, and more — all on campus.
        </p>

        {/* Search */}
        <form action="/services" method="GET" style={{
          display: 'flex',
          gap: '8px',
          maxWidth: '460px',
          margin: '0 auto',
        }}>
          <input
            name="search"
            placeholder="What do you need help with?"
            style={{
              flex: 1,
              padding: '13px 18px',
              fontSize: '15px',
              border: '1.5px solid #e0e0e0',
              borderRadius: '10px',
              outline: 'none',
              color: '#111',
              backgroundColor: '#fafafa',
            }}
          />
          <button type="submit" style={{
            backgroundColor: '#111',
            color: '#fff',
            border: 'none',
            padding: '13px 22px',
            borderRadius: '10px',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
          }}>
            Search
          </button>
        </form>
      </section>

      {/* Divider */}
      <div style={{ borderTop: '1px solid #f0f0f0', maxWidth: '800px', margin: '0 auto' }} />

      {/* Categories */}
      <section style={{
        maxWidth: '800px',
        margin: '0 auto',
        padding: '64px 24px',
      }}>
        <p style={{
          fontSize: '12px',
          fontWeight: '600',
          letterSpacing: '1px',
          color: '#aaa',
          textTransform: 'uppercase',
          marginBottom: '24px',
        }}>
          Browse by category
        </p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
          gap: '10px',
        }}>
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.name}
              href="/services"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '14px 16px',
                backgroundColor: '#fafafa',
                border: '1px solid #ebebeb',
                borderRadius: '10px',
                textDecoration: 'none',
                color: '#333',
                fontSize: '13px',
                fontWeight: '500',
              }}
            >
              <span style={{ fontSize: '18px' }}>{cat.icon}</span>
              {cat.name}
            </Link>
          ))}
        </div>
      </section>

      {/* Divider */}
      <div style={{ borderTop: '1px solid #f0f0f0', maxWidth: '800px', margin: '0 auto' }} />

      {/* How it works */}
      <section style={{
        maxWidth: '800px',
        margin: '0 auto',
        padding: '64px 24px',
      }}>
        <p style={{
          fontSize: '12px',
          fontWeight: '600',
          letterSpacing: '1px',
          color: '#aaa',
          textTransform: 'uppercase',
          marginBottom: '40px',
        }}>
          How it works
        </p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '40px',
        }}>
          {[
            { step: '01', title: 'Find a service', desc: 'Browse or search for what you need on campus.' },
            { step: '02', title: 'Check reviews', desc: 'See ratings, past work, and trust scores.' },
            { step: '03', title: 'Contact directly', desc: 'Reach out and arrange everything yourselves.' },
          ].map((item) => (
            <div key={item.step}>
              <div style={{ fontSize: '12px', color: '#bbb', fontWeight: '600', marginBottom: '12px' }}>
                {item.step}
              </div>
              <div style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px', color: '#111' }}>
                {item.title}
              </div>
              <div style={{ fontSize: '14px', color: '#888', lineHeight: '1.6' }}>
                {item.desc}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Divider */}
      <div style={{ borderTop: '1px solid #f0f0f0', maxWidth: '800px', margin: '0 auto' }} />

      {/* CTA */}
      <section style={{
        maxWidth: '800px',
        margin: '0 auto',
        padding: '64px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '24px',
      }}>
        <div>
          <div style={{ fontSize: '22px', fontWeight: '700', marginBottom: '6px', letterSpacing: '-0.5px' }}>
            Have a skill to offer?
          </div>
          <div style={{ fontSize: '15px', color: '#888' }}>
            Post your service and start getting clients today.
          </div>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <Link href="/post-service" style={{
            backgroundColor: '#111',
            color: '#fff',
            padding: '12px 24px',
            borderRadius: '10px',
            textDecoration: 'none',
            fontSize: '14px',
            fontWeight: '600',
          }}>
            Post a Service
          </Link>
          <Link href="/post-request" style={{
            backgroundColor: '#f5f5f5',
            color: '#333',
            padding: '12px 24px',
            borderRadius: '10px',
            textDecoration: 'none',
            fontSize: '14px',
            fontWeight: '600',
          }}>
            Request a Service
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        borderTop: '1px solid #f0f0f0',
        padding: '28px 32px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '12px',
        backgroundColor: '#fafafa',
      }}>
        <span style={{ fontSize: '14px', fontWeight: '600', color: '#333' }}>
          UniTalent Bridge
        </span>
        <span style={{ fontSize: '13px', color: '#aaa' }}>
          Campus marketplace · University of Rwanda
        </span>
      </footer>

    </main>
  );
}