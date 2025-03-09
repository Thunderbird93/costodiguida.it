class MainFooter extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
        <footer>
         <div class="content-container">
            <nav class="menu">
              <ul role="list"></ul>
             </nav>
             <nav class="bottom">
              <ul role="list">
               <li>
                <a href="#">Obiettivo del sito</a>
               </li>
               <li>
                  <a href="#">Privacy policy</a>
                 </li>
              </ul>
          </nav>
             </div>
    </footer>
    `;
  }
}

customElements.define("main-footer", MainFooter);
