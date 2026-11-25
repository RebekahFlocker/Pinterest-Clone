import { useEffect, useState } from "react";
import "./DMs.css";

export default function DMs() {
	const [chats, setChats] = useState([]);
	const [activeChatId, setActiveChatId] = useState(null);
	const [message, setMessage] = useState("");
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");

	useEffect(() => {
		const controller = new AbortController();

		async function loadChats() {
			try {
				const response = await fetch("https://dummyjson.com/comments?limit=8", {
					signal: controller.signal,
				});
				if (!response.ok) {
					throw new Error(`The messages request failed (${response.status}).`);
				}

				const data = await response.json();
				if (!Array.isArray(data.comments)) {
					throw new Error("The messages response did not contain a comment list.");
				}

				const fakeChats = data.comments.map((comment) => ({
					id: comment.id,
					name: comment.user.username,
					messages: [{ id: comment.id, text: comment.body, sent: false }],
				}));
				setChats(fakeChats);
				setActiveChatId(fakeChats[0]?.id ?? null);
			} catch (requestError) {
				if (!controller.signal.aborted) {
					setError(
						requestError instanceof Error
							? requestError.message
							: "Unable to load messages."
					);
				}
			} finally {
				if (!controller.signal.aborted) {
					setLoading(false);
				}
			}
		}

		loadChats();
		return () => controller.abort();
	}, []);

	const activeChat = chats.find((chat) => chat.id === activeChatId);

	function sendMessage(event) { 
		event.preventDefault();
		const text = message.trim();
		if (!text) return;

		const chat = activeChat || { 
			id: Date.now(),
            name: "New conversation", 
            messages: [] };
		const updatedChat = {
			...chat,
			messages: [...chat.messages, { id: Date.now(), text, sent: true }],
		};

		setChats((currentChats) => 
			currentChats.some((item) => item.id === chat.id)
				? currentChats.map((item) => (item.id === chat.id ? updatedChat : item))
				: [updatedChat, ...currentChats]
		);
		setActiveChatId(updatedChat.id);
		setMessage("");
	}

	return (
		<main className="dms-page">
			<aside className="dms-list">
				<h2>Messages</h2>
				<p>Direct messages</p>
				
				{loading && <p role="status">Loading chats…</p>}
				{error && <p role="alert">Could not load messages: {error}</p>}
				{!loading && !error && chats.length === 0 && 
					<p>No chats yet. Send a message to start one.</p>}

				
                {chats.map((chat) => (
					<button
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
				<header className="dms-header"><strong>{activeChat?.name || "Your messages"}</strong></header>
				<div className="dms-messages">
					{activeChat ? activeChat.messages.map((item) => (
						<div
							className={`dms-bubble ${item.sent ? "is-sent" : "is-received"}`}
							key={item.id}
						>
							{item.text}
						</div>
					)) : <p className="dms-empty">Choose a conversation or send a message to start one.</p>}
				</div>
				<form className="dms-form" onSubmit={sendMessage}>
					<input
						aria-label="Write a message"
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
