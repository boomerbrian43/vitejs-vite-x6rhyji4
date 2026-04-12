import { useState, useRef, useEffect } from 'react';

const B = {
  name: 'Trins Transport',
  tagline: 'Compassionate Non-Emergency Medical Transportation',
  phone: '(555) 000-0000',
  email: 'info@trinstransport.com',
  navy: '#0B2545',
  navyMid: '#163A6B',
  gold: '#C8880F',
  sky: '#0EA5E9',
  baseFare: 25,
  perMile: 2.5,
  weekendPct: 20,
  wheelchairFee: 10,
  heavyFee: 15,
  longDistFee: 10,
};

const TESTIMONIALS = [
  {
    name: 'Dorothy M.',
    role: 'Dialysis Patient 3 Years',
    init: 'DM',
    color: '#4F46E5',
    text: 'Trins Transport has truly been a blessing in my life. Always on time, drivers are incredibly kind. After three years of weekly rides, they feel like family.',
  },
  {
    name: 'James R.',
    role: "Patient's Family Member",
    init: 'JR',
    color: '#059669',
    text: 'My mother needs wheelchair transport every single week. Trins makes the whole process completely stress-free. Punctual, professional, and genuinely caring every time.',
  },
  {
    name: 'Sandra K., RN',
    role: 'Floor Nurse City Medical Center',
    init: 'SK',
    color: '#DC2626',
    text: 'We rely on Trins for all our hospital discharge transports. Their facility portal is simple, and they have never once let us down. Our patients always arrive safely.',
  },
  {
    name: 'William T.',
    role: 'Post-Surgery Patient',
    init: 'WT',
    color: '#D97706',
    text: 'After my knee replacement I needed weekly rides to physical therapy. Trins was professional, careful, and made me feel safe every single trip. Outstanding service.',
  },
];

const SERVICES = [
  {
    icon: 'hospital',
    title: 'Doctor Appointments',
    desc: 'Comfortable, punctual rides to any medical visit, specialist, or routine check-up door to door.',
  },
  {
    icon: 'syringe',
    title: 'Dialysis Transport',
    desc: "Dependable recurring rides for dialysis patients. We know your schedule and we'll always be there.",
  },
  {
    icon: 'bed',
    title: 'Hospital Discharge',
    desc: 'Safe, attentive transport home after surgeries, procedures, or extended hospital stays.',
  },
  {
    icon: 'home',
    title: 'Nursing Home Transfers',
    desc: 'Respectful, professional transfers between care facilities, nursing homes, and residences.',
  },
  {
    icon: 'wheelchair',
    title: 'Wheelchair Transport',
    desc: 'Fully ADA-compliant, rear-ramp vans with trained, compassionate drivers.',
  },
  {
    icon: 'building',
    title: 'Facility Staff Portal',
    desc: 'Hospitals and nursing home staff can book rides for multiple patients quickly and easily.',
  },
];

const FLEET = [
  {
    name: 'Wheelchair Accessible Van',
    tag: 'Most Popular',
    icon: 'wheelchair',
    desc: 'Fully equipped wheelchair van with a rear hydraulic ramp — ideal for wheelchairs, scooters, and bariatric patients.',
    features: [
      'Rear hydraulic ramp',
      'Wheelchair tie-downs',
      'Full AC/heat',
      'Door-to-door assist',
      'Bariatric capable',
    ],
    bg: 'linear-gradient(135deg,#0B2545,#163A6B)',
  },
  {
    name: 'Ambulatory Sedan',
    tag: 'Budget Friendly',
    icon: 'car',
    desc: 'Clean, comfortable sedan for patients who are ambulatory but need a reliable, caring ride to their appointment.',
    features: [
      'Door-to-door service',
      'Assistance in/out',
      'Climate controlled',
      'Professional driver',
      'No-contact option',
    ],
    bg: 'linear-gradient(135deg,#1E5CA0,#2D6FBB)',
  },
];

export default function TrinsApp() {
  const [page, setPage] = useState('landing');
  const [userType, setUserType] = useState(null);
  const [tab, setTab] = useState('home');
  const [tIdx, setTIdx] = useState(0);
  const [bookStep, setBookStep] = useState(1);
  const [booking, setBooking] = useState({
    name: '',
    phone: '',
    pickup: '',
    dropoff: '',
    date: '',
    time: '',
    miles: '',
    wheelchair: false,
    heavy: false,
    notes: '',
  });
  const [rides, setRides] = useState([
    {
      id: 1,
      date: 'Apr 8, 2026',
      from: '123 Oak St',
      to: 'City Medical Ctr',
      status: 'Completed',
      cost: '$32.50',
      driver: 'Marcus T.',
    },
    {
      id: 2,
      date: 'Apr 10, 2026',
      from: '456 Elm Ave',
      to: 'Sunrise Dialysis',
      status: 'Completed',
      cost: '$28.00',
      driver: 'Rosa M.',
    },
  ]);
  const [msgs, setMsgs] = useState([
    {
      role: 'assistant',
      content:
        "Hi! I'm the Trins Transport assistant. I can help with pricing, scheduling, and more. What can I help you with?",
    },
  ]);
  const [chatIn, setChatIn] = useState('');
  const [chatBusy, setChatBusy] = useState(false);
  const [booked, setBooked] = useState(false);
  const [ratings, setRatings] = useState({});
  const chatRef = useRef(null);

  useEffect(() => {
    chatRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [msgs]);
  useEffect(() => {
    const t = setInterval(
      () => setTIdx((i) => (i + 1) % TESTIMONIALS.length),
      5000
    );
    return () => clearInterval(t);
  }, []);

  const calcCost = () => {
    let c = B.baseFare + (parseFloat(booking.miles) || 0) * B.perMile;
    if (booking.wheelchair) c += B.wheelchairFee;
    if (booking.heavy) c += B.heavyFee;
    if ((parseFloat(booking.miles) || 0) > 25) c += B.longDistFee;
    const d = new Date(booking.date);
    if (d.getDay() === 0 || d.getDay() === 6) c *= 1 + B.weekendPct / 100;
    return c.toFixed(2);
  };

  const confirmBooking = () => {
    setRides([
      {
        id: rides.length + 1,
        date: booking.date || 'TBD',
        from: booking.pickup,
        to: booking.dropoff,
        status: 'Scheduled',
        cost: '$' + calcCost(),
        driver: 'Being assigned...',
      },
      ...rides,
    ]);
    setBooked(true);
    setTimeout(() => {
      setBooked(false);
      setBooking({
        name: '',
        phone: '',
        pickup: '',
        dropoff: '',
        date: '',
        time: '',
        miles: '',
        wheelchair: false,
        heavy: false,
        notes: '',
      });
      setBookStep(1);
      setTab('history');
    }, 2500);
  };

  const sendChat = async () => {
    if (!chatIn.trim() || chatBusy) return;
    const um = { role: 'user', content: chatIn };
    const next = [...msgs, um];
    setMsgs(next);
    setChatIn('');
    setChatBusy(true);
    try {
      const r = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 800,
          system:
            'You are a friendly assistant for Trins Transport, a non-emergency medical transport company. Base fare $25, $2.50/mile, +20% weekends, wheelchair +$10, bariatric +$15, 25+ miles +$10. For emergencies call 911. Keep answers short and warm.',
          messages: next.map((m) => ({ role: m.role, content: m.content })),
        }),
      });
      const data = await r.json();
      setMsgs([
        ...next,
        {
          role: 'assistant',
          content: data.content?.[0]?.text || 'Sorry, try again!',
        },
      ]);
    } catch {
      setMsgs([
        ...next,
        { role: 'assistant', content: 'Connection issue, please try again!' },
      ]);
    }
    setChatBusy(false);
  };

  const svc = {
    hospital: '🏥',
    syringe: '💉',
    bed: '🏨',
    home: '🏡',
    wheelchair: '♿',
    building: '🏢',
    car: '🚗',
  };

  const CSS = () => (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=Lato:wght@400;600;700&display=swap');
      *{box-sizing:border-box;margin:0;padding:0}
      body{font-family:'Lato',sans-serif}
      .hl{transition:transform .2s,box-shadow .2s!important}
      .hl:hover{transform:translateY(-4px)!important;box-shadow:0 16px 40px rgba(0,0,0,.13)!important}
      .gb{transition:all .2s}
      .gb:hover{filter:brightness(1.1);transform:translateY(-1px)}
      .na{color:rgba(255,255,255,.75);text-decoration:none;font-size:14px;font-weight:600;transition:color .2s}
      .na:hover{color:white}
      .fi{animation:fi .5s ease}
      @keyframes fi{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
    `}</style>
  );

  if (page === 'landing')
    return (
      <div style={{ fontFamily: "'Lato',sans-serif", background: '#FAFBFD' }}>
              <CSS />     {' '}
        <nav
          style={{
            background: B.navy,
            padding: '0 28px',
            height: '66px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            position: 'sticky',
            top: 0,
            zIndex: 100,
            boxShadow: '0 2px 20px rgba(0,0,0,.35)',
          }}
        >
                 {' '}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                     {' '}
            <div
              style={{
                width: '38px',
                height: '38px',
                background: B.gold,
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '20px',
              }}
            >
              🚐
            </div>
                     {' '}
            <span
              style={{
                color: 'white',
                fontFamily: "'Playfair Display',serif",
                fontSize: '20px',
                fontWeight: 800,
              }}
            >
              {B.name}
            </span>
                   {' '}
          </div>
                 {' '}
          <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
                     {' '}
            <a className="na" href="#services">
              Services
            </a>
                     {' '}
            <a className="na" href="#fleet">
              Fleet
            </a>
                     {' '}
            <a className="na" href="#reviews">
              Reviews
            </a>
                     {' '}
            <a className="na" href={'tel:' + B.phone}>
              📞 {B.phone}
            </a>
                     {' '}
            <button
              className="gb"
              onClick={() => setPage('welcome')}
              style={{
                background: B.gold,
                color: 'white',
                border: 'none',
                borderRadius: '9px',
                padding: '10px 22px',
                fontWeight: 700,
                cursor: 'pointer',
                fontSize: '14px',
              }}
            >
              Book a Ride
            </button>
                   {' '}
          </div>
               {' '}
        </nav>
             {' '}
        <section
          style={{
            background:
              'linear-gradient(135deg,' +
              B.navy +
              ' 0%,#1B3D6F 60%,#224E88 100%)',
            padding: '90px 28px 80px',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
                 {' '}
          <div
            style={{
              maxWidth: '1120px',
              margin: '0 auto',
              display: 'flex',
              gap: '60px',
              alignItems: 'center',
              flexWrap: 'wrap',
            }}
          >
                     {' '}
            <div style={{ flex: '1 1 320px' }} className="fi">
                         {' '}
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: 'rgba(200,136,15,.15)',
                  border: '1px solid rgba(200,136,15,.3)',
                  borderRadius: '30px',
                  padding: '6px 16px',
                  marginBottom: '22px',
                }}
              >
                             {' '}
                <span
                  style={{ color: B.gold, fontSize: '13px', fontWeight: 700 }}
                >
                  ⭐ Rated 4.9/5 by 200+ patients
                </span>
                           {' '}
              </div>
                         {' '}
              <h1
                style={{
                  fontFamily: "'Playfair Display',serif",
                  fontSize: 'clamp(34px,5vw,58px)',
                  fontWeight: 800,
                  color: 'white',
                  lineHeight: 1.12,
                  marginBottom: '22px',
                }}
              >
                              Caring Medical
                <br />
                Transport You Can
                <br />
                <span style={{ color: B.gold }}>Always Count On</span>         
                 {' '}
              </h1>
                         {' '}
              <p
                style={{
                  color: 'rgba(255,255,255,.72)',
                  fontSize: '18px',
                  lineHeight: 1.75,
                  marginBottom: '36px',
                  maxWidth: '490px',
                }}
              >
                              Professional non-emergency rides for patients,
                seniors, and medical facilities. Wheelchair accessible vans with
                rear ramps. On time, every time.            {' '}
              </p>
                         {' '}
              <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
                             {' '}
                <button
                  className="gb"
                  onClick={() => setPage('welcome')}
                  style={{
                    background: B.gold,
                    color: 'white',
                    border: 'none',
                    borderRadius: '14px',
                    padding: '18px 36px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    fontSize: '17px',
                  }}
                >
                  Book a Ride Now →
                </button>
                             {' '}
                <a
                  href={'tel:' + B.phone}
                  style={{
                    background: 'rgba(255,255,255,.09)',
                    color: 'white',
                    border: '2px solid rgba(255,255,255,.2)',
                    borderRadius: '14px',
                    padding: '18px 28px',
                    fontWeight: 700,
                    fontSize: '15px',
                    textDecoration: 'none',
                  }}
                >
                  📞 Call Us
                </a>
                           {' '}
              </div>
                         {' '}
              <div
                style={{
                  display: 'flex',
                  gap: '22px',
                  marginTop: '28px',
                  flexWrap: 'wrap',
                }}
              >
                             {' '}
                {[
                  '✓ Licensed & Insured',
                  '✓ HIPAA Compliant',
                  '✓ ADA Certified',
                ].map((b) => (
                  <span
                    key={b}
                    style={{
                      color: 'rgba(255,255,255,.55)',
                      fontSize: '13px',
                      fontWeight: 600,
                    }}
                  >
                    {b}
                  </span>
                ))}
                           {' '}
              </div>
                       {' '}
            </div>
                     {' '}
            <div style={{ flex: '1 1 300px', position: 'relative' }}>
                         {' '}
              <div
                style={{
                  borderRadius: '22px',
                  overflow: 'hidden',
                  boxShadow: '0 30px 80px rgba(0,0,0,.45)',
                  background:
                    'linear-gradient(135deg,' + B.navyMid + ',' + B.navy + ')',
                  aspectRatio: '4/3',
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                             {' '}
                <span style={{ fontSize: '120px', opacity: 0.15 }}>🚐</span>   
                         {' '}
                <div
                  style={{
                    position: 'absolute',
                    bottom: '16px',
                    left: '16px',
                    right: '16px',
                    background: 'rgba(11,37,69,.92)',
                    borderRadius: '14px',
                    padding: '14px 16px',
                  }}
                >
                                 {' '}
                  <div
                    style={{
                      color: B.gold,
                      fontWeight: 700,
                      fontSize: '13px',
                      marginBottom: '4px',
                    }}
                  >
                    🚐 Fleet Ready 24/7
                  </div>
                                 {' '}
                  <div
                    style={{ color: 'rgba(255,255,255,.65)', fontSize: '12px' }}
                  >
                    Rear ramp vans · ADA compliant · Trained drivers
                  </div>
                               {' '}
                </div>
                           {' '}
              </div>
                         {' '}
              <div
                style={{
                  position: 'absolute',
                  top: '-14px',
                  right: '-14px',
                  background: 'white',
                  borderRadius: '16px',
                  padding: '12px 16px',
                  boxShadow: '0 8px 30px rgba(0,0,0,.18)',
                  textAlign: 'center',
                }}
              >
                             {' '}
                <div
                  style={{
                    fontSize: '24px',
                    fontFamily: "'Playfair Display',serif",
                    fontWeight: 800,
                    color: B.navy,
                  }}
                >
                  99%
                </div>
                             {' '}
                <div
                  style={{
                    fontSize: '11px',
                    color: '#64748b',
                    fontWeight: 700,
                  }}
                >
                  On-Time Rate
                </div>
                           {' '}
              </div>
                       {' '}
            </div>
                   {' '}
          </div>
               {' '}
        </section>
             {' '}
        <section style={{ background: B.gold, padding: '30px 28px' }}>
                 {' '}
          <div
            style={{
              maxWidth: '900px',
              margin: '0 auto',
              display: 'flex',
              justifyContent: 'space-around',
              flexWrap: 'wrap',
              gap: '20px',
            }}
          >
                     {' '}
            {[
              ['2,500+', 'Rides Completed'],
              ['99%', 'On-Time Rate'],
              ['4.9 ★', 'Avg. Rating'],
              ['50+', 'Partner Facilities'],
            ].map(([n, l]) => (
              <div key={l} style={{ textAlign: 'center' }}>
                             {' '}
                <div
                  style={{
                    fontSize: 'clamp(24px,4vw,36px)',
                    fontWeight: 700,
                    color: 'white',
                    fontFamily: "'Playfair Display',serif",
                  }}
                >
                  {n}
                </div>
                             {' '}
                <div
                  style={{
                    fontSize: '13px',
                    color: 'rgba(255,255,255,.8)',
                    fontWeight: 700,
                  }}
                >
                  {l}
                </div>
                           {' '}
              </div>
            ))}
                   {' '}
          </div>
               {' '}
        </section>
             {' '}
        <section
          id="services"
          style={{ padding: '90px 28px', background: 'white' }}
        >
                 {' '}
          <div style={{ maxWidth: '1120px', margin: '0 auto' }}>
                     {' '}
            <div style={{ textAlign: 'center', marginBottom: '56px' }}>
                         {' '}
              <div
                style={{
                  color: B.gold,
                  fontWeight: 700,
                  fontSize: '12px',
                  letterSpacing: '2.5px',
                  textTransform: 'uppercase',
                  marginBottom: '10px',
                }}
              >
                What We Offer
              </div>
                         {' '}
              <h2
                style={{
                  fontFamily: "'Playfair Display',serif",
                  fontSize: 'clamp(28px,4vw,44px)',
                  color: B.navy,
                  marginBottom: '14px',
                }}
              >
                Medical Transport Services
              </h2>
                         {' '}
              <p
                style={{
                  color: '#64748B',
                  fontSize: '16px',
                  maxWidth: '520px',
                  margin: '0 auto',
                  lineHeight: 1.7,
                }}
              >
                We go wherever patients need to go — safely, comfortably, and
                with genuine compassion.
              </p>
                       {' '}
            </div>
                     {' '}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit,minmax(290px,1fr))',
                gap: '22px',
              }}
            >
                         {' '}
              {SERVICES.map((s) => (
                <div
                  key={s.title}
                  className="hl"
                  style={{
                    background: '#F8FAFF',
                    border: '1px solid #E8F0FE',
                    borderRadius: '18px',
                    padding: '30px',
                    boxShadow: '0 2px 12px rgba(0,0,0,.05)',
                  }}
                >
                                 {' '}
                  <div
                    style={{
                      width: '56px',
                      height: '56px',
                      background: B.navy + '18',
                      borderRadius: '16px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '28px',
                      marginBottom: '18px',
                    }}
                  >
                    {svc[s.icon]}
                  </div>
                                 {' '}
                  <h3
                    style={{
                      color: B.navy,
                      fontSize: '17px',
                      fontWeight: 700,
                      marginBottom: '8px',
                    }}
                  >
                    {s.title}
                  </h3>
                                 {' '}
                  <p
                    style={{
                      color: '#64748B',
                      fontSize: '14px',
                      lineHeight: 1.7,
                    }}
                  >
                    {s.desc}
                  </p>
                               {' '}
                </div>
              ))}
                       {' '}
            </div>
                   {' '}
          </div>
               {' '}
        </section>
             {' '}
        <section
          id="fleet"
          style={{ padding: '90px 28px', background: '#EFF4FC' }}
        >
                 {' '}
          <div style={{ maxWidth: '1120px', margin: '0 auto' }}>
                     {' '}
            <div style={{ textAlign: 'center', marginBottom: '56px' }}>
                         {' '}
              <div
                style={{
                  color: B.gold,
                  fontWeight: 700,
                  fontSize: '12px',
                  letterSpacing: '2.5px',
                  textTransform: 'uppercase',
                  marginBottom: '10px',
                }}
              >
                Our Fleet
              </div>
                         {' '}
              <h2
                style={{
                  fontFamily: "'Playfair Display',serif",
                  fontSize: 'clamp(28px,4vw,44px)',
                  color: B.navy,
                  marginBottom: '14px',
                }}
              >
                Wheelchair-Accessible Vehicles
              </h2>
                         {' '}
              <p
                style={{
                  color: '#64748B',
                  fontSize: '16px',
                  maxWidth: '540px',
                  margin: '0 auto',
                  lineHeight: 1.7,
                }}
              >
                All vehicles are ADA-compliant, spotlessly clean, and equipped
                with rear ramps for safe, dignified boarding.
              </p>
                       {' '}
            </div>
                     {' '}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit,minmax(310px,1fr))',
                gap: '26px',
              }}
            >
                         {' '}
              {FLEET.map((v) => (
                <div
                  key={v.name}
                  className="hl"
                  style={{
                    background: 'white',
                    borderRadius: '22px',
                    overflow: 'hidden',
                    boxShadow: '0 4px 24px rgba(0,0,0,.09)',
                  }}
                >
                                 {' '}
                  <div
                    style={{
                      height: '200px',
                      background: v.bg,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      position: 'relative',
                    }}
                  >
                                     {' '}
                    <span style={{ fontSize: '80px', opacity: 0.2 }}>
                      {svc[v.icon]}
                    </span>
                                     {' '}
                    {v.tag && (
                      <div
                        style={{
                          position: 'absolute',
                          top: '14px',
                          right: '14px',
                          background: B.gold,
                          color: 'white',
                          borderRadius: '22px',
                          padding: '5px 14px',
                          fontSize: '12px',
                          fontWeight: 700,
                        }}
                      >
                        {v.tag}
                      </div>
                    )}
                                     {' '}
                    <div
                      style={{
                        position: 'absolute',
                        bottom: '14px',
                        left: '14px',
                        background: 'rgba(11,37,69,.88)',
                        borderRadius: '10px',
                        padding: '6px 12px',
                      }}
                    >
                                         {' '}
                      <span
                        style={{
                          color: 'white',
                          fontSize: '12px',
                          fontWeight: 600,
                        }}
                      >
                        ♿ Rear Ramp Equipped
                      </span>
                                       {' '}
                    </div>
                                   {' '}
                  </div>
                                 {' '}
                  <div style={{ padding: '24px' }}>
                                     {' '}
                    <h3
                      style={{
                        color: B.navy,
                        fontSize: '18px',
                        fontWeight: 700,
                        marginBottom: '6px',
                      }}
                    >
                      {v.name}
                    </h3>
                                     {' '}
                    <p
                      style={{
                        color: '#64748B',
                        fontSize: '13px',
                        lineHeight: 1.6,
                        marginBottom: '16px',
                      }}
                    >
                      {v.desc}
                    </p>
                                     {' '}
                    {v.features.map((f) => (
                      <div
                        key={f}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          fontSize: '13px',
                          color: '#334155',
                          marginBottom: '7px',
                        }}
                      >
                                             {' '}
                        <div
                          style={{
                            width: '20px',
                            height: '20px',
                            background: B.gold + '18',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '10px',
                            color: B.gold,
                            fontWeight: 700,
                            flexShrink: 0,
                          }}
                        >
                          ✓
                        </div>
                                              {f}                   {' '}
                      </div>
                    ))}
                                     {' '}
                    <button
                      className="gb"
                      onClick={() => setPage('welcome')}
                      style={{
                        width: '100%',
                        background: B.navy,
                        color: 'white',
                        border: 'none',
                        borderRadius: '10px',
                        padding: '13px',
                        fontWeight: 700,
                        cursor: 'pointer',
                        fontSize: '14px',
                        marginTop: '14px',
                      }}
                    >
                      Book This Vehicle →
                    </button>
                                   {' '}
                  </div>
                               {' '}
                </div>
              ))}
                       {' '}
            </div>
                   {' '}
          </div>
               {' '}
        </section>
             {' '}
        <section style={{ padding: '90px 28px', background: B.navy }}>
                 {' '}
          <div
            style={{
              maxWidth: '1120px',
              margin: '0 auto',
              display: 'flex',
              gap: '70px',
              alignItems: 'center',
              flexWrap: 'wrap',
            }}
          >
                     {' '}
            <div style={{ flex: '1 1 300px' }}>
                         {' '}
              <div
                style={{
                  color: B.gold,
                  fontWeight: 700,
                  fontSize: '12px',
                  letterSpacing: '2.5px',
                  textTransform: 'uppercase',
                  marginBottom: '10px',
                }}
              >
                Why Choose Us
              </div>
                         {' '}
              <h2
                style={{
                  fontFamily: "'Playfair Display',serif",
                  fontSize: 'clamp(28px,4vw,42px)',
                  color: 'white',
                  marginBottom: '30px',
                  lineHeight: 1.2,
                }}
              >
                We Treat Every Patient Like Family
              </h2>
                         {' '}
              {[
                [
                  '🕐',
                  'Always On Time',
                  "We monitor traffic and plan ahead so you're never late.",
                ],
                [
                  '♿',
                  'Rear-Ramp Vans',
                  'ADA-compliant vehicles with hydraulic rear ramps.',
                ],
                [
                  '🏥',
                  'Facility Trusted',
                  '50+ hospitals and nursing homes rely on us daily.',
                ],
                [
                  '❤️',
                  'Compassionate Drivers',
                  'Trained in patient sensitivity and mobility assistance.',
                ],
                [
                  '🔒',
                  'Licensed & Insured',
                  'Fully licensed, insured, and HIPAA compliant.',
                ],
              ].map(([i, t, d]) => (
                <div
                  key={t}
                  style={{
                    display: 'flex',
                    gap: '16px',
                    alignItems: 'flex-start',
                    marginBottom: '22px',
                  }}
                >
                                 {' '}
                  <div
                    style={{
                      width: '46px',
                      height: '46px',
                      background: B.gold + '18',
                      border: '1px solid ' + B.gold + '30',
                      borderRadius: '14px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '22px',
                      flexShrink: 0,
                    }}
                  >
                    {i}
                  </div>
                                 {' '}
                  <div>
                                     {' '}
                    <div
                      style={{
                        color: 'white',
                        fontWeight: 700,
                        marginBottom: '3px',
                        fontSize: '15px',
                      }}
                    >
                      {t}
                    </div>
                                     {' '}
                    <div
                      style={{
                        color: 'rgba(255,255,255,.55)',
                        fontSize: '13px',
                        lineHeight: 1.6,
                      }}
                    >
                      {d}
                    </div>
                                   {' '}
                  </div>
                               {' '}
                </div>
              ))}
                       {' '}
            </div>
                     {' '}
            <div style={{ flex: '1 1 280px' }}>
                         {' '}
              <div
                style={{
                  background: B.gold + '15',
                  border: '1px solid ' + B.gold + '30',
                  borderRadius: '16px',
                  padding: '28px',
                  textAlign: 'center',
                }}
              >
                             {' '}
                <div style={{ fontSize: '60px', marginBottom: '16px' }}>🚐</div>
                             {' '}
                <h3
                  style={{
                    color: 'white',
                    fontFamily: "'Playfair Display',serif",
                    fontSize: '22px',
                    marginBottom: '16px',
                  }}
                >
                  Ready to Ride?
                </h3>
                             {' '}
                <p
                  style={{
                    color: 'rgba(255,255,255,.6)',
                    fontSize: '14px',
                    lineHeight: 1.7,
                    marginBottom: '20px',
                  }}
                >
                  Serving patients and healthcare facilities with care,
                  compassion, and reliability every single day.
                </p>
                             {' '}
                <div
                  style={{
                    display: 'flex',
                    gap: '20px',
                    justifyContent: 'space-around',
                  }}
                >
                                 {' '}
                  {[
                    ['2,500+', 'Rides'],
                    ['99%', 'On-Time'],
                    ['4.9★', 'Rating'],
                  ].map(([n, l]) => (
                    <div key={l} style={{ textAlign: 'center' }}>
                                         {' '}
                      <div
                        style={{
                          color: B.gold,
                          fontWeight: 800,
                          fontSize: '20px',
                          fontFamily: "'Playfair Display',serif",
                        }}
                      >
                        {n}
                      </div>
                                         {' '}
                      <div
                        style={{
                          color: 'rgba(255,255,255,.55)',
                          fontSize: '12px',
                          fontWeight: 600,
                        }}
                      >
                        {l}
                      </div>
                                       {' '}
                    </div>
                  ))}
                               {' '}
                </div>
                           {' '}
              </div>
                       {' '}
            </div>
                   {' '}
          </div>
               {' '}
        </section>
             {' '}
        <section style={{ padding: '90px 28px', background: 'white' }}>
                 {' '}
          <div style={{ maxWidth: '900px', margin: '0 auto' }}>
                     {' '}
            <div style={{ textAlign: 'center', marginBottom: '56px' }}>
                         {' '}
              <div
                style={{
                  color: B.gold,
                  fontWeight: 700,
                  fontSize: '12px',
                  letterSpacing: '2.5px',
                  textTransform: 'uppercase',
                  marginBottom: '10px',
                }}
              >
                Simple Process
              </div>
                         {' '}
              <h2
                style={{
                  fontFamily: "'Playfair Display',serif",
                  fontSize: 'clamp(28px,4vw,44px)',
                  color: B.navy,
                }}
              >
                How It Works
              </h2>
                       {' '}
            </div>
                     {' '}
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                flexWrap: 'wrap',
              }}
            >
                         {' '}
              {[
                [
                  '1',
                  'Book Your Ride',
                  "Use our app or call us. Tell us where you're going and any special needs.",
                  '📱',
                ],
                [
                  '2',
                  'Get Confirmed',
                  "You'll receive your driver's name, vehicle info, and exact arrival time.",
                  '✅',
                ],
                [
                  '3',
                  'Door-to-Door',
                  'Your driver arrives on time, assists you in, and gets you there safely.',
                  '🚐',
                ],
              ].map((s, i) => (
                <div
                  key={s[0]}
                  style={{
                    flex: '1 1 220px',
                    textAlign: 'center',
                    padding: '0 24px',
                  }}
                >
                                 {' '}
                  <div
                    style={{
                      width: '62px',
                      height: '62px',
                      background: B.navy,
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 16px',
                      fontSize: '22px',
                      fontWeight: 800,
                      color: B.gold,
                      fontFamily: "'Playfair Display',serif",
                    }}
                  >
                    {s[0]}
                  </div>
                                 {' '}
                  <div style={{ fontSize: '34px', marginBottom: '10px' }}>
                    {s[3]}
                  </div>
                                 {' '}
                  <h3
                    style={{
                      color: B.navy,
                      fontWeight: 700,
                      marginBottom: '8px',
                      fontSize: '17px',
                    }}
                  >
                    {s[1]}
                  </h3>
                                 {' '}
                  <p
                    style={{
                      color: '#64748B',
                      fontSize: '14px',
                      lineHeight: 1.7,
                    }}
                  >
                    {s[2]}
                  </p>
                               {' '}
                </div>
              ))}
                       {' '}
            </div>
                   {' '}
          </div>
               {' '}
        </section>
             {' '}
        <section
          id="reviews"
          style={{ padding: '90px 28px', background: '#EFF4FC' }}
        >
                 {' '}
          <div style={{ maxWidth: '1120px', margin: '0 auto' }}>
                     {' '}
            <div style={{ textAlign: 'center', marginBottom: '56px' }}>
                         {' '}
              <div
                style={{
                  color: B.gold,
                  fontWeight: 700,
                  fontSize: '12px',
                  letterSpacing: '2.5px',
                  textTransform: 'uppercase',
                  marginBottom: '10px',
                }}
              >
                Patient Stories
              </div>
                         {' '}
              <h2
                style={{
                  fontFamily: "'Playfair Display',serif",
                  fontSize: 'clamp(28px,4vw,44px)',
                  color: B.navy,
                }}
              >
                What Our Patients Say
              </h2>
                       {' '}
            </div>
                     {' '}
            <div style={{ maxWidth: '700px', margin: '0 auto 36px' }}>
                         {' '}
              <div
                key={tIdx}
                className="fi"
                style={{
                  background: 'white',
                  borderRadius: '26px',
                  padding: '44px 40px',
                  boxShadow: '0 8px 44px rgba(0,0,0,.1)',
                  textAlign: 'center',
                }}
              >
                             {' '}
                <div
                  style={{
                    fontSize: '56px',
                    color: B.gold + '30',
                    marginBottom: '16px',
                    fontFamily: "'Playfair Display',serif",
                    lineHeight: 0.8,
                  }}
                >
                  "
                </div>
                             {' '}
                <p
                  style={{
                    color: '#334155',
                    fontSize: '18px',
                    lineHeight: 1.85,
                    marginBottom: '28px',
                    fontStyle: 'italic',
                  }}
                >
                  {TESTIMONIALS[tIdx].text}
                </p>
                             {' '}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '14px',
                  }}
                >
                                 {' '}
                  <div
                    style={{
                      width: '52px',
                      height: '52px',
                      borderRadius: '50%',
                      background: TESTIMONIALS[tIdx].color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontWeight: 700,
                      fontSize: '17px',
                    }}
                  >
                    {TESTIMONIALS[tIdx].init}
                  </div>
                                 {' '}
                  <div style={{ textAlign: 'left' }}>
                                     {' '}
                    <div
                      style={{
                        fontWeight: 700,
                        color: B.navy,
                        fontSize: '16px',
                      }}
                    >
                      {TESTIMONIALS[tIdx].name}
                    </div>
                                     {' '}
                    <div style={{ color: '#94A3B8', fontSize: '13px' }}>
                      {TESTIMONIALS[tIdx].role}
                    </div>
                                   {' '}
                  </div>
                                 {' '}
                  <div style={{ color: B.gold, fontSize: '17px' }}>
                    {'⭐⭐⭐⭐⭐'}
                  </div>
                               {' '}
                </div>
                           {' '}
              </div>
                         {' '}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  gap: '8px',
                  marginTop: '18px',
                }}
              >
                             {' '}
                {TESTIMONIALS.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setTIdx(i)}
                    style={{
                      width: i === tIdx ? '26px' : '8px',
                      height: '8px',
                      borderRadius: '4px',
                      background: i === tIdx ? B.gold : '#CBD5E1',
                      border: 'none',
                      cursor: 'pointer',
                      transition: 'all .3s',
                    }}
                  />
                ))}
                           {' '}
              </div>
                       {' '}
            </div>
                     {' '}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))',
                gap: '18px',
              }}
            >
                         {' '}
              {TESTIMONIALS.map((t, i) => (
                <div
                  key={t.name}
                  className="hl"
                  onClick={() => setTIdx(i)}
                  style={{
                    background: 'white',
                    borderRadius: '18px',
                    padding: '24px',
                    boxShadow: '0 2px 14px rgba(0,0,0,.07)',
                    cursor: 'pointer',
                    border:
                      '2px solid ' + (i === tIdx ? B.gold : 'transparent'),
                  }}
                >
                                 {' '}
                  <div
                    style={{
                      color: B.gold,
                      fontSize: '15px',
                      marginBottom: '10px',
                    }}
                  >
                    {'⭐⭐⭐⭐⭐'}
                  </div>
                                 {' '}
                  <p
                    style={{
                      color: '#475569',
                      fontSize: '13px',
                      lineHeight: 1.7,
                      marginBottom: '16px',
                    }}
                  >
                    "{t.text.slice(0, 100)}..."
                  </p>
                                 {' '}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                    }}
                  >
                                     {' '}
                    <div
                      style={{
                        width: '38px',
                        height: '38px',
                        borderRadius: '50%',
                        background: t.color,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontWeight: 700,
                        fontSize: '14px',
                        flexShrink: 0,
                      }}
                    >
                      {t.init}
                    </div>
                                     {' '}
                    <div>
                                         {' '}
                      <div
                        style={{
                          fontWeight: 700,
                          color: B.navy,
                          fontSize: '13px',
                        }}
                      >
                        {t.name}
                      </div>
                                         {' '}
                      <div style={{ color: '#94A3B8', fontSize: '12px' }}>
                        {t.role}
                      </div>
                                       {' '}
                    </div>
                                   {' '}
                  </div>
                               {' '}
                </div>
              ))}
                       {' '}
            </div>
                   {' '}
          </div>
               {' '}
        </section>
             {' '}
        <section
          style={{
            padding: '50px 28px',
            background: 'white',
            borderTop: '1px solid #E2E8F0',
          }}
        >
                 {' '}
          <div
            style={{ maxWidth: '960px', margin: '0 auto', textAlign: 'center' }}
          >
                     {' '}
            <div
              style={{
                color: '#94A3B8',
                fontSize: '12px',
                fontWeight: 700,
                letterSpacing: '2px',
                textTransform: 'uppercase',
                marginBottom: '24px',
              }}
            >
              Trusted by Facilities Across the Region
            </div>
                     {' '}
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                flexWrap: 'wrap',
                gap: '20px',
              }}
            >
                         {' '}
              {[
                '🏥 City Medical Center',
                '🏨 Sunrise Rehab Center',
                '🏡 Oakwood Nursing Home',
                '💉 Metro Dialysis Ctr',
                '🏥 Valley Hospital',
                '🏡 Clearwater Manor',
              ].map((f) => (
                <div
                  key={f}
                  style={{
                    color: '#64748B',
                    fontSize: '14px',
                    fontWeight: 700,
                    padding: '10px 18px',
                    background: '#F8FAFF',
                    borderRadius: '10px',
                    border: '1px solid #E2E8F0',
                  }}
                >
                  {f}
                </div>
              ))}
                       {' '}
            </div>
                   {' '}
          </div>
               {' '}
        </section>
             {' '}
        <section
          style={{
            padding: '90px 28px',
            background: 'linear-gradient(135deg,' + B.navy + ',#224E88)',
            textAlign: 'center',
          }}
        >
                 {' '}
          <div style={{ maxWidth: '620px', margin: '0 auto' }}>
                     {' '}
            <h2
              style={{
                fontFamily: "'Playfair Display',serif",
                fontSize: 'clamp(28px,4vw,46px)',
                color: 'white',
                marginBottom: '16px',
              }}
            >
              Ready to Book Your Ride?
            </h2>
                     {' '}
            <p
              style={{
                color: 'rgba(255,255,255,.7)',
                fontSize: '17px',
                marginBottom: '36px',
                lineHeight: 1.7,
              }}
            >
              Join thousands of patients who trust Trins Transport for safe,
              on-time, compassionate care.
            </p>
                     {' '}
            <div
              style={{
                display: 'flex',
                gap: '14px',
                justifyContent: 'center',
                flexWrap: 'wrap',
              }}
            >
                         {' '}
              <button
                className="gb"
                onClick={() => setPage('welcome')}
                style={{
                  background: B.gold,
                  color: 'white',
                  border: 'none',
                  borderRadius: '14px',
                  padding: '18px 40px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  fontSize: '17px',
                }}
              >
                Book a Ride Now →
              </button>
                         {' '}
              <a
                href={'tel:' + B.phone}
                style={{
                  background: 'rgba(255,255,255,.09)',
                  color: 'white',
                  border: '2px solid rgba(255,255,255,.2)',
                  borderRadius: '14px',
                  padding: '18px 30px',
                  fontWeight: 700,
                  fontSize: '15px',
                  textDecoration: 'none',
                }}
              >
                📞 {B.phone}
              </a>
                       {' '}
            </div>
                   {' '}
          </div>
               {' '}
        </section>
             {' '}
        <footer style={{ background: '#050D1A', padding: '48px 28px 24px' }}>
                 {' '}
          <div style={{ maxWidth: '1120px', margin: '0 auto' }}>
                     {' '}
            <div
              style={{
                display: 'flex',
                gap: '40px',
                flexWrap: 'wrap',
                marginBottom: '32px',
              }}
            >
                         {' '}
              <div style={{ flex: '2 1 220px' }}>
                             {' '}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    marginBottom: '12px',
                  }}
                >
                                  <span style={{ fontSize: '22px' }}>🚐</span> 
                               {' '}
                  <span
                    style={{
                      color: 'white',
                      fontFamily: "'Playfair Display',serif",
                      fontSize: '18px',
                      fontWeight: 800,
                    }}
                  >
                    {B.name}
                  </span>
                               {' '}
                </div>
                             {' '}
                <p
                  style={{
                    color: 'rgba(255,255,255,.4)',
                    fontSize: '13px',
                    lineHeight: 1.8,
                  }}
                >
                  Professional non-emergency medical transportation. Licensed,
                  insured, and HIPAA compliant.
                </p>
                           {' '}
              </div>
                         {' '}
              <div style={{ flex: '1 1 140px' }}>
                             {' '}
                <div
                  style={{
                    color: 'white',
                    fontWeight: 700,
                    fontSize: '14px',
                    marginBottom: '14px',
                  }}
                >
                  Contact
                </div>
                             {' '}
                <div
                  style={{
                    color: 'rgba(255,255,255,.4)',
                    fontSize: '13px',
                    marginBottom: '8px',
                  }}
                >
                  📞 {B.phone}
                </div>
                             {' '}
                <div
                  style={{
                    color: 'rgba(255,255,255,.4)',
                    fontSize: '13px',
                    marginBottom: '8px',
                  }}
                >
                  ✉️ {B.email}
                </div>
                             {' '}
                <div
                  style={{ color: 'rgba(255,255,255,.4)', fontSize: '13px' }}
                >
                  📍 Serving the Greater Metro Area
                </div>
                           {' '}
              </div>
                       {' '}
            </div>
                     {' '}
            <div
              style={{
                borderTop: '1px solid rgba(255,255,255,.07)',
                paddingTop: '20px',
                display: 'flex',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '8px',
                fontSize: '12px',
                color: 'rgba(255,255,255,.3)',
              }}
            >
                          <span>© 2026 {B.name}. All rights reserved.</span>   
                     {' '}
              <span>Licensed · Insured · HIPAA Compliant · ADA Certified</span> 
                     {' '}
            </div>
                   {' '}
          </div>
               {' '}
        </footer>
           {' '}
      </div>
    );

  if (page === 'welcome')
    return (
      <div
        style={{
          background: 'linear-gradient(160deg,' + B.navy + ' 0%,#1E3D6F 100%)',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '30px 20px',
          fontFamily: "'Lato',sans-serif",
        }}
      >
              <CSS />     {' '}
        <button
          onClick={() => setPage('landing')}
          style={{
            position: 'absolute',
            top: '20px',
            left: '20px',
            background: 'rgba(255,255,255,.1)',
            border: 'none',
            color: 'white',
            borderRadius: '8px',
            padding: '8px 14px',
            cursor: 'pointer',
            fontSize: '13px',
            fontFamily: 'inherit',
          }}
        >
          Back to Site
        </button>
             {' '}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                 {' '}
          <div
            style={{
              width: '84px',
              height: '84px',
              background: B.gold,
              borderRadius: '22px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
              fontSize: '42px',
            }}
          >
            🚐
          </div>
                 {' '}
          <h1
            style={{
              color: 'white',
              fontSize: '28px',
              fontWeight: 800,
              margin: '0 0 6px',
              fontFamily: "'Playfair Display',serif",
            }}
          >
            {B.name}
          </h1>
                 {' '}
          <p style={{ color: 'rgba(255,255,255,.55)', fontSize: '14px' }}>
            How will you be using the app today?
          </p>
               {' '}
        </div>
             {' '}
        <div
          style={{
            width: '100%',
            maxWidth: '320px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
          }}
        >
                 {' '}
          <button
            className="gb"
            onClick={() => {
              setUserType('patient');
              setPage('app');
            }}
            style={{
              background: B.gold,
              color: 'white',
              border: 'none',
              borderRadius: '14px',
              padding: '18px',
              fontSize: '16px',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            👤  I'm a Patient
          </button>
                 {' '}
          <button
            className="gb"
            onClick={() => {
              setUserType('facility');
              setPage('app');
            }}
            style={{
              background: 'rgba(255,255,255,.08)',
              color: 'white',
              border: '2px solid rgba(255,255,255,.15)',
              borderRadius: '14px',
              padding: '18px',
              fontSize: '16px',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            🏥  I'm Facility Staff
          </button>
                 {' '}
          <button
            onClick={() => {
              setUserType('admin');
              setPage('admin');
            }}
            style={{
              background: 'transparent',
              color: '#475569',
              border: 'none',
              padding: '12px',
              fontSize: '13px',
              cursor: 'pointer',
              fontFamily: 'inherit',
            }}
          >
            Admin Login
          </button>
               {' '}
        </div>
           {' '}
      </div>
    );

  if (page === 'admin') {
    const rev = rides
      .reduce((a, r) => a + parseFloat(r.cost.replace('$', '')), 0)
      .toFixed(2);
    return (
      <div
        style={{
          background: '#F8FAFC',
          minHeight: '100vh',
          fontFamily: "'Lato',sans-serif",
        }}
      >
                <CSS />       {' '}
        <div
          style={{ background: B.navy, padding: '18px 20px', color: 'white' }}
        >
                   {' '}
          <button
            onClick={() => setPage('welcome')}
            style={{
              background: 'none',
              border: 'none',
              color: 'white',
              fontSize: '20px',
              cursor: 'pointer',
              marginBottom: '6px',
              padding: 0,
            }}
          >
            ←
          </button>
                   {' '}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '24px' }}>🚐</span>
            <div>
              <div style={{ fontWeight: 700, fontSize: '17px' }}>{B.name}</div>
              <div style={{ fontSize: '11px', opacity: 0.5 }}>
                Admin Dashboard
              </div>
            </div>
          </div>
                 {' '}
        </div>
               {' '}
        <div style={{ padding: '20px' }}>
                   {' '}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '12px',
              marginBottom: '22px',
            }}
          >
                       {' '}
            {[
              ['Rides', rides.length, '🚐', '#EFF6FF', '#1D4ED8'],
              [
                'Scheduled',
                rides.filter((r) => r.status === 'Scheduled').length,
                '📅',
                '#FEF3C7',
                '#92400E',
              ],
              [
                'Completed',
                rides.filter((r) => r.status === 'Completed').length,
                '✅',
                '#DCFCE7',
                '#166534',
              ],
              ['Revenue', '$' + rev, '💰', '#F3E8FF', '#6B21A8'],
            ].map(([l, v, i, bg, tc]) => (
              <div
                key={l}
                style={{
                  background: 'white',
                  borderRadius: '14px',
                  padding: '16px',
                  boxShadow: '0 1px 6px rgba(0,0,0,.07)',
                }}
              >
                               {' '}
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    background: bg,
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '18px',
                    marginBottom: '8px',
                  }}
                >
                  {i}
                </div>
                               {' '}
                <div style={{ fontSize: '22px', fontWeight: 700, color: tc }}>
                  {v}
                </div>
                               {' '}
                <div style={{ fontSize: '12px', color: '#94A3B8' }}>{l}</div>   
                         {' '}
              </div>
            ))}
                     {' '}
          </div>
                   {' '}
          <h3
            style={{
              color: B.navy,
              marginBottom: '12px',
              fontFamily: "'Playfair Display',serif",
            }}
          >
            All Bookings
          </h3>
                   {' '}
          {rides.map((r) => (
            <div
              key={r.id}
              style={{
                background: 'white',
                borderRadius: '14px',
                padding: '16px',
                marginBottom: '10px',
                boxShadow: '0 1px 6px rgba(0,0,0,.07)',
              }}
            >
                           {' '}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: '8px',
                }}
              >
                               {' '}
                <span style={{ fontWeight: 700, color: B.navy }}>{r.date}</span>
                               {' '}
                <span
                  style={{
                    background:
                      r.status === 'Completed' ? '#DCFCE7' : '#DBEAFE',
                    color: r.status === 'Completed' ? '#166534' : '#1D4ED8',
                    borderRadius: '20px',
                    padding: '3px 12px',
                    fontSize: '12px',
                    fontWeight: 700,
                  }}
                >
                  {r.status}
                </span>
                             {' '}
              </div>
                           {' '}
              <div style={{ fontSize: '13px', color: '#64748B' }}>
                📍 {r.from} → 🏥 {r.to}
              </div>
                           {' '}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginTop: '8px',
                  fontSize: '13px',
                }}
              >
                               {' '}
                <span style={{ color: '#94A3B8' }}>Driver: {r.driver}</span>   
                           {' '}
                <span
                  style={{ fontWeight: 700, color: B.sky, fontSize: '15px' }}
                >
                  {r.cost}
                </span>
                             {' '}
              </div>
                         {' '}
            </div>
          ))}
                 {' '}
        </div>
             {' '}
      </div>
    );
  }

  const Inp = ({ label, val, k, ph, type = 'text' }) => (
    <div>
           {' '}
      <label
        style={{
          fontSize: '11px',
          color: '#64748B',
          display: 'block',
          marginBottom: '5px',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.6px',
        }}
      >
        {label}
      </label>
           {' '}
      <input
        type={type}
        value={val}
        onChange={(e) => setBooking({ ...booking, [k]: e.target.value })}
        placeholder={ph}
        style={{
          width: '100%',
          padding: '12px',
          borderRadius: '10px',
          border: '2px solid #E2E8F0',
          fontSize: '15px',
          boxSizing: 'border-box',
          fontFamily: 'inherit',
          outline: 'none',
        }}
      />
         {' '}
    </div>
  );

  const Home = () => (
    <div style={{ padding: '18px' }}>
           {' '}
      <div
        style={{
          background: 'linear-gradient(135deg,' + B.navy + ',#1B3D6F)',
          borderRadius: '20px',
          padding: '22px',
          marginBottom: '14px',
          color: 'white',
        }}
      >
               {' '}
        <p
          style={{
            margin: '0 0 2px',
            opacity: 0.55,
            fontSize: '11px',
            textTransform: 'uppercase',
            letterSpacing: '1px',
          }}
        >
          {userType === 'facility' ? 'Facility Portal' : 'Welcome Back'}
        </p>
               {' '}
        <h2
          style={{
            margin: '0 0 16px',
            fontSize: '21px',
            fontFamily: "'Playfair Display',serif",
          }}
        >
          Where are we going today?
        </h2>
               {' '}
        <button
          className="gb"
          onClick={() => setTab('book')}
          style={{
            background: B.gold,
            color: 'white',
            border: 'none',
            borderRadius: '10px',
            padding: '12px 24px',
            fontWeight: 700,
            cursor: 'pointer',
            fontSize: '14px',
          }}
        >
          + Book a Ride
        </button>
             {' '}
      </div>
           {' '}
      <div
        style={{
          background: '#FFF1F2',
          border: '2px solid #FECDD3',
          borderRadius: '16px',
          padding: '14px',
          marginBottom: '14px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
        }}
      >
                <span style={{ fontSize: '28px' }}>🚨</span>       {' '}
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700, color: '#991B1B', fontSize: '13px' }}>
            Urgent Non-Emergency Issue?
          </div>
          <div style={{ fontSize: '11px', color: '#DC2626' }}>
            Tap to reach the owner directly
          </div>
        </div>
               {' '}
        <a
          href={'tel:' + B.phone}
          style={{
            background: '#DC2626',
            color: 'white',
            borderRadius: '8px',
            padding: '9px 13px',
            fontWeight: 700,
            fontSize: '12px',
            textDecoration: 'none',
            whiteSpace: 'nowrap',
          }}
        >
          Call Now
        </a>
             {' '}
      </div>
           {' '}
      <h3
        style={{
          color: B.navy,
          marginBottom: '10px',
          fontSize: '14px',
          fontWeight: 700,
        }}
      >
        Recent Rides
      </h3>
           {' '}
      {rides.slice(0, 3).map((r) => (
        <div
          key={r.id}
          style={{
            background: 'white',
            borderRadius: '14px',
            padding: '14px',
            marginBottom: '8px',
            boxShadow: '0 1px 6px rgba(0,0,0,.07)',
          }}
        >
                   {' '}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: '6px',
            }}
          >
                       {' '}
            <span style={{ fontWeight: 700, color: B.navy, fontSize: '13px' }}>
              {r.date}
            </span>
                       {' '}
            <span
              style={{
                background: r.status === 'Completed' ? '#DCFCE7' : '#DBEAFE',
                color: r.status === 'Completed' ? '#166534' : '#1D4ED8',
                borderRadius: '20px',
                padding: '2px 10px',
                fontSize: '11px',
                fontWeight: 700,
              }}
            >
              {r.status}
            </span>
                     {' '}
          </div>
                   {' '}
          <div style={{ fontSize: '12px', color: '#64748B' }}>
            📍 {r.from} → 🏥 {r.to}
          </div>
                   {' '}
          <div
            style={{
              fontWeight: 700,
              color: B.sky,
              marginTop: '4px',
              fontSize: '13px',
            }}
          >
            {r.cost}
          </div>
                 {' '}
        </div>
      ))}
         {' '}
    </div>
  );

  const Book = () => {
    if (booked)
      return (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '60px 30px',
            textAlign: 'center',
          }}
        >
                 {' '}
          <div style={{ fontSize: '72px', marginBottom: '16px' }}>✅</div>     
           {' '}
          <h2
            style={{
              color: B.navy,
              marginBottom: '8px',
              fontFamily: "'Playfair Display',serif",
            }}
          >
            Ride Confirmed!
          </h2>
                 {' '}
          <p style={{ color: '#64748B', fontSize: '14px' }}>
            Your booking is in. We'll be in touch shortly!
          </p>
               {' '}
        </div>
      );
    return (
      <div style={{ padding: '18px' }}>
               {' '}
        <h2
          style={{
            color: B.navy,
            marginBottom: '4px',
            fontFamily: "'Playfair Display',serif",
          }}
        >
          Book a Ride
        </h2>
               {' '}
        <p style={{ color: '#94A3B8', fontSize: '12px', marginBottom: '16px' }}>
          Step {bookStep} of 3
        </p>
               {' '}
        <div style={{ display: 'flex', gap: '6px', marginBottom: '20px' }}>
                   {' '}
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              style={{
                flex: 1,
                height: '4px',
                borderRadius: '2px',
                background: s <= bookStep ? B.gold : '#E2E8F0',
              }}
            />
          ))}
                 {' '}
        </div>
               {' '}
        {bookStep === 1 && (
          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '13px' }}
          >
                       {' '}
            <Inp
              label="Patient Name"
              val={booking.name}
              k="name"
              ph="Full name"
            />
                       {' '}
            <Inp
              label="Phone"
              val={booking.phone}
              k="phone"
              ph="(555) 000-0000"
              type="tel"
            />
                       {' '}
            <Inp
              label="Pickup Address"
              val={booking.pickup}
              k="pickup"
              ph="123 Main Street"
            />
                       {' '}
            <Inp
              label="Drop-off Address"
              val={booking.dropoff}
              k="dropoff"
              ph="City Medical Center"
            />
                       {' '}
            <button
              className="gb"
              onClick={() => setBookStep(2)}
              disabled={!booking.name || !booking.pickup || !booking.dropoff}
              style={{
                background: B.gold,
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                padding: '15px',
                fontSize: '15px',
                fontWeight: 700,
                cursor: 'pointer',
                opacity:
                  !booking.name || !booking.pickup || !booking.dropoff
                    ? 0.4
                    : 1,
              }}
            >
              Next — Date and Time →
            </button>
                     {' '}
          </div>
        )}
               {' '}
        {bookStep === 2 && (
          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '13px' }}
          >
                       {' '}
            <Inp label="Date" val={booking.date} k="date" ph="" type="date" />
                       {' '}
            <Inp label="Time" val={booking.time} k="time" ph="" type="time" />
                       {' '}
            <Inp
              label="Estimated Miles"
              val={booking.miles}
              k="miles"
              ph="e.g. 12"
              type="number"
            />
                       {' '}
            <div>
                           {' '}
              <label
                style={{
                  fontSize: '11px',
                  color: '#64748B',
                  display: 'block',
                  marginBottom: '8px',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.6px',
                }}
              >
                Special Needs
              </label>
                           {' '}
              {[
                [
                  'wheelchair',
                  '♿ Wheelchair Accessible',
                  '$' + B.wheelchairFee,
                ],
                [
                  'heavy',
                  '⚖️ Bariatric Transport (300+ lbs)',
                  '$' + B.heavyFee,
                ],
              ].map(([k, lbl, fee]) => (
                <label
                  key={k}
                  onClick={() => setBooking({ ...booking, [k]: !booking[k] })}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    background: 'white',
                    padding: '13px',
                    borderRadius: '10px',
                    border: '2px solid ' + (booking[k] ? B.gold : '#E2E8F0'),
                    cursor: 'pointer',
                    marginBottom: '8px',
                  }}
                >
                                   {' '}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                    }}
                  >
                                       {' '}
                    <div
                      style={{
                        width: '20px',
                        height: '20px',
                        borderRadius: '6px',
                        background: booking[k] ? B.gold : '#F1F5F9',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '11px',
                        color: 'white',
                        fontWeight: 700,
                      }}
                    >
                      {booking[k] ? '✓' : ''}
                    </div>
                                       {' '}
                    <span style={{ fontSize: '14px' }}>{lbl}</span>             
                       {' '}
                  </div>
                                   {' '}
                  <span
                    style={{ fontSize: '12px', color: B.gold, fontWeight: 700 }}
                  >
                    +{fee}
                  </span>
                                 {' '}
                </label>
              ))}
                         {' '}
            </div>
                       {' '}
            <div>
                           {' '}
              <label
                style={{
                  fontSize: '11px',
                  color: '#64748B',
                  display: 'block',
                  marginBottom: '5px',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.6px',
                }}
              >
                Notes
              </label>
                           {' '}
              <textarea
                value={booking.notes}
                onChange={(e) =>
                  setBooking({ ...booking, notes: e.target.value })
                }
                placeholder="Medical equipment, special needs..."
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '10px',
                  border: '2px solid #E2E8F0',
                  fontSize: '14px',
                  boxSizing: 'border-box',
                  height: '70px',
                  resize: 'none',
                  fontFamily: 'inherit',
                }}
              />
                         {' '}
            </div>
                       {' '}
            <div style={{ display: 'flex', gap: '10px' }}>
                           {' '}
              <button
                onClick={() => setBookStep(1)}
                style={{
                  flex: 1,
                  background: '#F1F5F9',
                  color: B.navy,
                  border: 'none',
                  borderRadius: '12px',
                  padding: '13px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                }}
              >
                ← Back
              </button>
                           {' '}
              <button
                className="gb"
                onClick={() => setBookStep(3)}
                disabled={!booking.date || !booking.time}
                style={{
                  flex: 2,
                  background: B.gold,
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '13px',
                  fontSize: '14px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  opacity: !booking.date || !booking.time ? 0.4 : 1,
                }}
              >
                Review and Pay →
              </button>
                         {' '}
            </div>
                     {' '}
          </div>
        )}
               {' '}
        {bookStep === 3 && (
          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '13px' }}
          >
                       {' '}
            <div
              style={{
                background: '#F8FAFF',
                borderRadius: '14px',
                padding: '16px',
                border: '2px solid #E2E8F0',
              }}
            >
                           {' '}
              <h3
                style={{
                  color: B.navy,
                  marginBottom: '12px',
                  fontSize: '14px',
                }}
              >
                📋 Booking Summary
              </h3>
                           {' '}
              {[
                ['Patient', booking.name],
                ['Phone', booking.phone],
                ['From', booking.pickup],
                ['To', booking.dropoff],
                ['Date', booking.date],
                ['Time', booking.time],
                ['Miles', (booking.miles || '?') + ' mi'],
              ].map(([l, v]) => (
                <div
                  key={l}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: '6px',
                    fontSize: '13px',
                  }}
                >
                                   {' '}
                  <span style={{ color: '#64748B' }}>{l}</span>                 {' '}
                  <span
                    style={{
                      fontWeight: 700,
                      color: B.navy,
                      maxWidth: '58%',
                      textAlign: 'right',
                    }}
                  >
                    {v}
                  </span>
                                 {' '}
                </div>
              ))}
                           {' '}
              {booking.wheelchair && (
                <div
                  style={{
                    fontSize: '12px',
                    color: '#0369A1',
                    marginTop: '4px',
                  }}
                >
                  ♿ Wheelchair accessible included
                </div>
              )}
                           {' '}
              {booking.heavy && (
                <div style={{ fontSize: '12px', color: '#0369A1' }}>
                  ⚖️ Bariatric transport included
                </div>
              )}
                           {' '}
              <div
                style={{
                  borderTop: '2px solid #E2E8F0',
                  marginTop: '12px',
                  paddingTop: '12px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                               {' '}
                <span style={{ fontWeight: 700, color: B.navy }}>
                  Estimated Total
                </span>
                               {' '}
                <span
                  style={{ fontWeight: 800, fontSize: '24px', color: B.gold }}
                >
                  ${calcCost()}
                </span>
                             {' '}
              </div>
                         {' '}
            </div>
                       {' '}
            <div
              style={{
                background: 'white',
                borderRadius: '14px',
                padding: '16px',
                border: '2px solid #E2E8F0',
              }}
            >
                           {' '}
              <h3
                style={{
                  color: B.navy,
                  marginBottom: '12px',
                  fontSize: '14px',
                }}
              >
                💳 Payment
              </h3>
                           {' '}
              <input
                placeholder="Card number"
                style={{
                  width: '100%',
                  padding: '11px',
                  borderRadius: '8px',
                  border: '1px solid #E2E8F0',
                  fontSize: '14px',
                  marginBottom: '8px',
                  boxSizing: 'border-box',
                  fontFamily: 'inherit',
                }}
              />
                           {' '}
              <div style={{ display: 'flex', gap: '8px' }}>
                               {' '}
                <input
                  placeholder="MM/YY"
                  style={{
                    flex: 1,
                    padding: '11px',
                    borderRadius: '8px',
                    border: '1px solid #E2E8F0',
                    fontSize: '14px',
                    fontFamily: 'inherit',
                  }}
                />
                               {' '}
                <input
                  placeholder="CVV"
                  style={{
                    flex: 1,
                    padding: '11px',
                    borderRadius: '8px',
                    border: '1px solid #E2E8F0',
                    fontSize: '14px',
                    fontFamily: 'inherit',
                  }}
                />
                             {' '}
              </div>
                           {' '}
              <div
                style={{
                  fontSize: '11px',
                  color: '#94A3B8',
                  textAlign: 'center',
                  marginTop: '8px',
                }}
              >
                🔒 SSL Secured
              </div>
                         {' '}
            </div>
                       {' '}
            <div style={{ display: 'flex', gap: '10px' }}>
                           {' '}
              <button
                onClick={() => setBookStep(2)}
                style={{
                  flex: 1,
                  background: '#F1F5F9',
                  color: B.navy,
                  border: 'none',
                  borderRadius: '12px',
                  padding: '13px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                }}
              >
                ← Back
              </button>
                           {' '}
              <button
                className="gb"
                onClick={confirmBooking}
                style={{
                  flex: 2,
                  background: '#16A34A',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '13px',
                  fontSize: '14px',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                ✅ Confirm and Pay
              </button>
                         {' '}
            </div>
                     {' '}
          </div>
        )}
             {' '}
      </div>
    );
  };

  const Chat = () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: 'calc(100vh - 130px)',
      }}
    >
           {' '}
      <div
        style={{ padding: '14px 18px 10px', borderBottom: '2px solid #F1F5F9' }}
      >
               {' '}
        <h2
          style={{
            margin: '0 0 2px',
            color: B.navy,
            fontSize: '17px',
            fontFamily: "'Playfair Display',serif",
          }}
        >
          🤖 Ask Us Anything
        </h2>
               {' '}
        <p style={{ margin: 0, color: '#94A3B8', fontSize: '12px' }}>
          Pricing, services, scheduling and more
        </p>
             {' '}
      </div>
           {' '}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '14px 16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          background: '#F8FAFF',
        }}
      >
               {' '}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '6px',
            marginBottom: '2px',
          }}
        >
                   {' '}
          {[
            'How much does a ride cost?',
            'Do you serve weekends?',
            'Can you handle wheelchairs?',
            "What if I'm bariatric?",
          ].map((q) => (
            <button
              key={q}
              onClick={() => setChatIn(q)}
              style={{
                background: 'white',
                border: '1px solid ' + B.sky,
                color: B.sky,
                borderRadius: '20px',
                padding: '5px 12px',
                fontSize: '11px',
                cursor: 'pointer',
                fontFamily: 'inherit',
              }}
            >
              {q}
            </button>
          ))}
                 {' '}
        </div>
               {' '}
        {msgs.map((m, i) => (
          <div
            key={i}
            style={{
              display: 'flex',
              justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start',
            }}
          >
                       {' '}
            <div
              style={{
                maxWidth: '80%',
                background: m.role === 'user' ? B.sky : 'white',
                color: m.role === 'user' ? 'white' : B.navy,
                borderRadius:
                  m.role === 'user'
                    ? '16px 16px 4px 16px'
                    : '16px 16px 16px 4px',
                padding: '10px 14px',
                fontSize: '14px',
                lineHeight: 1.6,
                boxShadow: '0 1px 4px rgba(0,0,0,.07)',
              }}
            >
                            {m.content}           {' '}
            </div>
                     {' '}
          </div>
        ))}
               {' '}
        {chatBusy && (
          <div style={{ display: 'flex' }}>
            <div
              style={{
                background: 'white',
                borderRadius: '16px 16px 16px 4px',
                padding: '10px 16px',
                boxShadow: '0 1px 4px rgba(0,0,0,.07)',
                color: '#94A3B8',
                fontSize: '18px',
                letterSpacing: '4px',
              }}
            >
              ...
            </div>
          </div>
        )}
                <div ref={chatRef} />     {' '}
      </div>
           {' '}
      <div
        style={{
          padding: '10px 14px',
          borderTop: '2px solid #F1F5F9',
          display: 'flex',
          gap: '8px',
          background: 'white',
        }}
      >
               {' '}
        <input
          value={chatIn}
          onChange={(e) => setChatIn(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendChat()}
          placeholder="Ask about pricing, services..."
          style={{
            flex: 1,
            padding: '11px 14px',
            borderRadius: '22px',
            border: '2px solid #E2E8F0',
            fontSize: '14px',
            outline: 'none',
            fontFamily: 'inherit',
          }}
        />
               {' '}
        <button
          onClick={sendChat}
          style={{
            background: B.sky,
            color: 'white',
            border: 'none',
            borderRadius: '50%',
            width: '44px',
            height: '44px',
            fontSize: '18px',
            cursor: 'pointer',
            flexShrink: 0,
          }}
        >
          ↑
        </button>
             {' '}
      </div>
         {' '}
    </div>
  );

  const History = () => (
    <div style={{ padding: '18px' }}>
           {' '}
      <h2
        style={{
          color: B.navy,
          marginBottom: '18px',
          fontFamily: "'Playfair Display',serif",
        }}
      >
        Your Rides
      </h2>
           {' '}
      {rides.map((r) => (
        <div
          key={r.id}
          style={{
            background: 'white',
            borderRadius: '14px',
            padding: '16px',
            marginBottom: '10px',
            boxShadow: '0 1px 6px rgba(0,0,0,.07)',
          }}
        >
                   {' '}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: '8px',
            }}
          >
                       {' '}
            <span style={{ fontWeight: 700, color: B.navy }}>{r.date}</span>   
                   {' '}
            <span
              style={{
                background: r.status === 'Completed' ? '#DCFCE7' : '#DBEAFE',
                color: r.status === 'Completed' ? '#166534' : '#1D4ED8',
                borderRadius: '20px',
                padding: '2px 10px',
                fontSize: '11px',
                fontWeight: 700,
              }}
            >
              {r.status}
            </span>
                     {' '}
          </div>
                   {' '}
          <div style={{ fontSize: '13px', color: '#64748B' }}>📍 {r.from}</div> 
                 {' '}
          <div
            style={{ fontSize: '13px', color: '#64748B', marginBottom: '8px' }}
          >
            🏥 {r.to}
          </div>
                   {' '}
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                       {' '}
            <span style={{ fontSize: '12px', color: '#94A3B8' }}>
              Driver: {r.driver}
            </span>
                       {' '}
            <span style={{ fontWeight: 700, color: B.sky, fontSize: '15px' }}>
              {r.cost}
            </span>
                     {' '}
          </div>
                   {' '}
          {r.status === 'Completed' && (
            <div
              style={{
                marginTop: '10px',
                paddingTop: '10px',
                borderTop: '1px solid #F1F5F9',
              }}
            >
                           {' '}
              <div
                style={{
                  fontSize: '11px',
                  color: '#94A3B8',
                  marginBottom: '4px',
                }}
              >
                Rate your ride:
              </div>
                           {' '}
              <div style={{ display: 'flex', gap: '2px' }}>
                               {' '}
                {[1, 2, 3, 4, 5].map((s) => (
                  <span
                    key={s}
                    onClick={() => setRatings({ ...ratings, [r.id]: s })}
                    style={{
                      fontSize: '22px',
                      cursor: 'pointer',
                      opacity: (ratings[r.id] || 0) >= s ? 1 : 0.22,
                    }}
                  >
                    ⭐
                  </span>
                ))}
                             {' '}
              </div>
                         {' '}
            </div>
          )}
                 {' '}
        </div>
      ))}
         {' '}
    </div>
  );

  const Profile = () => (
    <div style={{ padding: '18px' }}>
           {' '}
      <h2
        style={{
          color: B.navy,
          marginBottom: '18px',
          fontFamily: "'Playfair Display',serif",
        }}
      >
        Profile
      </h2>
           {' '}
      <div
        style={{
          background: 'linear-gradient(135deg,' + B.navy + ',#1B3D6F)',
          borderRadius: '16px',
          padding: '20px',
          marginBottom: '14px',
          textAlign: 'center',
          color: 'white',
        }}
      >
               {' '}
        <div
          style={{
            width: '68px',
            height: '68px',
            background: B.gold,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 12px',
            fontSize: '32px',
          }}
        >
          {userType === 'facility' ? '🏥' : '👤'}
        </div>
               {' '}
        <div style={{ fontWeight: 700, fontSize: '17px' }}>
          {userType === 'facility' ? 'Facility Staff' : 'Patient Account'}
        </div>
             {' '}
      </div>
           {' '}
      {[
        ['📍 Home Address', 'Add your home address'],
        ['🏥 Favorite Facility', 'Your regular medical facility'],
        ['📞 Emergency Contact', 'Contact name and number'],
        ['💊 Medical Notes', 'Equipment, allergies, special needs'],
      ].map(([l, p]) => (
        <div
          key={l}
          style={{
            background: 'white',
            borderRadius: '12px',
            padding: '14px',
            marginBottom: '8px',
            boxShadow: '0 1px 6px rgba(0,0,0,.07)',
          }}
        >
                   {' '}
          <div
            style={{
              fontSize: '13px',
              fontWeight: 700,
              color: B.navy,
              marginBottom: '6px',
            }}
          >
            {l}
          </div>
                   {' '}
          <input
            placeholder={p}
            style={{
              width: '100%',
              padding: '9px',
              borderRadius: '8px',
              border: '1px solid #E2E8F0',
              fontSize: '13px',
              boxSizing: 'border-box',
              fontFamily: 'inherit',
            }}
          />
                 {' '}
        </div>
      ))}
           {' '}
      <button
        onClick={() => setPage('landing')}
        style={{
          width: '100%',
          background: '#FEE2E2',
          color: '#991B1B',
          border: '2px solid #FECDD3',
          borderRadius: '12px',
          padding: '13px',
          fontWeight: 700,
          cursor: 'pointer',
          marginTop: '8px',
          fontFamily: 'inherit',
        }}
      >
        Sign Out
      </button>
         {' '}
    </div>
  );

  const TABS = [
    { id: 'home', icon: '🏠', label: 'Home' },
    { id: 'book', icon: '🚐', label: 'Book' },
    { id: 'chat', icon: '🤖', label: 'Ask AI' },
    { id: 'history', icon: '📋', label: 'History' },
    { id: 'profile', icon: '👤', label: 'Profile' },
  ];

  return (
    <div
      style={{
        background: '#F8FAFC',
        minHeight: '100vh',
        fontFamily: "'Lato',sans-serif",
        maxWidth: '480px',
        margin: '0 auto',
      }}
    >
            <CSS />     {' '}
      <div
        style={{
          background: B.navy,
          padding: '13px 18px',
          color: 'white',
          position: 'sticky',
          top: 0,
          zIndex: 10,
          boxShadow: '0 2px 14px rgba(0,0,0,.28)',
        }}
      >
               {' '}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                   {' '}
          <div
            style={{
              width: '34px',
              height: '34px',
              background: B.gold,
              borderRadius: '9px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '18px',
            }}
          >
            🚐
          </div>
                   {' '}
          <div>
                       {' '}
            <div
              style={{
                fontWeight: 700,
                fontSize: '16px',
                fontFamily: "'Playfair Display',serif",
              }}
            >
              {B.name}
            </div>
                       {' '}
            <div style={{ fontSize: '10px', opacity: 0.45 }}>
              {userType === 'facility'
                ? 'Facility Portal'
                : 'Non-Emergency Medical Transport'}
            </div>
                     {' '}
          </div>
                   {' '}
          <button
            onClick={() => setPage('landing')}
            style={{
              marginLeft: 'auto',
              background: 'rgba(255,255,255,.08)',
              border: 'none',
              color: 'white',
              borderRadius: '6px',
              padding: '5px 10px',
              fontSize: '11px',
              cursor: 'pointer',
              fontFamily: 'inherit',
            }}
          >
            ← Site
          </button>
                 {' '}
        </div>
             {' '}
      </div>
           {' '}
      <div style={{ paddingBottom: '70px' }}>
                {tab === 'home' && <Home />}        {tab === 'book' && <Book />}
                {tab === 'chat' && <Chat />}       {' '}
        {tab === 'history' && <History />}       {' '}
        {tab === 'profile' && <Profile />}     {' '}
      </div>
           {' '}
      <div
        style={{
          position: 'fixed',
          bottom: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '100%',
          maxWidth: '480px',
          background: 'white',
          borderTop: '2px solid #F1F5F9',
          display: 'flex',
          zIndex: 10,
          boxShadow: '0 -4px 16px rgba(0,0,0,.07)',
        }}
      >
               {' '}
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            style={{
              flex: 1,
              background: 'none',
              border: 'none',
              padding: '9px 4px 7px',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '2px',
              fontFamily: 'inherit',
            }}
          >
                        <span style={{ fontSize: '19px' }}>{t.icon}</span>     
                 {' '}
            <span
              style={{
                fontSize: '10px',
                color: tab === t.id ? B.gold : '#94A3B8',
                fontWeight: tab === t.id ? 700 : 400,
              }}
            >
              {t.label}
            </span>
                       {' '}
            {tab === t.id && (
              <div
                style={{
                  width: '18px',
                  height: '2px',
                  background: B.gold,
                  borderRadius: '1px',
                }}
              />
            )}
                     {' '}
          </button>
        ))}
             {' '}
      </div>
         {' '}
    </div>
  );
}
