(function () {
  'use strict';

  const shared = window.AWASANGA || (window.AWASANGA = {});
  const menuItems = shared.menuItems || Object.freeze([
    Object.freeze({ href: 'index.html', label: 'ホーム', key: 'home' }),
    Object.freeze({ href: 'about.html', label: '阿波山雅について', key: 'about' }),
    Object.freeze({ href: 'facility_guide.html', label: '施設・山と林道ガイド', key: 'facility' }),
    Object.freeze({ href: 'projects.html', label: '活動・プロジェクト', key: 'projects' }),
    Object.freeze({ href: 'activity-report.html', label: '活動報告', key: 'activity' }),
    Object.freeze({ href: 'news.html', label: 'お知らせ', key: 'news' }),
    Object.freeze({ href: 'characters.html', label: '仲間たち', key: 'characters' }),
    Object.freeze({ href: 'support.html', label: '応援する', key: 'support' }),
  ]);

  shared.menuItems = menuItems;
  window.AWASANGA_MENU_ITEMS = menuItems;

  function currentKeyFromPath() {
    const fileName = window.location.pathname.split('/').pop() || 'index.html';
    const map = {
      'index.html': 'home',
      'about.html': 'about',
      'facility_guide.html': 'facility',
      'projects.html': 'projects',
      'activity-report.html': 'activity',
      'news.html': 'news',
      'characters.html': 'characters',
      'support.html': 'support',
      'contact.html': 'support',
      'design-doc.html': 'design',
    };
    return map[fileName] || '';
  }

  function createMenuLink(item, current, activeClass) {
    const link = document.createElement('a');
    link.href = item.href;
    link.textContent = item.label;

    if (item.key === current) {
      link.className = activeClass;
      link.setAttribute('aria-current', 'page');
    }

    return link;
  }

  function renderMenu(target) {
    const current = target.hasAttribute('data-current')
      ? target.dataset.current
      : currentKeyFromPath();
    const isList = target.tagName.toLowerCase() === 'ul';
    const activeClass = isList ? 'active' : 'is-active';
    const fragment = document.createDocumentFragment();

    menuItems.forEach((item) => {
      const link = createMenuLink(item, current, activeClass);

      if (isList) {
        const listItem = document.createElement('li');
        listItem.append(link);
        fragment.append(listItem);
        return;
      }

      fragment.append(link);
    });

    target.replaceChildren(fragment);
  }

  document.querySelectorAll('[data-common-nav]').forEach(renderMenu);
})();
