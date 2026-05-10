// SERVER COMPONENT - Data fetching tim dilakukan di server
import Link from 'next/link'
import Image from 'next/image'
import styles from './about.module.css'

async function getTeam() {
  const data = await import('@/data/team.json')
  return data.default
}

export const metadata = {
  title: 'Tentang Kami – KosKu',
  description: 'Kenali lebih dekat tim dan visi di balik platform KosKu.',
}

export default async function AboutPage() {
  const team = await getTeam()

  return (
    <>
      {/* PAGE HERO */}
      <div className="page-hero">
        <div className="container">
          <div className="section-label">✦ Tentang Kami</div>
          <h1>Kami Hadir untuk<br />Memudahkan Hidupmu</h1>
          <p>KosKu lahir dari keresahan mahasiswa yang kesulitan mencari kos yang tepat. Kami membangun solusi yang sederhana, transparan, dan terpercaya.</p>
        </div>
      </div>

      {/* STORY */}
      <section>
        <div className={`container ${styles.storyGrid}`}>
          <div>
            <div className="section-label">✦ Cerita Kami</div>
            <h2 className="section-title">Dari Masalah Nyata,<br />Lahir Solusi Nyata</h2>
            <p className={styles.storyText}>
              Tahun 2024, Davit Zarly — seorang mahasiswa Informatika di Universitas Negeri Padang —
              mengalami betapa sulitnya mencari kos yang sesuai saat hendak magang di Yogyakarta.
              Informasi tersebar, foto tidak akurat, dan proses negosiasi yang panjang.
            </p>
            <p className={styles.storyText}>
              Dari keresahan itu, KosKu lahir. Platform yang menggabungkan teknologi modern dengan
              pengalaman pengguna yang sederhana — misi kami: setiap orang berhak menemukan
              tempat tinggal yang nyaman dengan mudah.
            </p>
            <div className={styles.storyStats}>
              {[
                { value: '2024', label: 'Didirikan' },
                { value: '12K+', label: 'Listing Aktif' },
                { value: '50+', label: 'Kota' },
              ].map((s) => (
                <div key={s.label} className={styles.storyStat}>
                  <strong>{s.value}</strong>
                  <span>{s.label}</span>
                </div>
              ))}
            </div>
          </div>
          <div className={styles.storyVisual}>
            <div className={styles.storyCard}>
              <div className={styles.scIcon}>🏠</div>
              <h3>Visi Kami</h3>
              <p>Menjadi platform pencarian hunian #1 di Indonesia yang paling dipercaya dan mudah digunakan.</p>
            </div>
            <div className={styles.storyCard}>
              <div className={styles.scIcon}>🎯</div>
              <h3>Misi Kami</h3>
              <p>Menghubungkan pencari kos dengan pemilik properti secara transparan, cepat, dan aman.</p>
            </div>
            <div className={styles.storyCard}>
              <div className={styles.scIcon}>💡</div>
              <h3>Nilai Kami</h3>
              <p>Kejujuran, inovasi, dan kepedulian terhadap pengalaman pengguna di setiap langkah.</p>
            </div>
          </div>
        </div>
      </section>

      {/* TIM */}
      <section style={{ background: '#F9FAFB' }}>
        <div className="container">
          <div className="section-label">✦ Tim Kami</div>
          <h2 className="section-title">Kenalan dengan Tim KosKu</h2>
          <p className="section-sub">Tim kecil yang berdedikasi besar — kami bekerja keras setiap hari untuk menghadirkan pengalaman terbaik bagimu.</p>
          <div className={styles.teamGrid}>
            {team.map((member) => (
              <Link key={member.id} href={`/team/${member.id}`} className={styles.teamCard}>
                <Image
                  src={member.avatar}
                  alt={member.name}
                  width={96}
                  height={96}
                  className={styles.avatar}
                  unoptimized
                />
                <div className={styles.memberInfo}>
                  <strong>{member.name}</strong>
                  <span className={styles.role}>{member.role}</span>
                  <p className={styles.bio}>{member.bio.substring(0, 80)}...</p>
                  <div className={styles.skills}>
                    {member.skills.map((s) => (
                      <span key={s} className={styles.skillTag}>{s}</span>
                    ))}
                  </div>
                  <span className={styles.viewDetail}>Lihat Profil →</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
