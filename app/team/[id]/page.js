// DYNAMIC ROUTE: app/team/[id]/page.js
// URL: /team/1, /team/2, /team/3, /team/4
// Parameter [id] diambil dari folder name dalam kurung siku

import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import styles from './team-detail.module.css'

// Fungsi ini memberitahu Next.js halaman mana yang perlu di-generate saat build
export async function generateStaticParams() {
  const data = await import('@/data/team.json')
  return data.default.map((member) => ({ id: member.id }))
}

// generateMetadata untuk SEO dinamis berdasarkan [id]
export async function generateMetadata({ params }) {
  const data = await import('@/data/team.json')
  const member = data.default.find((m) => m.id === params.id)
  if (!member) return { title: 'Not Found' }
  return {
    title: `${member.name} – Tim KosKu`,
    description: member.bio,
  }
}

// SERVER COMPONENT - data fetching di server berdasarkan params.id
export default async function TeamDetailPage({ params }) {
  const data = await import('@/data/team.json')
  const member = data.default.find((m) => m.id === params.id)
  const allMembers = data.default.filter((m) => m.id !== params.id)

  // Jika ID tidak ditemukan, tampilkan 404
  if (!member) notFound()

  return (
    <>
      {/* HEADER */}
      <div className={styles.profileHero}>
        <div className="container">
          <Link href="/about" className={styles.backBtn}>← Kembali ke Tim</Link>
          <div className={styles.profileCard}>
            <Image
              src={member.avatar}
              alt={member.name}
              width={140}
              height={140}
              className={styles.avatar}
              unoptimized
            />
            <div className={styles.profileInfo}>
              <div className="badge">👤 Anggota Tim</div>
              <h1>{member.name}</h1>
              <p className={styles.role}>{member.role}</p>
              <p className={styles.bio}>{member.bio}</p>
              <div className={styles.skills}>
                {member.skills.map((s) => (
                  <span key={s} className={styles.skillTag}>{s}</span>
                ))}
              </div>
              <div className={styles.socials}>
                <a href={`https://instagram.com/${member.instagram.replace('@', '')}`} target="_blank" rel="noopener noreferrer">
                  📸 {member.instagram}
                </a>
                <a href={`https://github.com/${member.github}`} target="_blank" rel="noopener noreferrer">
                  🐙 {member.github}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ANGGOTA LAIN */}
      <section>
        <div className="container">
          <div className="section-label">✦ Tim Lainnya</div>
          <h2 className="section-title">Kenalan dengan yang Lain</h2>
          <div className={styles.otherGrid}>
            {allMembers.map((m) => (
              <Link key={m.id} href={`/team/${m.id}`} className={styles.otherCard}>
                <Image
                  src={m.avatar}
                  alt={m.name}
                  width={60}
                  height={60}
                  className={styles.otherAvatar}
                  unoptimized
                />
                <strong>{m.name}</strong>
                <span>{m.role}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
