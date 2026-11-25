import React, { useEffect, useState } from "react";
import "./User.css";

const defaultProfile = {
	name: "Rebekah Flocker",
	username: "bekflo",
	bio: "Welcome to my Intereast! ✨",
	
};

function readStorage(key, fallback) { // looks into my browser memory so that my app can use the data I save 
	try {
		const saved = window.localStorage.getItem(key); // saves to local storage
		return saved ? JSON.parse(saved) : fallback; // makes data JSON so that my app can read it
	} catch {
		return fallback; // so that the app wont crash / data wont delete 
	}
}

export default function User() {
	const [profile, setProfile] = useState(() => readStorage("pinterest-profile", defaultProfile));
	const [pins, setPins] = useState(() => readStorage("pinterest-profile-pins", []));
	const [hasSavedPins, setHasSavedPins] = useState(
		() => readStorage("pinterest-profile-pins", null) !== null
	);
	const [pinsLoading, setPinsLoading] = useState(
		() => readStorage("pinterest-profile-pins", null) === null
	);
	const [pinsError, setPinsError] = useState("");
	const [editingProfile, setEditingProfile] = useState(false);
	const [profileForm, setProfileForm] = useState(profile || defaultProfile);
	const [pinForm, setPinForm] = useState({ title: "", image: "" });
	const [editingPin, setEditingPin] = useState(null);
	const [showPinForm, setShowPinForm] = useState(false);

	useEffect(() => { // i just copied my useEffect from my home page since its the same coding principles
		if (hasSavedPins) return;

		const controller = new AbortController(); // cancels post if you switch pages

		async function loadStarterPins() {
			try {
        const [postsResponse, productsResponse] = await Promise.all([
        	fetch("https://dummyjson.com/posts?limit=6", {
        		signal: controller.signal,
        	}),
        	fetch("https://dummyjson.com/products?limit=6&select=images", {
        		signal: controller.signal,
        	}),
        ]);
        if (!postsResponse.ok) {
        	throw new Error(`The starter posts request failed (${postsResponse.status}).`);
				}
        if (!productsResponse.ok) {
        	throw new Error(`The starter images request failed (${productsResponse.status}).`);
				}

        const [postsData, productsData] = await Promise.all([
        	postsResponse.json(),
        	productsResponse.json(),
        ]);
        if (!Array.isArray(postsData.posts) || !Array.isArray(productsData.products)) {
        	throw new Error("The starter pins response did not contain valid posts and images.");
        }

        const productsWithImages = productsData.products.filter(
        	(product) => Array.isArray(product.images) && product.images.length > 0
        );
        if (postsData.posts.length > 0 && productsWithImages.length === 0) {
        	throw new Error("The starter pins response did not contain any images.");
        }

        const starterPins = postsData.posts.map((post, index) => ({
					id: post.id,
					title: post.title,
          image: productsWithImages[index % productsWithImages.length].images[0],

        }));
        setPins(starterPins);
				setHasSavedPins(true);
			} catch (requestError) { // catches any errors when fetching post
				if (!controller.signal.aborted) {
					setPinsError(
						requestError instanceof Error
							? requestError.message
							: "Unable to load your pins."
					);
				}
			} finally {
				if (!controller.signal.aborted) {
					setPinsLoading(false);
				}
			}
		}

		loadStarterPins();
		return () => controller.abort();
	}, [hasSavedPins]);

	useEffect(() => { // code like this allows any changes to my profile to be saved to my windows local storage
		try {
			if (profile) window.localStorage.setItem("pinterest-profile", JSON.stringify(profile));
			else window.localStorage.removeItem("pinterest-profile");
		} catch {}}, [profile]);

	useEffect(() => { // this useEffect allows my edited pins/ post to be saved even after a page refresh 
		if (!hasSavedPins) return;

		try {
			window.localStorage.setItem("pinterest-profile-pins", JSON.stringify(pins));
		} catch {}}, [hasSavedPins, pins]);

	const saveProfile = (event) => { // allows me to change my profile and to save it as my new state 
		event.preventDefault();
		setProfile({ ...profileForm, name: profileForm.name.trim(), username: profileForm.username.trim().replace(/^@/, "") }); // 4 clean formatting
		setEditingProfile(false); 
	};

	const savePin = (event) => { // allows me to change my PINS so that is saves and becomes my new state 
		event.preventDefault();
		const title = pinForm.title.trim(); 
		const image = pinForm.image.trim();
		if (!title || !image) return; // dont post pin unless there is content in it
		if (editingPin !== null) {
			setPins((current) => current.map((pin) => pin.id === editingPin ? { ...pin, title, image } : pin));
		} else {
			setPins((current) => [{ id: Date.now(), title, image }, ...current]);
		}
		setHasSavedPins(true);
		setPinsLoading(false);
		setPinsError("");
		setPinForm({ title: "", image: "" });
		setEditingPin(null);
		setShowPinForm(false);
	};

	const startEditPin = (pin) => { // I can actually edit my post too!!
		setPinForm({ title: pin.title, image: pin.image });
		setEditingPin(pin.id);
		setShowPinForm(true);
	};

	const cancelPinForm = () => { // allows me to cancel my new post
		setPinForm({ title: "", image: "" });
		setEditingPin(null);
		setShowPinForm(false);
	};

	return (
		<main className="profile-page">

			<nav className="profile-nav">
				<span className="profile-brand" >R</span>
				<span className="profile-nav-label">Profile</span>
			</nav>

			{profile ? (
				<>
					<section className="profile-top">
						<div className="avatar" >{profile.name?.charAt(0)?.toUpperCase() || "No Pic"}</div>
						<h1>{profile.name}</h1>
						<p className="handle">@{profile.username}</p>
						{profile.bio && <p className="bio">{profile.bio}</p>}
						<div className="profile-actions">
							<button className="button" onClick={() => { setProfileForm(profile); setEditingProfile(true); }}>Edit profile</button>
							<button className="button primary" onClick={() => { cancelPinForm(); setShowPinForm(true); }}>＋ Create Pin</button>
						</div>
					</section>

					{editingProfile && (
						<form className="form-card" onSubmit={saveProfile}>
							<h2>Edit profile</h2>
							<label htmlFor="profile-name">Name</label>
							<input id="profile-name" required value={profileForm.name} onChange={(event) => 
                setProfileForm({ ...profileForm, name: event.target.value })} />
							<label htmlFor="profile-username">Username</label>
							<input id="profile-username" required value={profileForm.username} onChange={(event) => 
                setProfileForm({ ...profileForm, username: event.target.value })} />
							<label htmlFor="profile-bio">About</label>
							<textarea id="profile-bio" value={profileForm.bio} onChange={(event) => 
                setProfileForm({ ...profileForm, bio: event.target.value })} />
							<div className="form-buttons">
                <button className="button primary" type="submit">Save</button>
                <button className="button" type="button" onClick={() => 
                  setEditingProfile(false)}>Cancel</button>
                <button className="button" type="button" onClick={() => 
                  { setProfile(null); setEditingProfile(false); }}>Delete profile</button>
              </div>
						</form>
					)}

					{showPinForm && (
						<form className="form-card" onSubmit={savePin}>
							<h2>{editingPin !== null ? "Edit Pin" : "Create a Pin"}</h2>
							<label htmlFor="pin-title">Title</label>
							<input id="pin-title" required value={pinForm.title} onChange={(event) => 
                setPinForm({ ...pinForm, title: event.target.value })} placeholder="Give your Pin a title" />
							<label htmlFor="pin-image">Image URL</label>
							<input id="pin-image" required type="url" value={pinForm.image} onChange={(event) => 
                setPinForm({ ...pinForm, image: event.target.value })} placeholder="https://..." />
							<div className="form-buttons">
                <button className="button primary" type="submit">
                  {editingPin !== null ? "Save changes" : "Create Pin"}</button>
                  <button className="button" type="button" onClick={cancelPinForm}>Cancel</button>
              </div>
						</form>
					)}

					<section>
						<div className="section-head"><h2>Created</h2></div>
						{pinsLoading ? (
							<p className="empty-state">Loading Pins...</p>
						) : pinsError ? (
							<p className="empty-state">Could not load starter Pins: {pinsError}</p>
						) : pins.length ? (
							<div className="pin-grid">
								{pins.map((pin) => (
									<article className="pin-card" key={pin.id}>
										<img src={pin.image} alt={pin.title} loading="lazy" />
										<div className="pin-controls">
                      <button className="icon-button" type="button" onClick={() => 
                        startEditPin(pin)}>✎</button> {/* my cool pen emoji*/}
											<button className="icon-button" type="button"  onClick={() => 
                        setPins((current) => current.filter((item) => item.id !== pin.id))}>×</button>
										</div>
										<p className="pin-title">{pin.title}</p>
									</article>
								))}
							</div>
						) : <p className="empty-state">Your Pins will appear here. Create one to get started.</p>}
					</section>
				</>
			) : (
				<section className="profile-top">
					<div className="avatar">+</div>
					<h1>Create your profile</h1>
					<p className="bio">Set up your account to start collecting ideas.</p>
					<button className="button primary" onClick={() => { setProfileForm(defaultProfile); setProfile(defaultProfile); setEditingProfile(true); }}>Create profile</button>
				</section>
			)}
		</main>
	);
}
