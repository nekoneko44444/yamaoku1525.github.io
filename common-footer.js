(function () {
  'use strict';

  const items = (window.AWASANGA && window.AWASANGA.menuItems) || [
    { href: 'index.html', label: 'ホーム' },
    { href: 'about.html', label: '阿波山雅について' },
    { href: 'facility_guide.html', label: '施設・山と林道ガイド' },
    { href: 'projects.html', label: '活動・プロジェクト' },
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

  function exact(selector, text) {
    return Array.from(document.querySelectorAll(selector)).find((el) => el.textContent.trim() === text);
  }
  function setText(selector, text) {
    const el = document.querySelector(selector);
    if (el) el.textContent = text;
  }

  const file = location.pathname.split('/').pop();
  if (file === 'projects.html') {
    setText('.sub-hero p', 'ここは、阿波山雅が「何を、なぜ行うのか」を知るページです。活動の目的、具体的な取り組み、関わり方を紹介します。各活動の数値・写真・記録は、活動ごとの詳細ページで確認できます。');
    const concept = exact('.plain-intro p', 'だからこのページでは、活動の説明だけで終わらせず、実際に何をしているのか、どの記録を見ればよいのか、次にどう関われるのかまで並べます。');
    if (concept) concept.textContent = 'このページでは、各活動の背景と目指す姿、具体的な取り組み、関わり方を紹介します。実施日や数値、写真などの記録は、活動ごとの詳細ページにまとめています。';
    const activities = exact('h2', '活動ごとに、記録へつなげます');
    if (activities) {
      activities.textContent = '取り組みと関わり方を知る';
      const desc = activities.closest('.section-head')?.querySelector('.section-text');
      if (desc) desc.textContent = '各活動の目的、具体的な取り組み、関わり方を紹介します。詳しい記録を見たい場合は、各活動から詳細ページへ進めます。';
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
      if (boxes[1]?.querySelector('.record-links')) boxes[1].querySelector('.record-links').innerHTML = '<a href="facility_guide.html#tairanosato">平の里の案内</a><a href="news.html">お知らせ一覧を見る</a>';
    }
    const cta = document.querySelector('.final-cta-section .cta-panel p');
    if (cta) cta.textContent = 'このページで紹介した活動は、それぞれの詳細ページに、実施日・数値・写真・記録をまとめています。気になった活動から、詳しい記録をご覧ください。';
  }

  if (file === 'about.html') {
    const old = exact('.timeline-body', '那賀町賑わい課との認識合わせ協議 開始');
    if (old) old.textContent = '那賀町特産品開発・物販自販機設置による那賀地域活性化 協議開始';
  }
})();
