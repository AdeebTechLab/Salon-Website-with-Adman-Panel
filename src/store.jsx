import { createContext, useContext, useEffect, useState } from "react";

const px = (id, w = 900) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${w}`;

/* Photos used by page sections (replace with your own shop photos any time) */
const heroImage = px(4952620, 1600);
export const sectionPhotos = {
  about: px(2076930, 1200),
  booking: px(4422101, 1200),
};

/* Service categories shown in "Choose Your Look" and the services menu */
export const CATEGORIES = ["Haircut", "Beard & Trim", "Facial", "Grooming", "Packages"];

/* ---------- Date / format helpers ---------- */
const pad = (n) => String(n).padStart(2, "0");
export const dayISO = (offset = 0) => {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};
export const todayISO = () => dayISO(0);
export const money = (n) => `Rs. ${Number(n || 0).toLocaleString("en-PK")}`;
export const fmt12 = (t) => {
  if (!t) return "";
  const [h, m] = t.split(":").map(Number);
  return `${((h + 11) % 12) + 1}:${pad(m)} ${h < 12 ? "AM" : "PM"}`;
};
export const fmtDate = (iso) =>
  iso
    ? new Date(iso + "T00:00:00").toLocaleDateString("en-GB", {
        weekday: "short",
        day: "numeric",
        month: "short",
      })
    : "";

/* ---------- Seed data ---------- */
const services = [
  { id: "s1", name: "Signature Haircut", category: "Haircut", desc: "Face-shape focused haircut with finishing and styling.", price: 1200, duration: 45, image: px(2076930) },
  { id: "s2", name: "Skin Fade", category: "Haircut", desc: "Clean low, mid or high skin fade with a sharp finish.", price: 1500, duration: 50, image: px(7518731) },
  { id: "s7", name: "Kids Haircut", category: "Haircut", desc: "Comfortable, neat haircut for kids and teens.", price: 800, duration: 30, image: px(4952620) },
  { id: "s3", name: "Beard Trim & Shape", category: "Beard & Trim", desc: "Precision beard shaping, line-up and styling.", price: 700, duration: 30, image: px(4422101) },
  { id: "s4", name: "Hot Towel Shave", category: "Beard & Trim", desc: "Traditional hot towel shave for a smooth, refreshed finish.", price: 900, duration: 30, image: px(18503658) },
  { id: "s6", name: "Facial & Cleanup", category: "Facial", desc: "Gentle cleanup and facial care for a fresh, polished look.", price: 1600, duration: 45, image: px(10003357) },
  { id: "s10", name: "Deep Cleansing Facial", category: "Facial", desc: "Exfoliation, steam and mask for clear, refreshed skin.", price: 2000, duration: 60, image: px(10003357) },
  { id: "s5", name: "Hair Wash & Styling", category: "Grooming", desc: "Deep cleanse, conditioning and professional styling.", price: 800, duration: 30, image: px(4625627) },
  { id: "s11", name: "Head & Scalp Massage", category: "Grooming", desc: "Relaxing oil massage to release tension and nourish hair.", price: 700, duration: 20, image: px(4625627) },
  { id: "pk1", name: "Classic Gentleman Package", category: "Packages", desc: "Haircut & styling, beard trim and a quick facial.", price: 1800, duration: 60, image: px(5568409) },
  { id: "pk2", name: "Premium Grooming Package", category: "Packages", desc: "Haircut, beard shaping, facial, hair wash & massage.", price: 2800, duration: 90, image: px(4952620) },
  { id: "pk3", name: "The Legend Package", category: "Packages", desc: "The complete grooming experience for true gentlemen.", price: 3800, duration: 120, image: px(10003357) },
];

/* Packages shown on the homepage. Price & duration come from the linked service,
   so editing that service in the admin panel updates the package card too. */
const packages = [
  {
    id: "p1",
    serviceId: "pk1",
    badge: "Popular",
    name: "Classic Gentleman",
    desc: "Clean look, sharp style, total confidence.",
    includes: ["Haircut & Styling", "Beard Trim", "Quick Facial (optional)"],
  },
  {
    id: "p2",
    serviceId: "pk2",
    badge: "Best Value",
    name: "Premium Grooming",
    desc: "Complete care for a fresh and refined look.",
    includes: ["Haircut & Styling", "Beard Trim & Shaping", "Facial", "Hair Wash & Massage"],
  },
  {
    id: "p3",
    serviceId: "pk3",
    badge: "Premium",
    name: "The Legend Package",
    desc: "The ultimate experience for true gentlemen.",
    includes: ["Haircut & Styling", "Beard Trim & Shaping", "Facial", "Grooming (Full)", "Hair Wash & Scalp Massage"],
  },
];

const barbers = [
  { id: "b1", name: "Ahmad Raza", role: "Master Barber", experience: "8+ years", specialty: "Fades & Modern Cuts", image: px(5568409) },
  { id: "b2", name: "Hamza Malik", role: "Beard Specialist", experience: "6+ years", specialty: "Beard Styling & Shaves", image: px(4422101) },
  { id: "b3", name: "Usman Ahmed", role: "Senior Barber", experience: "7+ years", specialty: "Classic & Premium Grooming", image: px(10003357) },
  { id: "b4", name: "Bilal Khan", role: "Styling Barber", experience: "5+ years", specialty: "Hair Styling & Texture", image: px(2076930) },
];

/* ---------- Demo data for the admin panel (flagged demo:true) ---------- */
const demoClients = [
  ["dc1", "Ali Raza", "0301 2345678", "ali.raza@gmail.com", "Prefers low skin fade, no gel."],
  ["dc2", "Usama Farooq", "0312 4567890", "", "Regular — visits every 2 weeks."],
  ["dc3", "Hassan Javed", "0333 7654321", "hassan.javed@outlook.com", "Wedding grooming in December."],
  ["dc4", "Zain Abbas", "0345 1122334", "", ""],
  ["dc5", "Fahad Iqbal", "0300 9988776", "fahad.iqbal@gmail.com", "Use mild facial products."],
  ["dc6", "Saad Mehmood", "0321 5566778", "", "Likes a sharp beard line."],
  ["dc7", "Waqas Ahmed", "0307 3344556", "waqas.ahmed@yahoo.com", ""],
  ["dc8", "Noman Shah", "0315 6677889", "", "Classic side part."],
  ["dc9", "Talha Rafiq", "0336 2233445", "talha.rafiq@gmail.com", ""],
  ["dc10", "Imran Siddiqui", "0302 7788990", "", "Brings his son for kids haircut."],
].map(([id, name, phone, email, notes], i) => ({
  id,
  name,
  phone,
  email,
  notes,
  demo: true,
  created: new Date(dayISO(-40 + i * 3) + "T12:00:00").toISOString(),
}));

const demoAppointments = [
  [-6, "12:00", "dc1", "s2", "b1", "completed"],
  [-6, "16:30", "dc2", "s3", "b2", "completed"],
  [-5, "13:00", "dc3", "pk2", "b3", "completed"],
  [-5, "18:00", "dc4", "s1", "b1", "completed"],
  [-4, "14:30", "dc5", "s6", "b3", "completed"],
  [-3, "11:30", "dc6", "pk1", "b2", "completed"],
  [-3, "19:00", "dc7", "s2", "b4", "cancelled"],
  [-2, "15:00", "dc8", "s1", "b1", "completed"],
  [-2, "20:00", "dc1", "s4", "b2", "completed"],
  [-1, "12:30", "dc9", "pk3", "b3", "completed"],
  [-1, "17:30", "dc10", "s7", "b4", "completed"],
  [0, "12:00", "dc2", "s2", "b1", "confirmed"],
  [0, "15:30", "dc4", "pk1", "b2", "confirmed"],
  [0, "19:00", "dc5", "s3", "b3", "pending"],
  [1, "13:00", "dc6", "s1", "b1", "pending"],
  [1, "18:30", "dc3", "pk2", "b4", "confirmed"],
  [2, "14:00", "dc8", "s10", "b3", "pending"],
  [3, "16:00", "dc9", "s2", "b1", "pending"],
  [4, "20:00", "dc7", "pk3", "b2", "pending"],
].map(([off, time, clientId, sid, barberId, status], i) => {
  const s = services.find((x) => x.id === sid);
  return {
    id: "da" + (i + 1),
    clientId,
    serviceIds: [sid],
    barberId,
    date: dayISO(off),
    time,
    duration: s.duration,
    total: s.price,
    note: "",
    status,
    demo: true,
    created: new Date(dayISO(off - 2) + "T10:00:00").toISOString(),
  };
});

const baseReviews = [
  { id: "r1", name: "Ahsan Ali", rating: 5, message: "Bohat zabardast service. Fade bilkul clean tha aur staff bhi bohat professional hai.", created: "2026-09-28T12:00:00.000Z" },
  { id: "r2", name: "Bilal Hussain", rating: 5, message: "Shaadi se pehle grooming karwai, result excellent tha. Definitely recommended.", created: "2026-09-30T14:00:00.000Z" },
  { id: "r3", name: "Hamza Tariq", rating: 4, message: "Booking easy hai aur salon ka environment clean aur premium lagta hai.", created: "2026-10-02T16:00:00.000Z" },
];
const demoReviews = [
  { id: "dr1", name: "Usama Farooq", rating: 5, message: "Great service and attention to detail. My beard has never looked better!", created: "2026-09-12T12:00:00.000Z", demo: true },
  { id: "dr2", name: "Fahad Iqbal", rating: 5, message: "Amazing experience! Clean environment and professional staff.", created: "2026-09-18T12:00:00.000Z", demo: true },
  { id: "dr3", name: "Talha Rafiq", rating: 4, message: "Excellent haircut and beard trim. Will visit again for sure.", created: "2026-09-22T12:00:00.000Z", demo: true },
];

const DATA_VERSION = 3;
const seed = {
  version: DATA_VERSION,
  services,
  packages,
  barbers,
  clients: demoClients,
  appointments: demoAppointments,
  reviews: [...demoReviews, ...baseReviews],
  settings: {
    phone: "+92 300 1234567",
    whatsapp: "+92 300 1234567",
    email: "hello@legendbarber.pk",
    address: "Main Bazar, Khanpur, Punjab, Pakistan",
    hours: "Daily · 11:00 AM – 10:00 PM",
    instagram: "https://instagram.com/",
    facebook: "https://facebook.com/",
    tiktok: "https://tiktok.com/",
  },
};

const Ctx = createContext();
export const useStore = () => useContext(Ctx);
export const uid = () => Math.random().toString(36).slice(2, 9);
export const toMin = (t) => {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
};
export const toTime = (m) =>
  `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
export const OPEN = 660,
  CLOSE = 1320,
  STEP = 30;
export const heroPhoto = heroImage;

/* Old category names from earlier versions of the site */
const CATEGORY_MAP = {
  Haircuts: "Haircut",
  "Beard & Shave": "Beard & Trim",
  "Skin Care": "Facial",
  "Hair & Care": "Grooming",
  "Popular Combos": "Packages",
};
const addMissing = (list, extra) => [
  ...list,
  ...extra.filter((x) => !list.some((y) => y.id === x.id)),
];

/* Merge saved browser data with the seed and upgrade older saved data once. */
const mergeSeed = (saved) => {
  if (!saved || typeof saved !== "object") return seed;
  const db = {
    ...seed,
    ...saved,
    services: Array.isArray(saved.services) && saved.services.length ? saved.services : seed.services,
    packages: seed.packages,
    barbers: Array.isArray(saved.barbers) && saved.barbers.length ? saved.barbers : seed.barbers,
    clients: Array.isArray(saved.clients) ? saved.clients : [],
    appointments: Array.isArray(saved.appointments) ? saved.appointments : [],
    reviews: Array.isArray(saved.reviews) ? saved.reviews : seed.reviews,
    settings: { ...seed.settings, ...(saved.settings || {}) },
  };
  if (saved.version !== DATA_VERSION) {
    const used = new Set(db.appointments.flatMap((a) => a.serviceIds || []));
    const legacy = { s8: "Haircut + Beard Combo", s9: "Royal Grooming Package" };
    db.services = addMissing(
      db.services
        .filter((s) => !(legacy[s.id] === s.name && !used.has(s.id)))
        .map((s) => ({ ...s, category: CATEGORY_MAP[s.category] || s.category })),
      seed.services,
    );
    db.barbers = db.barbers.map((b) =>
      b.id === "b1" && b.image === px(4952620) ? { ...b, image: px(5568409) } : b,
    );
    db.clients = addMissing(db.clients, demoClients);
    db.appointments = addMissing(db.appointments, demoAppointments);
    db.reviews = addMissing(db.reviews, demoReviews);
    db.version = DATA_VERSION;
  }
  return db;
};

export function StoreProvider({ children }) {
  const [db, setDb] = useState(() => {
    try {
      return mergeSeed(JSON.parse(localStorage.getItem("legend-db-v2")));
    } catch {
      return seed;
    }
  });
  useEffect(() => {
    try {
      localStorage.setItem("legend-db-v2", JSON.stringify(db));
    } catch {
      /* storage full or unavailable */
    }
  }, [db]);
  const up = (k, fn) => setDb((d) => ({ ...d, [k]: fn(d[k]) }));
  const isFree = (barberId, date, start, dur) =>
    !db.appointments.some(
      (a) =>
        a.barberId === barberId &&
        a.date === date &&
        a.status !== "cancelled" &&
        start < toMin(a.time) + a.duration &&
        toMin(a.time) < start + dur,
    );
  const api = {
    ...db,
    isFree,
    addService: (s) => up("services", (a) => [...a, { ...s, id: uid() }]),
    updateService: (id, p) =>
      up("services", (a) => a.map((x) => (x.id === id ? { ...x, ...p } : x))),
    deleteService: (id) => up("services", (a) => a.filter((x) => x.id !== id)),
    addBarber: (b) => up("barbers", (a) => [...a, { ...b, id: uid() }]),
    updateBarber: (id, p) =>
      up("barbers", (a) => a.map((x) => (x.id === id ? { ...x, ...p } : x))),
    deleteBarber: (id) => up("barbers", (a) => a.filter((x) => x.id !== id)),
    updateClient: (id, p) =>
      up("clients", (a) => a.map((x) => (x.id === id ? { ...x, ...p } : x))),
    deleteClient: (id) =>
      setDb((d) => ({
        ...d,
        clients: d.clients.filter((c) => c.id !== id),
        appointments: d.appointments.filter((a) => a.clientId !== id),
      })),
    setStatus: (id, status) =>
      up("appointments", (a) =>
        a.map((x) => (x.id === id ? { ...x, status } : x)),
      ),
    addReview: (r) =>
      up("reviews", (a) => [
        ...a,
        { ...r, id: uid(), created: new Date().toISOString() },
      ]),
    deleteReview: (id) => up("reviews", (a) => a.filter((x) => x.id !== id)),
    updateSettings: (p) =>
      setDb((d) => ({ ...d, settings: { ...d.settings, ...p } })),
    clearDemo: () =>
      setDb((d) => ({
        ...d,
        clients: d.clients.filter((c) => !c.demo),
        appointments: d.appointments.filter((a) => !a.demo),
        reviews: d.reviews.filter((r) => !r.demo),
      })),
    book: ({ name, phone, email, notes }, serviceIds, barberId, date, time) =>
      setDb((d) => {
        let c = d.clients.find((x) => x.phone === phone);
        const clients = c
          ? d.clients.map((x) =>
              x.id === c.id
                ? {
                    ...x,
                    name,
                    email: email || x.email,
                    notes: notes || x.notes,
                  }
                : x,
            )
          : [
              ...d.clients,
              {
                id: uid(),
                name,
                phone,
                email,
                notes: notes || "",
                created: new Date().toISOString(),
              },
            ];
        const client = c || clients[clients.length - 1];
        const sv = d.services.filter((s) => serviceIds.includes(s.id));
        const ap = {
          id: uid(),
          clientId: client.id,
          serviceIds,
          barberId,
          date,
          time,
          duration: sv.reduce((t, s) => t + Number(s.duration), 0),
          total: sv.reduce((t, s) => t + Number(s.price), 0),
          note: notes,
          status: "pending",
          created: new Date().toISOString(),
        };
        return { ...d, clients, appointments: [...d.appointments, ap] };
      }),
  };
  return <Ctx.Provider value={api}>{children}</Ctx.Provider>;
}
