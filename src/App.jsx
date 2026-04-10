import { useEffect, useMemo, useState } from 'react'
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import './App.css'

const STORAGE_KEY = 'wedding-planner-pro-v1'
const CHART_COLORS = ['#f06292', '#ff8a80', '#ce93d8', '#f8bbd0', '#b39ddb']

const APP_SECTIONS = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'budget', label: 'Budget' },
  { id: 'tasks', label: 'Checklist' },
  { id: 'guests', label: 'Guests' },
  { id: 'seating', label: 'Seating' },
  { id: 'vendors', label: 'Vendors' },
  { id: 'timeline', label: 'Day Timeline' },
  { id: 'venues', label: 'Venue Compare' },
  { id: 'ideas', label: 'Ideas' },
  { id: 'party', label: 'Wedding Party' },
  { id: 'gifts', label: 'Gift Tracker' },
  { id: 'honeymoon', label: 'Honeymoon' },
  { id: 'songs', label: 'Songs' },
]

const DEFAULT_DATA = {
  details: {
    partner1: 'Alex',
    partner2: 'Sam',
    weddingDate: '2027-05-22',
    ceremonyTime: '15:00',
    venue: 'Rosewood Manor',
    couplePhoto: '',
  },
  onboarding: {
    completed: false,
  },
  totalBudget: 25000,
  budgetItems: [
    { id: crypto.randomUUID(), category: 'Venue', estimated: 7500, actual: 7200, paid: 4000 },
    { id: crypto.randomUUID(), category: 'Catering', estimated: 5000, actual: 0, paid: 1000 },
    { id: crypto.randomUUID(), category: 'Photography', estimated: 2200, actual: 1800, paid: 1200 },
    { id: crypto.randomUUID(), category: 'Decor & Florals', estimated: 2500, actual: 650, paid: 350 },
    { id: crypto.randomUUID(), category: 'Attire', estimated: 3000, actual: 1450, paid: 700 },
  ],
  tasks: [
    { id: crypto.randomUUID(), timeframe: '12+ months', task: 'Set wedding budget', assignedTo: 'Both', status: 'Done', dueDate: '2026-05-20' },
    { id: crypto.randomUUID(), timeframe: '12+ months', task: 'Book venue', assignedTo: 'Sam', status: 'In Progress', dueDate: '2026-06-15' },
    { id: crypto.randomUUID(), timeframe: '9-12 months', task: 'Choose photographer', assignedTo: 'Alex', status: 'Not Started', dueDate: '2026-09-01' },
  ],
  guests: [
    { id: crypto.randomUUID(), name: 'Olivia Green', email: 'olivia@example.com', guestType: 'Day', rsvp: 'Yes', dietary: 'Vegetarian', table: 'Table 1', plusOne: 'Ethan Green', side: 'Bride' },
    { id: crypto.randomUUID(), name: 'Noah Reed', email: 'noah@example.com', guestType: 'Evening', rsvp: 'Pending', dietary: '', table: '', plusOne: '', side: 'Groom' },
    { id: crypto.randomUUID(), name: 'Isla Bennett', email: 'isla@example.com', guestType: 'Day', rsvp: 'No', dietary: 'Nut allergy', table: '', plusOne: '', side: 'Bride' },
  ],
  vendors: [
    { id: crypto.randomUUID(), category: 'Venue', company: 'Rosewood Manor', contact: 'Mila Hayes', quotedPrice: 7200, depositPaid: 2000, balanceDue: 5200, paymentDue: '2026-08-15', status: 'Booked' },
    { id: crypto.randomUUID(), category: 'Photographer', company: 'Everlight Studio', contact: 'Nora West', quotedPrice: 1800, depositPaid: 600, balanceDue: 1200, paymentDue: '2026-10-01', status: 'Booked' },
    { id: crypto.randomUUID(), category: 'Florist', company: 'Petal Poetry', contact: 'Rose Allen', quotedPrice: 1300, depositPaid: 0, balanceDue: 1300, paymentDue: '2027-05-01', status: 'Quoted' },
  ],
  timeline: [
    { id: crypto.randomUUID(), time: '06:00', activity: 'Wake up & breakfast', involved: 'Couple', location: 'Home' },
    { id: crypto.randomUUID(), time: '09:00', activity: 'Hair & makeup starts', involved: 'Bridal party', location: 'Bridal suite' },
    { id: crypto.randomUUID(), time: '15:00', activity: 'Ceremony', involved: 'All guests', location: 'Rosewood Manor' },
  ],
  venueCompare: [
    { id: crypto.randomUUID(), name: 'Rosewood Manor', capacity: 120, price: 7200, score: 9 },
    { id: crypto.randomUUID(), name: 'Lakeside House', capacity: 140, price: 8100, score: 8 },
    { id: crypto.randomUUID(), name: 'The Ivy Hall', capacity: 100, price: 6400, score: 7 },
  ],
  ideas: [
    { id: crypto.randomUUID(), idea: 'Romantic blush + champagne palette', source: 'Pinterest board', status: 'Love it', budget: 600, priority: 'High' },
    { id: crypto.randomUUID(), idea: 'Floral photo booth corner', source: 'Instagram', status: 'Considering', budget: 450, priority: 'Medium' },
  ],
  ideasGallery: [],
  weddingParty: [
    { id: crypto.randomUUID(), role: 'Maid of Honour', name: 'Lily Hart', attireColor: 'Rose', giftGiven: 'No' },
    { id: crypto.randomUUID(), role: 'Best Man', name: 'James Ford', attireColor: 'Navy', giftGiven: 'No' },
  ],
  gifts: [
    { id: crypto.randomUUID(), giver: 'Olivia Green', description: 'Crystal vase', amount: 80, thankYouSent: 'No' },
    { id: crypto.randomUUID(), giver: 'Amelia Stone', description: 'Cash gift', amount: 150, thankYouSent: 'Yes' },
  ],
  honeymoon: {
    destination: 'Santorini + Amalfi Coast',
    departureDate: '2027-05-25',
    returnDate: '2027-06-04',
    budget: 5000,
    spent: 1800,
  },
  songs: [
    { id: crypto.randomUUID(), moment: 'Processional', song: 'A Thousand Years', artist: 'Christina Perri', confirmed: 'Yes' },
    { id: crypto.randomUUID(), moment: 'First Dance', song: 'Perfect', artist: 'Ed Sheeran', confirmed: 'No' },
  ],
  seatingTables: [
    { id: crypto.randomUUID(), name: 'Table 1', capacity: 10 },
    { id: crypto.randomUUID(), name: 'Table 2', capacity: 10 },
    { id: crypto.randomUUID(), name: 'Table 3', capacity: 10 },
    { id: crypto.randomUUID(), name: 'Table 4', capacity: 10 },
    { id: crypto.randomUUID(), name: 'Table 5', capacity: 10 },
    { id: crypto.randomUUID(), name: 'Table 6', capacity: 10 },
    { id: crypto.randomUUID(), name: 'Table 7', capacity: 10 },
    { id: crypto.randomUUID(), name: 'Table 8', capacity: 10 },
  ],
}

const parseCurrency = (value) => Number.parseFloat(value) || 0
const formatDatePretty = (value) => {
  if (!value) return 'No date'
  const parsed = new Date(`${value}T00:00:00`)
  if (Number.isNaN(parsed.getTime())) return value
  return parsed.toLocaleDateString()
}
const readAsDataUrl = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result || ''))
    reader.onerror = () => reject(new Error('Could not read file'))
    reader.readAsDataURL(file)
  })

const hydratePlanner = (value) => {
  if (!value) return DEFAULT_DATA
  return {
    ...DEFAULT_DATA,
    ...value,
    onboarding: { ...DEFAULT_DATA.onboarding, ...(value.onboarding || {}) },
    details: { ...DEFAULT_DATA.details, ...(value.details || {}) },
    budgetItems: value.budgetItems || DEFAULT_DATA.budgetItems,
    tasks: value.tasks || DEFAULT_DATA.tasks,
    guests: value.guests || DEFAULT_DATA.guests,
    vendors: value.vendors || DEFAULT_DATA.vendors,
    timeline: value.timeline || DEFAULT_DATA.timeline,
    venueCompare: value.venueCompare || DEFAULT_DATA.venueCompare,
    ideas: value.ideas || DEFAULT_DATA.ideas,
    ideasGallery: value.ideasGallery || DEFAULT_DATA.ideasGallery,
    weddingParty: value.weddingParty || DEFAULT_DATA.weddingParty,
    gifts: value.gifts || DEFAULT_DATA.gifts,
    honeymoon: { ...DEFAULT_DATA.honeymoon, ...(value.honeymoon || {}) },
    songs: value.songs || DEFAULT_DATA.songs,
    seatingTables: value.seatingTables || DEFAULT_DATA.seatingTables,
  }
}

function App() {
  const [activeSection, setActiveSection] = useState('dashboard')
  const [draggedGuestId, setDraggedGuestId] = useState('')
  const [calendarMonthOffset, setCalendarMonthOffset] = useState(0)
  const [wizardStep, setWizardStep] = useState(0)
  const [styleIdea, setStyleIdea] = useState('')
  const [planner, setPlanner] = useState(() => {
    const fromStorage = localStorage.getItem(STORAGE_KEY)
    return fromStorage ? hydratePlanner(JSON.parse(fromStorage)) : DEFAULT_DATA
  })
  const [showOnboarding, setShowOnboarding] = useState(() => !planner.onboarding?.completed)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(planner))
  }, [planner])

  const budgetMetrics = useMemo(() => {
    const estimated = planner.budgetItems.reduce((sum, item) => sum + parseCurrency(item.estimated), 0)
    const actual = planner.budgetItems.reduce((sum, item) => sum + parseCurrency(item.actual), 0)
    const paid = planner.budgetItems.reduce((sum, item) => sum + parseCurrency(item.paid), 0)
    const remaining = planner.totalBudget - actual
    return { estimated, actual, paid, remaining, owed: Math.max(actual - paid, 0) }
  }, [planner.budgetItems, planner.totalBudget])

  const taskStats = useMemo(() => {
    const done = planner.tasks.filter((task) => task.status === 'Done').length
    const inProgress = planner.tasks.filter((task) => task.status === 'In Progress').length
    const notStarted = planner.tasks.length - done - inProgress
    return { done, inProgress, notStarted }
  }, [planner.tasks])

  const guestStats = useMemo(() => {
    const yes = planner.guests.filter((guest) => guest.rsvp === 'Yes').length
    const no = planner.guests.filter((guest) => guest.rsvp === 'No').length
    const pending = planner.guests.length - yes - no
    return { yes, no, pending }
  }, [planner.guests])

  const vendorReminders = useMemo(
    () =>
      [...planner.vendors]
        .filter((vendor) => parseCurrency(vendor.balanceDue) > 0)
        .sort((a, b) => String(a.paymentDue || '').localeCompare(String(b.paymentDue || ''))),
    [planner.vendors],
  )

  const updateCollectionRow = (collectionKey, id, field, value) => {
    setPlanner((current) => ({
      ...current,
      [collectionKey]: current[collectionKey].map((row) => (row.id === id ? { ...row, [field]: value } : row)),
    }))
  }

  const addRow = (collectionKey, template) => {
    setPlanner((current) => ({
      ...current,
      [collectionKey]: [...current[collectionKey], { id: crypto.randomUUID(), ...template }],
    }))
  }

  const updateDetailsField = (field, value) => {
    setPlanner((current) => ({
      ...current,
      details: {
        ...current.details,
        [field]: value,
      },
    }))
  }

  const assignGuestToTable = (guestId, tableName) => {
    updateCollectionRow('guests', guestId, 'table', tableName)
    setDraggedGuestId('')
  }

  const handleCouplePhotoUpload = async (event) => {
    const file = event.target.files?.[0]
    if (!file) return
    const dataUrl = await readAsDataUrl(file)
    updateDetailsField('couplePhoto', dataUrl)
  }

  const handleGalleryUpload = async (event) => {
    const files = Array.from(event.target.files || [])
    if (!files.length) return
    const uploads = await Promise.all(
      files.map(async (file) => ({
        id: crypto.randomUUID(),
        title: file.name,
        imageUrl: await readAsDataUrl(file),
      })),
    )
    setPlanner((current) => ({
      ...current,
      ideasGallery: [...current.ideasGallery, ...uploads],
    }))
  }

  const completeOnboarding = () => {
    setPlanner((current) => ({
      ...current,
      ideas: styleIdea
        ? [{ id: crypto.randomUUID(), idea: styleIdea, source: 'Onboarding', status: 'Love it', budget: 0, priority: 'High' }, ...current.ideas]
        : current.ideas,
      onboarding: { completed: true },
    }))
    setShowOnboarding(false)
  }

  const renderDashboard = () => (
    <>
      <div className="hero-card card">
        <div className="hero-top">
          <div>
            <h2>{planner.details.partner1} & {planner.details.partner2}</h2>
            <p>
              {planner.details.weddingDate} at {planner.details.ceremonyTime} · {planner.details.venue}
            </p>
            <p className="subtle">A premium planning dashboard inspired by your workbook tabs.</p>
          </div>
          <div className="couple-photo-wrap">
            {planner.details.couplePhoto ? (
              <img className="couple-photo" src={planner.details.couplePhoto} alt="Couple profile" />
            ) : (
              <div className="photo-placeholder">Add Couple Photo</div>
            )}
            <label className="upload-btn">
              Upload Photo
              <input type="file" accept="image/*" onChange={handleCouplePhotoUpload} />
            </label>
          </div>
        </div>
      </div>

      <div className="stats-grid">
        <MetricCard title="Total Budget" value={`$${planner.totalBudget.toLocaleString()}`} />
        <MetricCard title="Total Spent" value={`$${budgetMetrics.actual.toLocaleString()}`} />
        <MetricCard title="Remaining" value={`$${budgetMetrics.remaining.toLocaleString()}`} />
        <MetricCard title="Tasks Complete" value={`${taskStats.done}/${planner.tasks.length}`} />
      </div>

      <div className="chart-grid">
        <ChartCard title="Budget Usage">
          <PlannerPieChart data={[
            { name: 'Spent', value: Math.max(budgetMetrics.actual, 0) },
            { name: 'Remaining', value: Math.max(budgetMetrics.remaining, 0) },
          ]} />
        </ChartCard>
        <ChartCard title="RSVP Overview">
          <PlannerPieChart data={[
            { name: 'Attending', value: guestStats.yes },
            { name: 'Declined', value: guestStats.no },
            { name: 'Pending', value: guestStats.pending },
          ]} />
        </ChartCard>
        <ChartCard title="Checklist Progress">
          <PlannerPieChart data={[
            { name: 'Done', value: taskStats.done },
            { name: 'In Progress', value: taskStats.inProgress },
            { name: 'Not Started', value: taskStats.notStarted },
          ]} />
        </ChartCard>
      </div>
    </>
  )

  const renderBudget = () => (
    <div className="card">
      <h2>Budget & Spending</h2>
      <div className="budget-top">
        <label>
          Total Budget
          <input
            type="number"
            value={planner.totalBudget}
            onChange={(event) => setPlanner({ ...planner, totalBudget: parseCurrency(event.target.value) })}
          />
        </label>
        <span>Estimated: ${budgetMetrics.estimated.toLocaleString()}</span>
        <span>Actual: ${budgetMetrics.actual.toLocaleString()}</span>
        <span>Paid: ${budgetMetrics.paid.toLocaleString()}</span>
        <span>Still Owed: ${budgetMetrics.owed.toLocaleString()}</span>
      </div>
      <PlannerTable
        columns={['Category', 'Estimated', 'Actual', 'Paid']}
        rows={planner.budgetItems}
        fields={['category', 'estimated', 'actual', 'paid']}
        onChange={(id, field, value) => updateCollectionRow('budgetItems', id, field, value)}
        numericFields={['estimated', 'actual', 'paid']}
      />
      <button className="add-btn" onClick={() => addRow('budgetItems', { category: '', estimated: 0, actual: 0, paid: 0 })}>+ Add Budget Line</button>
    </div>
  )

  const renderTasks = () => (
    <EditableSection
      title="Wedding Checklist"
      columns={['Timeframe', 'Task', 'Assigned To', 'Status', 'Due Date']}
      rows={planner.tasks}
      fields={['timeframe', 'task', 'assignedTo', 'status', 'dueDate']}
      collectionKey="tasks"
      addTemplate={{ timeframe: '', task: '', assignedTo: '', status: 'Not Started', dueDate: '' }}
      updateCollectionRow={updateCollectionRow}
      addRow={addRow}
    />
  )

  const renderGuests = () => (
    <EditableSection
      title="Guest List & RSVP"
      columns={['Full Name', 'Email', 'Day/Evening', 'RSVP', 'Dietary', 'Table', 'Plus One', 'Side']}
      rows={planner.guests}
      fields={['name', 'email', 'guestType', 'rsvp', 'dietary', 'table', 'plusOne', 'side']}
      collectionKey="guests"
      addTemplate={{ name: '', email: '', guestType: 'Day', rsvp: 'Pending', dietary: '', table: '', plusOne: '', side: '' }}
      updateCollectionRow={updateCollectionRow}
      addRow={addRow}
    />
  )

  const renderSeating = () => (
    <div className="card">
      <h2>Seating Planner (Drag & Drop)</h2>
      <p className="subtle">Drag guests into tables for quick planning. This updates the guest list table number automatically.</p>
      <div className="dnd-layout">
        <section
          className="guest-pool"
          onDragOver={(event) => event.preventDefault()}
          onDrop={() => assignGuestToTable(draggedGuestId, '')}
        >
          <h3>Unassigned Guests</h3>
          {planner.guests.filter((guest) => !guest.table).map((guest) => (
            <button
              className="guest-chip"
              key={guest.id}
              draggable
              onDragStart={() => setDraggedGuestId(guest.id)}
              onDragEnd={() => setDraggedGuestId('')}
            >
              {guest.name || 'Unnamed Guest'}
            </button>
          ))}
        </section>
        <div className="seating-grid">
          {planner.seatingTables.map((table) => {
            const seated = planner.guests.filter((guest) => guest.table === table.name)
            return (
              <article
                className="seat-card"
                key={table.id}
                onDragOver={(event) => event.preventDefault()}
                onDrop={() => assignGuestToTable(draggedGuestId, table.name)}
              >
                <h3>{table.name}</h3>
                <p>{seated.length}/{table.capacity} seated</p>
                <div className="seat-guests">
                  {seated.map((guest) => (
                    <button
                      className="guest-chip seated"
                      key={guest.id}
                      draggable
                      onDragStart={() => setDraggedGuestId(guest.id)}
                      onDragEnd={() => setDraggedGuestId('')}
                    >
                      {guest.name || 'Unnamed Guest'}
                    </button>
                  ))}
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </div>
  )

  const renderVendors = () => (
    <div className="card">
      <EditableSection
        title="Vendor & Supplier Tracker"
        columns={['Category', 'Company', 'Contact', 'Quoted Price', 'Deposit', 'Balance', 'Payment Due', 'Status']}
        rows={planner.vendors}
        fields={['category', 'company', 'contact', 'quotedPrice', 'depositPaid', 'balanceDue', 'paymentDue', 'status']}
        collectionKey="vendors"
        addTemplate={{ category: '', company: '', contact: '', quotedPrice: 0, depositPaid: 0, balanceDue: 0, paymentDue: '', status: 'Quoted' }}
        updateCollectionRow={updateCollectionRow}
        addRow={addRow}
        numericFields={['quotedPrice', 'depositPaid', 'balanceDue']}
      />
      <div className="vendor-reminders">
        <h3>Payment Reminders</h3>
        {vendorReminders.length === 0 ? (
          <p className="subtle">No pending vendor balances.</p>
        ) : (
          vendorReminders.map((vendor) => (
            <div className="reminder-item" key={vendor.id}>
              <strong>{vendor.company || 'Vendor'}</strong>
              <span>${parseCurrency(vendor.balanceDue).toLocaleString()} due · {formatDatePretty(vendor.paymentDue)}</span>
            </div>
          ))
        )}
      </div>
      <VendorCalendar reminders={vendorReminders} monthOffset={calendarMonthOffset} setMonthOffset={setCalendarMonthOffset} />
    </div>
  )

  const renderTimeline = () => (
    <EditableSection
      title="Wedding Day Timeline"
      columns={['Time', 'Activity', 'Who', 'Location']}
      rows={planner.timeline}
      fields={['time', 'activity', 'involved', 'location']}
      collectionKey="timeline"
      addTemplate={{ time: '', activity: '', involved: '', location: '' }}
      updateCollectionRow={updateCollectionRow}
      addRow={addRow}
    />
  )

  const renderVenues = () => (
    <EditableSection
      title="Venue Comparison Tool"
      columns={['Venue', 'Capacity', 'Price', 'Score /10']}
      rows={planner.venueCompare}
      fields={['name', 'capacity', 'price', 'score']}
      collectionKey="venueCompare"
      addTemplate={{ name: '', capacity: 0, price: 0, score: 0 }}
      updateCollectionRow={updateCollectionRow}
      addRow={addRow}
      numericFields={['capacity', 'price', 'score']}
    />
  )

  const renderIdeas = () => (
    <div className="card">
      <EditableSection
        title="Ideas & Inspiration"
        columns={['Idea', 'Source', 'Status', 'Budget', 'Priority']}
        rows={planner.ideas}
        fields={['idea', 'source', 'status', 'budget', 'priority']}
        collectionKey="ideas"
        addTemplate={{ idea: '', source: '', status: 'Considering', budget: 0, priority: 'Medium' }}
        updateCollectionRow={updateCollectionRow}
        addRow={addRow}
        numericFields={['budget']}
      />
      <div className="gallery-block">
        <h3>Inspiration Gallery</h3>
        <label className="upload-btn">
          Add Photos
          <input type="file" accept="image/*" multiple onChange={handleGalleryUpload} />
        </label>
        <div className="gallery-grid">
          {planner.ideasGallery.map((photo) => (
            <figure className="gallery-item" key={photo.id}>
              <img src={photo.imageUrl} alt={photo.title} />
              <figcaption>{photo.title}</figcaption>
            </figure>
          ))}
        </div>
      </div>
    </div>
  )

  const renderParty = () => (
    <EditableSection
      title="Wedding Party Tracker"
      columns={['Role', 'Name', 'Attire Colour', 'Gift Given?']}
      rows={planner.weddingParty}
      fields={['role', 'name', 'attireColor', 'giftGiven']}
      collectionKey="weddingParty"
      addTemplate={{ role: '', name: '', attireColor: '', giftGiven: 'No' }}
      updateCollectionRow={updateCollectionRow}
      addRow={addRow}
    />
  )

  const renderGifts = () => (
    <EditableSection
      title="Gift Tracker"
      columns={['Giver', 'Gift Description', 'Amount', 'Thank You Sent?']}
      rows={planner.gifts}
      fields={['giver', 'description', 'amount', 'thankYouSent']}
      collectionKey="gifts"
      addTemplate={{ giver: '', description: '', amount: 0, thankYouSent: 'No' }}
      updateCollectionRow={updateCollectionRow}
      addRow={addRow}
      numericFields={['amount']}
    />
  )

  const renderHoneymoon = () => (
    <div className="card honeymoon-card">
      <h2>Honeymoon Planner</h2>
      <div className="field-grid">
        <label>Destination<input value={planner.honeymoon.destination} onChange={(e) => setPlanner({ ...planner, honeymoon: { ...planner.honeymoon, destination: e.target.value } })} /></label>
        <label>Departure<input type="date" value={planner.honeymoon.departureDate} onChange={(e) => setPlanner({ ...planner, honeymoon: { ...planner.honeymoon, departureDate: e.target.value } })} /></label>
        <label>Return<input type="date" value={planner.honeymoon.returnDate} onChange={(e) => setPlanner({ ...planner, honeymoon: { ...planner.honeymoon, returnDate: e.target.value } })} /></label>
        <label>Budget<input type="number" value={planner.honeymoon.budget} onChange={(e) => setPlanner({ ...planner, honeymoon: { ...planner.honeymoon, budget: parseCurrency(e.target.value) } })} /></label>
        <label>Spent<input type="number" value={planner.honeymoon.spent} onChange={(e) => setPlanner({ ...planner, honeymoon: { ...planner.honeymoon, spent: parseCurrency(e.target.value) } })} /></label>
      </div>
    </div>
  )

  const renderSongs = () => (
    <EditableSection
      title="Song Planner"
      columns={['Moment', 'Song Title', 'Artist', 'Confirmed']}
      rows={planner.songs}
      fields={['moment', 'song', 'artist', 'confirmed']}
      collectionKey="songs"
      addTemplate={{ moment: '', song: '', artist: '', confirmed: 'No' }}
      updateCollectionRow={updateCollectionRow}
      addRow={addRow}
    />
  )

  const renderSection = () => {
    switch (activeSection) {
      case 'dashboard': return renderDashboard()
      case 'budget': return renderBudget()
      case 'tasks': return renderTasks()
      case 'guests': return renderGuests()
      case 'seating': return renderSeating()
      case 'vendors': return renderVendors()
      case 'timeline': return renderTimeline()
      case 'venues': return renderVenues()
      case 'ideas': return renderIdeas()
      case 'party': return renderParty()
      case 'gifts': return renderGifts()
      case 'honeymoon': return renderHoneymoon()
      case 'songs': return renderSongs()
      default: return renderDashboard()
    }
  }

  return (
    <div className="app-shell">
      {showOnboarding ? (
        <OnboardingWizard
          planner={planner}
          wizardStep={wizardStep}
          styleIdea={styleIdea}
          setStyleIdea={setStyleIdea}
          setWizardStep={setWizardStep}
          updateDetailsField={updateDetailsField}
          setPlanner={setPlanner}
          completeOnboarding={completeOnboarding}
        />
      ) : null}
      <aside className="sidebar card">
        <h1>Wedding Planner Luxe</h1>
        <p>Beautifully organized from “yes” to “I do”.</p>
        <button className="add-btn" onClick={() => setShowOnboarding(true)}>Open Premium Setup</button>
        <nav>
          {APP_SECTIONS.map((section) => (
            <button
              key={section.id}
              className={activeSection === section.id ? 'nav-btn active' : 'nav-btn'}
              onClick={() => setActiveSection(section.id)}
            >
              {section.label}
            </button>
          ))}
        </nav>
      </aside>

      <main className="content">{renderSection()}</main>
      <nav className="mobile-tabs">
        {APP_SECTIONS.map((section) => (
          <button
            key={section.id}
            className={activeSection === section.id ? 'nav-btn active' : 'nav-btn'}
            onClick={() => setActiveSection(section.id)}
          >
            {section.label}
          </button>
        ))}
      </nav>
    </div>
  )
}

function MetricCard({ title, value }) {
  return (
    <article className="metric-card card">
      <p>{title}</p>
      <strong>{value}</strong>
    </article>
  )
}

function ChartCard({ title, children }) {
  return (
    <article className="card chart-card">
      <h3>{title}</h3>
      <div className="chart-wrap">{children}</div>
    </article>
  )
}

function PlannerPieChart({ data }) {
  const safeData = data.filter((entry) => entry.value > 0)
  return (
    <ResponsiveContainer width="100%" height={220}>
      <PieChart>
        <Pie data={safeData.length ? safeData : [{ name: 'No data', value: 1 }]} dataKey="value" nameKey="name" innerRadius={50} outerRadius={84} paddingAngle={3}>
          {(safeData.length ? safeData : [{ name: 'No data', value: 1 }]).map((entry, index) => (
            <Cell key={`${entry.name}-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  )
}

function PlannerTable({ columns, rows, fields, onChange, numericFields = [] }) {
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>{columns.map((column) => <th key={column}>{column}</th>)}</tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id}>
              {fields.map((field) => (
                <td key={field}>
                  <input
                    type={numericFields.includes(field) ? 'number' : 'text'}
                    value={row[field]}
                    onChange={(event) => onChange(row.id, field, numericFields.includes(field) ? parseCurrency(event.target.value) : event.target.value)}
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function EditableSection({ title, columns, rows, fields, collectionKey, addTemplate, updateCollectionRow, addRow, numericFields = [] }) {
  return (
    <div className="card">
      <h2>{title}</h2>
      <PlannerTable columns={columns} rows={rows} fields={fields} onChange={(id, field, value) => updateCollectionRow(collectionKey, id, field, value)} numericFields={numericFields} />
      <button className="add-btn" onClick={() => addRow(collectionKey, addTemplate)}>+ Add Row</button>
    </div>
  )
}

function OnboardingWizard({ planner, wizardStep, styleIdea, setStyleIdea, setWizardStep, updateDetailsField, setPlanner, completeOnboarding }) {
  const next = () => setWizardStep((value) => Math.min(value + 1, 2))
  const back = () => setWizardStep((value) => Math.max(value - 1, 0))

  return (
    <div className="onboarding-backdrop">
      <div className="onboarding-card">
        <h2>Premium Onboarding</h2>
        <p className="subtle">Set up your wedding command center in less than 2 minutes.</p>
        {wizardStep === 0 ? (
          <div className="field-grid">
            <label>Partner 1<input value={planner.details.partner1} onChange={(event) => updateDetailsField('partner1', event.target.value)} /></label>
            <label>Partner 2<input value={planner.details.partner2} onChange={(event) => updateDetailsField('partner2', event.target.value)} /></label>
            <label>Wedding Date<input type="date" value={planner.details.weddingDate} onChange={(event) => updateDetailsField('weddingDate', event.target.value)} /></label>
            <label>Ceremony Time<input type="time" value={planner.details.ceremonyTime} onChange={(event) => updateDetailsField('ceremonyTime', event.target.value)} /></label>
            <label>Venue<input value={planner.details.venue} onChange={(event) => updateDetailsField('venue', event.target.value)} /></label>
          </div>
        ) : null}
        {wizardStep === 1 ? (
          <div className="field-grid">
            <label>Total Budget<input type="number" value={planner.totalBudget} onChange={(event) => setPlanner((current) => ({ ...current, totalBudget: parseCurrency(event.target.value) }))} /></label>
            <label>Initial Guest Target<input type="number" value={planner.guests.length} onChange={(event) => {
              const target = Math.max(Math.floor(parseCurrency(event.target.value)), 0)
              setPlanner((current) => {
                const guests = [...current.guests]
                while (guests.length < target) {
                  guests.push({ id: crypto.randomUUID(), name: '', email: '', guestType: 'Day', rsvp: 'Pending', dietary: '', table: '', plusOne: '', side: '' })
                }
                return { ...current, guests: guests.slice(0, target) }
              })
            }} /></label>
          </div>
        ) : null}
        {wizardStep === 2 ? (
          <div className="field-grid">
            <label>Style Direction<input placeholder="Romantic Garden, Modern Luxe..." value={styleIdea} onChange={(event) => setStyleIdea(event.target.value)} /></label>
            <p className="subtle">Tip: You can fine-tune everything later in each section.</p>
          </div>
        ) : null}
        <div className="wizard-actions">
          <button className="add-btn" onClick={back} disabled={wizardStep === 0}>Back</button>
          {wizardStep < 2 ? (
            <button className="add-btn" onClick={next}>Next</button>
          ) : (
            <button className="add-btn" onClick={completeOnboarding}>Finish Setup</button>
          )}
        </div>
      </div>
    </div>
  )
}

function VendorCalendar({ reminders, monthOffset, setMonthOffset }) {
  const base = new Date()
  const current = new Date(base.getFullYear(), base.getMonth() + monthOffset, 1)
  const monthLabel = current.toLocaleDateString(undefined, { month: 'long', year: 'numeric' })
  const daysInMonth = new Date(current.getFullYear(), current.getMonth() + 1, 0).getDate()
  const dueSet = new Set(
    reminders
      .filter((reminder) => reminder.paymentDue)
      .map((reminder) => new Date(`${reminder.paymentDue}T00:00:00`))
      .filter((date) => date.getFullYear() === current.getFullYear() && date.getMonth() === current.getMonth())
      .map((date) => date.getDate()),
  )

  return (
    <div className="calendar-card">
      <div className="calendar-head">
        <h3>Vendor Payment Calendar</h3>
        <div>
          <button className="tiny-btn" onClick={() => setMonthOffset((value) => value - 1)}>Prev</button>
          <span>{monthLabel}</span>
          <button className="tiny-btn" onClick={() => setMonthOffset((value) => value + 1)}>Next</button>
        </div>
      </div>
      <div className="calendar-grid">
        {Array.from({ length: daysInMonth }, (_, index) => index + 1).map((day) => (
          <div className={dueSet.has(day) ? 'day-pill due' : 'day-pill'} key={day}>
            {day}
          </div>
        ))}
      </div>
    </div>
  )
}

export default App
