let tag = 'modal-window';
let fade = 0.7; // opacity change in seconds

let content = `
  <style>
    :host {
      --bg-color: rgba(0,0,0,0.96);
      --text-color: white;
      --close-hover-color: deepskyblue;
      z-index: 2;
    }
    
    button#close {
      position: absolute;
      top: 1rem;
      right: 1rem;
      border: 0;
      padding: 0;
      margin: 0;
      background: transparent;
      color: var(--text-color);
      font-size: 2em;
      text-shadow: 1px 1px black;
      cursor: pointer;
      z-index: 1000;
    }
    
    button#close:hover {
      color: var(--close-hover-color);
    }
    
    #content {
      position: fixed;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      color: var(--text-color);
      background: var(--bg-color);
      opacity: 1;
      transition-property: opacity;
      transition-duration: ${fade}s;
      transition-timing-function: ease;
      display: grid;
      grid-template-columns: 1fr;
      grid-template-rows: 1fr;
      align-items: center;
      align-content: center;
      justify-items: center;
      z-index: 2;
    }
    
    #content ::slotted(p) {
      text-align: center;
    }
    
    #content.hidden {
      opacity: 0;
      pointer-events: none;
    }
  </style>
  <div id="content" class="hidden">
    <slot></slot>
    <button id="close"> &times; </button>
  </div>
`;

class Bit extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode : 'open' });
    this.shadowRoot.innerHTML = content;
  }
  
  connectedCallback() {
    let m = this;
    let p = m.parentNode;
    let s = m.shadowRoot;
    let c = s.querySelector('#content');
    let x = s.querySelector('button#close');
    
    let b = document.body;
    let o = b.style.overflow;

    x.addEventListener('click', hide);    
    setTimeout(show, 40);
    
    function show() {
      c.classList.remove('hidden');
      b.style.overflow = 'hidden';
    }
    
    function hide() {
      x.removeEventListener('click', hide);
      c.classList.add('hidden');
      b.style.overflow = o;
      setTimeout(remove, fade * 1000);
    }
    
    function remove() {
      try {
        p.removeChild(m);
      } catch (e) {
        console.warn(e, p, m);
      }
    }
  }
}

customElements.define(tag, Bit);
