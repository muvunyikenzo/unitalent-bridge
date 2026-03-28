'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  university: string;
  profileImage: string | null;
  bio: string | null;
  ratingAverage: number;
  jobsCompleted: number;
  isNewTalent: boolean;
  createdAt: string;
  services: Service[];
  reviewsReceived: Review[];
}

interface Service {
  id: string;
  title: string;
  category: string;
  price: number;
  priceUnit: string;
  isActive: boolean;
}

interface Review {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  reviewer: { name: string; profileImage: string | null };
}

function StarRating({ rating }: { rating: number }) {
  const full = Math.round(rating);
  return (
    <span>
      <span style={{ color: '#f59e0b' }}>{'★'.repeat(full)}{'☆'.repeat(5 - full)}</span>
      <span style={{ color: '#aaa', marginLeft: '5px', fontSize: '13px' }}>
        {rating > 0 ? rating.toFixed(1) : 'No reviews yet'}
      </span>
    </span>
  );
}

function Avatar({ name, image, size = 80 }: { name: string; image: string | null; size?: number }) {
  if (image) {
    return <img src={image} alt={name} style={{ width: size, height: size, borderRadius: '50%', objectFit: 'cover' }} />;
  }
  const initials = name.split(' ').slice(0, 2).map(w => w[0]?.toUpperCase()).join('');
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      backgroundColor: '#f0f0f0', display: 'flex', alignItems: 'center',
      justifyContent: 'center', fontWeight: '700',
      fontSize: size / 3, color: '#555',
    }}>
      {initials}
    </div>
  );
}

export default function ProfilePage({ params }: { params: { id: string } }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, [params.id]);

  async function fetchProfile() {
    try {
      const res = await fetch(`/api/users/${params.id}`);
      if (!res.ok) { setNotFound(true); setLoading(false); return; }
      const data = await res.json();
      setUser(data);
    } catch {
      setNotFound(true);
    }
    setLoading(false);
  }

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'system-ui' }}>
        <p style={{ color: '#aaa' }}>Loading profile...</p>
      </div>
    );
  }

  if (notFound || !user) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'system-ui', flexDirection: 'column', gap: '16px' }}>
        <p style={{ fontSize: '20px', fontWeight: '600' }}>Profile not found</p>
        <Link href="/" style={{ color: '#111', textDecoration: 'underline' }}>Go home</Link>
      </div>
    );
  }

  const isNew = (Date.now() - new Date(user.createdAt).getTime()) < 7 * 24 * 60 * 60 * 1000;
  const isTopRated = user.ratingAverage >= 4.5 && user.jobsCompleted >= 5;

  return (
    <main style={{
      minHeight: '100vh', backgroundColor: '#ffffff',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      color: '#111',
    }}>

      {/* Navbar */}
      <nav style={{
        padding: '0 32px', height: '60px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        borderBottom: '1px solid #f0f0f0', backgroundColor: '#fff',
      }}>
        <Link href="/" style={{ fontWeight: '700', fontSize: '17px', textDecoration: 'none', color: '#111' }}>
          UniTalent Bridge
        </Link>
        <Link href="/services" style={{ fontSize: '14px', color: '#555', textDecoration: 'none' }}>
          ← Back to Services
        </Link>
      </nav>

      <div style={{ maxWidth: '700px', margin: '0 auto', padding: '48px 24px' }}>

        {/* Profile Header */}
        <div style={{
          display: 'flex', gap: '24px', alignItems: 'flex-start',
          marginBottom: '40px', flexWrap: 'wrap',
        }}>
          <Avatar name={user.name} image={user.profileImage} size={80} />

          <div style={{ flex: 1, minWidth: '200px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '6px' }}>
              <h1 style={{ fontSize: '24px', fontWeight: '700', letterSpacing: '-0.3px' }}>
                {user.name}
              </h1>
              {isNew && (
                <span style={{
                  backgroundColor: '#f0fdf4', color: '#16a34a',
                  fontSize: '11px', fontWeight: '700', padding: '3px 10px',
                  borderRadius: '20px', letterSpacing: '0.5px',
                }}>
                  NEW ON CAMPUS
                </span>
              )}
              {!isNew && isTopRated && (
                <span style={{
                  backgroundColor: '#fffbeb', color: '#d97706',
                  fontSize: '11px', fontWeight: '700', padding: '3px 10px',
                  borderRadius: '20px', letterSpacing: '0.5px',
                }}>
                  TOP RATED
                </span>
              )}
            </div>

            <p style={{ fontSize: '14px', color: '#888', marginBottom: '10px' }}>
              {user.university}
            </p>

            {user.bio && (
              <p style={{ fontSize: '15px', color: '#444', lineHeight: '1.6', marginBottom: '12px' }}>
                {user.bio}
              </p>
            )}

            {/* Stats */}
            <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
              <div>
                <StarRating rating={user.ratingAverage} />
              </div>
              <div style={{ fontSize: '14px', color: '#555' }}>
                <strong>{user.jobsCompleted}</strong> jobs completed
              </div>
              <div style={{ fontSize: '14px', color: '#555' }}>
                <strong>{user.reviewsReceived.length}</strong> reviews
              </div>
            </div>
          </div>
        </div>

        <div style={{ borderTop: '1px solid #f0f0f0', marginBottom: '32px' }} />

        {/* Services */}
        {user.services.length > 0 && (
          <div style={{ marginBottom: '40px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '16px', letterSpacing: '-0.3px' }}>
              Services Offered
            </h2>
            <div style={{ display: 'grid', gap: '10px' }}>
              {user.services.filter(s => s.isActive).map(service => (
                <Link key={service.id} href={`/services/${service.id}`} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '14px 18px', border: '1px solid #ebebeb', borderRadius: '10px',
                  textDecoration: 'none', color: '#111',
                }}>
                  <div>
                    <div style={{ fontWeight: '600', fontSize: '15px', marginBottom: '2px' }}>
                      {service.title}
                    </div>
                    <div style={{ fontSize: '12px', color: '#888' }}>{service.category}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: '700', fontSize: '15px' }}>
                      {service.price.toLocaleString()} RWF
                    </div>
                    <div style={{ fontSize: '12px', color: '#aaa' }}>{service.priceUnit}</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Reviews */}
        {user.reviewsReceived.length > 0 && (
          <div>
            <h2 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '16px', letterSpacing: '-0.3px' }}>
              What students say
            </h2>
            <div style={{ display: 'grid', gap: '12px' }}>
              {user.reviewsReceived.map(review => (
                <div key={review.id} style={{
                  padding: '16px 18px', border: '1px solid #ebebeb',
                  borderRadius: '10px', backgroundColor: '#fafafa',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                    <Avatar name={review.reviewer.name} image={review.reviewer.profileImage} size={32} />
                    <div>
                      <div style={{ fontWeight: '600', fontSize: '13px' }}>{review.reviewer.name}</div>
                      <div style={{ color: '#f59e0b', fontSize: '12px' }}>
                        {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                      </div>
                    </div>
                  </div>
                  <p style={{ fontSize: '14px', color: '#444', lineHeight: '1.6', margin: 0 }}>
                    "{review.comment}"
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* No services yet */}
        {user.services.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px', color: '#aaa' }}>
            <p style={{ fontSize: '15px' }}>This student hasn't posted any services yet.</p>
          </div>
        )}

      </div>
    </main>
  );
}