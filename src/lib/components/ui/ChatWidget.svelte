<script lang="ts">
	import { Chat } from '@ai-sdk/svelte'
	import { MessageSquarePlus } from 'lucide-svelte'
	import ChatMessage from './ChatMessage.svelte'
	import { chatMessageMetadataSchema, type ChatUIMessage } from '$lib/types/chat'

	let isOpen = $state(false)
	let inputText = $state('')
	let messagesContainer: HTMLDivElement | undefined = $state()

	const chat = new Chat<ChatUIMessage>({
		messageMetadataSchema: chatMessageMetadataSchema
	})

	const suggestedQuestions = [
		'What AI skills does Wen have?',
		'How does Wen use AI in development?',
		'Tell me about the RAG chatbot.'
	]

	function sendText(text: string) {
		if (!text.trim()) return
		if (chat.status === 'submitted' || chat.status === 'streaming') return
		chat.sendMessage({ text })
		inputText = ''
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault()
			sendText(inputText)
		}
	}

	function handleSourceClick(sectionId: string) {
		isOpen = false
		document.querySelector(sectionId)?.scrollIntoView({ behavior: 'smooth' })
	}

	function scrollToBottom() {
		if (!messagesContainer) return
		messagesContainer.scrollTop = messagesContainer.scrollHeight
	}

	$effect(() => {
		if (chat.messages.length === 0) return
		const frame = requestAnimationFrame(scrollToBottom)
		return () => cancelAnimationFrame(frame)
	})

	let isActive = $derived(chat.status === 'submitted' || chat.status === 'streaming')

	let lastAssistantId = $derived(
		chat.messages.filter((m) => m.role === 'assistant').at(-1)?.id
	)

	let thinkingLabel = $derived(
		chat.status === 'submitted'
			? 'Analyzing query...'
			: chat.status === 'streaming'
				? 'Generating response...'
				: ''
	)
</script>

<!-- Toggle button -->
<button
	class="fixed right-6 bottom-6 z-50 flex h-14 w-14 items-center justify-center rounded-full border border-white/10 bg-brand-primary text-surface-950 shadow-[0_0_24px_rgba(16,185,129,0.3)] transition-all duration-300 hover:scale-105 hover:shadow-[0_0_32px_rgba(16,185,129,0.5)]"
	onclick={() => (isOpen = !isOpen)}
	aria-label={isOpen ? 'Close chat' : 'Open chat'}
>
	{#if isOpen}
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="22"
			height="22"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2.5"
			stroke-linecap="round"
			stroke-linejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg
		>
	{:else}
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="22"
			height="22"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2.5"
			stroke-linecap="round"
			stroke-linejoin="round"
			><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" /></svg
		>
	{/if}
</button>

<!-- Chat panel -->
{#if isOpen}
	<div
		class="fixed right-6 bottom-24 z-50 flex w-[380px] max-w-[calc(100vw-3rem)] flex-col overflow-hidden rounded-2xl border border-white/[0.08] bg-surface-950/95 shadow-[0_16px_64px_rgba(0,0,0,0.6)] backdrop-blur-xl"
		style="height: min(540px, calc(100vh - 8rem));"
	>
		<!-- Header -->
		<div class="flex items-center gap-3 border-b border-white/[0.06] px-5 py-4">
			<div class="flex h-8 w-8 items-center justify-center rounded-full bg-brand-primary/20">
				<div class="h-2 w-2 rounded-full bg-brand-primary"></div>
			</div>
			<div class="flex-1">
				<div class="text-sm font-semibold text-surface-50">Ask Me Anything</div>
				<div class="text-xs text-surface-500">AI-powered by RAG</div>
			</div>
			<button
				type="button"
				onclick={() => (chat.messages = [])}
				disabled={chat.messages.length === 0 || isActive}
				aria-label="New chat"
				title="New chat"
				class="flex h-8 w-8 items-center justify-center rounded-full text-surface-500 transition-colors hover:bg-white/[0.04] hover:text-surface-200 disabled:pointer-events-none disabled:opacity-30"
			>
				<MessageSquarePlus size={16} />
			</button>
		</div>

		<!-- Messages -->
		<div class="flex-1 space-y-4 overflow-y-auto p-5" bind:this={messagesContainer}>
			{#if chat.messages.length === 0}
				<!-- Welcome state -->
				<div class="space-y-3">
					<p class="text-sm text-surface-400">
						Ask me about Wen's experience, AI workflow, skills, or projects. I'll answer based on
						real portfolio data.
					</p>
					<div class="flex flex-col gap-2">
						{#each suggestedQuestions as question (question)}
							<button
								class="rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-2 text-left text-xs text-surface-400 transition-all duration-200 hover:border-brand-primary/30 hover:text-surface-300"
								onclick={() => sendText(question)}
							>
								{question}
							</button>
						{/each}
					</div>
				</div>
			{:else}
				{#each chat.messages as message (message.id)}
					<ChatMessage
						role={message.role === 'user' ? 'user' : 'assistant'}
						content={message.parts
							?.filter((p) => p.type === 'text')
							.map((p) => p.text)
							.join('') || ''}
						metadata={message.role === 'assistant' ? message.metadata : undefined}
						showFollowUps={message.id === lastAssistantId && !isActive}
						onSourceClick={handleSourceClick}
						onSuggestionClick={sendText}
					/>
				{/each}

				{#if isActive}
					<div class="flex justify-start">
						<div
							class="flex items-center gap-2.5 rounded-2xl border border-white/[0.06] bg-white/[0.03] px-4 py-3"
						>
							<span class="relative flex h-2 w-2">
								<span
									class="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-primary opacity-75"
								></span>
								<span class="inline-flex h-2 w-2 rounded-full bg-brand-primary"></span>
							</span>
							<span class="text-xs text-surface-400">{thinkingLabel}</span>
						</div>
					</div>
				{/if}
			{/if}

			{#if chat.error}
				<div
					class="rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-xs text-red-400"
				>
					{chat.error.message || 'Something went wrong. Please try again.'}
				</div>
			{/if}
		</div>

		<!-- Input -->
		<div class="border-t border-white/[0.06] p-4">
			<div class="flex gap-2">
				<input
					type="text"
					bind:value={inputText}
					onkeydown={handleKeydown}
					placeholder="Ask about Wen's experience..."
					class="flex-1 rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-2.5 text-sm text-surface-200 placeholder-surface-600 outline-none transition-colors focus:border-brand-primary/40"
					disabled={isActive}
				/>
				<button
					onclick={() => sendText(inputText)}
					disabled={isActive || !inputText.trim()}
					aria-label="Send message"
					class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-primary text-surface-950 transition-all duration-200 hover:shadow-[0_0_16px_rgba(16,185,129,0.3)] disabled:opacity-30"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="16"
						height="16"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2.5"
						stroke-linecap="round"
						stroke-linejoin="round"><path d="m5 12 7-7 7 7" /><path d="M12 19V5" /></svg
					>
				</button>
			</div>
		</div>
	</div>
{/if}
