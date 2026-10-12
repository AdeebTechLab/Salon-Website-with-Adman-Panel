import { useState } from "react";
import { useStore, money } from "../../store.jsx";
import Icon from "../Icon.jsx";
import { PageIntro, initials } from "./ui.jsx";

export default function ClientsAdmin() {
  const { clients, appointments, updateClient, deleteClient } = useStore();
  const [q, setQ] = useState("");
  const list = clients
    .filter((c) => (c.name + c.phone + (c.email || "")).toLowerCase().includes(q.toLowerCase()))
    .sort((a, b) => a.name.localeCompare(b.name));
  return (
    <div className="admin-stack">
      <PageIntro
        eyebrow="Customer Database"
        title="Customer Information"
        text="Contact details, visit history and private service notes."
        stat={clients.length}
        statLabel="Customers"
      />
      <div className="admin-toolbar">
        <label className="search">
          <Icon name="search" size={17} />
          <input
            placeholder="Search name, phone or email"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </label>
      </div>
      <div className="table-card scroll">
        <table>
          <thead>
            <tr>
              <th>Customer</th>
              <th>Contact</th>
              <th>Visits</th>
              <th>Spent</th>
              <th>Private notes</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {list.map((c) => {
              const ap = appointments.filter((a) => a.clientId === c.id);
              const done = ap.filter((a) => a.status === "completed");
              return (
                <tr key={c.id}>
                  <td>
                    <div className="cell-user">
                      <span className="avatar sm">{initials(c.name)}</span>
                      <span>
                        <strong>{c.name}</strong>
                        <small>Since {new Date(c.created).toLocaleDateString("en-GB", { month: "short", year: "numeric" })}</small>
                      </span>
                    </div>
                  </td>
                  <td>
                    {c.phone}
                    <small>{c.email || "No email"}</small>
                  </td>
                  <td>
                    {done.length} done
                    <small>{ap.length} booked</small>
                  </td>
                  <td>
                    <strong>{money(done.reduce((t, a) => t + Number(a.total), 0))}</strong>
                  </td>
                  <td className="notes-cell">
                    <input
                      defaultValue={c.notes}
                      placeholder="Preferences or notes"
                      aria-label={`Notes for ${c.name}`}
                      onBlur={(e) => updateClient(c.id, { notes: e.target.value })}
                    />
                  </td>
                  <td>
                    <button
                      className="lnk red"
                      onClick={() =>
                        window.confirm("Delete customer and booking history?") && deleteClient(c.id)
                      }
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
            {!list.length && (
              <tr>
                <td colSpan="6">
                  <div className="empty-state">
                    <strong>No customers found.</strong>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
