'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

const CATEGORIES = [
  'Haircuts & Barbering', 'Sewing & Fashion', 'Tutoring',
  'Laptop & Tech Repair', 'Graphic Design', 'Photography',
  'Food & Catering', 'Music & Audio', 'Language Help', 'Other',
];

interface Request {
  id: string;
  title: string;
  category: string | null;
  description: string;
  budget: number | null;
  deadline: string | null;
  responsesCount: number;
  createdAt: string;
  user: {
    id: string;
    name: string;
    profileImage: string | null;
  };
}

function timeAgo(date: string): string {
  const diff = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

function Avatar({ name, image }: { name: string; image: string | null }) {
  if (image) {
    return <img src={image} alt={name} style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }} />;
  }
  const initials = name.split(' ').slice(0, 2).map(w => w[0]?.toUpperCase()).join('');
  return (
    <div style={{
      width: '36px', height: '36px', borderRadius: '50%',
      backgroundColor: '#f0f0f0', display: 'flex', alignItems: 'center',
      justifyContent: 'center', fontWeight: '700', fontSize: '13px',
      color: '#555', flexShrink: 0,
    }}>
      {initials}
    </div>
  );
}

export default function RequestsPage() {
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('');
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetchRequests();
  }, [category]);

  async function fetchRequests() {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (category) params.set('category', category);
      const res = await fetch('/api/requests?' + params.toString());
      const data = await res.json();
      setRequests(data.data || []);
      setTotal(data.total || 0);
    } catch {
      setRequests([]);
    }
    setLoading(false);
  }

  return (
    <main style={{
      minHeight: '100vh',
      backgroundColor: '#ffffff',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      color: '#111',
    }}>

      {/* Navbar */}
      <nav style={{
        padding: '0 32px', height: '60px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        borderBottom: '1px solid #f0f0f0', position: 'sticky', top: 0,
        backgroundColor: '#fff', zIndex: 100,
      }}>
        <Link href="/" style={{ fontWeight: '700', fontSize: '17px', textDecoration: 'none', color: '#111' }}>
          UniTalent Bridge
        </Link>
        <div style={{ display: 'flex', gap: '24px', alignItems: 'center', fontSize: '14px' }}>
          <Link href="/services" style={{ color: '#555', textDecoration: 'none' }}>Services</Link>
          <Link href="/requests" style={{ color: '#111', textDecoration: 'none', fontWeight: '600' }}>Requests</Link>
          <Link href="/post-request" style={{
            backgroundColor: '#111', color: '#fff',
            padding: '8px 16px', borderRadius: '8px',
            textDecoration: 'none', fontSize: '13px', fontWeight: '500',
          }}>
            Post a Request
          </Link>
        </div>
      </nav>

      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '48px 24px' }}>

        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: '700', letterSpacing: '-0.5px', marginBottom: '6px' }}>
            Student Requests
          </h1>
          <p style={{ color: '#888', fontSize: '15px' }}>
            {total > 0 ? `${total} students looking for help right now` : 'Students posting what they need'}
          </p>
        </div>

        {/* Filter */}
        <div style={{ marginBottom: '32px' }}>
          <select
            value={category}
            onChange={e => setCategory(e.target.value)}
            style={{
              padding: '10px 14px', fontSize: '14px',
              border: '1.5px solid #e0e0e0', borderRadius: '8px',
              backgroundColor: '#fafafa', color: '#111',
              outline: 'none', cursor: 'pointer',
            }}
          >
            <option value="">All Categories</option>
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        {/* Loading */}
        {loading && (
          <div style={{ textAlign: 'center', padding: '80px', color: '#aaa' }}>
            Loading requests...
          </div>
        )}

        {/* Empty */}
        {!loading && requests.length === 0 && (
          <div style={{ textAlign: 'center', padding: '80px 24px' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>📋</div>
            <div style={{ fontSize: '20px', fontWeight: '600', marginBottom: '8px' }}>No requests yet</div>
            <div style={{ color: '#888', marginBottom: '28px', fontSize: '15px' }}>
              Be the first to post what you need
            </div>
            <Link href="/post-request" style={{
              backgroundColor: '#111', color: '#fff',
              padding: '12px 24px', borderRadius: '8px',
              textDecoration: 'none', fontSize: '14px', fontWeight: '600',
            }}>
              Post a Request
            </Link>
          </div>
        )}

        {/* Request Cards */}
        <div style={{ display: 'grid', gap: '12px' }}>
          {requests.map((request) => (
            <div key={request.id} style={{
              border: '1px solid #ebebeb',
              borderRadius: '12px',
              padding: '20px 24px',
              backgroundColor: '#fff',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px', flexWrap: 'wrap' }}>

                {/* Left */}
                <div style={{ flex: 1, minWidth: '200px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                    <Avatar name={request.user.name} image={request.user.profileImage} />
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: '600', color: '#111' }}>
                        {request.user.name}
                      </div>
                      <div style={{ fontSize: '12px', color: '#aaa' }}>
                        {timeAgo(request.createdAt)}
                      </div>
                    </div>
                  </div>

                  <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '6px', color: '#111' }}>
                    {request.title}
                  </h3>

                  <p style={{ fontSize: '14px', color: '#666', lineHeight: '1.5', marginBottom: '12px' }}>
                    {request.description.length > 120
                      ? request.description.slice(0, 120) + '...'
                      : request.description}
                  </p>

                  <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                    {request.budget && (
                      <span style={{ fontSize: '13px', color: '#374151', fontWeight: '600' }}>
                        💰 Budget: {request.budget.toLocaleString()} RWF
                      </span>
                    )}
                    {request.deadline && (
                      <span style={{ fontSize: '13px', color: '#374151' }}>
                        📅 By {new Date(request.deadline).toLocaleDateString('en-RW', { month: 'short', day: 'numeric' })}
                      </span>
                    )}
                    {request.category && (
                      <span style={{
                        fontSize: '11px', fontWeight: '600',
                        backgroundColor: '#f5f5f5', color: '#555',
                        padding: '3px 10px', borderRadius: '20px',
                      }}>
                        {request.category}
                      </span>
                    )}
                  </div>
                </div>

                {/* Right */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
                  <div style={{ fontSize: '12px', color: '#aaa' }}>
                    {request.responsesCount} response{request.responsesCount !== 1 ? 's' : ''}
                  </div>
                  <Link href={`/services`} style={{
                    backgroundColor: '#111', color: '#fff',
                    padding: '10px 20px', borderRadius: '8px',
                    textDecoration: 'none', fontSize: '13px',
                    fontWeight: '600', whiteSpace: 'nowrap',
                  }}>
                    I Can Help →
                  </Link>
                </div>

              </div>
            </div>
          ))}
        </div>

      </div>
    </main>
  );
}