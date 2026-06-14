(function () {
  'use strict';

  const items = (window.AWASANGA && window.AWASANGA.menuItems) || [
    { href: 'index.html', label: 'ホーム' },
    { href: 'about.html', label: '阿波山雅について' },
    { href: 'facility_guide.html', label: '施設・山と林道ガイド' },
    { href: 'projects.html', label: '活動・プロジェクト' },
    { href: 'activity-report.html', label: '活動報告' },
    { href: 'news.html', label: 'お知らせ' },
    { href: 'characters.html', label: '仲間たち' },
    { href: 'support.html', label: '応援する' }
  ];

  document.querySelectorAll('[data-common-footer]').forEach((target) => {
    const fragment = document.createDocumentFragment();
    items.forEach((item) => {
      const link = document.createElement('a');
      link.href = item.href;
      link.textContent = item.label;
      fragment.append(link);
    });
    target.replaceChildren(fragment);
  });

  const style = document.createElement('style');
  style.textContent = `
    .page-role-guide{display:grid;grid-template-columns:repeat(2,1fr);gap:16px;margin-top:28px}
    .page-role-card{display:block;padding:22px 24px;border-radius:22px;background:#fff;border:1px solid rgba(36,75,55,.12);color:var(--ink);box-shadow:0 14px 36px rgba(22,50,36,.07)}
    .page-role-card.current{background:var(--green);color:#fff}
    .page-role-card small{display:block;margin-bottom:6px;color:var(--gold-dark);font-weight:900;letter-spacing:.08em}
    .page-role-card.current small{color:var(--gold)}
    .page-role-card strong{display:block;font-size:20px;line-height:1.45}
    .page-role-card span{display:block;margin-top:7px;color:var(--muted);font-size:13px;line-height:1.75}
    .page-role-card.current span{color:rgba(255,255,255,.84)}
    @media(max-width:980px){.page-role-guide{grid-template-columns:1fr}}
  `;
  document.head.append(style);

  function exact(selector, text) {
    return Array.from(document.querySelectorAll(selector)).find((el) => el.textContent.trim() === text);
  }
  function setText(selector, text) {
    const el = document.querySelector(selector);
    if (el) el.textContent = text;
  }
  function guide(current) {
    const wrap = document.createElement('div');
    wrap.className = 'page-role-guide';
    wrap.setAttribute('aria-label', 'ページの使い分け');
    wrap.innerHTML = current === 'projects'
      ? '<div class="page-role-card current"><small>活動・プロジェクト・現在のページ</small><strong>何を、なぜ行うのかを知る</strong><span>活動の目的、取り組み内容、関わり方を紹介します。</span></div><a class="page-role-card" href="activity-report.html"><small>活動報告</small><strong>何が、いつ、どれだけ進んだかを見る</strong><span>数値、日付、写真、掲載・連携実績を確認できます。</span></a>'
      : '<a class="page-role-card" href="projects.html"><small>活動・プロジェクト</small><strong>何を、なぜ行うのかを知る</strong><span>活動の目的、取り組み内容、関わり方を紹介します。</span></a><div class="page-role-card current"><small>活動報告・現在のページ</small><strong>何が、いつ、どれだけ進んだかを見る</strong><span>数値、日付、写真、掲載・連携実績を確認できます。</span></div>';
    return wrap;
  }

  const file = location.pathname.split('/').pop();
  if (file === 'projects.html') {
    setText('.sub-hero p', 'ここは、阿波山雅が「何を、なぜ行うのか」を知るページです。活動の目的、具体的な取り組み、関わり方を紹介します。数値や日付などの成果は「活動報告」で確認できます。');
    const panel = document.querySelector('.resolve-panel');
    if (panel && !document.querySelector('.page-role-guide')) panel.after(guide('projects'));
    const concept = exact('.plain-intro p', 'だからこのページでは、活動の説明だけで終わらせず、実際に何をしているのか、どの記録を見ればよいのか、次にどう関われるのかまで並べます。');
    if (concept) concept.textContent = 'このページでは、各活動の背景と目指す姿、具体的な取り組み、関わり方を紹介します。実施日、数値、掲載などの成果は、活動報告に分けて記録しています。';
    const activities = exact('h2', '活動ごとに、記録へつなげます');
    if (activities) {
      activities.textContent = '取り組みと関わり方を知る';
      const desc = activities.closest('.section-head')?.querySelector('.section-text');
      if (desc) desc.textContent = '各活動の目的、具体的な取り組み、関わり方を紹介します。実績を確認したい場合は、各活動から活動報告へ進めます。';
    }
    const local = document.getElementById('local-products');
    if (local) {
      const strong = local.querySelector('.activity-side strong');
      const h3 = local.querySelector('h3');
      const paragraphs = local.querySelectorAll('.activity-body > p');
      const boxes = local.querySelectorAll('.detail-box');
      if (strong) strong.textContent = '那賀町特産品開発・物販自販機設置による那賀地域活性化';
      if (h3) h3.textContent = '那賀町の特産品を、いつでも手に取れる地域の入口へ。';
      if (paragraphs[0]) paragraphs[0].textContent = '那賀町には、ゆずをはじめとした特産品と、それを育て、加工し、届ける人の仕事があります。商品として磨き、買える場所を増やすことで、地域の実りを継続する仕事につなげます。';
      if (paragraphs[1]) paragraphs[1].textContent = '特産品開発と物販自販機の設置を通じて、林道利用者や来訪者が那賀町の商品に出会い、地域を知り、次の訪問につながる接点をつくります。';
      if (boxes[0]?.querySelector('span')) boxes[0].querySelector('span').textContent = '那賀町特産品の商品開発、物販自販機の設置検討、販売接点づくり、来訪者への地域産品の発信。';
      if (boxes[1]?.querySelector('.record-links')) boxes[1].querySelector('.record-links').innerHTML = '<a href="activity-report.html#town-report">協議・実績の記録を見る</a><a href="facility_guide.html#tairanosato">平の里の案内</a><a href="news.html">お知らせ一覧を見る</a>';
    }
    const cta = document.querySelector('.final-cta-section .cta-panel p');
    if (cta) cta.textContent = 'このページで紹介した活動の実施日、数値、写真、掲載・連携実績は、活動報告にまとめています。成果や進捗を確認したい方は、活動報告をご覧ください。';
  }

  if (file === 'activity-report.html') {
    setText('.sub-hero p', 'ここは、活動の成果を確認するページです。実際に動いた日付、数値、写真、掲載・連携実績を時系列でまとめています。活動の目的や参加方法を知りたい方は「活動・プロジェクト」をご覧ください。');
    const panel = document.querySelector('.report-panel');
    if (panel && !document.querySelector('.page-role-guide')) panel.after(guide('activity'));
    const reports = exact('h2', '実績別レポート');
    if (reports) {
      reports.textContent = '主要実績の記録';
      const desc = reports.closest('.section-head')?.querySelector('.section-text');
      if (desc) desc.innerHTML = 'ここでは「いつ、何が起きて、どんな成果につながったか」を記録します。活動の目的や関わり方は、<a href="projects.html">活動・プロジェクト</a>で紹介しています。';
    }
    const town = document.getElementById('town-report');
    if (town) {
      const meta = town.querySelector('.report-visual-meta b');
      const h3 = town.querySelector('h3');
      const p = town.querySelector('.report-content > p');
      const facts = town.querySelectorAll('.fact-box');
      if (meta) meta.textContent = '特産品開発・物販自販機';
      if (h3) h3.textContent = '那賀町特産品開発・物販自販機設置による那賀地域活性化';
      if (p) p.textContent = '2026年3月から、那賀町の特産品開発と物販自販機の設置による地域活性化について協議を開始。地域産品を手に取れる販売接点を増やし、林道利用者や来訪者を那賀地域の消費と滞在につなげる構想を進めています。';
      if (facts[1]?.querySelector('span')) facts[1].querySelector('span').textContent = '特産品開発・物販自販機設置による那賀地域活性化';
      if (facts[2]) facts[2].innerHTML = '<b>関連</b><a href="projects.html#local-products">活動の目的を見る</a>';
    }
    const trust = exact('.trust-item', '那賀町賑わい課2026/03 協議開始');
    if (trust) trust.innerHTML = '那賀地域<br>活性化<small>2026/03 協議開始</small>';
    const oldTimeline = exact('.timeline-body b', '那賀町賑わい課との連携協議');
    if (oldTimeline) {
      oldTimeline.textContent = '那賀町特産品開発・物販自販機設置による那賀地域活性化';
      const span = oldTimeline.parentElement.querySelector('span');
      if (span) span.textContent = '特産品開発と物販自販機設置に向けた協議を開始。';
    }
  }

  if (file === 'about.html') {
    const old = exact('.timeline-body', '那賀町賑わい課との認識合わせ協議 開始');
    if (old) old.textContent = '那賀町特産品開発・物販自販機設置による那賀地域活性化 協議開始';
  }
})();
