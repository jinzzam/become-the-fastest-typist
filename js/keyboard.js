document.addEventListener('DOMContentLoaded', () => {
    const keys = document.querySelectorAll('.key');
    let isShiftPressed = false;

    // 키보드 누르기 이벤트 (keydown)
    document.addEventListener('keydown', (event) => {
        // Shift 키를 누를 때 텍스트를 바꿉니다.
        if (event.key === 'Shift' && !isShiftPressed) {
            isShiftPressed = true;
            keys.forEach(key => {
                const shiftedText = key.getAttribute('data-shift');
                if (shiftedText) {
                    key.textContent = shiftedText;
                }
            });
        }

        // 현재 눌린 키를 시각적으로 표시합니다.
        const pressedKey = event.key;
        keys.forEach(key => {
            if (key.textContent.toLowerCase() === pressedKey.toLowerCase() ||
                (key.textContent === 'Shift' && pressedKey === 'Shift') ||
                (key.textContent === 'Alt' && pressedKey === 'Alt') ||
                (key.textContent === 'Ctrl' && pressedKey === 'Control') ||
                (key.textContent === ' ' && pressedKey === 'Spacebar') ||
                (key.textContent === '←' && pressedKey === 'Backspace') ||
                (key.textContent === '한/영' && pressedKey === 'HangulMode') ||
                (key.textContent === 'Caps Lock' && pressedKey === 'CapsLock') ||
                (key.textContent === 'Win' && pressedKey === 'Meta')) {
                key.classList.add('active');
            }
        });
    });

    // 키보드 떼기 이벤트 (keyup)
    document.addEventListener('keyup', (event) => {
        // Shift 키를 뗄 때 텍스트를 원래대로 복원합니다.
        if (event.key === 'Shift') {
            isShiftPressed = false;
            keys.forEach(key => {
                const originalText = key.getAttribute('data-original');
                if (originalText) {
                    key.textContent = originalText;
                }
            });
        }

        // 떼어진 키의 시각적 표시를 제거합니다.
        const releasedKey = event.key;
        keys.forEach(key => {
            if (key.textContent.toLowerCase() === releasedKey.toLowerCase() ||
                (key.textContent === 'Shift' && releasedKey === 'Shift') ||
                (key.textContent === 'Alt' && releasedKey === 'Alt') ||
                (key.textContent === 'Ctrl' && releasedKey === 'Control') ||
                (key.textContent === ' ' && releasedKey === 'Spacebar') ||
                (key.textContent === '←' && releasedKey === 'Backspace') ||
                (key.textContent === '한/영' && releasedKey === 'HangulMode') ||
                (key.textContent === 'Caps Lock' && releasedKey === 'CapsLock') ||
                (key.textContent === 'Win' && releasedKey === 'Meta')) {
                key.classList.remove('active');
            }
        });
    });
});