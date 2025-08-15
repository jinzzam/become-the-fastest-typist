const keys = document.querySelectorAll('.key');

let isShiftPressed = false;

document.addEventListener('keydown', (event) => {
    const keyElement = document.getElementById(`key-${event.code}`);
    if (keyElement) {
        keyElement.classList.add('active');
    }

    if (event.key === 'Shift' && !isShiftPressed) {
        isShiftPressed = true;
        
        keys.forEach(key => {
            const shiftedText = key.getAttribute('data-shift');
            if (shiftedText.length!=0) {
                key.textContent = shiftedText;
            }
        });
    }
});

document.addEventListener('keyup', (event) => {
    const keyElement = document.getElementById(`key-${event.code}`);
    if (keyElement) {
        keyElement.classList.remove('active');
    }
    
    if (event.key === 'Shift') {
        isShiftPressed = false;
        
        keys.forEach(key => {
            const originalText = key.getAttribute('data-original');
            if (originalText.length!=0) {
                key.textContent = originalText;
            }
        });
    }
});