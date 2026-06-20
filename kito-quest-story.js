(function () {
  'use strict';

  function ready(fn) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn, { once: true });
      return;
    }
    fn();
  }

  ready(function () {
    const playContainer = document.querySelector('#character-play .container');
    if (!playContainer || document.querySelector('.kito-quest')) return;

    const pages = [
      {
        label: '表紙',
        title: '森の記憶の図書館と3人の精霊たち',
        image: './img/kito-quest/story-00-cover.png',
        imageAlt: '森の記憶の図書館と3人の精霊たち 表紙',
        text: '木頭杉の仙人、スギト、ユズリが、忘れられた森の記憶をたどる物語です。まずは絵本を開くように、森の図書館へ入っていきます。',
        mission: '木頭杉の仙人と忘れられた森の記憶'
      },
      {
        label: 'はじまり',
        title: '呼吸する図書館',
        image: './img/kito-quest/story-01-beginning.png',
        imageAlt: 'はじまりの章 呼吸する図書館',
        text: '木頭図書館は、世界一美しい木の殿堂。千年の時を越えて山からやってきた木頭杉たちが、静かに眠るように本を守っています。',
        mission: '図書館の息づかいに耳を澄ませよう。'
      },
      {
        label: '第1章',
        title: '薄れゆく輪郭と、命の芯',
        image: './img/kito-quest/story-02-core.png',
        imageAlt: '第1章 薄れゆく輪郭と命の芯',
        text: '杉じぃが本棚の柱に触れると、指先は木の表面に吸い込まれるように透き通ってしまいます。失われかけた記憶の奥で、赤く光る命の芯が呼んでいます。',
        mission: 'ミッション1へ。赤い部分の名前を思い出そう。'
      },
      {
        label: '第2章',
        title: '激流を渡った道具の記憶',
        image: './img/kito-quest/story-03-river-tool.png',
        imageAlt: '第2章 激流を渡った道具の記憶',
        text: '杉じぃは、激しい川を一本の道具だけで命がけで乗り越えた記憶をたどります。木頭の材を運んだ人々の手と声が、森の中によみがえります。',
        mission: 'ミッション2へ。激流を渡った道具の名を探そう。'
      },
      {
        label: '第3章',
        title: '都での栄光と、受け継がれる約束',
        image: './img/kito-quest/story-04-city-promise.png',
        imageAlt: '第3章 都での栄光と受け継がれる約束',
        text: '記憶の先には、大阪城や下鴨神社へとつながる旅がありました。木頭杉は、遠い都で人々の暮らしと祈りを支えてきたのです。',
        mission: 'ミッション3へ。杉じぃの胸に残った気持ちを見つけよう。'
      },
      {
        label: '第4章',
        title: 'ぬくもりの再会と、受け継がれる手',
        image: './img/kito-quest/story-05-woodhead.png',
        imageAlt: '第4章 ぬくもりの再会と受け継がれる手',
        text: '導かれるようにたどり着いたのは、木の香りに包まれた職人の小屋。木頭杉の記憶は、今も手仕事の中で新しい形へ生まれ変わっています。',
        mission: '職人の手から、木がもう一度生きはじめる。'
      },
      {
        label: '最終章',
        title: '永遠に響く「名」と、千年の約束',
        image: './img/kito-quest/story-06-final-promise.png',
        imageAlt: '最終章 永遠に響く名と千年の約束',
        text: '杉じぃは全てを思い出します。木を育て、運び、使い、次へ渡してきた人々の名前。その記憶は、千年の森から未来へ続いていきます。',
        mission: '集めた言葉が、約束の言葉へつながります。'
      },
      {
        label: '贈り物',
        title: '杉じぃからの贈り物',
        image: './img/kito-quest/story-07-gift.png',
        imageAlt: '杉じぃからの贈り物 木頭見習いマイスター認定',
        text: '見事に全ての記憶をつなぎ止めた君は、「木頭見習いマイスター」として認定されます。物語の続きは、木に触れる一人ひとりの手の中にあります。',
        mission: '読了したら、おまけクイズで記憶をたしかめよう。'
      }
    ];

    const quizzes = [
      {
        title: 'ミッション1：命の芯を見つけろ',
        image: './img/kito-quest/mission1.jpg',
        imageAlt: '謎解きミッション1 命の芯を見つけろ',
        question: '木の中心に近い「赤い部分」の名前は何でしょう？',
        choices: ['あかみ', 'しろみ', 'あまみ'],
        answer: 'あかみ',
        note: '正解は「あかみ」。木の中心に近い赤みのある部分で、杉じぃの記憶の芯につながります。'
      },
      {
        title: 'ミッション2：激流を渡った道具',
        image: './img/kito-quest/mission2.jpg',
        imageAlt: 'ミッション2 激流を渡った道具の名前を探せ',
        question: '激しい川を渡るために使われた道具の名前は？',
        choices: ['かい', 'さお', 'いかだ'],
        answer: 'かい',
        note: '正解は「かい」。櫂は水をかいて進む道具で、木頭杉を運んだ記憶につながります。'
      },
      {
        title: 'ミッション3：1000年の旅の記憶',
        image: './img/kito-quest/mission3.jpg',
        imageAlt: 'ミッション3 1000年の旅の記憶',
        question: '木頭杉が胸に秘めていた「一番大切な気持ち」は何でしょう？',
        choices: ['かおり', 'ほこり', 'ねむり'],
        answer: 'ほこり',
        note: '正解は「ほこり」。大阪城や下鴨神社にもつながる、木頭杉の千年の記憶です。'
      }
    ];

    const section = document.createElement('section');
    section.className = 'kito-quest';
    section.innerHTML = `
      <div class="kito-quest-head">
        <div>
          <div class="kito-quest-kicker">KITO QUEST PICTURE BOOK</div>
          <h2>木頭クエスト 冒険の書</h2>
          <p>第4回木頭クマまつりで披露された物語を、イラストと一緒にめくって読める絵本形式にしました。クイズは物語を読み終えたあとに楽しむ小さなおまけです。</p>
        </div>
        <div class="kito-quest-counter" data-kito-counter>表紙</div>
      </div>

      <div class="kito-quest-body kito-book-body">
        <nav class="kito-map" aria-label="木頭クエストのページ" data-kito-map></nav>
        <article class="kito-stage-card kito-picture-book">
          <figure class="kito-page-figure">
            <img src="./img/kito-quest/story-00-cover.png" alt="森の記憶の図書館と3人の精霊たち 表紙" data-kito-image>
          </figure>
          <div class="kito-page-panel">
            <div class="kito-stage-meta" data-kito-label>表紙</div>
            <h3 data-kito-title></h3>
            <p class="kito-story" data-kito-text></p>
            <p class="kito-question" data-kito-mission></p>
            <div class="kito-actions">
              <button class="btn btn-outline" type="button" data-kito-prev>前のページ</button>
              <button class="btn btn-primary" type="button" data-kito-next>次のページ</button>
            </div>
            <div class="kito-clear" data-kito-clear>
              <strong>冒険の書、読了</strong>
              <p>物語を読み終えたら、下の3つのクイズで杉じぃの記憶をもう一度たどってみよう。</p>
            </div>
          </div>
        </article>
      </div>

      <div class="kito-quest-body kito-quiz-body">
        <div class="kito-map" data-kito-quiz-map></div>
        <article class="kito-stage-card kito-quiz-card" data-kito-quiz-card>
          <div class="kito-stage-meta">おまけクイズ</div>
          <h3 data-kito-quiz-title></h3>
          <figure class="kito-quiz-figure">
            <img src="./img/kito-quest/mission1.jpg" alt="謎解きミッション1 命の芯を見つけろ" data-kito-quiz-image>
          </figure>
          <p class="kito-question" data-kito-quiz-question></p>
          <div class="kito-options" data-kito-options></div>
          <div class="kito-feedback" data-kito-feedback></div>
        </article>
      </div>
    `;

    playContainer.append(section);

    const map = section.querySelector('[data-kito-map]');
    const counter = section.querySelector('[data-kito-counter]');
    const image = section.querySelector('[data-kito-image]');
    const label = section.querySelector('[data-kito-label]');
    const title = section.querySelector('[data-kito-title]');
    const text = section.querySelector('[data-kito-text]');
    const mission = section.querySelector('[data-kito-mission]');
    const prev = section.querySelector('[data-kito-prev]');
    const next = section.querySelector('[data-kito-next]');
    const clear = section.querySelector('[data-kito-clear]');

    let pageIndex = 0;

    pages.forEach((page, index) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'kito-stage-tab';
      button.textContent = `${page.label}：${page.title}`;
      button.addEventListener('click', () => {
        pageIndex = index;
        renderPage();
      });
      map.append(button);
    });

    function renderPage() {
      const page = pages[pageIndex];
      counter.textContent = page.label;
      label.textContent = page.label;
      image.src = page.image;
      image.alt = page.imageAlt;
      title.textContent = page.title;
      text.textContent = page.text;
      mission.textContent = page.mission;
      prev.disabled = pageIndex === 0;
      next.disabled = pageIndex === pages.length - 1;
      clear.classList.toggle('is-visible', pageIndex === pages.length - 1);
      Array.from(map.children).forEach((button, index) => {
        button.classList.toggle('is-active', index === pageIndex);
      });
    }

    prev.addEventListener('click', () => {
      if (pageIndex > 0) {
        pageIndex -= 1;
        renderPage();
      }
    });

    next.addEventListener('click', () => {
      if (pageIndex < pages.length - 1) {
        pageIndex += 1;
        renderPage();
      }
    });

    const quizMap = section.querySelector('[data-kito-quiz-map]');
    const quizTitle = section.querySelector('[data-kito-quiz-title]');
    const quizImage = section.querySelector('[data-kito-quiz-image]');
    const quizQuestion = section.querySelector('[data-kito-quiz-question]');
    const quizOptions = section.querySelector('[data-kito-options]');
    const quizFeedback = section.querySelector('[data-kito-feedback]');
    let quizIndex = 0;

    quizzes.forEach((item, index) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'kito-stage-tab';
      button.textContent = item.title;
      button.addEventListener('click', () => {
        quizIndex = index;
        renderQuiz();
      });
      quizMap.append(button);
    });

    function renderQuiz() {
      const item = quizzes[quizIndex];
      quizTitle.textContent = item.title;
      quizImage.src = item.image;
      quizImage.alt = item.imageAlt;
      quizQuestion.textContent = item.question;
      quizFeedback.classList.remove('is-visible');
      quizFeedback.textContent = '';
      quizOptions.replaceChildren();

      item.choices.forEach((choice, index) => {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'kito-option';
        button.textContent = `${index + 1}. ${choice}`;
        button.dataset.answer = choice;
        button.addEventListener('click', () => {
          const correct = button.dataset.answer === item.answer;
          Array.from(quizOptions.children).forEach((option) => {
            option.disabled = true;
            option.classList.toggle('is-correct', option.dataset.answer === item.answer);
          });
          if (!correct) button.classList.add('is-wrong');
          quizFeedback.textContent = correct ? `正解。${item.note}` : `もう一歩。正解は「${item.answer}」。${item.note}`;
          quizFeedback.classList.add('is-visible');
        });
        quizOptions.append(button);
      });

      Array.from(quizMap.children).forEach((button, index) => {
        button.classList.toggle('is-active', index === quizIndex);
      });
    }

    renderPage();
    renderQuiz();
  });
})();
