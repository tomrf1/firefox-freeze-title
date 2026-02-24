const id = "freeze-tab-title";
const frozenTabs = new Set();

browser.menus.create({
  id,
  title: "Freeze Tab Title",
  contexts: ["tab"],
  type: "checkbox"
});

browser.menus.onShown.addListener(async (info, tab) => {
  if (tab && tab.id) {
    const isFrozen = frozenTabs.has(tab.id);
    await browser.menus.update(id, {
      checked: isFrozen
    });
    await browser.menus.refresh();
  }
});

browser.menus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId === id) {
    const isFrozen = frozenTabs.has(tab.id);

    if (isFrozen) {
      frozenTabs.delete(tab.id);
      try {
        await browser.tabs.sendMessage(tab.id, {
          action: "unfreezeTitle"
        });
      } catch (err) {
        console.error("Error sending message to tab:", err);
      }
    } else {
      frozenTabs.add(tab.id);
      try {
        await browser.tabs.sendMessage(tab.id, {
          action: "freezeTitle"
        });
      } catch (err) {
        console.error("Error sending message to tab:", err);
      }
    }
  }
});

browser.tabs.onRemoved.addListener((tabId) => {
  frozenTabs.delete(tabId);
});










