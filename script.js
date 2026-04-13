// Window dragging functionality
let draggedWindow = null;
let offsetX = 0;
let offsetY = 0;

function startDrag(event) {
    // Don't drag if clicking on certain elements
    if (event.target.tagName === 'BUTTON') return;
    
    draggedWindow = event.target.closest('.photo-window');
    if (!draggedWindow) return;

    event.preventDefault();
    offsetX = event.clientX - draggedWindow.offsetLeft;
    offsetY = event.clientY - draggedWindow.offsetTop;

    const handleDragMove = (moveEvent) => dragWindow(moveEvent);
    const handleDragStop = () => stopDrag(handleDragMove, handleDragStop);

    document.addEventListener('mousemove', handleDragMove);
    document.addEventListener('mouseup', handleDragStop);
}

function dragWindow(event) {
    if (!draggedWindow) return;

    let newX = event.clientX - offsetX;
    let newY = event.clientY - offsetY;

    // Keep window within viewport bounds
    newX = Math.max(0, Math.min(newX, window.innerWidth - 100));
    newY = Math.max(0, Math.min(newY, window.innerHeight - 100));

    draggedWindow.style.left = newX + 'px';
    draggedWindow.style.top = newY + 'px';
}

function stopDrag(moveHandler, stopHandler) {
    draggedWindow = null;
    document.removeEventListener('mousemove', moveHandler);
    document.removeEventListener('mouseup', stopHandler);
}

// Open window on folder icon click
document.querySelectorAll('.icon').forEach(icon => {
    icon.addEventListener('click', function() {
        const folderName = this.dataset.folder;
        const windowId = folderName + '-window';
        const windowEl = document.getElementById(windowId);
        
        if (windowEl) {
            windowEl.style.display = 'block';
            // Bring to front
            windowEl.style.zIndex = Math.max(...Array.from(document.querySelectorAll('.photo-window')).map(w => parseInt(window.getComputedStyle(w).zIndex) || 1000)) + 1;
        }
    });
});

// Close window with right-click or close button (if we add one)
document.querySelectorAll('.photo-window').forEach(photoWindow => {
    photoWindow.addEventListener('contextmenu', function(e) {
        e.preventDefault();
        this.style.display = 'none';
    });
    
    photoWindow.addEventListener('mousedown', function(e) {
        // Only drag if clicking on the image directly (not a button)
        if (e.target === this || e.target.tagName === 'IMG') {
            startDrag(e);
            this.style.zIndex = Math.max(...Array.from(document.querySelectorAll('.photo-window')).map(w => parseInt(window.getComputedStyle(w).zIndex) || 1000)) + 1;
        }
    });
});
