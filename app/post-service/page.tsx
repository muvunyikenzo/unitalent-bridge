'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const CATEGORIES = [
  'Haircuts & Barbering',
  'Sewing & Fashion',
  'Tutoring',
  'Laptop & Tech Repair',
  'Graphic Design',
  'Photography',
  'Food & Catering',
  'Music & Audio',
  'Language Help',
  'Other',
];

export default function PostServicePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    title: '',
    category: '',
    description: '',
    price: '',
    priceUnit: 'per session',
    location: '',
  });

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          price: parseInt(form.price),
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'Something went wrong.');
        setLoading(false);
        return;
      }

      router.push('/services');
    } catch {
      setError('Failed to post service. Please try again.');
      setLoading(false);
    }
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
        borderBottom: '1px solid #f0f0f0', backgroundColor: '#fff',
      }}>
        <Link href="/" style={{ fontWeight: '700', fontSize: '17px', textDecoration: 'none', color: '#111' }}>
          UniTalent Bridge
        </Link>
        <Link href="/services" style={{ fontSize: '14px', color: '#555', textDecoration: 'none' }}>
          ← Back to Services
        </Link>
      </nav>

      <div style={{ maxWidth: '580px', margin: '0 auto', padding: '48px 24px' }}>

        {/* Header */}
        <div style={{ marginBottom: '40px' }}>
          <div style={{
            display: 'inline-block',
            backgroundColor: '#f0fdf4', color: '#16a34a',
            fontSize: '12px', fontWeight: '700', padding: '4px 12px',
            borderRadius: '20px', marginBottom: '16px', letterSpacing: '0.5px',
          }}>
            SHARE YOUR GIFT
          </div>
          <h1 style={{
            fontSize: '30px', fontWeight: '700',
            letterSpacing: '-0.5px', marginBottom: '8px',
          }}>
            What can you do for your campus?
          </h1>
          <p style={{ color: '#888', fontSize: '15px', lineHeight: '1.6' }}>
            Hundreds of students need exactly what you offer.
            Post your service and start getting clients today.
          </p>
        </div>

        {/* Error */}
        {error && (
          <div style={{
            backgroundColor: '#fef2f2', border: '1px solid #fecaca',
            color: '#dc2626', padding: '12px 16px', borderRadius: '8px',
            fontSize: '14px', marginBottom: '24px',
          }}>
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>

          {/* Title */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>
              Service Title *
            </label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="e.g. Professional Haircuts & Fades"
              required
              style={{
                width: '100%', padding: '11px 14px', fontSize: '15px',
                border: '1.5px solid #e0e0e0', borderRadius: '8px',
                outline: 'none', color: '#111', backgroundColor: '#fafafa',
                boxSizing: 'border-box',
              }}
            />
          </div>

          {/* Category */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>
              Category *
            </label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              required
              style={{
                width: '100%', padding: '11px 14px', fontSize: '15px',
                border: '1.5px solid #e0e0e0', borderRadius: '8px',
                outline: 'none', color: '#111', backgroundColor: '#fafafa',
                boxSizing: 'border-box', cursor: 'pointer',
              }}
            >
              <option value="">Select a category</option>
              {CATEGORIES.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>
              Description *
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Describe what you offer, your experience, and what makes you great. Be specific — students trust detail."
              required
              rows={5}
              style={{
                width: '100%', padding: '11px 14px', fontSize: '15px',
                border: '1.5px solid #e0e0e0', borderRadius: '8px',
                outline: 'none', color: '#111', backgroundColor: '#fafafa',
                boxSizing: 'border-box', resize: 'vertical', lineHeight: '1.6',
              }}
            />
          </div>

          {/* Price */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>
                Price (RWF) *
              </label>
              <input
                name="price"
                type="number"
                value={form.price}
                onChange={handleChange}
                placeholder="e.g. 3000"
                required
                min="0"
                style={{
                  width: '100%', padding: '11px 14px', fontSize: '15px',
                  border: '1.5px solid #e0e0e0', borderRadius: '8px',
                  outline: 'none', color: '#111', backgroundColor: '#fafafa',
                  boxSizing: 'border-box',
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>
                Price Unit
              </label>
              <select
                name="priceUnit"
                value={form.priceUnit}
                onChange={handleChange}
                style={{
                  width: '100%', padding: '11px 14px', fontSize: '15px',
                  border: '1.5px solid #e0e0e0', borderRadius: '8px',
                  outline: 'none', color: '#111', backgroundColor: '#fafafa',
                  boxSizing: 'border-box', cursor: 'pointer',
                }}
              >
                <option value="per session">per session</option>
                <option value="per hour">per hour</option>
                <option value="per piece">per piece</option>
                <option value="per project">per project</option>
                <option value="per day">per day</option>
              </select>
            </div>
          </div>

          {/* Location */}
          <div style={{ marginBottom: '32px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>
              Location on Campus
            </label>
            <input
              name="location"
              value={form.location}
              onChange={handleChange}
              placeholder="e.g. Gikondo Campus, Male Hostels, Library, Online"
              style={{
                width: '100%', padding: '11px 14px', fontSize: '15px',
                border: '1.5px solid #e0e0e0', borderRadius: '8px',
                outline: 'none', color: '#111', backgroundColor: '#fafafa',
                boxSizing: 'border-box',
              }}
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%', padding: '14px',
              backgroundColor: loading ? '#999' : '#111',
              color: '#fff', border: 'none', borderRadius: '10px',
              fontSize: '15px', fontWeight: '700',
              cursor: loading ? 'not-allowed' : 'pointer',
              marginBottom: '12px',
            }}
          >
            {loading ? 'Posting your service...' : 'Share My Gift with Campus →'}
          </button>

          <p style={{ textAlign: 'center', fontSize: '13px', color: '#aaa' }}>
            Your service will be visible to all students immediately.
            New providers get a 7-day visibility boost. 🚀
          </p>

        </form>
      </div>
    </main>
  );
}