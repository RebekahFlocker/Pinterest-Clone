import { useEffect, useState } from 'react'
import homeImage from '../../assets/sharePin.jpg'
import './Home.css'

function Home() {
  const [posts, setPosts] = useState([])
  const [savedPostIds, setSavedPostIds] = useState(() => new Set())
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const controller = new AbortController()

    async function loadFeed() {
      try {
        const [postsResponse, productsResponse] = await Promise.all([
          fetch('https://dummyjson.com/posts?limit=24', {
            signal: controller.signal,
          }),
          fetch('https://dummyjson.com/products?limit=30&select=images', {
            signal: controller.signal,
          }),
        ])

        if (!postsResponse.ok) {
          throw new Error(`The posts request failed (${postsResponse.status}).`)
        }
        if (!productsResponse.ok) {
          throw new Error(`The images request failed (${productsResponse.status}).`)
        }

        const [postsData, productsData] = await Promise.all([
          postsResponse.json(),
          productsResponse.json(),
        ])

        if (!Array.isArray(postsData.posts) || !Array.isArray(productsData.products)) {
          throw new Error('The feed response did not contain valid posts and images.')
        }

        const productsWithImages = productsData.products.filter(
          (product) => Array.isArray(product.images) && product.images.length > 0
        )
        if (postsData.posts.length > 0 && productsWithImages.length === 0) {
          throw new Error('The feed response did not contain any images.')
        }

        setPosts(
          postsData.posts.map((post, index) => ({
            ...post,
            image: productsWithImages[index % productsWithImages.length].images[0],
          }))
        )
      } catch (requestError) {
        if (!controller.signal.aborted) {
          setError(
            requestError instanceof Error
              ? requestError.message
              : 'Unable to load the home feed.'
          )
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false)
        }
      }
    }

    loadFeed()
    return () => controller.abort()
  }, [])

  function toggleSaved(postId) {
    setSavedPostIds((currentSavedIds) => {
      const nextSavedIds = new Set(currentSavedIds)
      if (nextSavedIds.has(postId)) {
        nextSavedIds.delete(postId)
      } else {
        nextSavedIds.add(postId)
      }
      return nextSavedIds
    })
  }

  return (
    <main className="home-page">
      <section className="home-intro">
        <img
          className="home-pic"
          src={homeImage}
          alt="Illustration introducing the home feed"
        />
        <div className="home-intro-copy">
          <p className="eyebrow">WELCOME TO YOUR HOME FEED</p>
          <h1>Find your next idea</h1>
          <p>Discover inspiration and save the ideas you love.</p>
        </div>
      </section>

      <section className="feed-section" aria-labelledby="feed-title">
        <h2 id="feed-title" className="feed-heading">Ideas for your feed</h2>

        {loading && <p className="feed-message" role="status">Loading ideas…</p>}
        {error && <p className="feed-message feed-error" role="alert">Could not load the feed: {error}</p>}
        {!loading && !error && posts.length === 0 && (
          <p className="feed-message">No ideas are available right now.</p>
        )}

        {!loading && !error && posts.length > 0 && (
          <div className="pin-grid">
            {posts.map((post) => {
              const isSaved = savedPostIds.has(post.id)
              const tags = Array.isArray(post.tags) ? post.tags.slice(0, 3) : []

              return (
                <article className="pin-card" key={post.id}>
                  <div className="pin-image-wrap">
                    <img
                      className="pin-image"
                      src={post.image}
                      alt={post.title}
                      loading="lazy"
                    />
                    <button
                      className={`pin-save-button${isSaved ? ' is-saved' : ''}`}
                      type="button"
                      aria-pressed={isSaved}
                      onClick={() => toggleSaved(post.id)}
                    >
                      {isSaved ? 'Saved' : 'Save'}
                    </button>
                  </div>
                  <div className="pin-content">
                    <h2>{post.title}</h2>
                    <p className="pin-description">{post.body}</p>
                    <div className="pin-footer">
                      <div className="pin-tags">
                        {tags.map((tag) => (
                          <span className="pin-tag" key={tag}>{tag}</span>
                        ))}
                      </div>
                      <span className="pin-likes">
                        {post.reactions?.likes ?? 0} likes
                      </span>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        )}
      </section>
    </main>
  )
}

export default Home
