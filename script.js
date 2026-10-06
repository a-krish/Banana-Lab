const categories = {
  stories: {
    label: 'Stories',
    items: [
      {
        name: 'Moonlit Orchard',
        blurb: 'A warm, whimsical story world about memory, roots, and belonging.',
        filled: true,
        action: 'Read concept'
      },
      {
        name: 'The River Below',
        blurb: 'A mysterious coming-of-age tale built around hidden currents and ancient ruins.',
        filled: true,
        action: 'View brief'
      },
      {
        name: 'Night Ferry',
        blurb: 'A moody adventure about crossing forgotten places after sunset.',
        filled: false,
        action: 'Coming soon'
      },
      {
        name: 'Glass Sky',
        blurb: 'A dreamlike fable set inside a floating city of stories and echoes.',
        filled: false,
        action: 'Coming soon'
      }
    ]
  },
  artwork: {
    label: 'Artwork',
    items: [
      {
        name: 'Banyan Bloom',
        blurb: 'Concept art exploring color, mood, and handcrafted visual identity.',
        filled: true,
        action: 'View palette'
      },
      {
        name: 'Golden Echo',
        blurb: 'Character-driven illustrations inspired by vintage storybooks.',
        filled: true,
        action: 'Open gallery'
      },
      {
        name: 'Sunset Atlas',
        blurb: 'Poster compositions and landscape studies built for worldbuilding.',
        filled: false,
        action: 'Coming soon'
      },
      {
        name: 'Forest Fragments',
        blurb: 'A mixed media collection of environment sketches and color explorations.',
        filled: false,
        action: 'Coming soon'
      }
    ]
  },
  animation: {
    label: 'Animation',
    items: [
      {
        name: 'Looped Wonder',
        blurb: 'Short-form motion tests with playful rhythm and expressive movement.',
        filled: true,
        action: 'Play reel'
      },
      {
        name: 'Velvet Weather',
        blurb: 'Atmospheric animation studies focused on mood, pacing, and timing.',
        filled: true,
        action: 'Watch scene'
      },
      {
        name: 'Pine & Thread',
        blurb: 'A handcrafted character animation idea centered on soft motion and comedy.',
        filled: false,
        action: 'Coming soon'
      },
      {
        name: 'Orange Drift',
        blurb: 'An abstract motion piece exploring color transitions and light play.',
        filled: false,
        action: 'Coming soon'
      }
    ]
  },
  games: {
    label: 'Games',
    items: [
      {
        name: 'Banana Bounce',
        blurb: 'A playful browser prototype built for quick arcade energy and bright feedback.',
        filled: true,
        action: 'Play demo'
      },
      {
        name: 'Pocket Quest',
        blurb: 'A small exploration game mixing whimsical encounters and collectible rewards.',
        filled: true,
        action: 'Open build'
      },
      {
        name: 'Mango Run',
        blurb: 'A fast-paced chase concept with layered obstacles and kinetic motion.',
        filled: false,
        action: 'Coming soon'
      },
      {
        name: 'Studio Dash',
        blurb: 'An experimental game idea shaped by teamwork, pace, and charm.',
        filled: false,
        action: 'Coming soon'
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
      const buttonMarkup = item.filled
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

renderCategory('stories');
