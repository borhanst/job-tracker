const addSelectionButton = document.querySelector('#add-selection');
const clearReviewButton = document.querySelector('#clear-review');
const sendToAppButton = document.querySelector('#send-to-app');
const statusNode = document.querySelector('#status');
const sectionCountNode = document.querySelector('#section-count');
const sectionListNode = document.querySelector('#section-list');

function setStatus(message, variant = 'warn') {
  statusNode.textContent = message || '';
  statusNode.classList.toggle('is-ok', variant === 'ok');
}

function sendMessage(message) {
  return chrome.runtime.sendMessage(message);
}

function sectionLabel(count) {
  return count === 1 ? '1 section' : `${count} sections`;
}

function renderCaptureReview(captureReview) {
  const sections = captureReview?.sections || [];
  sectionCountNode.textContent = sectionLabel(sections.length);
  sectionListNode.replaceChildren();
  sendToAppButton.disabled = sections.length === 0;
  clearReviewButton.disabled = sections.length === 0;

  if (sections.length === 0) {
    const empty = document.createElement('p');
    empty.className = 'empty';
    empty.textContent = 'Select JD text on the page, then use Add Selection. Repeat for responsibilities, requirements, benefits, and company sections.';
    sectionListNode.append(empty);
    return;
  }

  sections.forEach((section, index) => {
    const item = document.createElement('li');
    item.className = 'section-card';

    const text = document.createElement('p');
    text.textContent = section;

    const controls = document.createElement('div');
    controls.className = 'section-controls';

    const up = document.createElement('button');
    up.className = 'icon-button';
    up.type = 'button';
    up.textContent = '↑';
    up.title = 'Move up';
    up.disabled = index === 0;
    up.addEventListener('click', () => moveSection(index, index - 1));

    const down = document.createElement('button');
    down.className = 'icon-button';
    down.type = 'button';
    down.textContent = '↓';
    down.title = 'Move down';
    down.disabled = index === sections.length - 1;
    down.addEventListener('click', () => moveSection(index, index + 1));

    const remove = document.createElement('button');
    remove.className = 'icon-button';
    remove.type = 'button';
    remove.textContent = '×';
    remove.title = 'Remove';
    remove.addEventListener('click', () => removeSection(index));

    controls.append(up, down, remove);
    item.append(text, controls);
    sectionListNode.append(item);
  });
}

async function refreshCaptureReview() {
  const response = await sendMessage({ type: 'GET_CAPTURE_REVIEW' });

  if (!response?.success) {
    setStatus(response?.error || 'Capture Review could not be loaded.');
    return;
  }

  renderCaptureReview(response.captureReview);
}

async function addSelection() {
  addSelectionButton.disabled = true;
  setStatus('');

  try {
    const response = await sendMessage({ type: 'ADD_SELECTION' });

    if (!response?.success) {
      setStatus(response?.error || 'Selection could not be added.');
      return;
    }

    renderCaptureReview(response.captureReview);
    setStatus('Selection added to Capture Review.', 'ok');
  } finally {
    addSelectionButton.disabled = false;
  }
}

async function removeSection(index) {
  const response = await sendMessage({ type: 'REMOVE_SECTION', index });

  if (!response?.success) {
    setStatus(response?.error || 'Section could not be removed.');
    return;
  }

  renderCaptureReview(response.captureReview);
  setStatus('Section removed.', 'ok');
}

async function moveSection(from, to) {
  const response = await sendMessage({ type: 'MOVE_SECTION', from, to });

  if (!response?.success) {
    setStatus(response?.error || 'Section could not be moved.');
    return;
  }

  renderCaptureReview(response.captureReview);
  setStatus('Section order updated.', 'ok');
}

async function clearReview() {
  const response = await sendMessage({ type: 'CLEAR_CAPTURE_REVIEW' });

  if (!response?.success) {
    setStatus(response?.error || 'Capture Review could not be cleared.');
    return;
  }

  renderCaptureReview(response.captureReview);
  setStatus('Capture Review cleared.', 'ok');
}

async function sendToApp() {
  sendToAppButton.disabled = true;
  setStatus('Sending to Applynexis...', 'ok');

  try {
    const response = await sendMessage({ type: 'SEND_TO_APP' });

    if (!response?.success) {
      setStatus(response?.error || 'Capture could not be sent.');
      return;
    }

    setStatus('Sent to Applynexis.', 'ok');
  } finally {
    sendToAppButton.disabled = false;
    refreshCaptureReview();
  }
}

addSelectionButton.addEventListener('click', addSelection);
clearReviewButton.addEventListener('click', clearReview);
sendToAppButton.addEventListener('click', sendToApp);
refreshCaptureReview();
