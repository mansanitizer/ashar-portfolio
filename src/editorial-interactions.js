// Small accessibility improvements around the existing gallery handlers.
export function initializeEditorialInteractions() {
    if (!document.body.classList.contains('editorial')) return;
    document.querySelectorAll('.cert-card').forEach(card => {
        card.tabIndex = 0;
        card.setAttribute('role', 'button');
        card.setAttribute('aria-label', `View ${card.querySelector('h3').textContent.toLowerCase()} certificate`);
        card.addEventListener('keydown', event => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                card.click();
            }
        });
    });
    document.querySelectorAll('#work-modal, #cert-modal, #pdf-modal').forEach(modal => {
        modal.setAttribute('role', 'dialog');
        modal.setAttribute('aria-modal', 'true');
        const title = modal.querySelector('h3');
        if (title) modal.setAttribute('aria-labelledby', title.id);
        const close = modal.querySelector('.close-btn');
        close?.setAttribute('aria-label', 'Close dialog');
        let previousFocus;
        let wasOpen = false;
        const isOpen = () => modal.classList.contains('show') || modal.classList.contains('active');
        new MutationObserver(() => {
            const open = isOpen();
            if (open === wasOpen) return;
            wasOpen = open;
            if (open) {
                previousFocus = document.activeElement;
                close?.focus({ preventScroll: true });
            } else {
                previousFocus?.focus({ preventScroll: true });
            }
        }).observe(modal, { attributes: true, attributeFilter: ['class'] });
        modal.addEventListener('keydown', event => {
            if (!isOpen() || event.key !== 'Tab') return;
            const items = [...modal.querySelectorAll('button:not(:disabled), a[href], input, [tabindex="0"]')]
                .filter(element => element.getClientRects().length);
            const first = items[0], last = items[items.length - 1];
            if (event.shiftKey && document.activeElement === first) {
                event.preventDefault(); last?.focus();
            } else if (!event.shiftKey && document.activeElement === last) {
                event.preventDefault(); first?.focus();
            }
        });
    });
}
