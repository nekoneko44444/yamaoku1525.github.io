(function () {
  const menuItems = [
    { href: 'index.html', label: 'ホーム', key: 'home' },
    { href: 'about.html', label: '阿波山雅について', key: 'about' },
    { href: 'facility_guide.html', label: '施設・山と林道ガイド', key: 'facility' },
    { href: 'projects.html', label: '活動・プロジェクト', key: 'projects' },
    { href: 'activity-report.html', label: '活動報告', key: 'activity' },
    { href: 'characters.html', label: '仲間たち', key: 'characters' },
    { href: 'support.html', label: '応援する', key: 'support' },
  ];

  window.AWASANGA_MENU_ITEMS = menuItems;

  function currentKeyFromPath() {
    const fileName = window.location.pathname.split('/').pop() || 'index.html';
    const map = {
      'index.html': 'home',
      'about.html': 'about',
      'facility_guide.html': 'facility',
      'projects.html': 'projects',
      'activity-report.html': 'activity',
      'characters.html': 'characters',
      'support.html': 'support',
      'contact.html': 'support',
    };
    return map[fileName] || '';
  }

  function renderMenu(target) {
    const current = target.dataset.current || currentKeyFromPath();
    const isList = target.tagName.toLowerCase() === 'ul';
    target.innerHTML = menuItems.map((item) => {
      const activeClass = item.key === current ? (isList ? ' class="active"' : ' class="is-active"') : '';
      const link = `<a${activeClass} href="${item.href}">${item.label}</a>`;
      return isList ? `<li>${link}</li>` : link;
    }).join('');
  }

  document.querySelectorAll('[data-common-nav]').forEach(renderMenu);
})();
