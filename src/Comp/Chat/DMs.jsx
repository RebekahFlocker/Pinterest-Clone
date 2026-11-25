import { useEffect, useState } from "react";
import "./DMs.css";

export default function DMs() {
	const [chats, setChats] = useState([]);
	const [activeChatId, setActiveChatId] = useState(null); // chat starts off empty
	const [message, setMessage] = useState(""); // no messages are selected
	const [loading, setLoading] = useState(true); // saves what is typed in the box but not sent
	const [error, setError] = useState(""); 

	useEffect(() => {
		const controller = new AbortController(); // aborts sending a message if you change pages

		async function loadChats() {
			try { // loads 8 chats from API
				const response = await fetch("https://dummyjson.com/comments?limit=8", {
					signal: controller.signal,
				});
				if (!response.ok) { // if chats not fetched = error message
					throw new Error(`Chat fetch failed (${response.status}).`);
				}

				const data = await response.json(); // converts from JSON to JS
				if (!Array.isArray(data.comments)) {
					throw new Error("No messages in this chat."); 
				}

				const fakeChats = data.comments.map((comment) => ({ // actually makes the comments into a chat
					id: comment.id,
					name: comment.user.username,
					messages: [{ id: comment.id, text: comment.body, sent: false }],
				}));
				setChats(fakeChats); // updates the state when chat changes
			} catch (requestError) {
				if (!controller.signal.aborted) {
					setError(requestError?.message || "Unable to load messages.");
				}
			} finally {
				if (!controller.signal.aborted) {
					setLoading(false);
				}
			}
		}

		loadChats(); // loads the chats
		return () => controller.abort();
	}, []);

	const activeChat = chats.find((chat) => chat.id === activeChatId); // finds the active/ selected chat

	function sendMessage(event) { 
		event.preventDefault(); // stops page reloading when message is sent
		const text = message.trim(); // creates cleaner text formatting 
		if (!text) return; // doesnt send an empty message 

		const chat = activeChat || {  
			id: Date.now(),
            name: "New conversation", 
            messages: [] };
		const updatedChat = { // updates the chat list
			...chat,
			messages: [...chat.messages, { id: Date.now(), text, sent: true }],
		};

		setChats((currentChats) => 
			currentChats.some((item) => item.id === chat.id)
				? currentChats.map((item) => (item.id === chat.id ? updatedChat : item))
				: [updatedChat, ...currentChats]
		);
		setActiveChatId(updatedChat.id); 
		setMessage(""); // clears the text box after sending
	}

	return (
		<main className="dms-page">
			<aside className="dms-list"> {/*creates a side bar to list chats*/}
				<h2>Messages</h2>
				<p>Direct messages</p>
				
				{loading && <p role="status">Loading chats…</p>} {/*informs the user chat is loading */}
				{error && <p role="alert">Could not load messages: {error}</p>} 
				{!loading && !error && chats.length === 0 && 
					<p>No chats yet. Send a message to start one.</p>}

				
                {chats.map((chat) => (
					<button // makes each chat a button to be pressed to open the chat
						className={`dms-chat-button${activeChatId === chat.id ? " is-active" : ""}`}
						key={chat.id}
						onClick={() => setActiveChatId(chat.id)}
					>
						<strong>{chat.name}</strong>
						<div className="dms-preview">{chat.messages[chat.messages.length - 1]?.text}</div>
					</button>
				))}
			</aside>

			<section className="dms-conversation">
				<header className="dms-header">
					<strong>{activeChat?.name || "Your messages"}</strong> {/*if no chat is selected the default is just the message */}
				</header>
				<div className="dms-messages">
					{activeChat ? activeChat.messages.map((item) => (  
						<div
							className={`dms-bubble ${item.sent ? "is-sent" : "is-received"}`} // shows if message is recived
							key={item.id}>
							{item.text}
						</div>
					)) : <p className="dms-empty">Choose a conversation or send a message to start one.</p>}
				</div>
				<form className="dms-form" onSubmit={sendMessage}>
					<input // text box placeholders
						placeholder="Write a message…"
						value={message}
						onChange={(event) => setMessage(event.target.value)}
					/>
					<button type="submit">Send</button>
				</form>
			</section>
		</main>
	);
}
