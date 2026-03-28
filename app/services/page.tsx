'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

const CATEGORIES = [
  'Haircuts & Barbering', 'Sewing & Fashion', 'Tutoring',
  'Laptop & Tech Repair', 'Graphic Design', 'Photography',
  'Food & Catering', 'Music & Audio', 'Language Help', 'Other',
];

interface Service {
  id: string;
  title: string;
  category: string;
  price: number;
  priceUnit: string;
  location: string;
  createdAt: string;
  user: {
    id: string;
    name: string;
    profileImage: string | null;
    ratingAverage: number;
    jobsCompleted: number;
    createdAt: string;
  };
  _count: { reviews: number };
}

function StarRating({ rating }: { rating: number }) {
  const full = Math.round(rating);
  return (
    <span>
      <span style={{ color: '#f59e0b', fontSize: '13px' }}>
        {'★'.repeat(full)}{'☆'.repeat(5 - full)}
      </span>
      <span style={{ color: '#aaa', marginLeft: '5px', fontSize: '12px' }}>
        {rating > 0 ? rating.toFixed(1) : 'No reviews yet'}
      </span>
    </span>
  );
}

function Avatar({ name, image }: { name: string; image: string | null }) {
  if (image) {
    return <img src={image} alt={name} style={{ width: '44px', height: '44px', borderRadius: '50%', objectFit: 'cover' }} />;
  }
  const initials = name.split(' ').slice(0, 2).map(w => w[0]?.toUpperCase()).join('');
  return (
    <div style={{
      width: '44px', height: '44px', borderRadius: '50%',
      backgroundColor: '#f0f0f0', display: 'flex', alignItems: 'center',
      justifyContent: 'center', fontWeight: '700', fontSize: '14px', color: '#555',
      flexShrink: 0,
    }}>
      {initials}
    </div>
  );
}

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [sort, setSort] = useState('ranking');
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetchServices('');
  }, [category, sort]);

  async function fetchServices(q: string) {
    setLoading(true);
    const params = new URLSearchParams();
    if (q) params.set('search', q);
    if (category) params.set('category', category);
    params.set('sort', sort);
    const res = await fetch('/api/services?' + params.toString());
    const data = await res.json();
    setServices(data.data || []);
    setTotal(data.total || 0);
    setLoading(false);
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    fetchServices(search);
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
        <Link href="/" style={{ fontWeight: '700', fontSize: '17px', textDecoration: 'none', color: '#111', letterSpacing: '-0.3px' }}>
          UniTalent Bridge
        </Link>
        <div style={{ display: 'flex', gap: '24px', alignItems: 'center', fontSize: '14px' }}>
          <Link href="/services" style={{ color: '#111', textDecoration: 'none', fontWeight: '600' }}>Services</Link>
          <Link href="/requests" style={{ color: '#555', textDecoration: 'none' }}>Requests</Link>
          <Link href="/post-service" style={{
            backgroundColor: '#111', color: '#fff',
            padding: '8px 16px', borderRadius: '8px',
            textDecoration: 'none', fontSize: '13px', fontWeight: '500',
          }}>
            Post a Service
          </Link>
        </div>
      </nav>

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '48px 24px' }}>

        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: '700', letterSpacing: '-0.5px', marginBottom: '6px' }}>
            Student Services
          </h1>
          <p style={{ color: '#888', fontSize: '15px' }}>
            {total > 0 ? `${total} services available on campus` : 'Browse what students are offering'}
          </p>
        </div>

        {/* Search + Filters */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '36px', flexWrap: 'wrap' }}>
          <form onSubmit={handleSearch} style={{ display: 'flex', gap: '8px', flex: 1, minWidth: '220px' }}>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search services..."
              style={{
                flex: 1, padding: '10px 14px', fontSize: '14px',
                border: '1.5px solid #e0e0e0', borderRadius: '8px',
                outline: 'none', backgroundColor: '#fafafa', color: '#111',
              }}
            />
            <button type="submit" style={{
              backgroundColor: '#111', color: '#fff', border: 'none',
              padding: '10px 18px', borderRadius: '8px', fontSize: '14px',
              fontWeight: '500', cursor: 'pointer',
            }}>
              Search
            </button>
          </form>

          <select
            value={category}
            onChange={e => setCategory(e.target.value)}
            style={{
              padding: '10px 14px', fontSize: '14px',
              border: '1.5px solid #e0e0e0', borderRadius: '8px',
              backgroundColor: '#fafafa', color: '#111', outline: 'none', cursor: 'pointer',
            }}
          >
            <option value="">All Categories</option>
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>

          <select
            value={sort}
            onChange={e => setSort(e.target.value)}
            style={{
              padding: '10px 14px', fontSize: '14px',
              border: '1.5px solid #e0e0e0', borderRadius: '8px',
              backgroundColor: '#fafafa', color: '#111', outline: 'none', cursor: 'pointer',
            }}
          >
            <option value="ranking">Best Match</option>
            <option value="rating">Highest Rated</option>
            <option value="price_asc">Lowest Price</option>
            <option value="price_desc">Highest Price</option>
            <option value="newest">Newest</option>
          </select>
        </div>

        {/* Loading */}
        {loading && (
          <div style={{ textAlign: 'center', padding: '80px', color: '#aaa', fontSize: '15px' }}>
            Loading services...
          </div>
        )}

        {/* Empty state */}
        {!loading && services.length === 0 && (
          <div style={{ textAlign: 'center', padding: '80px 24px' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔍</div>
            <div style={{ fontSize: '20px', fontWeight: '600', marginBottom: '8px' }}>No services found</div>
            <div style={{ color: '#888', marginBottom: '28px', fontSize: '15px' }}>
              Try a different search or be the first to post one
            </div>
            <Link href="/post-service" style={{
              backgroundColor: '#111', color: '#fff',
              padding: '12px 24px', borderRadius: '8px',
              textDecoration: 'none', fontSize: '14px', fontWeight: '600',
            }}>
              Post a Service
            </Link>
          </div>
        )}

        {/* Service Cards */}
        <div style={{ display: 'grid', gap: '12px' }}>
          {services.map((service) => {
            const sevenDays = 7 * 24 * 60 * 60 * 1000;
            const isNew = (Date.now() - new Date(service.user.createdAt).getTime()) < sevenDays;
            const isTopRated = service.user.ratingAverage >= 4.5 && service.user.jobsCompleted >= 5;
            const isPopular = service.user.jobsCompleted >= 10;

            return (
              <div key={service.id} style={{
                border: '1px solid #ebebeb',
                borderRadius: '12px',
                padding: '20px 24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '16px',
                flexWrap: 'wrap',
                backgroundColor: '#fff',
              }}>

                {/* Left */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flex: 1, minWidth: '200px' }}>
                  <Avatar name={service.user.name} image={service.user.profileImage} />
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '3px' }}>
                      <span style={{ fontWeight: '600', fontSize: '15px' }}>{service.title}</span>
                      {isNew && (
                        <span style={{ backgroundColor: '#f0fdf4', color: '#16a34a', fontSize: '10px', fontWeight: '700', padding: '2px 8px', borderRadius: '20px' }}>
                          NEW
                        </span>
                      )}
                      {!isNew && isTopRated && (
                        <span style={{ backgroundColor: '#fffbeb', color: '#d97706', fontSize: '10px', fontWeight: '700', padding: '2px 8px', borderRadius: '20px' }}>
                          TOP RATED
                        </span>
                      )}
                      {!isNew && !isTopRated && isPopular && (
                        <span style={{ backgroundColor: '#faf5ff', color: '#7c3aed', fontSize: '10px', fontWeight: '700', padding: '2px 8px', borderRadius: '20px' }}>
                          POPULAR
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: '13px', color: '#888', marginBottom: '5px' }}>
                      by {service.user.name} · {service.category}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <StarRating rating={service.user.ratingAverage} />
                      <span style={{ fontSize: '12px', color: '#bbb' }}>
                        · {service.user.jobsCompleted} jobs · {service._count.reviews} reviews
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '18px', fontWeight: '700' }}>
                      {service.price.toLocaleString()} RWF
                    </div>
                    <div style={{ fontSize: '12px', color: '#aaa' }}>{service.priceUnit}</div>
                  </div>
                  <Link href={`/services/${service.id}`} style={{
                    backgroundColor: '#111', color: '#fff',
                    padding: '10px 20px', borderRadius: '8px',
                    textDecoration: 'none', fontSize: '13px',
                    fontWeight: '600', whiteSpace: 'nowrap',
                  }}>
                    View Profile
                  </Link>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </main>
  );
}