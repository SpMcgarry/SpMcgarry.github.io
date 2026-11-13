/**
 * Sean McGarry Personal Profile & Career Advocate v2 Client
 * Static, decoupled frontend script.
 */

// Configurable Railway backend endpoint (default: seanmcgarry.up.railway.app, fallback: seanpmcgarry.up.railway.app)
const BACKEND_CONFIG = {
    primaryUrl: 'https://seanmcgarry.up.railway.app',
    secondaryUrl: 'https://seanpmcgarry.up.railway.app',
    coffeeBaseUrl: 'https://buymeacoffee.com/seanmcgarry'
};

document.addEventListener('DOMContentLoaded', () => {
    initNavHighlight();
    initFundingButtons();
    initAdvocateInterface();
});

/**
 * Update active navigation link on scroll
 */
function initNavHighlight() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('nav a[href^="#"]');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            if (window.scrollY >= sectionTop) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

/**
 * Configure Project Funding ($30/hr) buttons with explicit project context
 */
function initFundingButtons() {
    const fundButtons = document.querySelectorAll('[data-fund-project]');
    fundButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const projectName = button.getAttribute('data-fund-project');
            const targetStep = button.getAttribute('data-next-step');
            
            // Build Buy Me A Coffee URL with project context
            const message = encodeURIComponent(`1 Hour Dedicated Work ($30) on: ${projectName} - Deliverable: ${targetStep}`);
            const targetUrl = `${BACKEND_CONFIG.coffeeBaseUrl}?note=${message}`;
            
            window.open(targetUrl, '_blank', 'noopener,noreferrer');
        });
    });
}

/**
 * Lightweight Career Advocate v2 Client with Graceful Offline Fallback
 */
function initAdvocateInterface() {
    const chatContainer = document.getElementById('advocate-chat-log');
    const inputField = document.getElementById('advocate-input');
    const sendButton = document.getElementById('advocate-send');
    const statusDot = document.getElementById('backend-status-dot');
    const statusText = document.getElementById('backend-status-text');

    if (!chatContainer || !inputField || !sendButton) return;

    // Check backend health status quietly
    checkBackendHealth();

    async function checkBackendHealth() {
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 3000);
            const res = await fetch(`${BACKEND_CONFIG.primaryUrl}/healthz`, {
                signal: controller.signal
            });
            clearTimeout(timeoutId);
            if (res.ok) {
                statusDot.classList.remove('offline');
                statusText.textContent = 'Career Advocate v2 Backend: Online';
                return;
            }
        } catch (e) {
            // Silently fall back to standby mode
        }
        statusDot.classList.add('offline');
        statusText.textContent = 'Career Advocate Backend: Standby (Rebuilding v2)';
    }

    sendButton.addEventListener('click', () => handleUserMessage());
    inputField.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleUserMessage();
    });

    async function handleUserMessage() {
        const text = inputField.value.trim();
        if (!text) return;

        // Append user question
        appendMessage('user', text);
        inputField.value = '';

        // Show thinking indicator
        const thinkingId = appendMessage('assistant', 'Consulting grounded experience record...');

        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 6000);
            
            const response = await fetch(`${BACKEND_CONFIG.primaryUrl}/api/v2/chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: text }),
                signal: controller.signal
            });
            clearTimeout(timeoutId);

            if (response.ok) {
                const data = await response.json();
                updateMessage(thinkingId, data.response || 'No response recorded.');
                return;
            }
            throw new Error('Backend non-responsive');
        } catch (err) {
            // Friendly graceful fallback
            updateMessage(
                thinkingId,
                `The live Career Advocate v2 engine is currently undergoing a clean ground-up scaffold rebuild on Railway. 
                \n\nIn the meantime, feel free to inspect the detailed **Build Story** and **Project Backlog** below, or connect with Sean directly on **[LinkedIn](https://www.linkedin.com/in/sean-p-mcgarry/)**!`
            );
        }
    }

    function appendMessage(sender, text) {
        const msgDiv = document.createElement('div');
        msgDiv.className = `advocate-msg advocate-msg-${sender}`;
        msgDiv.style.margin = '0.75rem 0';
        msgDiv.style.padding = '0.75rem 1rem';
        msgDiv.style.borderRadius = '8px';
        msgDiv.style.fontSize = '0.92rem';

        if (sender === 'user') {
            msgDiv.style.background = '#F1F5F9';
            msgDiv.style.borderLeft = '3px solid #1E293B';
            msgDiv.innerHTML = `<strong>You:</strong> ${escapeHtml(text)}`;
        } else {
            msgDiv.style.background = '#FFFBEB';
            msgDiv.style.borderLeft = '3px solid #D97706';
            msgDiv.innerHTML = `<strong>Career Advocate:</strong> ${formatMarkdown(text)}`;
        }

        const id = 'msg-' + Date.now();
        msgDiv.id = id;
        chatContainer.appendChild(msgDiv);
        chatContainer.scrollTop = chatContainer.scrollHeight;
        return id;
    }

    function updateMessage(id, newText) {
        const msgDiv = document.getElementById(id);
        if (msgDiv) {
            msgDiv.innerHTML = `<strong>Career Advocate:</strong> ${formatMarkdown(newText)}`;
            chatContainer.scrollTop = chatContainer.scrollHeight;
        }
    }

    function escapeHtml(string) {
        const div = document.createElement('div');
        div.textContent = string;
        return div.innerHTML;
    }

    function formatMarkdown(text) {
        return text
            .replace(/\n\n/g, '<br><br>')
            .replace(/\n/g, '<br>')
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" rel="noopener" style="color:#D97706;font-weight:600;">$1</a>');
    }
}
