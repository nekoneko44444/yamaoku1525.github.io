(function () {
  function renderFooterLinks(target) {
    const menuItems = window.AWASANGA_MENU_ITEMS || [];
    const isList = target.tagName.toLowerCase() === 'ul';
    target.innerHTML = menuItems.map((item) => {
      const link = `<a href="${item.href}">${item.label}</a>`;
      return isList ? `<li>${link}</li>` : link;
    }).join('');
  }

  document.querySelectorAll('[data-common-footer]').forEach(renderFooterLinks);
})();
