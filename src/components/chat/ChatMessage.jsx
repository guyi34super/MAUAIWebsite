import { linkifyMessageText } from '../../lib/chatUtils';

export default function ChatMessage({ message }) {
  const isUser = message.role === 'user';
  const parts = linkifyMessageText(message.text);

  return (
    <div className={`site-chat__message ${isUser ? 'site-chat__message--user' : 'site-chat__message--bot'}`}>
      <div className="site-chat__bubble">
        {parts.map((part, index) => {
          if (part.type === 'link') {
            return (
              <a
                key={`${part.href}-${index}`}
                href={part.href}
                target="_blank"
                rel="noopener noreferrer"
              >
                {part.value}
              </a>
            );
          }
          return <span key={`text-${index}`}>{part.value}</span>;
        })}
      </div>
    </div>
  );
}
