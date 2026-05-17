(function () {
  'use strict';

  const fallbackMenuItems = Object.freeze([
    Object.freeze({ href: 'index.html', label: 'ホーム' }),
    Object.freeze({ href: 'about.html', label: '阿波山雅について' }),
    Object.freeze({ href: 'facility_guide.html', label: '施設・山と林道ガイド' }),
    Object.freeze({ href: 'projects.html', label: '活動・プロジェクト' }),
    Object.freeze({ href: 'activity-report.html', label: '活動報告' }),
    Object.freeze({ href: 'characters.html', label: '仲間たち' }),
    Object.freeze({ href: 'support.html', label: '応援する' }),
  ]);

  function getMenuItems() {
    if (Array.isArray(window.AWASANGA_MENU_ITEMS) && window.AWASANGA_MENU_ITEMS.length > 0) {
      return window.AWASANGA_MENU_ITEMS;
    }

    if (
      window.AWASANGA
      && Array.isArray(window.AWASANGA.menuItems)
      && window.AWASANGA.menuItems.length > 0
    ) {
      return window.AWASANGA.menuItems;
    }

    return fallbackMenuItems;
  }

  function createFooterLink(item) {
    const link = document.createElement('a');
    link.href = item.href;
    link.textContent = item.label;
    return link;
  }

  function renderFooterLinks(target) {
    const isList = target.tagName.toLowerCase() === 'ul';
    const fragment = document.createDocumentFragment();

    getMenuItems().forEach((item) => {
      const link = createFooterLink(item);

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

  document.querySelectorAll('[data-common-footer]').forEach(renderFooterLinks);
})();
