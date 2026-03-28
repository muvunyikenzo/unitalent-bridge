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

export default function PostRequestPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    title: '',
    category: '',
    description: '',
    budget: '',
    deadline: '',
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
      const res = await fetch('/api/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          budget: form.budget ? parseInt(form.budget) : null,
          deadline: form.deadline || null,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'Something went wrong.');
        setLoading(false);
        return;
      }

      router.push('/requests');
    } catch {
      setError('Failed to post request. Please try again.');
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
        <Link href="/requests" style={{ fontSize: '14px', color: '#555', textDecoration: 'none' }}>
          ← Back to Requests
        </Link>
      </nav>

      <div style={{ maxWidth: '580px', margin: '0 auto', padding: '48px 24px' }}>

        {/* Header */}
        <div style={{ marginBottom: '40px' }}>
          <div style={{
            display: 'inline-block',
            backgroundColor: '#eff6ff', color: '#2563eb',
            fontSize: '12px', fontWeight: '700', padding: '4px 12px',
            borderRadius: '20px', marginBottom: '16px', letterSpacing: '0.5px',
          }}>
            GET HELP FROM CAMPUS
          </div>
          <h1 style={{
            fontSize: '30px', fontWeight: '700',
            letterSpacing: '-0.5px', marginBottom: '8px',
          }}>
            What do you need help with?
          </h1>
          <p style={{ color: '#888', fontSize: '15px', lineHeight: '1.6' }}>
            Post your request and let talented students come to you.
            Most requests get responses within hours.
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
            <label style={{
              display: 'block', fontSize: '13px',
              fontWeight: '600', color: '#374151', marginBottom: '6px',
            }}>
              What do you need? *
            </label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="e.g. Need someone to fix my laptop keyboard"
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
            <label style={{
              display: 'block', fontSize: '13px',
              fontWeight: '600', color: '#374151', marginBottom: '6px',
            }}>
              Category
            </label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              style={{
                width: '100%', padding: '11px 14px', fontSize: '15px',
                border: '1.5px solid #e0e0e0', borderRadius: '8px',
                outline: 'none', color: '#111', backgroundColor: '#fafafa',
                boxSizing: 'border-box', cursor: 'pointer',
              }}
            >
              <option value="">Select a category (optional)</option>
              {CATEGORIES.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block', fontSize: '13px',
              fontWeight: '600', color: '#374151', marginBottom: '6px',
            }}>
              More details *
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Give more details about what you need. The more specific you are, the better responses you'll get."
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

          {/* Budget + Deadline */}
          <div style={{
            display: 'grid', gridTemplateColumns: '1fr 1fr',
            gap: '12px', marginBottom: '32px',
          }}>
            <div>
              <label style={{
                display: 'block', fontSize: '13px',
                fontWeight: '600', color: '#374151', marginBottom: '6px',
              }}>
                Budget (RWF)
              </label>
              <input
                name="budget"
                type="number"
                value={form.budget}
                onChange={handleChange}
                placeholder="e.g. 5000"
                min="0"
                style={{
                  width: '100%', padding: '11px 14px', fontSize: '15px',
                  border: '1.5px solid #e0e0e0', borderRadius: '8px',
                  outline: 'none', color: '#111', backgroundColor: '#fafafa',
                  boxSizing: 'border-box',
                }}
              />
              <p style={{ fontSize: '11px', color: '#aaa', marginTop: '4px' }}>
                Leave blank if flexible
              </p>
            </div>
            <div>
              <label style={{
                display: 'block', fontSize: '13px',
                fontWeight: '600', color: '#374151', marginBottom: '6px',
              }}>
                Deadline
              </label>
              <input
                name="deadline"
                type="date"
                value={form.deadline}
                onChange={handleChange}
                style={{
                  width: '100%', padding: '11px 14px', fontSize: '15px',
                  border: '1.5px solid #e0e0e0', borderRadius: '8px',
                  outline: 'none', color: '#111', backgroundColor: '#fafafa',
                  boxSizing: 'border-box', cursor: 'pointer',
                }}
              />
              <p style={{ fontSize: '11px', color: '#aaa', marginTop: '4px' }}>
                Leave blank if flexible
              </p>
            </div>
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
            {loading ? 'Posting your request...' : 'Post My Request →'}
          </button>

          <p style={{ textAlign: 'center', fontSize: '13px', color: '#aaa' }}>
            Your request is visible to all students on campus.
            Expect responses within a few hours. 💬
          </p>

        </form>
      </div>
    </main>
  );
}