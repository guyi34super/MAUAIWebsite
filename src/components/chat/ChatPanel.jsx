import { useEffect, useRef, useState } from 'react';
import { Send, X } from 'lucide-react';
import ChatMessage from './ChatMessage';
import { MAX_MESSAGE_LENGTH, isBookOrderOptionSet, isLoopOptionSet, isWelcomeOptionSet } from '../../lib/chatUtils';

function optionLabel(option) {
  if (typeof option === 'string') return option;
  return option?.label || option?.text || '';
}

function optionValue(option) {
  if (typeof option === 'string') return option;
  return option?.value || option?.label || option?.text || '';
}

export default function ChatPanel({ onClose, messages, options, loading, sending, syncing, error, ready, onSend, onRetry }) {
  const [input, setInput] = useState('');
  const listRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages, syncing, options]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || sending) return;
    setInput('');
    onSend(text);
  };

  const handleOptionClick = (option) => {
    const value = optionValue(option);
    if (!value || sending) return;
    onSend(value);
  };

  const busy = sending;
  const bootstrapping = syncing && messages.filter((m) => m.text?.trim()).length === 0;
  const hasUserMessage = messages.some((m) => m.role === 'user' && m.text?.trim());
  const menuReady = options.length > 0 && !hasUserMessage;
  const showTyping = syncing || bootstrapping;
  const showWelcomeOptions = isWelcomeOptionSet(options);
  const showLoopOptions = isLoopOptionSet(options);
  const showBookOrderOptions = isBookOrderOptionSet(options);
  const optionsLabel = showWelcomeOptions
    ? 'Choose a service:'
    : showLoopOptions
      ? 'Yes or no:'
      : showBookOrderOptions
        ? 'Choose one:'
        : 'Choose an option:';

  return (
    <div className="site-chat__panel" role="dialog" aria-label="Chat with MO">
      <header className="site-chat__header">
        <div>
          <p className="site-chat__title">Chat with MO</p>
          <p className="site-chat__subtitle">Ask about our AI services</p>
        </div>
        <button type="button" onClick={onClose} className="site-chat__close" aria-label="Close chat">
          <X size={18} />
        </button>
      </header>

      <div className="site-chat__messages" ref={listRef}>
        {messages.length === 0 && !busy && !syncing && !bootstrapping && !error && (
          <p className="site-chat__empty">Hi! How can I help you today?</p>
        )}
        {messages.filter((msg) => msg.text?.trim()).map((msg) => (
          <ChatMessage key={msg.id} message={msg} />
        ))}
        {showTyping && (
          <div className="site-chat__typing" aria-live="polite">
            <span className="site-chat__typing-dot" />
            <span className="site-chat__typing-dot" />
            <span className="site-chat__typing-dot" />
          </div>
        )}
        {error && (
          <div className="site-chat__error">
            <p>{error}</p>
            <button type="button" onClick={onRetry} className="site-chat__retry">
              Try again
            </button>
          </div>
        )}
      </div>

      {options.length > 0 && (
        <div className="site-chat__options-wrap">
          <p className="site-chat__options-label">{optionsLabel}</p>
          <div className={`site-chat__options${showLoopOptions || showBookOrderOptions ? ' site-chat__options--row' : ''}`}>
            {options.map((option, i) => {
              const label = optionLabel(option);
              if (!label) return null;
              return (
                <button
                  key={`${label}-${i}`}
                  type="button"
                  className="site-chat__option"
                  onClick={() => handleOptionClick(option)}
                  disabled={busy}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>
      )}

      <form className="site-chat__form" onSubmit={handleSubmit}>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value.slice(0, MAX_MESSAGE_LENGTH))}
          placeholder={showWelcomeOptions ? 'Type a service name…' : 'Type a message…'}
          className="site-chat__input"
          disabled={busy || (bootstrapping && !menuReady)}
          aria-label="Message"
        />
        <button type="submit" className="site-chat__send" disabled={busy || (bootstrapping && !menuReady) || !input.trim()} aria-label="Send message">
          <Send size={18} />
        </button>
      </form>
    </div>
  );
}
