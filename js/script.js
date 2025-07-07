const defaults = {
  "Naruto": {
    main: {
      name: "Naruto Uzumaki",
      img: "images/naruto.webp",
      bio: "Energetic ninja with a dream to become Hokage."
    },
    episodes: {
      1: { en: "Naruto becomes ninja.", ar: "ناروتو يصبح نينجا." },
      2: { en: "Team 7 is formed.", ar: "تشكيل الفريق 7." },
      3: { en: "Training starts.", ar: "يبدأ التدريب." },
      4: { en: "Mission begins.", ar: "تبدأ المهمة." },
      5: { en: "Zabuza appears.", ar: "ظهور زابوزا." }
    }
  },
  "One Piece": {
    main: {
      name: "Monkey D. Luffy",
      img: "images/luffy.png",
      bio: "Rubber-powered pirate aiming to be Pirate King."
    },
    episodes: {
      1: { en: "Luffy sets sail.", ar: "لوفي يبدأ رحلته." },
      2: { en: "Meet Zoro.", ar: "لقاء زورو." },
      3: { en: "Nami joins crew.", ar: "انضمام نامي." },
      4: { en: "Battle at Baratie.", ar: "معركة في باراتي." },
      5: { en: "Captain fights Mihawk.", ar: "الكابتن يقاتل ميهوك." }
    }
  },
  "Death Note": {
    main: {
      name: "Light Yagami",
      img: "images/light yagami.webp",
      bio: "High school genius who wields the Death Note."
    },
    episodes: {
      1: { en: "Light finds Death Note.", ar: "يجد لايت دفتر الموت." },
      2: { en: "Kira appears.", ar: "ظهور كيرا." },
      3: { en: "L starts investigation.", ar: "إل يبدأ التحقيق." },
      4: { en: "Light confronts L.", ar: "لايت يواجه إل." },
      5: { en: "Near joins case.", ar: "انضمام نير للقضية." }
    }
  },
  "Demon Slayer": {
    main: {
      name: "Tanjiro Kamado",
      img: "images/demon-slayer-paint-by-numbers.jpg",
      bio: "Determined demon slayer protecting his sister."
    },
    episodes: {
      1: { en: "Tanjiro's family attacked.", ar: "عائلة تانجيرو تتعرض لهجوم." },
      2: { en: "Tanjiro begins training.", ar: "تانجيرو يبدأ التدريب." },
      3: { en: "Meet Nezuko.", ar: "لقاء نيزيكو." },
      4: { en: "Fight with demons.", ar: "القتال مع الشياطين." },
      5: { en: "Hashira introduced.", ar: "تعريف الهاشيرا." }
    }
  },
  "Attack on Titan": {
    main: {
      name: "Eren Yeager",
      img: "images/Eren.webp",
      bio: "Vengeful warrior fighting Titans to save humanity."
    },
    episodes: {
      1: { en: "Wall breached by Titans.", ar: "اختراق الجدار من قبل العمالقة." },
      2: { en: "Eren joins Survey Corps.", ar: "إرين ينضم لفيلق الاستطلاع." },
      3: { en: "Battle inside Trost.", ar: "المعركة داخل تروست." },
      4: { en: "Eren transforms.", ar: "إرين يتحول." },
      5: { en: "Titans retreat.", ar: "انسحاب العمالقة." }
    }
  }
};

const CHARACTERS_KEY = 'animeCharacters';
const COMMENTS_KEY = 'episodeComments';

const characterContainer = document.getElementById('character-container');
const episodesSection = document.getElementById('episodes-section');
const episodeList = document.getElementById('episode-list');
const toggleEpisodesBtn = document.getElementById('toggle-episodes-btn');
const addCharacterBtn = document.getElementById('add-character-btn');
const characterFormSection = document.getElementById('character-form-section');
const characterForm = document.getElementById('character-form');
const searchInput = document.getElementById('search-input');

// Load saved or default characters
let characters = JSON.parse(localStorage.getItem(CHARACTERS_KEY)) || {};
for (const anime in defaults) {
  if (!Array.isArray(characters[anime])) {
    characters[anime] = [defaults[anime].main];
  }
}

let comments = JSON.parse(localStorage.getItem(COMMENTS_KEY)) || {};

function saveCharacters() {
  localStorage.setItem(CHARACTERS_KEY, JSON.stringify(characters));
}

function saveComments() {
  localStorage.setItem(COMMENTS_KEY, JSON.stringify(comments));
}

function createCharacterCard(character, anime) {
  const card = document.createElement('div');
  card.classList.add('character-card');

  const img = document.createElement('img');
  img.src = character.img;
  img.alt = character.name;
  img.onerror = () => { img.src = 'images/placeholder.png'; };

  const h3 = document.createElement('h3');
  h3.textContent = character.name;

  const pAnime = document.createElement('p');
  pAnime.innerHTML = `<strong>Anime:</strong> ${anime}`;

  const pBio = document.createElement('p');
  pBio.textContent = character.bio;

  const delBtn = document.createElement('button');
  delBtn.classList.add('delete-char');
  delBtn.innerHTML = '✖';
  delBtn.title = `Delete ${character.name}`;
  delBtn.addEventListener('click', () => {
    if (confirm(`Delete character ${character.name} from ${anime}?`)) {
      characters[anime] = characters[anime].filter(c => c.name !== character.name);
      if (characters[anime].length === 0) delete characters[anime];
      saveCharacters();
      renderCharacters();
    }
  });

  card.append(img, h3, pAnime, pBio, delBtn);
  return card;
}

function renderCharacters(filter = '') {
  characterContainer.innerHTML = '';
  for (const anime in characters) {
    if (!Array.isArray(characters[anime])) continue;
    characters[anime].forEach(character => {
      if (character.name.toLowerCase().includes(filter.toLowerCase())) {
        const card = createCharacterCard(character, anime);
        characterContainer.appendChild(card);
      }
    });
  }
}

function createEpisodeElement(anime, epNum, summaries) {
  const epDiv = document.createElement('div');
  epDiv.className = 'episode';

  const title = document.createElement('h3');
  title.textContent = `${anime} - Episode ${epNum}`;

  const summary = document.createElement('p');
  summary.textContent = summaries.en;
  summary.className = 'episode-summary';

  const toggleBtn = document.createElement('button');
  toggleBtn.textContent = 'Show Arabic';
  toggleBtn.className = 'lang-toggle';
  toggleBtn.addEventListener('click', () => {
    if (summary.textContent === summaries.en) {
      summary.textContent = summaries.ar;
      toggleBtn.textContent = 'Show English';
    } else {
      summary.textContent = summaries.en;
      toggleBtn.textContent = 'Show Arabic';
    }
  });

  const epKey = `${anime}-${epNum}`;
  if (!comments[epKey]) comments[epKey] = [];

  const commentSection = document.createElement('div');
  commentSection.className = 'comment-section';

  const commentList = document.createElement('div');
  commentList.className = 'comments-container';

  function renderComments() {
    commentList.innerHTML = '';
    comments[epKey].forEach((txt, idx) => {
      const c = document.createElement('div');
      c.className = 'comment';
      c.textContent = txt;

      const del = document.createElement('button');
      del.textContent = '✖';
      del.className = 'delete-comment';
      del.title = 'Delete comment';
      del.onclick = () => {
        comments[epKey].splice(idx, 1);
        saveComments();
        renderComments();
      };
      c.appendChild(del);
      commentList.appendChild(c);
    });
  }

  renderComments();

  const form = document.createElement('form');
  form.className = 'comment-form';

  const input = document.createElement('input');
  input.type = 'text';
  input.placeholder = 'Add a comment...';
  input.required = true;

  const submit = document.createElement('button');
  submit.type = 'submit';
  submit.textContent = 'Add';

  form.append(input, submit);
  form.onsubmit = e => {
    e.preventDefault();
    const val = input.value.trim();
    if (val) {
      comments[epKey].push(val);
      saveComments();
      input.value = '';
      renderComments();
    }
  };

  commentSection.append(commentList, form);
  epDiv.append(title, summary, toggleBtn, commentSection);
  return epDiv;
}

function renderEpisodes() {
  episodeList.innerHTML = '';
  for (const anime in defaults) {
    const eps = defaults[anime].episodes;
    for (const num in eps) {
      const epEl = createEpisodeElement(anime, num, eps[num]);
      episodeList.appendChild(epEl);
    }
  }
}

// Events
toggleEpisodesBtn.onclick = () => {
  const visible = episodesSection.style.display === 'block';
  episodesSection.style.display = visible ? 'none' : 'block';
  toggleEpisodesBtn.textContent = visible ? 'Show Episode Conclusions' : 'Hide Episode Conclusions';
};

addCharacterBtn.onclick = () => {
  characterFormSection.style.display =
    characterFormSection.style.display === 'block' ? 'none' : 'block';
  episodesSection.style.display = 'none';
};

characterForm.onsubmit = e => {
  e.preventDefault();
  const anime = document.getElementById('anime-name')?.value || prompt("Enter anime name:");
  const name = document.getElementById('character-name').value.trim();
  const img = document.getElementById('image-link').value.trim();
  const bio = document.getElementById('character-bio').value.trim();

  if (!characters[anime]) characters[anime] = [];
  if (characters[anime].some(c => c.name.toLowerCase() === name.toLowerCase())) {
    alert('Character with this name already exists.');
    return;
  }

  characters[anime].push({ name, img, bio });
  saveCharacters();
  renderCharacters();
  characterForm.reset();
  characterFormSection.style.display = 'none';
};

searchInput.oninput = e => {
  renderCharacters(e.target.value);
};

renderCharacters();
renderEpisodes();
// Dark mode toggle
const darkToggle = document.getElementById('dark-mode-toggle');
darkToggle.onclick = () => {
  document.body.classList.toggle('dark');
  const isDark = document.body.classList.contains('dark');
  darkToggle.textContent = isDark ? 'Toggle Light Mode' : 'Toggle Dark Mode';
};
