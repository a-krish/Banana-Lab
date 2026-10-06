const categories = {
  games: {
    label: 'Games',
    items: [
      {
        name: 'Hard Platforming',
        blurb: 'A playful browser prototype built for quick arcade energy and bright feedback.',
        filled: true,
        action: 'Play demo',
        url: 'https://a-krish.github.io/cool-stuff.com/app.html'
      }
    ]
  }
};

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

  showcase.innerHTML = `<div class="showcase-grid">${cards}</div>`;
}

buttons.forEach((button) => {
  button.addEventListener('click', () => {
    buttons.forEach((btn) => btn.classList.toggle('active', btn === button));
    renderCategory(button.dataset.category);
  });
});

renderCategory('games');
