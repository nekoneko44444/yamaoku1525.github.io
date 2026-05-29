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

  const projectGalleryImages = Object.freeze({
    'okuyarito-base': Object.freeze(['./img/top_yamanoie1.png', './img/top_yamanoie2.png', './img/top_yamanoie3.png']),
    foodribbon: Object.freeze(['./img/top_insyoku1.png', './img/top_insyoku2.png', './img/top_insyoku3.png']),
    trail: Object.freeze([
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=900&q=80',
      './img/trail2.png',
      './img/trail3.png',
    ]),
    rindo: Object.freeze([
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80',
      './img/rindo2.png',
      './img/rindo3.png',
    ]),
    'kito-quest': Object.freeze(['./img/top_kouri1.png', './img/top_kouri2.png', './img/top_kouri3.png']),
    'tree-planting': Object.freeze([
      'https://images.unsplash.com/photo-1522748906645-95d8adfd52c7?auto=format&fit=crop&w=900&q=80',
      './img/tree_planting2.png',
      './img/tree_planting3.png',
    ]),
    newsletter: Object.freeze([
      'https://images.unsplash.com/photo-1474366521946-c3d4b507abf2?auto=format&fit=crop&w=900&q=80',
      './img/newsletter2.png',
      './img/newsletter3.png',
    ]),
    'local-products': Object.freeze(['./img/top_yuzu1.png', './img/top_yuzu2.png', './img/top_yuzu3.png']),
  });

  const characterAssets = Object.freeze({
    nagika: Object.freeze(['./img/なぎかちゃん.png', './img/ナギカ.png', './img/nagika.png']),
    sugito: Object.freeze(['./img/スギト.png', './img/sugito.png']),
    sugijii: Object.freeze(['./img/杉じぃ.png', './img/杉じい.png', './img/sugijii.png']),
    yuzuri: Object.freeze(['./img/ユズリ.png', './img/yuzuri.png']),
  });

  const projectStoryEnhancements = Object.freeze({
    'okuyarito-base': Object.freeze({
      heading: '山の入口に、もう一度「ただいま」と言える灯りを残す。',
      paragraphs: Object.freeze([
        '奥槍戸山の家に灯りがついているだけで、山へ向かう人の気持ちは少し軽くなります。登山の前に息を整える人、林道を走ってきて温かいものを求める人、家族で景色を見に来た人。違う目的で来た人たちが、同じ場所で湯気の立つごはんを囲み、言葉を交わします。',
        '私たちが守りたいのは、建物だけではありません。疲れた人が休める時間、初めて来た人が安心できる案内、また誰かを連れて来たくなる記憶です。ここが続くことは、山に人が戻ってくる理由を残すことです。',
      ]),
      voiceTitle: 'なぎかちゃんの声',
      voice: '山の奥まで来てくれた人に、最初に渡せるものは安心だと思うんよ。ごはんでも、ひと言でも、笑顔でもいい。「ここに来てよかった」って思える時間を、ちゃんと残したいんよ。',
      character: 'nagika',
      activity: '奥槍戸山の家の営業、食事提供、来訪者案内、営業開始情報の発信、サポーターや地域の人との交流づくり。',
      support: '食べに行く、誰かを連れて行く、営業情報を広める、サポーターとして場所の継続を支える。',
    }),
    foodribbon: Object.freeze({
      heading: '一食を差し出す気持ちが、誰かの今日をあたためる。',
      paragraphs: Object.freeze([
        'フードリボンは、困っている人だけのための特別な仕組みではありません。「今日は誰かの分も置いていこう」と思う人と、「今日は少し助けてほしい」と思う人が、同じ地域の中で自然につながるための小さな合図です。',
        '提供117食、支援148食という数字の奥には、顔の見えない誰かを思って託された一食があります。食べることは生きることに近いからこそ、そこに生まれる共感は強く、地域のやさしさを見える形にしてくれます。',
      ]),
      voiceTitle: 'なぎかちゃんの声',
      voice: 'お腹がすいている時って、心まで小さくなることがあるんよね。だから一食を渡すことは、ただ食べてもらうだけじゃなくて、「気にかけている人がいるよ」って伝えることなんよ。',
      character: 'nagika',
      activity: 'フードリボン活動、子どもへの食事提供、支援食数の報告、新聞掲載を通じた周知。',
      support: '食べる、支援する、活動を知人に伝える。誰かの今日を少し軽くする一食として応援する。',
    }),
    trail: Object.freeze({
      heading: '足もとの道を整えることは、山との約束をつなぎ直すこと。',
      paragraphs: Object.freeze([
        '次郎笈へ続く道は、ただの通路ではありません。何度も歩いた人の記憶、初めて稜線に立つ人の高鳴り、山を好きになるきっかけが積み重なる場所です。けれど山道は、誰かが気にかけなければ少しずつ消えていきます。',
        '草を払い、崩れたところを見て、次に歩く人の安全を想像する。派手な作業ではなくても、その一つひとつが「また歩ける道」を残します。山を楽しむ人が、山を支える人にもなる入口をつくります。',
      ]),
      voiceTitle: 'スギトの声',
      voice: '道は、歩く人だけのものじゃない。次に来る人のために、少し手を入れて帰る。それだけで山との関わり方は変わるんだ。',
      character: 'sugito',
      activity: '次郎笈トレイル再生プロジェクト第1弾・第2弾、現地確認、整備活動、活動告知。',
      support: '整備活動に参加する、情報を広げる、安全に歩いて利用する。歩いた記憶を、次の整備につなげる。',
    }),
    rindo: Object.freeze({
      heading: '道を知る人が増えるほど、山は会いに行ける場所になる。',
      paragraphs: Object.freeze([
        '剣山スーパー林道や奥槍戸周辺の道は、山の奥へ人を運ぶ大切な入口です。けれど、そこには天候、路面、通行規制、落石や凍結の不安もあります。知らずに向かえば危険でも、知って向かえば山の楽しみはぐっと広がります。',
        '私たちは、林道イベントへの参加や情報発信を通じて、道の楽しさと安全の両方を伝えます。通り過ぎるだけだった人が、拠点に立ち寄り、地域の人と話し、次の来訪につながる流れをつくります。',
      ]),
      voiceTitle: 'スギトの声',
      voice: '山道は、勢いだけで入る場所じゃない。知って、備えて、無理をしない。そうすれば、道はちゃんと楽しい時間につながってくれる。',
      character: 'sugito',
      activity: '剣山スーパー林道ミーティングへの参加、林道利用者への案内、施設・林道情報の整理。',
      support: '事前確認をして安全に訪れる、拠点に立ち寄る、林道の魅力と注意点をあわせて発信する。',
    }),
    'kito-quest': Object.freeze({
      heading: '木の時間に触れると、山の見え方が変わる。',
      paragraphs: Object.freeze([
        '木頭杉には、植えた人、育てた人、伐った人、使い道を考えた人の時間が染み込んでいます。木に触れることは、山の長い営みに触れることです。',
        '木工体験や木頭クエスト、地域イベントでの出店は、木頭杉を「知っている人だけの素材」にしないための入口です。子どもも大人も、遊びながら、手を動かしながら、山の価値を自分の感覚で受け取れるようにします。',
      ]),
      voiceTitle: '杉じぃの声',
      voice: '木は急がん。じゃが、人が忘れるのは早い。だから触れて、作って、持ち帰れる形にするんじゃ。木の時間を知ると、山の未来の見え方も変わるんじゃよ。',
      character: 'sugijii',
      activity: '木頭杉の価値発信、木工体験、木頭クマ祭りでの出店・登壇、木頭クエスト企画。',
      support: '体験する、商品を使う、イベントに参加する。木の手ざわりを、誰かに話して広げる。',
    }),
    'tree-planting': Object.freeze({
      heading: '今日植えた一本が、未来の誰かを山へ呼ぶ。',
      paragraphs: Object.freeze([
        'ヤマザクラの苗を植えても、すぐに満開の景色は見られません。土をかぶせ、水をやり、根づくのを待つ。結果が見えるまで時間がかかるからこそ、この活動には未来を信じる力があります。',
        '何年か後、花が咲いた山を見に誰かが来るかもしれない。その人が写真を撮り、誰かに話し、また季節がめぐる。植樹は、今ここにいない人へ景色を手渡す活動です。',
      ]),
      voiceTitle: 'ユズリの声',
      voice: 'すぐに咲かないからこそ、植える意味があると思うんです。未来の誰かが「きれい」と立ち止まる景色を、今の私たちが準備しているんです。',
      character: 'yuzuri',
      activity: 'ヤマザクラ植樹イベント、奥槍戸山の家カレー提供、季節の景色づくり。',
      support: '植樹に参加する、イベントを手伝う、成長の記録を残す。未来の景色を一緒に待つ。',
    }),
    newsletter: Object.freeze({
      heading: '記録しなければ、活動は風のように過ぎてしまう。',
      paragraphs: Object.freeze([
        '山で起きた小さな出来事は、その場にいた人の記憶には残ります。でも、記録しなければ、まだ出会っていない人には届きません。奥槍戸やま日和は、山の出来事を次の誰かへ渡すための手紙です。',
        '活動報告、組合員の紹介、地域の話題。紙面に残すことで、一日の出来事が支援者や来訪者の入口になります。言葉にすることは、山の魅力を閉じ込めるのではなく、遠くへ届けることです。',
      ]),
      voiceTitle: 'ユズリの声',
      voice: '残すだけでは足りません。読む人が「行ってみたい」「関わってみたい」と思える形にしましょう。山の魅力は、知っている人だけのものにしておくには惜しいです。',
      character: 'yuzuri',
      activity: '奥槍戸やま日和 vol001からvol004、お知らせ更新、活動報告、メディア掲載の整理。',
      support: '読む、共有する、活動を紹介する、取材や発信で協力する。届いていない人へ言葉を渡す。',
    }),
    'local-products': Object.freeze({
      heading: '地域の実りを、買って終わりではなく、続く関係にする。',
      paragraphs: Object.freeze([
        'ゆずや地域産品は、ただの商品ではありません。山の気候、手入れを続ける人、収穫の時期を待つ時間、加工する工夫が詰まっています。',
        '食べる、買う、贈る。その一つひとつが、地域の仕事を次につなぐ応援になります。私たちは、実りを「お土産」で終わらせず、山へ来る理由、地域を思い出すきっかけ、また関わる入口に育てていきます。',
      ]),
      voiceTitle: 'ユズリの声',
      voice: 'おいしいものには、土地の記憶が入っています。買ってくれた人の暮らしに少し山が届いて、またここを思い出してもらえたら、それも大切な応援です。',
      character: 'yuzuri',
      activity: 'ゆず・地域産品の活用、加工品や食の企画、販売支援、平の里との接点づくり。',
      support: '買う、食べる、贈る、商品づくりを応援する。地域の実りを、次の仕事につなげる。',
    }),
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

  function injectProjectEnhancementStyles() {
    if (document.getElementById('project-story-enhancement-styles')) return;

    const style = document.createElement('style');
    style.id = 'project-story-enhancement-styles';
    style.textContent = `
      .activity-photo-grid {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 6px;
        background: rgba(36,75,55,.08);
      }
      .activity-photo-grid img {
        width: 100%;
        height: 100%;
        aspect-ratio: 1 / 1;
        object-fit: cover;
        display: block;
      }
      .activity-photo-grid img:first-child {
        grid-column: 1 / -1;
        aspect-ratio: 4 / 3;
      }
      .activity-photo-grid img:only-child {
        aspect-ratio: 4 / 3;
      }
      .scene-box.has-character {
        display: grid;
        grid-template-columns: 76px 1fr;
        gap: 16px;
        align-items: start;
        border-left-width: 0;
        border-top: 6px solid var(--gold);
      }
      .scene-character {
        width: 76px;
        height: 76px;
        object-fit: contain;
        border-radius: 999px;
        background: #fff;
        padding: 7px;
        box-shadow: 0 12px 28px rgba(22,50,36,.16);
      }
      .scene-box.character-missing {
        display: block;
        border-left: 6px solid var(--gold);
        border-top: 0;
      }
      .scene-box.character-missing .scene-character {
        display: none;
      }
      .scene-box-text strong {
        margin-bottom: 8px;
      }
      @media (max-width: 640px) {
        .scene-box.has-character {
          grid-template-columns: 58px 1fr;
          gap: 12px;
        }
        .scene-character {
          width: 58px;
          height: 58px;
          padding: 5px;
        }
      }
    `;
    document.head.append(style);
  }

  function setText(element, text) {
    if (element && text) {
      element.textContent = text;
    }
  }

  function removeBrokenImage(image) {
    const grid = image.closest('.activity-photo-grid');
    image.remove();
    if (grid && !grid.querySelector('img')) {
      grid.remove();
    }
  }

  function enhanceProjectGalleries() {
    if (!document.querySelector('[data-current="projects"]')) return;

    Object.entries(projectGalleryImages).forEach(([articleId, sources]) => {
      const article = document.getElementById(articleId);
      const side = article && article.querySelector('.activity-side');
      const firstImage = side && side.querySelector(':scope > img');
      if (!side || !firstImage || side.querySelector('.activity-photo-grid')) return;

      const grid = document.createElement('div');
      grid.className = 'activity-photo-grid';
      grid.dataset.maxPhotos = '3';

      sources.slice(0, 3).forEach((src, index) => {
        const image = document.createElement('img');
        image.src = src;
        image.alt = index === 0 ? firstImage.alt : `${firstImage.alt} ${index + 1}`;
        image.loading = index === 0 ? 'eager' : 'lazy';
        image.onerror = () => removeBrokenImage(image);
        grid.append(image);
      });

      firstImage.replaceWith(grid);
    });
  }

  function tryCharacterSource(image, sources, index) {
    if (!sources || index >= sources.length) {
      image.hidden = true;
      const sceneBox = image.closest('.scene-box');
      if (sceneBox) sceneBox.classList.add('character-missing');
      return;
    }

    image.src = sources[index];
    image.onerror = () => tryCharacterSource(image, sources, index + 1);
  }

  function addCharacterToScene(sceneBox, characterKey, voiceTitle) {
    if (!sceneBox || sceneBox.classList.contains('has-character')) return;

    const sources = characterAssets[characterKey];
    if (!sources) return;

    const strong = sceneBox.querySelector('strong');
    const paragraph = sceneBox.querySelector('p');
    const textWrap = document.createElement('div');
    const image = document.createElement('img');

    image.className = 'scene-character';
    image.alt = voiceTitle ? `${voiceTitle}のキャラクター` : 'キャラクター';
    image.loading = 'lazy';

    if (strong) textWrap.append(strong);
    if (paragraph) textWrap.append(paragraph);
    textWrap.className = 'scene-box-text';

    sceneBox.replaceChildren(image, textWrap);
    sceneBox.classList.add('has-character');
    sceneBox.dataset.character = characterKey;
    tryCharacterSource(image, sources, 0);
  }

  function updateProjectDetail(article, index, text) {
    const detail = article.querySelectorAll('.detail-box')[index];
    const span = detail && detail.querySelector('span:not(.record-links)');
    setText(span, text);
  }

  function enhanceProjectStories() {
    if (!document.querySelector('[data-current="projects"]')) return;

    injectProjectEnhancementStyles();
    enhanceProjectGalleries();

    Object.entries(projectStoryEnhancements).forEach(([articleId, copy]) => {
      const article = document.getElementById(articleId);
      if (!article) return;

      setText(article.querySelector('.activity-body h3'), copy.heading);

      const paragraphs = Array.from(article.querySelectorAll('.activity-body > p'));
      copy.paragraphs.forEach((text, index) => setText(paragraphs[index], text));

      const sceneBox = article.querySelector('.scene-box');
      if (sceneBox) {
        setText(sceneBox.querySelector('strong'), copy.voiceTitle);
        setText(sceneBox.querySelector('p'), copy.voice);
        addCharacterToScene(sceneBox, copy.character, copy.voiceTitle);
      }

      updateProjectDetail(article, 0, copy.activity);
      updateProjectDetail(article, 2, copy.support);
    });
  }

  document.querySelectorAll('[data-common-nav]').forEach(renderMenu);
  enhanceActivityReportAnchors();
  enhanceProjectRecordLinks();
  enhanceProjectStories();
})();
