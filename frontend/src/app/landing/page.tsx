// src/app/landing/page.tsx
// Landing page — must NOT include html/head/body tags (layout.tsx handles those)

export default function LandingPage() {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div dangerouslySetInnerHTML={{ __html: HTML }} />
    </>
  );
}

const CSS = `
.lp*{box-sizing:border-box}
.lp{font-family:'Plus Jakarta Sans',system-ui,sans-serif;background:#0D0D0D;color:#fff;overflow-x:hidden;min-height:100vh}
.lp a{text-decoration:none}
.lp-nav{position:fixed;top:0;left:0;right:0;z-index:100;display:flex;align-items:center;justify-content:space-between;padding:0 5%;height:68px;background:rgba(13,13,13,0.9);backdrop-filter:blur(12px);border-bottom:1px solid rgba(255,255,255,0.08)}
.lp-logo{display:flex;align-items:center;gap:10px}
.lp-logo-icon{width:34px;height:34px;border-radius:10px;background:linear-gradient(135deg,#FF385C,#E31C5F);display:flex;align-items:center;justify-content:center;font-size:16px}
.lp-logo-text{font-size:18px;font-weight:700;color:#fff}
.lp-nav-links{display:flex;align-items:center;gap:32px}
.lp-nav-links a{color:rgba(255,255,255,0.6);font-size:14px;font-weight:500;transition:color .2s}
.lp-nav-links a:hover{color:white}
.lp-nav-cta{display:flex;align-items:center;gap:12px}
.lp-btn-ghost{color:white;font-size:14px;font-weight:500;padding:8px 20px;border-radius:50px;border:1px solid rgba(255,255,255,0.2);transition:all .2s}
.lp-btn-ghost:hover{background:rgba(255,255,255,0.08)}
.lp-btn-primary{background:linear-gradient(135deg,#FF385C,#E31C5F);color:white;font-size:14px;font-weight:600;padding:9px 22px;border-radius:50px;box-shadow:0 4px 16px rgba(255,56,92,.35);transition:all .2s}
.lp-btn-primary:hover{transform:translateY(-1px);box-shadow:0 6px 22px rgba(255,56,92,.45)}
.lp-hero{min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:120px 5% 80px;position:relative;overflow:hidden}
.lp-hero-bg{position:absolute;inset:0;z-index:0;background-image:url('https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=1800&q=80');background-size:cover;background-position:center;filter:brightness(0.18)}
.lp-hero-glow{position:absolute;top:20%;left:50%;transform:translateX(-50%);width:600px;height:400px;border-radius:50%;background:radial-gradient(ellipse,rgba(255,56,92,.15) 0%,transparent 70%);z-index:0;pointer-events:none}
.lp-hero-content{position:relative;z-index:1;max-width:780px}
.lp-badge{display:inline-flex;align-items:center;gap:8px;background:rgba(255,56,92,.15);border:1px solid rgba(255,56,92,.3);color:#FF7091;font-size:13px;font-weight:600;padding:6px 16px;border-radius:50px;margin-bottom:28px}
.lp-badge-dot{width:6px;height:6px;border-radius:50%;background:#FF385C;animation:lp-pulse 2s infinite}
@keyframes lp-pulse{0%,100%{opacity:1}50%{opacity:.4}}
.lp-hero h1{font-size:clamp(40px,6vw,72px);font-weight:800;line-height:1.08;letter-spacing:-.03em;margin-bottom:24px;background:linear-gradient(180deg,#fff 0%,rgba(255,255,255,.7) 100%);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
.lp-hero h1 span{background:linear-gradient(135deg,#FF385C,#FC642D);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
.lp-hero-sub{font-size:18px;color:rgba(255,255,255,.55);line-height:1.65;margin-bottom:44px;max-width:560px;margin-left:auto;margin-right:auto}
.lp-hero-actions{display:flex;align-items:center;justify-content:center;gap:16px;flex-wrap:wrap;margin-bottom:60px}
.lp-btn-hp{background:linear-gradient(135deg,#FF385C,#E31C5F);color:white;font-size:16px;font-weight:700;padding:16px 36px;border-radius:50px;box-shadow:0 8px 32px rgba(255,56,92,.4);transition:all .25s;display:inline-flex;align-items:center;gap:8px}
.lp-btn-hp:hover{transform:translateY(-2px);box-shadow:0 12px 40px rgba(255,56,92,.5)}
.lp-btn-hg{color:white;font-size:15px;font-weight:600;padding:15px 32px;border-radius:50px;border:1.5px solid rgba(255,255,255,.2);transition:all .2s;display:inline-flex;align-items:center;gap:8px}
.lp-btn-hg:hover{background:rgba(255,255,255,.07)}
.lp-stats{display:flex;align-items:center;justify-content:center;gap:48px;flex-wrap:wrap}
.lp-stat-num{font-size:28px;font-weight:800;color:white}
.lp-stat-label{font-size:13px;color:rgba(255,255,255,.4);margin-top:2px}
.lp-stat-div{width:1px;height:36px;background:rgba(255,255,255,.1)}
.lp-proof{padding:36px 5%;border-top:1px solid rgba(255,255,255,.07);border-bottom:1px solid rgba(255,255,255,.07);background:rgba(255,255,255,.02)}
.lp-proof-inner{max-width:1100px;margin:0 auto;display:flex;align-items:center;justify-content:center;gap:14px;flex-wrap:wrap}
.lp-proof-label{font-size:11px;font-weight:700;color:rgba(255,255,255,.25);letter-spacing:.1em;text-transform:uppercase}
.lp-pill{display:flex;align-items:center;gap:7px;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);padding:7px 18px;border-radius:50px;font-size:13px;font-weight:600;color:rgba(255,255,255,.45)}
.lp-dot{width:7px;height:7px;border-radius:50%}
.lp-section{padding:100px 5%;max-width:1200px;margin:0 auto}
.lp-sl{font-size:12px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:#FF385C;margin-bottom:14px}
.lp-st{font-size:clamp(28px,4vw,44px);font-weight:800;line-height:1.15;letter-spacing:-.02em;color:white;margin-bottom:14px}
.lp-ss{font-size:17px;color:rgba(255,255,255,.45);line-height:1.65;max-width:480px}
.lp-fi{display:grid;grid-template-columns:1fr 1fr;gap:60px;align-items:center;margin-bottom:60px}
.lp-ms{display:grid;grid-template-columns:1fr 1fr;gap:12px}
.lp-mc{border-radius:14px;padding:18px}
.lp-mc-i{font-size:22px;margin-bottom:10px}
.lp-mc-n{font-size:22px;font-weight:800;color:white;margin-bottom:4px}
.lp-mc-l{font-size:12px;color:rgba(255,255,255,.4)}
.lp-fg{display:grid;grid-template-columns:repeat(3,1fr);gap:2px;border:1px solid rgba(255,255,255,.08);border-radius:20px;overflow:hidden}
.lp-fc{background:#161616;padding:32px 28px;border-right:1px solid rgba(255,255,255,.07);border-bottom:1px solid rgba(255,255,255,.07);transition:background .2s}
.lp-fc:hover{background:#1c1c1c}
.lp-fc:nth-child(3),.lp-fc:nth-child(6){border-right:none}
.lp-fc:nth-child(4),.lp-fc:nth-child(5),.lp-fc:nth-child(6){border-bottom:none}
.lp-fi2{width:46px;height:46px;border-radius:13px;margin-bottom:18px;display:flex;align-items:center;justify-content:center;font-size:22px}
.lp-fc h3{font-size:16px;font-weight:700;color:white;margin-bottom:10px}
.lp-fc p{font-size:14px;color:rgba(255,255,255,.45);line-height:1.65}
.lp-how{padding:100px 5%;background:rgba(255,255,255,.02);border-top:1px solid rgba(255,255,255,.07);border-bottom:1px solid rgba(255,255,255,.07)}
.lp-hi{max-width:1100px;margin:0 auto}
.lp-steps{display:grid;grid-template-columns:repeat(4,1fr);margin-top:56px}
.lp-step{padding:32px 24px;border-right:1px solid rgba(255,255,255,.07)}
.lp-step:last-child{border-right:none}
.lp-sn{font-size:11px;font-weight:700;letter-spacing:.1em;color:rgba(255,56,92,.7);margin-bottom:18px;text-transform:uppercase}
.lp-si{font-size:28px;margin-bottom:14px}
.lp-step h3{font-size:16px;font-weight:700;color:white;margin-bottom:8px}
.lp-step p{font-size:13px;color:rgba(255,255,255,.4);line-height:1.6}
.lp-props{padding:100px 5%;max-width:1200px;margin:0 auto}
.lp-ph{display:flex;justify-content:space-between;align-items:flex-end;margin-bottom:40px;flex-wrap:wrap;gap:16px}
.lp-pg{display:grid;grid-template-columns:repeat(4,1fr);gap:16px}
.lp-pc{border-radius:16px;overflow:hidden;border:1px solid rgba(255,255,255,.07);background:#161616;transition:all .3s}
.lp-pc:hover{transform:translateY(-4px);border-color:rgba(255,255,255,.15)}
.lp-pi{width:100%;height:180px;object-fit:cover;display:block}
.lp-po{position:relative}
.lp-pb{position:absolute;bottom:10px;left:10px;background:rgba(0,0,0,.7);backdrop-filter:blur(6px);color:white;font-size:12px;font-weight:600;padding:4px 10px;border-radius:6px;border:1px solid rgba(255,255,255,.1)}
.lp-pif{padding:14px 16px}
.lp-pct{font-size:15px;font-weight:700;color:white;margin-bottom:4px}
.lp-pcc{font-size:12px;color:rgba(255,255,255,.4)}
.lp-pricing{padding:100px 5%;max-width:1100px;margin:0 auto;text-align:center}
.lp-prg{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-top:48px;text-align:left}
.lp-prc{background:#161616;border:1px solid rgba(255,255,255,.08);border-radius:20px;padding:32px 28px;position:relative;transition:border-color .2s}
.lp-prc:hover{border-color:rgba(255,255,255,.18)}
.lp-prc.featured{border-color:rgba(255,56,92,.5);background:linear-gradient(145deg,#1a0a0e,#161616)}
.lp-ppb{position:absolute;top:-12px;left:50%;transform:translateX(-50%);background:linear-gradient(135deg,#FF385C,#E31C5F);color:white;font-size:10px;font-weight:700;letter-spacing:.08em;padding:4px 16px;border-radius:50px;white-space:nowrap;text-transform:uppercase}
.lp-pt{font-size:12px;font-weight:700;color:rgba(255,255,255,.35);text-transform:uppercase;letter-spacing:.1em;margin-bottom:12px}
.lp-pn{font-size:48px;font-weight:800;color:white;line-height:1;margin-bottom:4px}
.lp-pn span{font-size:18px;font-weight:500;color:rgba(255,255,255,.35)}
.lp-pp{font-size:13px;color:rgba(255,255,255,.3);margin-bottom:24px}
.lp-pd{height:1px;background:rgba(255,255,255,.07);margin-bottom:20px}
.lp-pfl{list-style:none;display:flex;flex-direction:column;gap:11px;margin-bottom:28px}
.lp-pfl li{font-size:14px;color:rgba(255,255,255,.55);display:flex;align-items:center;gap:10px}
.lp-pfl li::before{content:'✓';width:17px;height:17px;border-radius:50%;background:rgba(0,166,153,.15);border:1px solid rgba(0,166,153,.4);flex-shrink:0;display:flex;align-items:center;justify-content:center;font-size:10px;color:#00A699}
.lp-pfl li.dim{opacity:.3}
.lp-pfl li.dim::before{content:'×';color:rgba(255,255,255,.3);background:transparent;border-color:rgba(255,255,255,.15)}
.lp-prb{display:block;text-align:center;padding:13px;border-radius:12px;font-size:14px;font-weight:700;transition:all .2s}
.lp-prb.o{border:1.5px solid rgba(255,255,255,.2);color:white}
.lp-prb.o:hover{background:rgba(255,255,255,.07)}
.lp-prb.s{background:linear-gradient(135deg,#FF385C,#E31C5F);color:white;box-shadow:0 4px 20px rgba(255,56,92,.3)}
.lp-prb.s:hover{box-shadow:0 6px 28px rgba(255,56,92,.45);transform:translateY(-1px)}
.lp-testi{padding:100px 5%;max-width:1100px;margin:0 auto}
.lp-tg{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-top:48px}
.lp-tc{background:#161616;border:1px solid rgba(255,255,255,.08);border-radius:20px;padding:28px}
.lp-ts{color:#FBBF24;font-size:14px;margin-bottom:16px;letter-spacing:2px}
.lp-tt{font-size:15px;color:rgba(255,255,255,.65);line-height:1.7;margin-bottom:20px;font-style:italic}
.lp-ta{display:flex;align-items:center;gap:12px}
.lp-av{width:40px;height:40px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:700;color:white;flex-shrink:0}
.lp-tn{font-size:14px;font-weight:700;color:white}
.lp-tr{font-size:12px;color:rgba(255,255,255,.35);margin-top:2px}
.lp-cta{padding:80px 5%;margin:0 5% 60px;border-radius:28px;background:linear-gradient(135deg,#1a0508,#160310,#0a0d1a);border:1px solid rgba(255,56,92,.2);text-align:center;position:relative;overflow:hidden}
.lp-cta-glow{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:500px;height:300px;border-radius:50%;background:radial-gradient(ellipse,rgba(255,56,92,.1) 0%,transparent 70%);pointer-events:none}
.lp-cta h2{font-size:clamp(28px,4vw,48px);font-weight:800;letter-spacing:-.02em;margin-bottom:14px;position:relative}
.lp-cta p{font-size:17px;color:rgba(255,255,255,.45);margin-bottom:36px;position:relative}
.lp-cta-actions{display:flex;align-items:center;justify-content:center;gap:16px;flex-wrap:wrap;position:relative}
.lp-footer{padding:60px 5% 28px;border-top:1px solid rgba(255,255,255,.07)}
.lp-ft{display:flex;justify-content:space-between;gap:40px;flex-wrap:wrap;margin-bottom:44px}
.lp-fb{max-width:280px}
.lp-fbl{display:flex;align-items:center;gap:10px;margin-bottom:14px}
.lp-fbi{width:30px;height:30px;border-radius:8px;background:linear-gradient(135deg,#FF385C,#E31C5F);display:flex;align-items:center;justify-content:center;font-size:14px}
.lp-fbn{font-size:16px;font-weight:700;color:white}
.lp-fb p{font-size:13px;color:rgba(255,255,255,.35);line-height:1.65}
.lp-fc2 h4{font-size:11px;font-weight:700;letter-spacing:.09em;text-transform:uppercase;color:rgba(255,255,255,.25);margin-bottom:14px}
.lp-fc2 a{display:block;font-size:14px;color:rgba(255,255,255,.5);margin-bottom:10px;transition:color .2s}
.lp-fc2 a:hover{color:white}
.lp-fbot{display:flex;align-items:center;justify-content:space-between;padding-top:24px;border-top:1px solid rgba(255,255,255,.07);flex-wrap:wrap;gap:12px}
.lp-fbot p{font-size:13px;color:rgba(255,255,255,.22)}
.lp-fl{display:flex;gap:8px}
.lp-fl a{font-size:12px;color:rgba(255,255,255,.35);padding:4px 12px;border-radius:6px;border:1px solid rgba(255,255,255,.08);transition:all .2s}
.lp-fl a:hover{color:white;border-color:rgba(255,255,255,.2)}
@media(max-width:900px){.lp-nav-links{display:none}.lp-fi{grid-template-columns:1fr}.lp-fg{grid-template-columns:repeat(2,1fr)}.lp-steps{grid-template-columns:repeat(2,1fr)}.lp-pg{grid-template-columns:repeat(2,1fr)}.lp-prg{grid-template-columns:1fr}.lp-tg{grid-template-columns:1fr}}
@media(max-width:600px){.lp-fg{grid-template-columns:1fr}.lp-stat-div{display:none}}
`;

const HTML = `
<div class="lp">
  <nav class="lp-nav">
    <a href="/" class="lp-logo"><div class="lp-logo-icon">✦</div><span class="lp-logo-text">HostAI</span></a>
    <div class="lp-nav-links"><a href="#features">Features</a><a href="#how">How it works</a><a href="#pricing">Pricing</a><a href="#testimonials">Reviews</a></div>
    <div class="lp-nav-cta"><a href="/auth/login" class="lp-btn-ghost">Log in</a><a href="/auth/register" class="lp-btn-primary">Get started free</a></div>
  </nav>

  <section class="lp-hero">
    <div class="lp-hero-bg"></div>
    <div class="lp-hero-glow"></div>
    <div class="lp-hero-content">
      <div class="lp-badge"><div class="lp-badge-dot"></div>AI-powered host automation — now in 3 languages</div>
      <h1>Your properties.<br><span>Managed by AI.</span></h1>
      <p class="lp-hero-sub">Automate check-in messages, guest Q&amp;A, and cleaning notifications across all your properties — in English, French, and Spanish.</p>
      <div class="lp-hero-actions"><a href="/auth/register" class="lp-btn-hp">Start for free →</a><a href="#how" class="lp-btn-hg">▶ See how it works</a></div>
      <div class="lp-stats">
        <div><div class="lp-stat-num">3×</div><div class="lp-stat-label">Faster responses</div></div>
        <div class="lp-stat-div"></div>
        <div><div class="lp-stat-num">80%</div><div class="lp-stat-label">Less manual work</div></div>
        <div class="lp-stat-div"></div>
        <div><div class="lp-stat-num">3</div><div class="lp-stat-label">Languages</div></div>
        <div class="lp-stat-div"></div>
        <div><div class="lp-stat-num">24/7</div><div class="lp-stat-label">AI coverage</div></div>
      </div>
    </div>
  </section>

  <div class="lp-proof"><div class="lp-proof-inner"><span class="lp-proof-label">Works with</span><div class="lp-pill"><div class="lp-dot" style="background:#FF385C"></div>Airbnb</div><div class="lp-pill"><div class="lp-dot" style="background:#003580"></div>Booking.com</div><div class="lp-pill"><div class="lp-dot" style="background:#1B5E20"></div>VRBO</div><div class="lp-pill"><div class="lp-dot" style="background:#6366F1"></div>Direct bookings</div></div></div>

  <section class="lp-section" id="features">
    <div class="lp-fi">
      <div><div class="lp-sl">Features</div><h2 class="lp-st">Everything a host needs, automated.</h2><p class="lp-ss">Stop copy-pasting. Let AI handle the repetitive work so you focus on growth.</p></div>
      <div class="lp-ms">
        <div class="lp-mc" style="background:rgba(255,56,92,.08);border:1px solid rgba(255,56,92,.15)"><div class="lp-mc-i">✉️</div><div class="lp-mc-n">100+</div><div class="lp-mc-l">Messages automated/month</div></div>
        <div class="lp-mc" style="background:rgba(0,166,153,.08);border:1px solid rgba(0,166,153,.15)"><div class="lp-mc-i">🌍</div><div class="lp-mc-n">3</div><div class="lp-mc-l">Languages supported</div></div>
        <div class="lp-mc" style="background:rgba(99,102,241,.08);border:1px solid rgba(99,102,241,.15)"><div class="lp-mc-i">🧹</div><div class="lp-mc-n">0</div><div class="lp-mc-l">Forgotten cleanings</div></div>
        <div class="lp-mc" style="background:rgba(252,100,45,.08);border:1px solid rgba(252,100,45,.15)"><div class="lp-mc-i">⭐</div><div class="lp-mc-n">4.9</div><div class="lp-mc-l">Avg. guest rating</div></div>
      </div>
    </div>
    <div class="lp-fg">
      <div class="lp-fc"><div class="lp-fi2" style="background:rgba(255,56,92,.14)">🗝️</div><h3>AI Check-in Messages</h3><p>Auto-generate personalized check-in instructions with lock codes and WiFi — in the guest's language.</p></div>
      <div class="lp-fc"><div class="lp-fi2" style="background:rgba(0,166,153,.14)">💬</div><h3>Multilingual FAQ Bot</h3><p>Guests ask at 11pm. AI answers instantly in English, French, or Spanish — WiFi, parking, checkout.</p></div>
      <div class="lp-fc"><div class="lp-fi2" style="background:rgba(252,100,45,.14)">🧹</div><h3>Auto Cleaning Tasks</h3><p>Checkout triggers a cleaning task automatically. Your cleaner gets notified. Zero effort.</p></div>
      <div class="lp-fc"><div class="lp-fi2" style="background:rgba(99,102,241,.14)">🏠</div><h3>Multi-Property Dashboard</h3><p>All your properties, bookings, messages, and tasks in one place. No more juggling apps.</p></div>
      <div class="lp-fc"><div class="lp-fi2" style="background:rgba(34,197,94,.14)">📅</div><h3>Booking Management</h3><p>Import bookings from any platform. Track check-ins, check-outs, and special requests.</p></div>
      <div class="lp-fc"><div class="lp-fi2" style="background:rgba(59,130,246,.14)">🔔</div><h3>Smart Notifications</h3><p>Get alerted for upcoming arrivals, overdue cleanings, and unread guest messages.</p></div>
    </div>
  </section>

  <section class="lp-how" id="how"><div class="lp-hi">
    <div style="text-align:center;max-width:600px;margin:0 auto"><div class="lp-sl">How it works</div><h2 class="lp-st">Set up in 10 minutes. Save hours every week.</h2></div>
    <div class="lp-steps">
      <div class="lp-step"><div class="lp-sn">Step 01</div><div class="lp-si">🏠</div><h3>Add your properties</h3><p>Enter details, check-in instructions, and cleaner contact in EN, FR, or ES.</p></div>
      <div class="lp-step"><div class="lp-sn">Step 02</div><div class="lp-si">📋</div><h3>Import bookings</h3><p>Add bookings manually or from Airbnb, Booking.com, or VRBO. Select guest language.</p></div>
      <div class="lp-step"><div class="lp-sn">Step 03</div><div class="lp-si">✨</div><h3>AI generates messages</h3><p>One click generates a perfect check-in message in the guest's language.</p></div>
      <div class="lp-step"><div class="lp-sn">Step 04</div><div class="lp-si">🧹</div><h3>Auto-handle checkout</h3><p>Mark guest checked out. AI sends goodbye and creates a cleaning task.</p></div>
    </div>
  </div></section>

  <section class="lp-props">
    <div class="lp-ph"><div><div class="lp-sl">Top destinations</div><h2 class="lp-st">Manage properties anywhere.</h2></div><a href="/auth/register" style="color:#FF385C;font-size:14px;font-weight:600">See all →</a></div>
    <div class="lp-pg">
      <div class="lp-pc"><div class="lp-po"><img src="https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?w=600&q=80" class="lp-pi" alt="Paris"><div class="lp-pb">🇫🇷 French support</div></div><div class="lp-pif"><div class="lp-pct">Paris, France</div><div class="lp-pcc">430 properties managed</div></div></div>
      <div class="lp-pc"><div class="lp-po"><img src="https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=600&q=80" class="lp-pi" alt="Barcelona"><div class="lp-pb">🇪🇸 Spanish support</div></div><div class="lp-pif"><div class="lp-pct">Barcelona, Spain</div><div class="lp-pcc">550 properties managed</div></div></div>
      <div class="lp-pc"><div class="lp-po"><img src="https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=600&q=80" class="lp-pi" alt="London"><div class="lp-pb">🇬🇧 English support</div></div><div class="lp-pif"><div class="lp-pct">London, UK</div><div class="lp-pcc">750 properties managed</div></div></div>
      <div class="lp-pc"><div class="lp-po"><img src="https://images.unsplash.com/photo-1514890547357-a9ee288728e0?w=600&q=80" class="lp-pi" alt="Maldives"><div class="lp-pb">🌍 All languages</div></div><div class="lp-pif"><div class="lp-pct">Maldives</div><div class="lp-pcc">432 properties managed</div></div></div>
    </div>
  </section>

  <section class="lp-pricing" id="pricing">
    <div class="lp-sl" style="text-align:center">Pricing</div>
    <h2 class="lp-st" style="text-align:center">Simple, honest pricing.</h2>
    <p style="font-size:17px;color:rgba(255,255,255,.4);margin-top:12px">Start free, upgrade when ready. Cancel anytime.</p>
    <div class="lp-prg">
      <div class="lp-prc"><div class="lp-pt">Starter</div><div class="lp-pn">$0<span>/mo</span></div><div class="lp-pp">Free forever · 1 property</div><div class="lp-pd"></div><ul class="lp-pfl"><li>1 property</li><li>10 AI messages/month</li><li>Manual booking import</li><li>EN language only</li><li class="dim">Cleaning automation</li><li class="dim">Multilingual support</li></ul><a href="/auth/register" class="lp-prb o">Get started free</a></div>
      <div class="lp-prc featured"><div class="lp-ppb">MOST POPULAR</div><div class="lp-pt">Pro</div><div class="lp-pn">$29<span>/mo</span></div><div class="lp-pp">Per host · up to 5 properties</div><div class="lp-pd"></div><ul class="lp-pfl"><li>Up to 5 properties</li><li>Unlimited AI messages</li><li>Auto cleaning tasks</li><li>EN + FR + ES languages</li><li>FAQ bot 24/7</li><li>Email notifications</li></ul><a href="/auth/register" class="lp-prb s">Start 14-day free trial</a></div>
      <div class="lp-prc"><div class="lp-pt">Scale</div><div class="lp-pn">$79<span>/mo</span></div><div class="lp-pp">Unlimited properties</div><div class="lp-pd"></div><ul class="lp-pfl"><li>Unlimited properties</li><li>Priority AI responses</li><li>Custom templates</li><li>All 3 languages</li><li>Dedicated support</li></ul><a href="/auth/register" class="lp-prb o">Contact us</a></div>
    </div>
  </section>

  <section class="lp-testi" id="testimonials">
    <div style="text-align:center;max-width:600px;margin:0 auto"><div class="lp-sl">Testimonials</div><h2 class="lp-st">Hosts love HostAI.</h2></div>
    <div class="lp-tg">
      <div class="lp-tc"><div class="lp-ts">★★★★★</div><p class="lp-tt">"I manage 4 apartments in Paris. Before HostAI I spent 2 hours every day on messages. Now it's 10 minutes. The French AI messages are perfect — guests think I wrote them myself."</p><div class="lp-ta"><div class="lp-av" style="background:linear-gradient(135deg,#FF385C,#E31C5F)">SM</div><div><div class="lp-tn">Sophie Martin</div><div class="lp-tr">Host · Paris · 4 properties</div></div></div></div>
      <div class="lp-tc"><div class="lp-ts">★★★★★</div><p class="lp-tt">"The auto cleaning task feature is a game changer. I used to forget to message my cleaner at least once a month. Now it happens automatically the moment a guest checks out."</p><div class="lp-ta"><div class="lp-av" style="background:linear-gradient(135deg,#00A699,#007A72)">JS</div><div><div class="lp-tn">John Smith</div><div class="lp-tr">Host · London · 7 properties</div></div></div></div>
      <div class="lp-tc"><div class="lp-ts">★★★★★</div><p class="lp-tt">"My guests come from all over the world. HostAI detects their language and responds in Spanish or English. My review scores went from 4.6 to 4.9 in one month."</p><div class="lp-ta"><div class="lp-av" style="background:linear-gradient(135deg,#FC642D,#E31C5F)">CR</div><div><div class="lp-tn">Carlos Rivera</div><div class="lp-tr">Host · Barcelona · 3 properties</div></div></div></div>
    </div>
  </section>

  <div class="lp-cta">
    <div class="lp-cta-glow"></div>
    <h2>Ready to automate your hosting?</h2>
    <p>Join hundreds of hosts saving 5+ hours per week with AI.</p>
    <div class="lp-cta-actions"><a href="/auth/register" class="lp-btn-hp">Start free today →</a><a href="/auth/login" class="lp-btn-hg">Already have an account</a></div>
  </div>

  <footer class="lp-footer">
    <div class="lp-ft">
      <div class="lp-fb"><div class="lp-fbl"><div class="lp-fbi">✦</div><span class="lp-fbn">HostAI</span></div><p>AI-powered automation for Airbnb hosts. Save time, delight guests, grow your portfolio.</p></div>
      <div class="lp-fc2"><h4>Product</h4><a href="#features">Features</a><a href="#pricing">Pricing</a><a href="#how">How it works</a><a href="/auth/register">Sign up</a></div>
      <div class="lp-fc2"><h4>Languages</h4><a href="#">English</a><a href="#">Français</a><a href="#">Español</a></div>
      <div class="lp-fc2"><h4>Support</h4><a href="#">Documentation</a><a href="#">Contact</a><a href="#">Privacy Policy</a></div>
    </div>
    <div class="lp-fbot"><p>© 2026 HostAI. All rights reserved.</p><div class="lp-fl"><a href="#">🇬🇧 EN</a><a href="#">🇫🇷 FR</a><a href="#">🇪🇸 ES</a></div></div>
  </footer>
</div>
`;
