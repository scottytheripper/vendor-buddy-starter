export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

import { prisma } from "../../lib/db";

async function getStats() {
  try {
    const [eventCount, reportCount] = await Promise.all([
      prisma.event.count(),
      prisma.report.count(),
    ]);

    const totals = await prisma.report.groupBy({
      by: ["eventId"],
      _sum: { grossRevenue: true, feesPaid: true, hoursWorked: true },
      _count: { _all: true },
    });

    const rows = await Promise.all(
      totals.map(async (t) => {
        const event = await prisma.event.findUnique({ where: { id: t.eventId } });

        const revenue = t._sum.grossRevenue ?? 0;
        const fees = t._sum.feesPaid ?? 0;
        const hours = t._sum.hoursWorked ?? 0;
        const net = revenue - fees;
        const hourly = hours ? net / hours : null;

        return {
          eventName: event?.name ?? "Unknown",
          submissions: t._count._all,
          gross: revenue,
          fees,
          net,
          hourly,
        };
      })
    );

    return { eventCount, reportCount, rows };
  } catch (err) {
    console.error("Dashboard getStats() failed:", err);
    return { eventCount: 0, reportCount: 0, rows: [] };
  }
}

export default async function Dashboard() {
  const { eventCount, reportCount, rows } = await getStats();
  return (
    <main className="grid" style={{ gap: 20 }}>
      <section className="grid grid-2">
        <div className="stat">
          <span className="label">Events</span>
          <span className="value">{eventCount}</span>
        </div>
        <div className="stat">
          <span className="label">Reports</span>
          <span className="value">{reportCount}</span>
        </div>
      </section>

      <section>
        <h2>Event Stats</h2>
        <table>
          <thead>
            <tr>
              <th>Event</th>
              <th>Submissions</th>
              <th>Gross</th>
              <th>Fees</th>
              <th>Net</th>
              <th>Hourly</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i}>
                <td>{r.eventName}</td>
                <td>{r.submissions}</td>
                <td>{r.gross}</td>
                <td>{r.fees}</td>
                <td>{r.net}</td>
                <td>{r.hourly ?? "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </main>
  );
}