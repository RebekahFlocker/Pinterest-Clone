import { useEffect, useState } from 'react'
import homeImage from '../../assets/sharePin.jpg'
import './Home.css'

function Home() {
  const [posts, setPosts] = useState([])
  const [savedPostIds, setSavedPostIds] = useState(() => new Set()) // sets post IDs 
  const [likedPostIds, setLikedPostIds] = useState(() => new Set())
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const controller = new AbortController() // cancels post if you switch pages

    async function loadFeed() {
      try {
        const [postsResponse, productsResponse] = await Promise.all([ // calls 2 request at the same time 
          fetch('https://dummyjson.com/posts?limit=24', { // fetches 24 post from API
            signal: controller.signal, // can be cancelled 
          }),
          fetch('https://dummyjson.com/products?limit=30&select=images', { // fetches 30 pics 
            signal: controller.signal,
          }),
        ])

        if (!postsResponse.ok) {
          throw new Error(`The posts request failed (${postsResponse.status}).`)
        }
        if (!productsResponse.ok) {
          throw new Error(`The images request failed (${productsResponse.status}).`)
        }

        const [postsData, productsData] = await Promise.all([ // reads promise as JSON
          postsResponse.json(),
          productsResponse.json(),
        ])

        if (!Array.isArray(postsData.posts) || !Array.isArray(productsData.products)) {
          throw new Error('The feed response did not contain valid posts and images.') // if the post is invalid (no pic or post) then error is thrown
        }

        const productsWithImages = productsData.products.filter(
          (product) => Array.isArray(product.images) && product.images.length > 0 // keeps post only if there is an pic
        )
        if (postsData.posts.length > 0 && productsWithImages.length === 0) {
          throw new Error('The feed response did not contain any images.') 
        }

        setPosts( // updates state 
          postsData.posts.map((post, index) => ({
            ...post, // copies old post content into new. basiclly keeps the old and just updates it/ adds new content
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

    loadFeed() // starts loading the feed
    return () => controller.abort() // not sure if i need this, but I put a cancel request in case the pages changes 
  }, [])

  function toggleSaved(postId) { 
    setSavedPostIds((currentSavedIds) => { // tracks what post were saved using the post ID
      const nextSavedIds = new Set(currentSavedIds) // for React to update the state if post is saved 
      if (nextSavedIds.has(postId)) {
        nextSavedIds.delete(postId)
      } else {
        nextSavedIds.add(postId) // actually adds the post ID to the saved list
      }
      return nextSavedIds // for react to update again & show it
    })
  }

  function toggleLike(postId) { // for the like / unlike toggle I just used the same format as the save toggle 
    setLikedPostIds((currentLikedIds) => { 
      const nextLikedIds = new Set(currentLikedIds)
      if (nextLikedIds.has(postId)) {
        nextLikedIds.delete(postId)
      } else {
        nextLikedIds.add(postId)
      }
      return nextLikedIds
    })
  }

  return (
    <main className="home-page">
      <section className="home-intro">
        <img
          className="home-pic"
          src={homeImage} // my Pinterest feed pic. I got this from a free stock site 
        />
        <div className="home-intro-copy">
          <p className="eyebrow">WELCOME TO YOUR HOME FEED</p>
          <h1>Find your next idea</h1>
          <p>Discover inspiration and save the ideas you love.</p>
        </div>
      </section>

      <section className="feed-section">
        <h2 id="feed-title" className="feed-heading">Ideas for your feed</h2>

        {loading && <p className="feed-message" role="status">Loading ideas…</p>}
        {error && <p className="feed-message feed-error" role="alert">Could not load the feed: {error}</p>}
        {!loading && !error && posts.length === 0 && (
          <p className="feed-message">No ideas are available right now.</p>
        )}


        {!loading && !error && posts.length > 0 && ( // if there is no errors my feed/ post are displayed 
          <div className="pin-grid">
            {posts.map((post) => { // makes a box for each post
              const isSaved = savedPostIds.has(post.id)
              const isLiked = likedPostIds.has(post.id) // if post is liked its recorded in the ID
              const likeCount = (post.reactions?.likes ?? 0) + (isLiked ? 1 : 0) // displays the amount of likes if any
              const tags = Array.isArray(post.tags) ? post.tags.slice(0, 3) : [] // uses up to 3 tags from the API

              return (
                <article className="pin-card" key={post.id}> {/*what each card/ post should display*/}
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
                      onClick={() => toggleSaved(post.id)} // calls the save const function when clicked 
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
                      <button // I have a like button!! 
                        className={`pin-likes${isLiked ? ' is-liked' : ''}`} // my css will tell the JS how the like should be positioned 
                        type="button"
                        onClick={() => toggleLike(post.id)} // the actual like toggle
                      > {isLiked ? '♥' : '♡'} {likeCount} likes {/* emojies to show how the button should look when toggled  + like count */}
                      </button>
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
