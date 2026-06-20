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

    const chapters = [
      {
        label: '序章',
        title: '木頭杉の仙人と、忘れられた森の記憶',
        place: '木頭図書館',
        text: '物語は、木頭図書館の木組みの天井から始まります。読者は「杉の白みの首飾り」を受け取り、杉じぃの失われた記憶をたどる冒険へ出発します。白みは杉の外側の明るい部分。冒険の途中で片われを見つけると、ひとつの木の物語が完成します。',
        quote: '杉じぃ「ワシの心には、木の匂いと、誰かの役に立っていた誇りだけが残っておるのじゃ。」',
        mission: '白みの首飾りを受け取り、図書館の中へ。',
        image: './img/top_yamanoie1.png',
        imageAlt: '森の図書館へ向かう冒険の始まり'
      },
      {
        label: '第1章',
        title: '薄れゆく輪郭と、命の芯',
        place: '図書館の柱',
        text: '森のささやきが消えかけ、杉じぃの記憶の核もゆらいでいます。スギトは、杉じぃの中にある硬くて熱い「記憶の核」を探そうとします。ここで見つけるのは、木の中心に近い赤っぽい部分。水に強く、杉の命の芯のような存在です。',
        quote: 'スギト「杉じぃの思い出を探し出してやるよ！」',
        mission: 'ミッション1：命の芯を見つけろ。キーワードは「あかみ」。',
        image: './img/kito-quest/mission1.jpg',
        imageAlt: '謎解きミッション1 命の芯を見つけろ'
      },
      {
        label: '第2章',
        title: '激流を渡った道具の記憶',
        place: '木頭の川',
        text: '木頭の材を都へ届けるため、昔の人々は命がけで川を渡りました。その旅をともにした道具の記憶が、図書館に残されています。激しい流れを越え、木を運び、人の手から手へとつながった道具。その名は「櫂」。',
        quote: 'ユズリ「命がけの旅をともにした道具が、今も大切に残されているはずよ。」',
        mission: 'ミッション2：激流を渡った道具を見つけだせ。キーワードは「かい」。',
        image: './img/kito-quest/mission2.jpg',
        imageAlt: 'ミッション2 激流を渡った道具の名前を探せ'
      },
      {
        label: '第3章',
        title: '都での栄光と、受け継がれる約束',
        place: '大阪城・下鴨神社の記憶',
        text: '杉じぃは思い出します。木頭杉の強さと美しさは、大阪城や京都の下鴨神社といった名高い場所でも頼りにされてきました。木は二度生きる。一度目は森で、二度目は建物や道具として。胸に秘めていた一番大切な気持ちは「誇り」でした。',
        quote: '杉じぃ「ワシらは、ずっと日本を支えてきたんじゃな。」',
        mission: 'ミッション3：1000年の旅の記憶。キーワードは「ほこり」。',
        image: './img/kito-quest/mission3.jpg',
        imageAlt: 'ミッション3 1000年の旅の記憶'
      },
      {
        label: '第4章',
        title: 'ぬくもりの再会と、受け継がれる手',
        place: 'WoodHeadブース',
        text: '冒険は図書館の外へ進みます。WoodHeadブースで職人の手さばきに触れ、五稜箸を手に取ることで、木に新しい命を吹き込む仕事を感じます。白みの首飾りと赤みの片われがそろうと、ひとつの杉の木の物語が完成します。',
        quote: 'ユズリ「あの方の魂は、指先から指先へと受け継がれてきたのね。」',
        mission: 'ミッション4：赤みの片われを見つけ、首飾りを完成させよう。',
        image: './img/top_kouri1.png',
        imageAlt: '木工と手仕事のぬくもり'
      },
      {
        label: '最終章',
        title: '永遠に響く名と、千年の約束',
        place: '受付・認定',
        text: '最後に明かされる「あの方」の正体は、山を愛し、木を育て、命がけで川を下り、今も新しい命を吹き込む人々そのもの。ミッションで集めた言葉を思い出し、「あかみのぬくもりが、えいえんのほこりをつなぐ」という約束の言葉へたどり着きます。',
        quote: '杉じぃ「君が木に触れるたび、ワシらはまた、新しい物語をはじめることができる。」',
        mission: 'クリア後は「木頭見習いマイスター」として認定。首飾りを持ち帰り、後日、名前入りの札が図書館に飾られます。',
        image: './img/杉じぃ.png',
        imageAlt: '杉じぃからの贈り物'
      }
    ];

    const quiz = [
      {
        title: 'ミッション1：命の芯を見つけろ',
        question: '木の中心に近い、赤っぽくて水に強い部分の名前は？',
        choices: ['あかみ', 'しろみ', 'あまみ'],
        answer: 'あかみ',
        note: '赤みは心材。杉の中心に近く、硬くて水に強い部分です。'
      },
      {
        title: 'ミッション2：激流を渡った道具',
        question: '木頭の川を渡る旅で、船や筏を進めるために使った道具の名前は？',
        choices: ['かい', 'さお', 'いかだ'],
        answer: 'かい',
        note: '櫂は水をかいて進む道具。木頭の材を運ぶ記憶につながります。'
      },
      {
        title: 'ミッション3：1000年の旅の記憶',
        question: '木頭杉が千年の時を超えて胸に秘めていた、一番大切な気持ちは？',
        choices: ['かおり', 'ほこり', 'ねむり'],
        answer: 'ほこり',
        note: '大阪城や下鴨神社にも使われた木頭杉。その記憶の中心にあるのは誇りです。'
      }
    ];

    const section = document.createElement('section');
    section.className = 'kito-quest';
    section.innerHTML = `
      <div class="kito-quest-head">
        <div>
          <div class="kito-quest-kicker">KITO QUEST STORY</div>
          <h2>木頭クエスト 冒険の書</h2>
          <p>第4回木頭クマまつりで披露された「木頭杉の仙人と忘れられた森の記憶」を、Webで読める物語として再構成しました。クイズは本編を楽しむための小さな寄り道です。</p>
        </div>
        <div class="kito-quest-counter" data-kito-counter>序章</div>
      </div>
      <div class="kito-quest-body kito-book-body">
        <nav class="kito-map" aria-label="木頭クエストの章" data-kito-map></nav>
        <article class="kito-stage-card kito-picture-book">
          <figure class="kito-illustration">
            <img src="./img/top_yamanoie1.png" alt="森の図書館へ向かう冒険の始まり" data-kito-image>
            <figcaption data-kito-place>木頭図書館</figcaption>
          </figure>
          <div class="kito-page-text">
            <div class="kito-stage-meta" data-kito-label>序章</div>
            <h3 data-kito-title></h3>
            <div class="kito-story" data-kito-text></div>
            <div class="kito-story kito-dialogue" data-kito-quote></div>
            <p class="kito-question" data-kito-mission></p>
            <div class="kito-actions">
              <button class="btn btn-outline" type="button" data-kito-prev>前のページ</button>
              <button class="btn btn-primary" type="button" data-kito-next>次のページ</button>
            </div>
            <div class="kito-clear" data-kito-clear>
              <strong>冒険の書、読了</strong>
              <p>物語の中心は、木を育て、運び、使い、次へ渡してきた人の手です。木頭杉の赤みと白み、そして誇りを、次の世代へつないでいきます。</p>
            </div>
          </div>
        </article>
      </div>
      <div class="kito-quest-body" style="padding-top:0;">
        <div class="kito-map" data-kito-quiz-map></div>
        <article class="kito-stage-card" data-kito-quiz-card>
          <div class="kito-stage-meta">おまけクイズ</div>
          <h3 data-kito-quiz-title></h3>
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
    const place = section.querySelector('[data-kito-place]');
    const title = section.querySelector('[data-kito-title]');
    const text = section.querySelector('[data-kito-text]');
    const quote = section.querySelector('[data-kito-quote]');
    const mission = section.querySelector('[data-kito-mission]');
    const prev = section.querySelector('[data-kito-prev]');
    const next = section.querySelector('[data-kito-next]');
    const clear = section.querySelector('[data-kito-clear]');

    let chapterIndex = 0;

    chapters.forEach((chapter, index) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'kito-stage-tab';
      button.textContent = `${chapter.label}：${chapter.title}`;
      button.addEventListener('click', () => {
        chapterIndex = index;
        renderChapter();
      });
      map.append(button);
    });

    function renderChapter() {
      const chapter = chapters[chapterIndex];
      counter.textContent = chapter.label;
      label.textContent = chapter.label;
      image.src = chapter.image;
      image.alt = chapter.imageAlt;
      place.textContent = chapter.place;
      title.textContent = chapter.title;
      text.textContent = chapter.text;
      quote.textContent = chapter.quote;
      mission.textContent = chapter.mission;
      prev.disabled = chapterIndex === 0;
      next.disabled = chapterIndex === chapters.length - 1;
      clear.classList.toggle('is-visible', chapterIndex === chapters.length - 1);
      Array.from(map.children).forEach((button, index) => {
        button.classList.toggle('is-active', index === chapterIndex);
      });
    }

    prev.addEventListener('click', () => {
      if (chapterIndex > 0) {
        chapterIndex -= 1;
        renderChapter();
      }
    });

    next.addEventListener('click', () => {
      if (chapterIndex < chapters.length - 1) {
        chapterIndex += 1;
        renderChapter();
      }
    });

    const quizMap = section.querySelector('[data-kito-quiz-map]');
    const quizTitle = section.querySelector('[data-kito-quiz-title]');
    const quizQuestion = section.querySelector('[data-kito-quiz-question]');
    const quizOptions = section.querySelector('[data-kito-options]');
    const quizFeedback = section.querySelector('[data-kito-feedback]');
    let quizIndex = 0;

    quiz.forEach((item, index) => {
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
      const item = quiz[quizIndex];
      quizTitle.textContent = item.title;
      quizQuestion.textContent = item.question;
      quizFeedback.classList.remove('is-visible');
      quizFeedback.textContent = '';
      quizOptions.replaceChildren();

      item.choices.forEach((choice) => {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'kito-option';
        button.textContent = choice;
        button.addEventListener('click', () => {
          const correct = choice === item.answer;
          Array.from(quizOptions.children).forEach((option) => {
            option.disabled = true;
            option.classList.toggle('is-correct', option.textContent === item.answer);
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

    renderChapter();
    renderQuiz();
  });
})();
