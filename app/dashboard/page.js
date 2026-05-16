import { getKosProperties } from '@/lib/supabaseKos'
import DashboardClient from './DashboardClient'
import styles from './dashboard.module.css'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Daftar Kos - KosKu',
  description: 'Daftar kos tersedia di KosKu.',
}

export default async function DashboardPage({ searchParams }) {
  const query = typeof searchParams?.q === 'string' ? searchParams.q : ''
  let properties = []
  let allProperties = []
  let setupError = ''

  try {
    const results = await Promise.all([
      getKosProperties(query),
      getKosProperties(),
    ])
    properties = results[0]
    allProperties = results[1]
  } catch (error) {
    setupError =
      error?.message ||
      'Dashboard belum bisa mengambil data Supabase. Jalankan SQL supabase/kos_properties.sql terlebih dahulu.'
  }

  return (
    <section className={styles.dashboard}>
      <div className={`container ${styles.shell}`}>
        <header className={styles.header}>
          <div>
            <div className="section-label">Katalog KosKu</div>
            <h1>Daftar Kos Tersedia</h1>
            <p>Pilih kos dari card properti, lihat detail singkat, lalu checkout dengan QRIS.</p>
          </div>
        </header>

        <div className={styles.summaryGrid}>
          <div className={styles.summaryItem}>
            <span>Total Properti</span>
            <strong>{allProperties.length}</strong>
          </div>
          <div className={styles.summaryItem}>
            <span>Tersedia</span>
            <strong>{allProperties.filter((property) => property.availability === 'Tersedia').length}</strong>
          </div>
          <div className={styles.summaryItem}>
            <span>Terbatas</span>
            <strong>{allProperties.filter((property) => property.availability === 'Terbatas').length}</strong>
          </div>
        </div>

        {setupError && (
          <div className={styles.setupAlert} role="alert">
            <strong>Data Supabase belum siap</strong>
            <p>{setupError}</p>
            <p>Jalankan file supabase/kos_properties.sql di SQL Editor Supabase.</p>
          </div>
        )}

        <DashboardClient
          initialProperties={properties}
          initialQuery={query}
          totalCount={allProperties.length}
          canManage={false}
          showCheckout
        />
      </div>
    </section>
  )
}
