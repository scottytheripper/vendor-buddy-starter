import { prisma } from "../../lib/db";
import { revalidatePath } from "next/cache";

async function createEvent(formData: FormData) {
  "use server";
  const name = String(formData.get("name") ?? "").trim();
  const location = String(formData.get("location") ?? "").trim();
  const category = String(formData.get("category") ?? "").trim();
  const start = String(formData.get("startDate") ?? "").trim();
  const end = String(formData.get("endDate") ?? "").trim();

  if (!name) throw new Error("Event name is required.");
  await prisma.event.create({
    data: {
      name,
      location: location || null,
      category: category || null,
      startDate: start ? new Date(start) : null,
      endDate: end ? new Date(end) : null,
    }
  });
  revalidatePath("/events");
}

export default async function EventsPage() {
  const events = await prisma.event.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <main className="grid" style={{gap: 20}}>
      <section className="card">
        <h3>Create Event</h3>
        <form action={createEvent} className="grid" style={{gap: 12}}>
          <input name="name" placeholder="Event name" required />
          <div className="grid grid-2">
            <input name="location" placeholder="Location (optional)" />
            <input name="category" placeholder="Category (e.g., Night Market)" />
          </div>
          <div className="grid grid-2">
            <input name="startDate" type="date" />
            <input name="endDate" type="date" />
          </div>
          <button type="submit">Add Event</button>
        </form>
      </section>

      <section className="card">
        <h3>Events</h3>
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Location</th>
              <th>Category</th>
              <th>Dates</th>
            </tr>
          </thead>
          <tbody>
            {events.map(e => (
              <tr key={e.id}>
                <td>{e.name}</td>
                <td>{e.location ?? "-"}</td>
                <td><span className="badge">{e.category ?? "-"}</span></td>
                <td>{e.startDate ? new Date(e.startDate).toLocaleDateString() : "-"}{e.endDate ? " → " + new Date(e.endDate).toLocaleDateString() : ""}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </main>
  );
}
