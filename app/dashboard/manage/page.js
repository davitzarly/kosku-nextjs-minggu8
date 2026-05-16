import { logoutAdmin } from '@/app/login/actions'
import { getKosProperties } from '@/lib/supabaseKos'
import DashboardClient from '../DashboardClient'
import styles from '../dashboard.module.css'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Kelola Kos - KosKu',
  description: 'Tambah, ubah, dan hapus card kos KosKu.',
}

export default async function ManageDashboardPage({ searchParams }) {
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
            <div className="section-label">Admin KosKu</div>
            <h1>Kelola Card Kos</h1>
            <p>Tambahkan, ubah, atau hapus card kos yang tampil di katalog publik.</p>
          </div>

          <form action={logoutAdmin}>
            <button type="submit" className={styles.logoutButton}>
              Logout
            </button>
          </form>
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
          canManage
          showCheckout={false}
        />
      </div>
    </section>
  )
}
