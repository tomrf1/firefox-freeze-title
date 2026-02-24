class FrozenState {
  frozenTitle = document.title;
  originalTitleDescriptor = Object.getOwnPropertyDescriptor(Document.prototype, 'title');
  titleObserver;

  constructor() {
    // Prevent JS updates to document.title
    Object.defineProperty(document, 'title', {
      get: () => this.frozenTitle,
      set: () => {},
      configurable: true,
    });

    // Prevent DOM update to the title element
    const titleElement = document.querySelector('title');
    if (titleElement) {
      this.titleObserver = new MutationObserver(() => {
        if (titleElement.textContent !== this.frozenTitle) {
          titleElement.textContent = this.frozenTitle;
        }
      });
      this.titleObserver.observe(titleElement, { childList: true, characterData: true, subtree: true });
    }
  }

  unfreeze() {
    Object.defineProperty(document, 'title', this.originalTitleDescriptor);
    this.titleObserver?.disconnect();
  }
}

let state = null;

browser.runtime.onMessage.addListener((message) => {
  if (message.action === "freezeTitle") {
    if (state == null) state = new FrozenState();
  } else if (message.action === "unfreezeTitle") {
    state?.unfreeze();
    state = null;
  }
});
