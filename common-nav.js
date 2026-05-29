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

  const activityReportSectionIds = Object.freeze({
    '数字で見る阿波山雅': 'visitor-report',
    '次郎笈トレイル再生': 'trail-report',
    'フードリボン': 'foodribbon-report',
    '木頭クエスト × クマ祭り': 'kito-quest-report',
    '那賀町賑わい課との連携協議': 'town-report',
    '奥槍戸やま日和': 'newsletter-report',
    'メディア・受託・登録実績': 'media-report',
    '主な沿革': 'timeline-report',
  });

  const projectRecordLinks = Object.freeze({
    'okuyarito-base': Object.freeze({ href: 'activity-report.html#visitor-report', label: '来場者数と活動実績を見る' }),
    foodribbon: Object.freeze({ href: 'activity-report.html#foodribbon-report', label: 'フードリボンの活動報告を見る' }),
    trail: Object.freeze({ href: 'activity-report.html#trail-report', label: '次郎笈トレイルの活動報告を見る' }),
    'kito-quest': Object.freeze({ href: 'activity-report.html#kito-quest-report', label: '木頭クエストの活動報告を見る' }),
    'tree-planting': Object.freeze({ href: 'activity-report.html#timeline-report', label: '主な沿革で植樹記録を見る' }),
    newsletter: Object.freeze({ href: 'activity-report.html#newsletter-report', label: '広報誌の活動報告を見る' }),
  });

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

  function setNearestSectionId(headingText, id) {
    const headings = document.querySelectorAll('h2, h3');
    const heading = Array.from(headings).find((element) => element.textContent.trim() === headingText);
    const target = heading && heading.closest('article, section');

    if (target && !target.id) {
      target.id = id;
    }
  }

  function scrollToHashTarget() {
    const rawHash = window.location.hash.slice(1);
    if (!rawHash) return;

    const id = decodeURIComponent(rawHash);
    const target = document.getElementById(id);
    if (!target) return;

    window.requestAnimationFrame(() => {
      target.scrollIntoView({ block: 'start' });
    });
  }

  function enhanceActivityReportAnchors() {
    if (!document.querySelector('[data-current="activity"]')) return;

    Object.entries(activityReportSectionIds).forEach(([headingText, id]) => {
      setNearestSectionId(headingText, id);
    });

    scrollToHashTarget();
  }

  function enhanceProjectRecordLinks() {
    if (!document.querySelector('[data-current="projects"]')) return;

    Object.entries(projectRecordLinks).forEach(([articleId, linkConfig]) => {
      const article = document.getElementById(articleId);
      const link = article && article.querySelector('.record-links a[href="activity-report.html"]');

      if (!link) return;

      link.href = linkConfig.href;
      link.textContent = linkConfig.label;
    });
  }

  document.querySelectorAll('[data-common-nav]').forEach(renderMenu);
  enhanceActivityReportAnchors();
  enhanceProjectRecordLinks();
})();
