chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message?.type !== 'GET_SELECTION') return false;

  const selection = window.getSelection()?.toString().trim() || '';

  sendResponse({
    success: Boolean(selection),
    section: selection,
    url: window.location.href,
    title: document.title || null,
  });

  return false;
});
