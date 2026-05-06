const APP_BASE_URL = 'http://localhost:3000';
const CONTEXT_MENU_ID = 'applynexis-add-selection';

let captureReview = {
  url: '',
  title: null,
  sections: [],
};

function normalizeSection(text) {
  return String(text || '').replace(/\s+\n/g, '\n').replace(/\n{3,}/g, '\n\n').trim();
}

function setPageContext({ url, title }) {
  if (!captureReview.url || captureReview.url !== url) {
    captureReview = {
      url,
      title: title || null,
      sections: [],
    };
    return;
  }

  captureReview.title = title || captureReview.title;
}

function addSection({ section, url, title }) {
  const normalized = normalizeSection(section);

  if (!normalized) {
    return {
      success: false,
      error: 'Select job description text before using Add Selection.',
    };
  }

  setPageContext({ url, title });
  captureReview.sections.push(normalized);

  return {
    success: true,
    captureReview,
  };
}

async function getActiveTabSelection() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  if (!tab?.id) {
    throw new Error('No active tab found.');
  }

  try {
    return await chrome.tabs.sendMessage(tab.id, { type: 'GET_SELECTION' });
  } catch (error) {
    const message = String(error?.message || '');

    const isMissingReceiver =
      message.includes('Receiving end does not exist') ||
      message.includes('Could not establish connection');

    if (!isMissingReceiver) {
      throw error;
    }

    try {
      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ['content.js'],
      });
    } catch (_injectError) {
      throw new Error('This page does not allow capture. Open a regular website tab and try again.');
    }

    return chrome.tabs.sendMessage(tab.id, { type: 'GET_SELECTION' });
  }
}

async function sendToApp() {
  if (!captureReview.url || captureReview.sections.length === 0) {
    return {
      success: false,
      error: 'Add at least one selected JD section before sending.',
    };
  }

  const response = await fetch(`${APP_BASE_URL}/api/jd-handoffs`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(captureReview),
  });

  if (response.status === 401) {
    await chrome.tabs.create({ url: `${APP_BASE_URL}/login` });
    return {
      success: false,
      error: 'Sign in to Applynexis, then send the capture again.',
    };
  }

  const data = await response.json();

  if (!response.ok || !data.success) {
    return {
      success: false,
      error: data.error || 'Browser JD Capture could not be sent.',
    };
  }

  captureReview = { url: '', title: null, sections: [] };
  await openOrFocusAddJobTab(data.openUrl);

  return {
    success: true,
  };
}

async function openOrFocusAddJobTab(openUrl) {
  const targetUrl = `${APP_BASE_URL}${openUrl}`;
  const addJobTabs = await chrome.tabs.query({ url: `${APP_BASE_URL}/jobs/add*` });

  if (addJobTabs.length === 0) {
    await chrome.tabs.create({ url: targetUrl });
    return;
  }

  const tab = addJobTabs[0];

  if (!tab.id) {
    await chrome.tabs.create({ url: targetUrl });
    return;
  }

  await chrome.tabs.update(tab.id, {
    active: true,
    url: targetUrl,
  });

  if (typeof tab.windowId === 'number') {
    await chrome.windows.update(tab.windowId, { focused: true });
  }
}

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: CONTEXT_MENU_ID,
    title: 'Add Selection to Applynexis',
    contexts: ['selection'],
  });

  chrome.sidePanel
    .setPanelBehavior({ openPanelOnActionClick: true })
    .catch(() => {
      // Ignore unsupported side panel behavior setup.
    });
});

chrome.runtime.onStartup.addListener(() => {
  chrome.sidePanel
    .setPanelBehavior({ openPanelOnActionClick: true })
    .catch(() => {
      // Ignore unsupported side panel behavior setup.
    });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId !== CONTEXT_MENU_ID || !info.selectionText || !tab?.url) return;

  addSection({
    section: info.selectionText,
    url: tab.url,
    title: tab.title || null,
  });
});

chrome.action.onClicked.addListener(async (tab) => {
  if (!tab?.id) return;

  try {
    await chrome.sidePanel.setOptions({
      tabId: tab.id,
      path: 'popup.html',
      enabled: true,
    });
    await chrome.sidePanel.open({ tabId: tab.id });
  } catch (_error) {
    // Ignore side panel open failures.
  }
});

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  const run = async () => {
    switch (message?.type) {
      case 'ADD_SELECTION': {
        const selection = await getActiveTabSelection();
        return addSection(selection);
      }
      case 'GET_CAPTURE_REVIEW':
        return { success: true, captureReview };
      case 'REMOVE_SECTION': {
        captureReview.sections.splice(message.index, 1);
        return { success: true, captureReview };
      }
      case 'MOVE_SECTION': {
        const from = message.from;
        const to = message.to;
        if (from < 0 || to < 0 || from >= captureReview.sections.length || to >= captureReview.sections.length) {
          return { success: false, error: 'Section could not be moved.' };
        }
        const [section] = captureReview.sections.splice(from, 1);
        captureReview.sections.splice(to, 0, section);
        return { success: true, captureReview };
      }
      case 'CLEAR_CAPTURE_REVIEW':
        captureReview = { url: '', title: null, sections: [] };
        return { success: true, captureReview };
      case 'SEND_TO_APP':
        return sendToApp();
      default:
        return { success: false, error: 'Unsupported Browser JD Capture action.' };
    }
  };

  run()
    .then(sendResponse)
    .catch((error) => {
      sendResponse({
        success: false,
        error: error.message || 'Browser JD Capture failed.',
      });
    });

  return true;
});
