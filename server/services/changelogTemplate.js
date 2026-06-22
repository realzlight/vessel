export const generateChangelogHtml = (categorized) => {
  const categoryLabels = {
    FIX: 'Fixes',
    FEATURE: 'Features',
    UPDATED: 'Updated',
    ADDED: 'Added',
    DELETED: 'Deleted',
    PATCHED: 'Patched'
  }


  const sections = {}
  categorized.forEach(c => {
    if (!sections[c.category]) sections[c.category] = []
    sections[c.category].push(c)
  })

  const renderSection = (category, commits) => {
    if (!commits || commits.length === 0) return ''
    return `
      <section class="changelog-section ${category.toLowerCase()}">
        <h2>${categoryLabels[category] || category}</h2>
        <div class="commits-list">
          ${commits.map(c => `
            <div class="commit-card">
              <p class="commit-summary">${c.summary}</p>
              <span class="commit-hash">#${c.hash}</span>
            </div>
          `).join('')}
        </div>
      </section>
    `
  }

  const template = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Changelog</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
          background: #000000;
          color: #e5e5e5;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
        }
        nav {
          background: #0a0a0a;
          border-bottom: 1px solid #1a1a1a;
          padding: 16px 24px;
          font-size: 14px;
          font-weight: 600;
        }
        main {
          max-width: 700px;
          margin: 0 auto;
          padding: 24px;
        }
        .changelog-section {
          margin-bottom: 32px;
        }
        .changelog-section h2 {
          font-size: 16px;
          color: #ffffff;
          margin-bottom: 12px;
          text-transform: capitalize;
        }
        .commits-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .commit-card {
          background: #0a0a0a;
          border: 1px solid #1a1a1a;
          border-radius: 6px;
          padding: 12px;
          font-size: 13px;
        }
        .commit-summary {
          color: #e5e5e5;
          margin-bottom: 6px;
        }
        .commit-hash {
          font-family: 'Courier New', monospace;
          color: #737373;
          font-size: 11px;
        }
        footer {
          text-align: center;
          padding: 24px;
          border-top: 1px solid #1a1a1a;
          font-size: 11px;
          color: #737373;
        }
        .empty { color: #737373; padding: 24px; text-align: center; }
      </style>
    </head>
    <body>
      <nav>{project_name}</nav>
      <main>
        {fix_section}
        {feature_section}
        {updated_section}
        {added_section}
        {deleted_section}
        {patched_section}
      </main>
      <footer>made with ♥ by realzlight</footer>
    </body>
    </html>
  `

  let html = template
    .replace('{project_name}', 'Changelog')
    .replace('{fix_section}', renderSection('FIX', sections.FIX) || '<div class="empty">No fixes yet</div>')
    .replace('{feature_section}', renderSection('FEATURE', sections.FEATURE) || '')
    .replace('{updated_section}', renderSection('UPDATED', sections.UPDATED) || '')
    .replace('{added_section}', renderSection('ADDED', sections.ADDED) || '')
    .replace('{deleted_section}', renderSection('DELETED', sections.DELETED) || '')
    .replace('{patched_section}', renderSection('PATCHED', sections.PATCHED) || '')

  return html
}
