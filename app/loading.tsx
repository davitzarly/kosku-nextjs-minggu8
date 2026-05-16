export default function Loading() {
  return (
    <section className="site-loading" aria-label="Memuat halaman">
      <div className="container site-loading__inner">
        <div className="site-loading__copy">
          <span className="site-loading__eyebrow" />
          <strong className="site-loading__title" />
          <p className="site-loading__line" />
          <p className="site-loading__line site-loading__line--short" />
        </div>

        <div className="site-loading__grid" aria-hidden="true">
          {[0, 1, 2].map((item) => (
            <div key={item} className="site-loading__card">
              <span />
              <strong />
              <p />
              <p />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
