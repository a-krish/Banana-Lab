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

// Comments storage
const comments = {
  artwork: [],
  animation: []
};

// Load comments from localStorage
function loadComments() {
  const saved = localStorage.getItem('bananaLabComments');
  if (saved) {
    Object.assign(comments, JSON.parse(saved));
  }
}

// Save comments to localStorage
function saveComments() {
  localStorage.setItem('bananaLabComments', JSON.stringify(comments));
}

// Get next user number
function getNextUserNumber() {
  const allComments = [...comments.artwork, ...comments.animation];
  return allComments.length + 1;
}

// Generate username
function generateUsername(commentIndex) {
  return `user${commentIndex}`;
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

  let html = `<div class="showcase-grid">${cards}</div>`;

  // Add comment section for artwork and animation
  if (categoryName === 'artwork' || categoryName === 'animation') {
    html += renderCommentSection(categoryName);
  }

  showcase.innerHTML = html;
}

function renderCommentSection(categoryName) {
  const categoryComments = comments[categoryName] || [];

  const commentsHTML = categoryComments
    .map((comment, index) => {
      const username = generateUsername(index + 1);
      return `
        <div class="comment">
          <strong>${username}</strong>
          <p>${comment}</p>
        </div>
      `;
    })
    .join('');

  return `
    <div class="comment-section">
      <h3>Suggestions & Ideas</h3>
      <form id="comment-form" data-category="${categoryName}">
        <textarea 
          id="comment-input" 
          placeholder="What ${categoryName} should we create next?" 
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

buttons.forEach((button) => {
  button.addEventListener('click', () => {
    buttons.forEach((btn) => btn.classList.toggle('active', btn === button));
    renderCategory(button.dataset.category);
    
    // Attach event listener to the comment form after rendering
    attachCommentFormListener(button.dataset.category);
  });
});

function attachCommentFormListener(categoryName) {
  const form = document.getElementById('comment-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const textarea = document.getElementById('comment-input');
      const comment = textarea.value.trim();

      if (comment) {
        comments[categoryName].push(comment);
        saveComments();
        textarea.value = '';
        renderCategory(categoryName);
        attachCommentFormListener(categoryName);
      }
    });
  }
}

// Initialize
loadComments();
renderCategory('games');
