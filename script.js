// Supabase configuration
const supabaseUrl = 'https://hxkjobrrebofvgjheyom.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh4a2pvYnJyZWJvZnZnamhleW9tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTEzNjY1NjYsImV4cCI6MjEwNjk0MjU2Nn0.31LRRsoAHPX5gL7RiARSbnkTQMLDwrK3qoxLYlZLgQQ';
const supabaseClient = window.supabase.createClient(supabaseUrl, supabaseKey);

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

async function loadComments() {
  try {
    const { data, error } = await supabaseClient
      .from('comments')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Failed to load comments:', error);
      return;
    }

    Object.keys(comments).forEach((categoryName) => {
      comments[categoryName] = (data || [])
        .filter((item) => item.category === categoryName)
        .map((item) => ({
          text: item.text,
          username: item.username
        }));
    });
  } catch (err) {
    console.error('Error loading comments:', err);
  }
}

function generateUsername() {
  return `user${Date.now()}`;
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
    .map((commentData) => `
      <div class="comment">
        <strong>${commentData.username}</strong>
        <p>${commentData.text}</p>
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

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const textarea = form.querySelector('#comment-input');
    const comment = textarea.value.trim();

    if (!comment) return;

    const username = generateUsername();

    try {
      const { error } = await supabaseClient.from('comments').insert([
        {
          category: categoryName,
          text: comment,
          username
        }
      ]);

      if (error) {
        console.error('Failed to add comment:', error);
        alert('Failed to add comment. Please try again.');
        return;
      }

      textarea.value = '';
      await loadComments();
      renderCategory(categoryName);

      setTimeout(() => {
        const commentsList = document.querySelector('.comments-list');
        if (commentsList) {
          commentsList.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      }, 0);
    } catch (err) {
      console.error('Error adding comment:', err);
      alert('Failed to add comment. Please try again.');
    }
  });
}

buttons.forEach((button) => {
  button.addEventListener('click', () => {
    buttons.forEach((btn) => btn.classList.toggle('active', btn === button));
    renderCategory(button.dataset.category);
  });
});

loadComments().then(() => renderCategory('games'));
