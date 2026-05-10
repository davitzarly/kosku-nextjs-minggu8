// SERVER COMPONENT (default - tidak perlu 'use client')
// Data fetching dilakukan langsung di server menggunakan async/await

import Link from 'next/link'
import Image from 'next/image'
import styles from './page.module.css'
import ContactForm from '@/components/ContactForm'

// Ambil data tim dari file JSON lokal (simulasi data fetching)
async function getTeamData() {
  // Dalam production: bisa fetch dari API eksternal
  // fetch('https://api.kosku.id/team', { next: { revalidate: 3600 } })
  const data = await import('@/data/team.json')
  return data.default
}

export default async function HomePage() {
  // Data fetching di Server Component - aman, tidak expose ke client
  const team = await getTeamData()

  return (
    <>
      {/* ===== HERO SECTION ===== */}
      <section className={styles.hero}>
        <div className={styles.heroBg}></div>
        <div className={`container ${styles.heroInner}`}>
          <div className={styles.heroText}>
            <div className="badge">🏠 Platform Kos #1 di Indonesia</div>
            <h1 className={styles.heroTitle}>
              Temukan Kos<br />
              <em className={styles.accent}>Impianmu</em> dengan<br />
              Mudah & Cepat
            </h1>
            <p className={styles.heroSub}>
              KosKu menghubungkan pencari kos dengan ribuan properti terpercaya
              di seluruh Indonesia — dari Yogyakarta hingga Jakarta, semua ada di satu platform.
            </p>
            <div className={styles.heroActions}>
              <Link href="/services" className="btn-primary">Lihat Layanan Kami</Link>
              <Link href="/about" className={styles.btnGhost}>Tentang KosKu →</Link>
            </div>

            {/* Stats */}
            <div className={styles.stats}>
              {[
                { value: '12.000+', label: 'Properti Aktif' },
                { value: '50 Kota', label: 'Se-Indonesia' },
                { value: '4.8★', label: 'Rating Pengguna' },
              ].map((stat, i) => (
                <div key={i} className={styles.statItem}>
                  <strong>{stat.value}</strong>
                  <span>{stat.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Visual Card */}
          <div className={styles.heroVisual}>
            <div className={styles.visualCard}>
              <div className={styles.vcHeader}>
                <span>📍 Yogyakarta, ID</span>
                <span className={styles.vcLive}>● Live</span>
              </div>
              <div className={styles.vcSearch}>🔍 Cari kos di dekatmu...</div>
              <div className={styles.vcBanner}>
                <div>
                  <div className={styles.vcBannerTitle}>CASHBACK 20%</div>
                  <div className={styles.vcBannerSub}>*Berlaku hingga 25 Sep 2025</div>
                </div>
                <span style={{ fontSize: '2rem' }}>🎉</span>
              </div>
              <div className={styles.vcSection}>Direkomendasikan</div>
              {[
                { name: 'Ayana Homestay', loc: 'Imogiri, Yogyakarta', price: '2.000.000', rating: '4.9', color: '#bbf7d0' },
                { name: 'Maharani Villa', loc: 'Bendungan Hilir, Jakarta', price: '2.000.000', rating: '4.5', color: '#fde68a' },
                { name: 'Apartemen Land House', loc: 'Jl. Tentara Pelajar', price: '1.800.000', rating: '4.7', color: '#c4b5fd' },
              ].map((item, i) => (
                <div key={i} className={styles.vcItem}>
                  <div className={styles.vcThumb} style={{ background: `linear-gradient(135deg, ${item.color}, ${item.color}99)` }}></div>
                  <div className={styles.vcInfo}>
                    <div className={styles.vcName}>{item.name}</div>
                    <div className={styles.vcLoc}>📍 {item.loc}</div>
                  </div>
                  <div className={styles.vcRight}>
                    <div className={styles.vcPrice}>Rp {item.price}</div>
                    <div className={styles.vcRating}>⭐ {item.rating}</div>
                  </div>
                </div>
              ))}
            </div>
            {/* Floating badges */}
            <div className={`${styles.floatBadge} ${styles.fb1}`}>🏆 Top Rated</div>
            <div className={`${styles.floatBadge} ${styles.fb2}`}>🔔 Kos Baru!</div>
          </div>
        </div>
      </section>

      {/* ===== FITUR SECTION ===== */}
      <section className={styles.features}>
        <div className="container">
          <div className="section-label">✦ Kenapa KosKu?</div>
          <h2 className="section-title">Semua yang Kamu Butuhkan<br />Ada di KosKu</h2>
          <div className={styles.featGrid}>
            {[
              { icon: '🗺️', title: 'Pencarian Lokasi', desc: 'Temukan kos terdekat dari kampus atau kantor dengan teknologi geolokasi.' },
              { icon: '❤️', title: 'Simpan Favorit', desc: 'Tandai kos favorit dan bandingkan kapan saja di semua perangkatmu.', accent: true },
              { icon: '⭐', title: 'Ulasan Jujur', desc: 'Ribuan ulasan terverifikasi dari penghuni nyata, tanpa manipulasi.' },
              { icon: '🔔', title: 'Notifikasi Instan', desc: 'Alert saat kos baru muncul atau harga turun di area pilihanmu.' },
              { icon: '💳', title: 'Bayar Aman', desc: 'Pembayaran sewa langsung via platform dengan berbagai metode.' },
              { icon: '📋', title: 'Kelola Kontrak', desc: 'Semua kontrak dan riwayat pembayaran dalam satu dashboard rapi.' },
            ].map((f, i) => (
              <div key={i} className={`${styles.featCard} ${f.accent ? styles.featAccent : ''}`}>
                <div className={styles.featIcon}>{f.icon}</div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
            <Link href="/services" className="btn-outline">Lihat Semua Layanan →</Link>
          </div>
        </div>
      </section>

      {/* ===== TIM SECTION (data dari server) ===== */}
      <section className={styles.teamSection}>
        <div className="container">
          <div className="section-label">✦ Tim Kami</div>
          <h2 className="section-title">Orang-orang di Balik KosKu</h2>
          <div className={styles.teamGrid}>
            {team.map((member) => (
              <Link key={member.id} href={`/team/${member.id}`} className={styles.teamCard}>
                <Image
                  src={member.avatar}
                  alt={member.name}
                  width={88}
                  height={88}
                  className={styles.teamAvatar}
                  unoptimized
                />
                <strong>{member.name}</strong>
                <span>{member.role}</span>
                <div className={styles.teamSkills}>
                  {member.skills.slice(0, 2).map((s) => (
                    <span key={s} className={styles.skillTag}>{s}</span>
                  ))}
                </div>
              </Link>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <Link href="/about" className="btn-outline">Kenalan dengan Tim →</Link>
          </div>
        </div>
      </section>

      {/* ===== CTA SECTION ===== */}
      <section className={styles.ctaSection}>
        <div className="container">
          <h2>Siap Temukan Kos Impianmu?</h2>
          <p>Daftar gratis dan eksplorasi ribuan kos terbaik di kotamu.</p>
          <Link href="/contact" className="btn-primary" style={{ background: '#fff', color: '#1A9547' }}>
            Hubungi Kami Sekarang
          </Link>
        </div>
      </section>
    </>
  )
}
