// src/app/landing/page.tsx
// Standalone marketing landing page — no auth required
import Link from 'next/link';

export const metadata = {
  title: 'HostAI — Smart Hosting, Simplified',
  description: 'AI-powered Airbnb host management. Automate check-in messages, cleaning tasks, and multilingual guest communication.',
};

export default function LandingPage() {
  return (
    <>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        :root {
          --red: #FF385C; --red2: #FF5A5F;
          --dark: #0D0D0F; --dark2: #13131A; --dark3: #1A1A24;
          --card: #16161F; --border: rgba(255,255,255,0.08); --border2: rgba(255,255,255,0.14);
          --text: #F0EEE8; --muted: rgba(240,238,232,0.5); --muted2: rgba(240,238,232,0.3);
          --serif: 'DM Serif Display', Georgia, serif;
          --sans: 'DM Sans', -apple-system, sans-serif;
        }
        html { scroll-behavior: smooth; }
        body { background: var(--dark); color: var(--text); font-family: var(--sans); overflow-x: hidden; }

        nav {
          position: fixed; top: 0; left: 0; right: 0; z-index: 100;
          padding: 0 5vw; display: flex; align-items: center; justify-content: space-between;
          height: 68px; background: rgba(13,13,15,0.75); backdrop-filter: blur(20px);
          border-bottom: 1px solid var(--border);
        }
        .nav-logo { font-family: var(--serif); font-size: 26px; color: var(--red); letter-spacing: -0.5px; text-decoration: none; }
        .nav-links { display: flex; align-items: center; gap: 32px; }
        .nav-links a { font-size: 14px; font-weight: 500; color: var(--muted); text-decoration: none; transition: color .2s; }
        .nav-links a:hover { color: var(--text); }
        .nav-cta { display: flex; gap: 10px; }
        .btn-ghost-sm { background: transparent; border: 1px solid var(--border2); color: var(--text); font-family: var(--sans); font-size: 13px; font-weight: 500; padding: 8px 18px; border-radius: 50px; cursor: pointer; transition: all .2s; text-decoration: none; display: inline-flex; align-items: center; }
        .btn-ghost-sm:hover { border-color: rgba(255,255,255,0.35); }
        .btn-red-sm { background: var(--red); border: none; color: #fff; font-family: var(--sans); font-size: 13px; font-weight: 600; padding: 8px 18px; border-radius: 50px; cursor: pointer; transition: all .2s; text-decoration: none; display: inline-flex; align-items: center; }
        .btn-red-sm:hover { background: #e8304f; transform: translateY(-1px); }

        /* HERO */
        #hero { min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; padding: 120px 5vw 80px; position: relative; overflow: hidden; }
        .hero-bg { position: absolute; inset: 0; z-index: 0; background: radial-gradient(ellipse 80% 60% at 50% 10%, rgba(255,56,92,0.13) 0%, transparent 65%), radial-gradient(ellipse 50% 40% at 80% 80%, rgba(255,90,95,0.07) 0%, transparent 60%), var(--dark); }
        .hero-grid { position: absolute; inset: 0; z-index: 0; opacity: .07; background-image: linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px); background-size: 60px 60px; mask-image: radial-gradient(ellipse 80% 60% at 50% 0%, black 20%, transparent 70%); }
        .hero-tag { display: inline-flex; align-items: center; gap: 7px; background: rgba(255,56,92,0.12); border: 1px solid rgba(255,56,92,0.3); color: #FF7B93; font-size: 12px; font-weight: 600; letter-spacing: .06em; padding: 5px 14px; border-radius: 50px; margin-bottom: 28px; position: relative; z-index: 1; }
        .pulse { width: 6px; height: 6px; border-radius: 50%; background: var(--red); animation: pulse 2s infinite; }
        @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.5;transform:scale(.8)} }
        h1 { font-family: var(--serif); font-size: clamp(44px,7vw,88px); font-weight: 400; line-height: 1.05; letter-spacing: -2px; max-width: 860px; position: relative; z-index: 1; margin-bottom: 24px; }
        h1 em { font-style: italic; color: var(--red); }
        .hero-sub { font-size: clamp(15px,2vw,18px); font-weight: 400; color: var(--muted); max-width: 520px; line-height: 1.7; position: relative; z-index: 1; margin-bottom: 44px; }
        .hero-btns { display: flex; gap: 12px; flex-wrap: wrap; justify-content: center; position: relative; z-index: 1; }
        .btn-primary { background: var(--red); color: #fff; font-family: var(--sans); font-size: 15px; font-weight: 600; padding: 14px 32px; border: none; border-radius: 50px; cursor: pointer; transition: all .2s; box-shadow: 0 0 30px rgba(255,56,92,0.35); text-decoration: none; display: inline-flex; align-items: center; gap: 8px; }
        .btn-primary:hover { background: #e8304f; transform: translateY(-2px); box-shadow: 0 0 40px rgba(255,56,92,.5); }
        .btn-outline { background: transparent; color: var(--text); font-family: var(--sans); font-size: 15px; font-weight: 500; padding: 14px 32px; border: 1px solid var(--border2); border-radius: 50px; cursor: pointer; transition: all .2s; text-decoration: none; display: inline-flex; align-items: center; gap: 8px; }
        .btn-outline:hover { border-color: rgba(255,255,255,.3); background: rgba(255,255,255,.04); }
        .hero-cards { display: flex; gap: 16px; flex-wrap: wrap; justify-content: center; margin-top: 72px; position: relative; z-index: 1; max-width: 960px; }
        .hero-card { background: var(--card); border: 1px solid var(--border); border-radius: 20px; padding: 20px 22px; display: flex; align-items: flex-start; gap: 14px; text-align: left; min-width: 220px; flex: 1; transition: border-color .2s, transform .2s; }
        .hero-card:hover { border-color: var(--border2); transform: translateY(-3px); }
        .hci { width: 40px; height: 40px; border-radius: 12px; flex-shrink: 0; display: flex; align-items: center; justify-content: center; font-size: 18px; }
        .hci-red { background: rgba(255,56,92,.15); } .hci-blue { background: rgba(99,149,255,.12); } .hci-amber { background: rgba(255,185,56,.12); } .hci-green { background: rgba(56,200,130,.12); }
        .hero-card h4 { font-size: 14px; font-weight: 600; margin-bottom: 4px; }
        .hero-card p { font-size: 12px; color: var(--muted); line-height: 1.5; }

        /* LOGOS */
        .logos-strip { padding: 32px 5vw; border-top: 1px solid var(--border); border-bottom: 1px solid var(--border); background: var(--dark2); display: flex; align-items: center; justify-content: center; gap: 48px; flex-wrap: wrap; }
        .logos-strip span { font-size: 13px; color: var(--muted2); font-weight: 500; letter-spacing: .05em; text-transform: uppercase; }

        /* SECTION */
        section { padding: 96px 5vw; }
        .section-tag { font-size: 12px; font-weight: 600; letter-spacing: .08em; text-transform: uppercase; color: var(--red); margin-bottom: 16px; }
        .section-title { font-family: var(--serif); font-size: clamp(32px,5vw,56px); font-weight: 400; line-height: 1.1; letter-spacing: -1px; margin-bottom: 18px; }
        .section-sub { font-size: 16px; color: var(--muted); line-height: 1.7; max-width: 540px; }

        /* FEATURES */
        #features { background: var(--dark2); }
        .features-header { text-align: center; margin-bottom: 64px; }
        .features-header .section-sub { margin: 0 auto; }
        .features-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px; max-width: 1100px; margin: 0 auto; }
        .feature-card { background: var(--card); border: 1px solid var(--border); border-radius: 20px; padding: 28px; transition: border-color .2s, transform .2s; }
        .feature-card:hover { border-color: var(--border2); transform: translateY(-4px); }
        .feature-icon { font-size: 28px; margin-bottom: 16px; }
        .feature-card h3 { font-size: 17px; font-weight: 600; margin-bottom: 8px; }
        .feature-card p { font-size: 14px; color: var(--muted); line-height: 1.65; }
        .ftag { display: inline-block; margin-top: 16px; font-size: 11px; font-weight: 600; letter-spacing: .05em; padding: 3px 10px; border-radius: 50px; }
        .ft-ai { background: rgba(255,56,92,.12); color: #FF7B93; } .ft-auto { background: rgba(99,149,255,.12); color: #7FA4FF; }
        .ft-lang { background: rgba(56,200,130,.12); color: #50D99A; } .ft-clean { background: rgba(255,185,56,.12); color: #FFCA5C; }

        /* HOW */
        #how { background: var(--dark); }
        .how-inner { max-width: 1100px; margin: 0 auto; display: grid; grid-template-columns: 1fr 1fr; gap: 80px; align-items: center; }
        .step { display: flex; gap: 20px; padding: 24px 0; border-bottom: 1px solid var(--border); cursor: default; }
        .step:last-child { border-bottom: none; }
        .step-num { width: 36px; height: 36px; border-radius: 50%; background: var(--card); border: 1px solid var(--border); display: flex; align-items: center; justify-content: center; font-size: 13px; font-weight: 700; color: var(--muted); flex-shrink: 0; transition: all .2s; }
        .step.active .step-num { background: var(--red); border-color: var(--red); color: #fff; }
        .step-body h4 { font-size: 16px; font-weight: 600; margin-bottom: 6px; }
        .step-body p { font-size: 14px; color: var(--muted); line-height: 1.6; }
        .how-visual { background: var(--card); border: 1px solid var(--border); border-radius: 24px; padding: 32px; min-height: 320px; display: flex; align-items: center; justify-content: center; }
        .msg-preview { width: 100%; max-width: 340px; }
        .msg-bubble { background: var(--dark3); border: 1px solid var(--border); border-radius: 16px; padding: 16px 18px; font-size: 13px; line-height: 1.65; color: var(--muted); margin-bottom: 10px; }
        .msg-bubble.ai { background: rgba(255,56,92,.1); border-color: rgba(255,56,92,.2); color: var(--text); }
        .msg-badge { display: inline-flex; align-items: center; gap: 5px; font-size: 10px; font-weight: 700; letter-spacing: .06em; text-transform: uppercase; color: var(--red); margin-bottom: 8px; }
        .typing { display: flex; gap: 4px; margin-top: 8px; }
        .typing span { width: 5px; height: 5px; background: rgba(255,56,92,.5); border-radius: 50%; animation: b 1.2s infinite; }
        .typing span:nth-child(2){animation-delay:.2s} .typing span:nth-child(3){animation-delay:.4s}
        @keyframes b{0%,80%,100%{transform:translateY(0)}40%{transform:translateY(-5px)}}

        /* LANGS */
        #languages { background: var(--dark2); }
        .langs-inner { display: grid; grid-template-columns: repeat(3,1fr); gap: 20px; max-width: 1100px; margin: 0 auto; }
        .lang-card { background: var(--card); border: 1px solid var(--border); border-radius: 20px; padding: 28px; transition: border-color .2s, transform .2s; }
        .lang-card:hover { border-color: var(--border2); transform: translateY(-3px); }
        .lang-flag { font-size: 36px; margin-bottom: 16px; }
        .lang-card h3 { font-size: 18px; font-weight: 600; margin-bottom: 8px; }
        .lang-card p { font-size: 13px; color: var(--muted); line-height: 1.6; font-style: italic; margin-bottom: 12px; }
        .lang-pill { font-size: 11px; font-weight: 600; color: var(--muted2); background: rgba(255,255,255,.05); border-radius: 50px; padding: 3px 10px; display: inline-block; }

        /* STATS */
        #stats { background: var(--dark); border-top: 1px solid var(--border); border-bottom: 1px solid var(--border); padding: 72px 5vw; }
        .stats-grid { display: grid; grid-template-columns: repeat(4,1fr); gap: 40px; max-width: 900px; margin: 0 auto; text-align: center; }
        .stat-num { font-family: var(--serif); font-size: clamp(36px,5vw,56px); letter-spacing: -1px; }
        .stat-label { font-size: 13px; color: var(--muted); margin-top: 6px; }

        /* PRICING */
        #pricing { background: var(--dark2); }
        .pricing-header { text-align: center; margin-bottom: 56px; }
        .pricing-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 20px; max-width: 960px; margin: 0 auto; }
        .pricing-card { background: var(--card); border: 1px solid var(--border); border-radius: 24px; padding: 32px; }
        .pricing-card.featured { border-color: rgba(255,56,92,.4); background: linear-gradient(160deg,rgba(255,56,92,.07) 0%,var(--card) 60%); }
        .pricing-label { font-size: 12px; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; color: var(--muted); margin-bottom: 12px; }
        .pricing-label.popular { color: var(--red); }
        .pricing-price { font-family: var(--serif); font-size: 48px; letter-spacing: -2px; line-height: 1; margin-bottom: 4px; }
        .pricing-price sub { font-family: var(--sans); font-size: 15px; font-weight: 400; color: var(--muted); vertical-align: middle; letter-spacing: 0; }
        .pricing-desc { font-size: 13px; color: var(--muted); margin-bottom: 28px; }
        .pricing-features { list-style: none; display: flex; flex-direction: column; gap: 10px; margin-bottom: 28px; }
        .pricing-features li { font-size: 14px; color: var(--muted); display: flex; align-items: center; gap: 8px; }
        .pricing-features li::before { content:''; width:16px; height:16px; border-radius:50%; background: rgba(255,56,92,.15) url("data:image/svg+xml,%3Csvg viewBox='0 0 16 16' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M4 8l2.5 2.5L12 5.5' stroke='%23FF385C' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E") no-repeat center; flex-shrink:0; }
        .btn-plan { width:100%; padding:13px; border-radius:50px; font-family:var(--sans); font-size:14px; font-weight:600; cursor:pointer; transition:all .2s; text-decoration:none; display:block; text-align:center; }
        .btn-plan-outline { background:transparent; color:var(--text); border:1px solid var(--border2); }
        .btn-plan-outline:hover { border-color:rgba(255,255,255,.3); background:rgba(255,255,255,.04); }
        .btn-plan-red { background:var(--red); color:#fff; border:none; box-shadow:0 0 24px rgba(255,56,92,.3); }
        .btn-plan-red:hover { background:#e8304f; transform:translateY(-1px); }

        /* CTA */
        #cta { background:var(--dark); padding:120px 5vw; text-align:center; position:relative; overflow:hidden; }
        #cta::before { content:''; position:absolute; width:600px; height:600px; border-radius:50%; background:radial-gradient(circle,rgba(255,56,92,.1) 0%,transparent 70%); top:50%; left:50%; transform:translate(-50%,-50%); pointer-events:none; }
        #cta h2 { font-family:var(--serif); font-size:clamp(36px,6vw,68px); letter-spacing:-2px; line-height:1.05; max-width:700px; margin:0 auto 20px; position:relative; }
        #cta h2 em { font-style:italic; color:var(--red); }
        #cta p { font-size:16px; color:var(--muted); margin-bottom:40px; position:relative; }

        /* FOOTER */
        footer { background:var(--dark2); border-top:1px solid var(--border); padding:48px 5vw 32px; }
        .footer-top { display:flex; justify-content:space-between; flex-wrap:wrap; gap:32px; margin-bottom:40px; }
        .footer-logo { font-family:var(--serif); font-size:28px; color:var(--red); text-decoration:none; }
        .footer-tagline { font-size:13px; color:var(--muted); margin-top:6px; max-width:220px; line-height:1.6; }
        .footer-col h5 { font-size:11px; font-weight:700; letter-spacing:.08em; text-transform:uppercase; color:var(--muted2); margin-bottom:14px; }
        .footer-col a { display:block; font-size:14px; color:var(--muted); text-decoration:none; margin-bottom:10px; transition:color .2s; }
        .footer-col a:hover { color:var(--text); }
        .footer-bottom { border-top:1px solid var(--border); padding-top:24px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px; }
        .footer-bottom p { font-size:13px; color:var(--muted2); }

        /* REVEAL */
        .reveal { opacity:0; transform:translateY(28px); transition:opacity .65s ease, transform .65s ease; }
        .reveal.visible { opacity:1; transform:none; }
        .d1{transition-delay:.1s} .d2{transition-delay:.2s} .d3{transition-delay:.3s} .d4{transition-delay:.4s}

        @media(max-width:820px){
          .nav-links{display:none}
          .how-inner{grid-template-columns:1fr;gap:40px}
          .langs-inner{grid-template-columns:1fr}
          .pricing-grid{grid-template-columns:1fr;max-width:420px;margin:0 auto}
          .stats-grid{grid-template-columns:repeat(2,1fr)}
        }
      `}</style>

      {/* Google Fonts */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700&family=DM+Serif+Display:ital@0;1&display=swap" rel="stylesheet" />

      {/* NAV */}
      <nav>
        <Link href="/" className="nav-logo">HostAI</Link>
        <div className="nav-links">
          <a href="#features">Features</a>
          <a href="#how">How it works</a>
          <a href="#languages">Languages</a>
          <a href="#pricing">Pricing</a>
        </div>
        <div className="nav-cta">
          <Link href="/login" className="btn-ghost-sm">Sign in</Link>
          <Link href="/register" className="btn-red-sm">Get started →</Link>
        </div>
      </nav>

      {/* HERO */}
      <section id="hero">
        <div className="hero-bg" />
        <div className="hero-grid" />
        <div className="hero-tag"><span className="pulse" />AI-Powered Host Management</div>
        <h1>Your properties.<br /><em>Hosted smarter.</em></h1>
        <p className="hero-sub">Automate guest check-in messages, cleaning tasks, and multilingual communication — so you can focus on what matters.</p>
        <div className="hero-btns">
          <Link href="/register" className="btn-primary">Start for free →</Link>
          <a href="#how" className="btn-outline">See how it works</a>
        </div>
        <div className="hero-cards">
          {[
            { icon: '✉️', cls: 'hci-red', title: 'Auto check-in messages', desc: 'Personalized welcome messages in the guest\'s language.' },
            { icon: '🧹', cls: 'hci-amber', title: 'Cleaning notifications', desc: 'Cleaners notified the moment a guest checks out.' },
            { icon: '🌍', cls: 'hci-blue', title: '3 languages built-in', desc: 'English, French & Spanish — every guest feels at home.' },
            { icon: '✦', cls: 'hci-green', title: 'Claude AI powered', desc: 'Messages generated by Claude — natural, warm, on-brand.' },
          ].map(c => (
            <div className="hero-card" key={c.title}>
              <div className={`hci ${c.cls}`}>{c.icon}</div>
              <div><h4>{c.title}</h4><p>{c.desc}</p></div>
            </div>
          ))}
        </div>
      </section>

      {/* LOGOS */}
      <div className="logos-strip">
        <span>Trusted by hosts on</span>
        <span>🏠 Airbnb</span><span>🔶 Booking.com</span><span>🏡 Vrbo</span><span>🌐 Direct Bookings</span>
      </div>

      {/* FEATURES */}
      <section id="features">
        <div className="features-header reveal">
          <div className="section-tag">Features</div>
          <div className="section-title">Everything a host needs</div>
          <p className="section-sub">From your first property to a full portfolio — HostAI grows with you.</p>
        </div>
        <div className="features-grid">
          {[
            { icon:'🏠', title:'Property Management', desc:'Add unlimited properties with multilingual titles, WiFi details, check-in instructions, and custom descriptions per language.', tag:'Multilingual', tagCls:'ft-auto' },
            { icon:'✉️', title:'AI Check-in Messages', desc:'One click generates a warm, personalized check-in message for your guest — in English, French, or Spanish.', tag:'AI Powered', tagCls:'ft-ai' },
            { icon:'👋', title:'Check-out Reminders', desc:'Automated departure messages remind guests of check-out time and procedures. No more last-minute confusion.', tag:'Automated', tagCls:'ft-auto' },
            { icon:'🧹', title:'Cleaning Task System', desc:'A cleaning task is auto-created for every booking at checkout. Track status from pending to done.', tag:'Auto-created', tagCls:'ft-clean' },
            { icon:'🤖', title:'Multilingual FAQ Bot', desc:'An AI assistant that answers common guest questions about WiFi, parking, pets, and check-in times.', tag:'3 Languages', tagCls:'ft-lang' },
            { icon:'📊', title:'Live Dashboard', desc:'See all properties, upcoming bookings, pending cleaning tasks, and key stats at a glance.', tag:'Real-time', tagCls:'ft-auto' },
          ].map((f, i) => (
            <div className={`feature-card reveal d${(i%3)+1}`} key={f.title}>
              <div className="feature-icon">{f.icon}</div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
              <span className={`ftag ${f.tagCls}`}>{f.tag}</span>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how">
        <div className="how-inner">
          <div>
            <div className="section-tag reveal">How it works</div>
            <div className="section-title reveal">From booking to <em style={{fontStyle:'italic',color:'var(--red)'}}>checkout</em> — automated</div>
            <div id="steps-container">
              {[
                { n:1, title:'Add your property', desc:'Set up your listing with address, WiFi, check-in times, and multilingual descriptions in minutes.' },
                { n:2, title:'Create a booking', desc:'Add guest details, select their language, and set dates. A cleaning task is auto-created.' },
                { n:3, title:'Generate AI messages', desc:'One click generates check-in, check-out, or cleaning messages — personalized, in the guest\'s language.' },
                { n:4, title:'Edit, copy & send', desc:'Tweak the message in the panel, then copy it directly to Airbnb or your messaging app.' },
              ].map(s => (
                <div className={`step${s.n===1?' active':''}`} key={s.n} id={`step-${s.n}`}>
                  <div className="step-num">{s.n}</div>
                  <div className="step-body"><h4>{s.title}</h4><p>{s.desc}</p></div>
                </div>
              ))}
            </div>
          </div>
          <div className="how-visual reveal">
            <div className="msg-preview" id="msg-preview">
              <div className="msg-bubble ai">
                <div className="msg-badge">✦ AI Generated · EN</div>
                Hi Sophie! 🏠 Welcome to Cozy Paris Apartment. Check-in is from 15:00. WiFi: Paris2024! Feel free to reach out if you need anything. Enjoy your stay!
              </div>
              <div className="msg-bubble" style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'12px 16px'}}>
                <span style={{fontSize:'12px',fontWeight:600}}>⎘ Copy message</span>
                <span style={{fontSize:'12px',color:'var(--red)'}}>↻ Regenerate</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* LANGUAGES */}
      <section id="languages">
        <div style={{textAlign:'center',marginBottom:'56px'}} className="reveal">
          <div className="section-tag">Multilingual</div>
          <div className="section-title">Speak your guest&apos;s language</div>
          <p className="section-sub" style={{margin:'0 auto'}}>Select the guest&apos;s language when adding a booking — every message is generated accordingly.</p>
        </div>
        <div className="langs-inner">
          {[
            { flag:'🇬🇧', lang:'English', quote:'"Hi Sophie! Welcome to Cozy Paris Apartment. Check-in from 3 PM. WiFi: Paris2024! Enjoy your stay!"', pill:'Default language' },
            { flag:'🇫🇷', lang:'Français', quote:'"Bonjour Sophie ! Bienvenue à Appartement Cosy à Paris. L\'arrivée est possible dès 15h. Bon séjour !"', pill:'Fully supported' },
            { flag:'🇪🇸', lang:'Español', quote:'"¡Hola Carlos! Bienvenido al Estudio Playa en Barcelona. El check-in es a las 14h. ¡Disfruta tu estancia!"', pill:'Fully supported' },
          ].map((l,i) => (
            <div className={`lang-card reveal d${i+1}`} key={l.lang}>
              <div className="lang-flag">{l.flag}</div>
              <h3>{l.lang}</h3>
              <p>{l.quote}</p>
              <span className="lang-pill">{l.pill}</span>
            </div>
          ))}
        </div>
      </section>

      {/* STATS */}
      <div id="stats">
        <div className="stats-grid">
          {[['3×','faster guest messaging'],['3','languages supported'],['100%','automated cleaning tasks'],['∞','properties & bookings']].map(([n,l],i)=>(
            <div className={`reveal d${i}`} key={l}><div className="stat-num">{n}</div><div className="stat-label">{l}</div></div>
          ))}
        </div>
      </div>

      {/* PRICING */}
      <section id="pricing">
        <div className="pricing-header reveal">
          <div className="section-tag">Pricing</div>
          <div className="section-title">Simple, transparent pricing</div>
          <p className="section-sub" style={{margin:'0 auto'}}>Start free. Scale as you grow. No hidden fees.</p>
        </div>
        <div className="pricing-grid">
          <div className="pricing-card reveal d1">
            <div className="pricing-label">Starter</div>
            <div className="pricing-price">$0 <sub>/mo</sub></div>
            <div className="pricing-desc">Perfect for getting started</div>
            <ul className="pricing-features"><li>Up to 2 properties</li><li>Unlimited bookings</li><li>AI message templates</li><li>3 languages</li><li>Cleaning tasks</li></ul>
            <Link href="/register" className="btn-plan btn-plan-outline">Get started free</Link>
          </div>
          <div className="pricing-card featured reveal d2">
            <div className="pricing-label popular">⭐ Most Popular</div>
            <div className="pricing-price">$19 <sub>/mo</sub></div>
            <div className="pricing-desc">For growing hosts</div>
            <ul className="pricing-features"><li>Unlimited properties</li><li>Unlimited bookings</li><li>Real Claude AI messages</li><li>3 languages + FAQ bot</li><li>Cleaning task management</li><li>Priority support</li></ul>
            <Link href="/register" className="btn-plan btn-plan-red">Start 14-day trial →</Link>
          </div>
          <div className="pricing-card reveal d3">
            <div className="pricing-label">Pro</div>
            <div className="pricing-price">$49 <sub>/mo</sub></div>
            <div className="pricing-desc">For professional hosts</div>
            <ul className="pricing-features"><li>Everything in Growth</li><li>Team access (3 users)</li><li>Cleaner portal</li><li>Email notifications</li><li>API access</li><li>Custom AI prompts</li></ul>
            <Link href="/register" className="btn-plan btn-plan-outline">Contact us</Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="cta">
        <h2>Ready to host <em>smarter</em>?</h2>
        <p>Join thousands of hosts saving hours every week with HostAI.</p>
        <div className="hero-btns">
          <Link href="/register" className="btn-primary">Create your free account →</Link>
          <Link href="/login" className="btn-outline">Sign in</Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer>
        <div className="footer-top">
          <div>
            <Link href="/" className="footer-logo">HostAI</Link>
            <p className="footer-tagline">AI-powered hosting management for modern Airbnb hosts.</p>
          </div>
          <div className="footer-col"><h5>Product</h5><a href="#features">Features</a><a href="#pricing">Pricing</a><Link href="/dashboard">Dashboard</Link></div>
          <div className="footer-col"><h5>Host Tools</h5><Link href="/properties">Properties</Link><Link href="/bookings">Bookings</Link><Link href="/chat">AI Assistant</Link></div>
          <div className="footer-col"><h5>Company</h5><a href="#">About</a><a href="#">Blog</a><a href="#">Contact</a></div>
        </div>
        <div className="footer-bottom">
          <p>© 2025 HostAI. All rights reserved.</p>
          <p>Built with ❤️ using Next.js &amp; Claude AI</p>
        </div>
      </footer>

      {/* Client-side interactions */}
      <script dangerouslySetInnerHTML={{ __html: `
        // Scroll reveal
        const obs = new IntersectionObserver(entries => {
          entries.forEach(e => { if(e.isIntersecting) e.target.classList.add('visible'); });
        }, { threshold: 0.1 });
        document.querySelectorAll('.reveal').forEach(el => obs.observe(el));

        // Step previews
        const previews = {
          1: \`<div class="msg-bubble ai"><div class="msg-badge">🏠 Property added</div>Cozy Paris Apartment · 12 Rue de Rivoli, Paris<br/><small style="color:var(--muted);font-size:11px;margin-top:6px;display:block">Check-in 15:00 · Check-out 11:00 · WiFi: Paris2024!</small></div>\`,
          2: \`<div class="msg-bubble ai"><div class="msg-badge">📅 Booking created</div>Guest: Sophie Dupont · 🇫🇷 French<br/>Jan 12 → Jan 15, 2025<br/><small style="color:var(--muted);font-size:11px;margin-top:6px;display:block">🧹 Cleaning task auto-created for Jan 15</small></div>\`,
          3: \`<div class="msg-bubble ai"><div class="msg-badge">✦ Generating · FR</div>Bonjour Sophie ! 🏠 Bienvenue à Appartement Cosy à Paris...<div class="typing"><span></span><span></span><span></span></div></div>\`,
          4: \`<div class="msg-bubble ai"><div class="msg-badge">✓ Ready to send · FR</div>Bonjour Sophie ! 🏠 Bienvenue à Appartement Cosy à Paris. L'arrivée est possible dès 15h. WiFi : Paris2024! Bon séjour !</div><div class="msg-bubble" style="display:flex;align-items:center;justify-content:space-between;padding:12px 16px"><span style="font-size:12px;font-weight:600;color:#50D99A">✓ Copied!</span><span style="font-size:12px;color:var(--red)">↻ Regenerate</span></div>\`
        };
        function setStep(n) {
          document.querySelectorAll('.step').forEach(s => s.classList.remove('active'));
          const el = document.getElementById('step-'+n);
          if(el) el.classList.add('active');
          const preview = document.getElementById('msg-preview');
          if(preview) preview.innerHTML = previews[n];
        }
        let cur = 1;
        setInterval(() => { cur = cur >= 4 ? 1 : cur + 1; setStep(cur); }, 3200);
      `}} />
    </>
  );
}
