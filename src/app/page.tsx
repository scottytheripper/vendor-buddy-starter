import Link from "next/link";

export default function Home() {
  return (
    <main className="grid" style={{gap: 20}}>
      <section className="card">
        <h2>Decide if an event is worth it — with real vendor data</h2>
        <p>Upload results from events you've worked, and see aggregated reports from other vendors. Earn credits by sharing; spend credits to unlock insights.</p>
        <div style={{display: 'flex', gap: 12}}>
          <Link href="/dashboard"><button>Open Dashboard</button></Link>
          <Link href="/upload"><button>Upload CSV</button></Link>
        </div>
      </section>
      <section className="grid grid-2">
        <div className="stat">
          <span className="label">Vendors</span>
          <span className="value">1 (demo)</span>
        </div>
        <div className="stat">
          <span className="label">Events</span>
          <span className="value">1 (seed)</span>
        </div>
      </section>
      <section className="card">
        <h3>CSV upload format</h3>
        <p>Include a header row with: <code>eventName, grossRevenue, feesPaid, hours, date, notes</code></p>
      </section>
    </main>
  );
}
