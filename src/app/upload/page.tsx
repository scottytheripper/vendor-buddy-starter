import { parseReportsCsv } from "../../lib/csv";
import { prisma } from "../../lib/db";
import { revalidatePath } from "next/cache";

async function uploadCsv(formData: FormData) {
  "use server";
  const file = formData.get("file") as File | null;
  if (!file) throw new Error("CSV file is required.");
  const text = await file.text();
  const rows = parseReportsCsv(text);

  for (const row of rows) {
    const name = (row.eventName ?? "").trim();
    if (!name) continue;

    // ensure event exists
    let event = await prisma.event.findFirst({ where: { name } });
    if (!event) {
      event = await prisma.event.create({ data: { name } });
    }

    const gross = parseFloat(row.grossRevenue || "0") || 0;
    const fees = parseFloat(row.feesPaid || "0") || 0;
    const hours = row.hours ? parseFloat(row.hours) : null;
    const date = row.date ? new Date(row.date) : null;

    await prisma.report.create({
      data: {
        eventId: event.id,
        grossRevenue: gross,
        feesPaid: fees,
        hoursWorked: hours,
        date,
        notes: row.notes || null
      }
    });
  }

  revalidatePath("/dashboard");
  return { count: rows.length };
}

export default function UploadPage() {
  return (
    <main className="grid" style={{gap: 20}}>
      <section className="card">
        <h3>Upload Reports (CSV)</h3>
        <p>Headers: <code>eventName, grossRevenue, feesPaid, hours, date, notes</code></p>
        <form action={uploadCsv} className="grid" style={{gap: 12}}>
          <input type="file" name="file" accept=".csv" required />
          <button type="submit">Upload</button>
        </form>
      </section>
      <section className="card">
        <h3>Example CSV</h3>
        <pre style={{whiteSpace: "pre-wrap"}}>
{`eventName,grossRevenue,feesPaid,hours,date,notes
Murrieta Night Market,950,150,7,2025-08-10,Great traffic; peak 6–8pm
Temecula Farmers Market,720,90,5,2025-08-17,Windy day; slower close`}
        </pre>
      </section>
    </main>
  );
}
