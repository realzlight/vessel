export const getRepoCommits = async (githubRepo) => {
  try {
    const [owner, repo] = githubRepo.split('/')
    const res = await fetch(`https://api.github.com/repos/${owner}/${repo}/commits?per_page=50`)
    
    if (!res.ok) {
      throw new Error(`GitHub API error: ${res.status}`)
    }

    const commits = await res.json()
    
    return commits.map(c => ({
      hash: c.sha.slice(0, 7),
      message: c.commit.message.split('\n')[0], // first line only
      author: c.commit.author.name,
      timestamp: c.commit.author.date,
      url: c.html_url
    }))
  } catch (err) {
    console.error('GitHub fetch error:', err)
    throw err
  }
}
