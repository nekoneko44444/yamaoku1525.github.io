(function () {
  'use strict';

  const fallbackMenuItems = Object.freeze([
    Object.freeze({ href: 'index.html', label: 'ホーム' }),
    Object.freeze({ href: 'about.html', label: '阿波山雅について' }),
    Object.freeze({ href: 'facility_guide.html', label: '施設・山と林道ガイド' }),
    Object.freeze({ href: 'projects.html', label: '活動・プロジェクト' }),
    Object.freeze({ href: 'activity-report.html', label: '活動報告' }),
    Object.freeze({ href: 'news.html', label: 'お知らせ' }),
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

  function injectHeaderAlignmentStyles() {
    if (document.getElementById('shared-header-alignment-styles')) return;

    const style = document.createElement('style');
    style.id = 'shared-header-alignment-styles';
    style.textContent = `
      .site-header {
        position: sticky;
        top: 0;
        z-index: 100;
        background: rgba(255,250,240,.9);
        border-bottom: 1px solid rgba(36,75,55,.1);
        backdrop-filter: blur(14px);
      }

      .header-inner {
        width: min(calc(100% - 40px), 1120px);
        max-width: none;
        min-height: 84px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 28px;
      }

      .brand {
        display: inline-flex;
        align-items: center;
        gap: 12px;
        color: var(--green, var(--green-deep, #2D5A3D));
        text-decoration: none;
        min-width: max-content;
      }

      .brand img {
        width: 80px;
        height: auto;
      }

      .brand small {
        display: block;
        font-size: 11px;
        line-height: 1;
        color: var(--muted, var(--gray, #7A7A7A));
      }

      .brand strong {
        display: block;
        font-size: 21px;
        line-height: 1.12;
        letter-spacing: .09em;
      }

      .brand span {
        display: block;
        color: var(--gold-dark, var(--wood, #8B6F4E));
        font-size: 11px;
        letter-spacing: .16em;
      }

      .site-header .nav {
        position: static;
        min-height: 0;
        padding: 0;
        background: transparent;
        border-bottom: 0;
        backdrop-filter: none;
        justify-content: flex-end;
        flex-wrap: wrap;
        gap: 7px 16px;
        font-size: 13px;
      }

      .site-header .nav a {
        position: relative;
        display: inline-block;
        padding: 6px 0;
        color: var(--green, var(--green-deep, #2D5A3D));
        font-size: 13px;
        text-decoration: none;
        white-space: nowrap;
        opacity: .86;
      }

      .site-header .nav a:hover,
      .site-header .nav a.is-active,
      .site-header .nav a.active {
        opacity: 1;
      }

      .site-header .nav a::after {
        content: "";
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        height: 1px;
        background: var(--gold, var(--yuzu, #E8B83A));
        transform: scaleX(0);
        transform-origin: left;
        transition: transform .24s ease;
      }

      .site-header .nav a:hover::after,
      .site-header .nav a.is-active::after,
      .site-header .nav a.active::after {
        transform: scaleX(1);
      }

      .sub-hero {
        min-height: 420px;
        display: grid;
        align-items: center;
        overflow: hidden;
        color: #fff;
        padding: 92px 24px 112px;
        background:
          linear-gradient(90deg, rgba(22,50,36,.92) 0%, rgba(36,75,55,.78) 58%, rgba(36,75,55,.5) 100%),
          url("./img/top_yamanoie1.png") center/cover no-repeat;
      }

      .sub-hero-inner {
        width: min(calc(100% - 40px), 1120px);
        max-width: none;
        margin: 0 auto;
        padding: 0;
      }

      .sub-hero .hero-label,
      .sub-hero .hero-badge,
      .hero-badge {
        display: none !important;
      }

      .sub-hero h1 {
        margin: 0;
        font-size: clamp(42px, 6vw, 72px);
        line-height: 1.12;
        letter-spacing: .08em;
      }

      .sub-hero p {
        max-width: 760px;
        margin: 24px 0 0;
        font-size: clamp(16px, 2vw, 19px);
        line-height: 1.9;
        color: rgba(255,255,255,.9);
      }

      .projects-lead,
      .report-lead,
      .support-lead {
        margin-top: 0 !important;
      }

      @media (max-width: 880px) {
        .header-inner {
          align-items: flex-start;
          flex-direction: column;
          padding: 16px 0;
        }

        .site-header .nav {
          justify-content: flex-start;
        }
      }

      @media (max-width: 640px) {
        .sub-hero {
          min-height: 360px;
          padding: 70px 20px 92px;
        }

        .sub-hero h1 {
          font-size: clamp(34px, 10vw, 48px);
        }
      }
    `;
    document.head.append(style);
  }

  function createBrand() {
    const brand = document.createElement('a');
    brand.className = 'brand';
    brand.href = 'index.html';
    brand.setAttribute('aria-label', '協同組合阿波山雅 ホーム');
    brand.innerHTML = `
      <img src="./img/awasanga_logo_w2.png" alt="協同組合阿波山雅ロゴ" />
      <div>
        <small>協同組合</small>
        <strong>阿波山雅</strong>
        <span>あわさんが</span>
      </div>
    `;
    return brand;
  }

  function normalizeLegacyHeader() {
    const oldNav = document.querySelector('body > nav.nav');
    if (!oldNav || !oldNav.querySelector('.nav-logo')) return;

    const current = oldNav.querySelector('[data-current]')?.dataset.current || '';
    const links = Array.from(oldNav.querySelectorAll('.nav-links a'));
    const header = document.createElement('header');
    const inner = document.createElement('div');
    const nav = document.createElement('nav');

    header.className = 'site-header';
    inner.className = 'container header-inner';
    nav.className = 'nav';
    nav.setAttribute('aria-label', oldNav.getAttribute('aria-label') || 'メインナビゲーション');
    if (current) nav.dataset.current = current;

    links.forEach((link) => {
      const item = link.cloneNode(true);
      if (item.classList.contains('active')) {
        item.classList.remove('active');
        item.classList.add('is-active');
      }
      nav.append(item);
    });

    inner.append(createBrand(), nav);
    header.append(inner);
    oldNav.replaceWith(header);
  }

  injectHeaderAlignmentStyles();
  normalizeLegacyHeader();
  document.querySelectorAll('[data-common-footer]').forEach(renderFooterLinks);
})();
