import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useProducts } from '../context/ProductsContext'
import { getBotResponse } from '../utils/chatBotLogic'
import styles from './ChatBot.module.css'

export default function ChatBot() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([{ role: 'bot', text: "Hi! I'm your shopping assistant. Ask for product suggestions or about shipping and returns.", products: [], id: 'welcome' }])
  const [input, setInput] = useState('')
  const messagesEndRef = useRef(null)
  const { products } = useProducts()

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = () => {
    const text = input.trim()
    if (!text) return
    setInput('')
    setMessages((prev) => [...prev, { role: 'user', text, products: [], id: `u-${Date.now()}` }])
    const { text: botText, products: suggested } = getBotResponse(text, products, [])
    setMessages((prev) => [...prev, { role: 'bot', text: botText, products: suggested || [], id: `b-${Date.now()}` }])
  }

  const formatBotText = (str) => {
    if (!str) return null
    return str.split(/\n/).map((line, i) => {
      const bold = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      return <p key={i} dangerouslySetInnerHTML={{ __html: bold }} />
    })
  }

  return (
    <div className={`${styles.widget} ${open ? styles.widgetOpen : ''}`}>
      <button type="button" className={styles.toggle} onClick={() => setOpen((o) => !o)} aria-label={open ? 'Close chat' : 'Open chat'}>
        {open ? <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg> : <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>}
      </button>
      <div className={styles.panel}>
        <div className={styles.panelHead}>
          <span className={styles.botName}>Store Assistant</span>
        </div>
        <div className={styles.messages}>
          {messages.map((msg) => (
            <div key={msg.id} className={msg.role === 'user' ? styles.userWrap : styles.botWrap}>
              {msg.role === 'bot' && <div className={styles.botAvatar}>A</div>}
              <div className={msg.role === 'user' ? styles.userBubble : styles.botBubble}>
                <div className={styles.msgText}>{msg.role === 'user' ? msg.text : formatBotText(msg.text)}</div>
                {msg.role === 'bot' && msg.products?.length > 0 && (
                  <div className={styles.productCards}>
                    {msg.products.map((p) => (
                      <Link key={p.id} to={`/shop/${p.slug}`} className={styles.productCard}>
                        <img src={p.image} alt="" className={styles.productCardImg} />
                        <span className={styles.productCardName}>{p.name}</span>
                        <span className={styles.productCardPrice}>${p.price}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
              {msg.role === 'user' && <div className={styles.userAvatar}>You</div>}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        <div className={styles.inputWrap}>
          <input type="text" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), sendMessage())} placeholder="Ask for products or help..." className={styles.input} maxLength={500} />
          <button type="button" onClick={sendMessage} className={styles.sendBtn} aria-label="Send">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
          </button>
        </div>
      </div>
    </div>
  )
}
