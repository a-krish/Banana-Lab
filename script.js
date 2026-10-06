const categories = {
  stories: {
    label: 'Stories',
    items: []
  },
  artwork: {
    label: 'Artwork',
    items: []
  },
  animation: {
    label: 'Animation',
    items: []
  },
  games: {
    label: 'Games',
    items: [
      {
        name: 'Space City Adventure',
        blurb: 'A playful browser prototype built for quick arcade energy and bright feedback.',
        filled: true,
        action: 'Play Game',
        url: 'https://a-krish.github.io/cool-stuff.com/app.html'
      }
    ]
  }
};

const comments = {
  stories: [],
  artwork: [],
  animation: [],
  games: []
};

function loadComments() {
  const saved = JSON.parse(localStorage.getItem('bananaLabComments') || '{}');

  Object.keys(comments).forEach((categoryName) => {
    comments[categoryName] = Array.isArray(saved[categoryName]) ? saved[categoryName] : [];
  });
}

function saveComments() {
  localStorage.setItem('bananaLabComments', JSON.stringify(comments));
}

function generateUsername(index) {
  return `user${index}`;
}

const showcase = document.querySelector('#showcase');
const buttons = document.querySelectorAll('.category-btn');

function renderCategory(categoryName) {
  const category = categories[categoryName];
  if (!category || !showcase) return;

  const cards = category.items
    .map((item) => {
      const filledClass = item.filled ? 'filled' : 'empty';
      const buttonMarkup = item.url
        ? `<a href="${item.url}" target="_blank" rel="noopener noreferrer"><button type="button">${item.action}</button></a>`
        : item.filled
          ? `<button type="button">${item.action}</button>`
          : `<button type="button" disabled>${item.action}</button>`;

      return `
        <article class="project-card ${filledClass}">
          <h3>${item.name}</h3>
          <p>${item.blurb}</p>
          ${buttonMarkup}
        </article>
      `;
    })
    .join('');

  const html = `
    <div class="showcase-grid">${cards}</div>
    ${renderCommentSection(categoryName)}
  `;

  showcase.innerHTML = html;
  attachCommentFormListener(categoryName);
}

function renderCommentSection(categoryName) {
  const categoryComments = comments[categoryName] || [];

  const commentsHTML = categoryComments
    .map((comment, index) => `
      <div class="comment">
        <strong>${generateUsername(index + 1)}</strong>
        <p>${comment}</p>
      </div>
    `)
    .join('');

  return `
    <div class="comment-section">
      <h3>${categories[categoryName].label} Suggestions</h3>
      <form id="comment-form" data-category="${categoryName}">
        <textarea
          id="comment-input"
          placeholder="What ${categories[categoryName].label.toLowerCase()} should we make next?"
          required
          maxlength="500"
        ></textarea>
        <button type="submit">Add Suggestion</button>
      </form>
      <div class="comments-list">
        ${commentsHTML || '<p class="no-comments">No suggestions yet. Be the first to share your idea!</p>'}
      </div>
    </div>
  `;
}

function attachCommentFormListener(categoryName) {
  const form = document.querySelector(`#comment-form[data-category="${categoryName}"]`);

  if (!form) return;

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const textarea = form.querySelector('#comment-input');
    const comment = textarea.value.trim();

    if (!comment) return;

    comments[categoryName].push(comment);
    saveComments();
    textarea.value = '';
    renderCategory(categoryName);
  });
}

buttons.forEach((button) => {
  button.addEventListener('click', () => {
    buttons.forEach((btn) => btn.classList.toggle('active', btn === button));
    renderCategory(button.dataset.category);
  });
});

loadComments();
renderCategory('games');
