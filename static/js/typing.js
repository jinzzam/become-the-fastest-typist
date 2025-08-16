document.addEventListener('DOMContentLoaded', () => {

    const keys = document.querySelectorAll('.key');
    const hangulEngKey = document.getElementById('key-HangulMode');
    const textDisplay = document.getElementById('text-display');
    const originalTextElement = document.getElementById('original-text');
    const originalText = originalTextElement.innerText;

    let isShiftPressed = false;
    let isHangulMode = false;
    let isCapsLockPressed = false;
    let currentIndex = 0;
    // You need this variable for composition events.
    let isComposing = false;

    // 키보드 레이아웃을 현재 상태에 맞춰 업데이트하는 함수
    function updateKeyboardLayout() {
        keys.forEach(key => {
            let displayText = '';
            if (!key.hasAttribute('data-original') || key.id === 'key-HangulMode' || key.id === 'key-Backspace' || key.id === 'key-Tab' || key.id === 'key-CapsLock' || key.id === 'key-Enter' || key.id.includes('Shift') || key.id.includes('Control') || key.id.includes('Meta') || key.id.includes('Alt') || key.id === 'key-ContextMenu' || key.id === 'key-Space') {
                displayText = key.textContent;
            } else if (isHangulMode) {
                if (isShiftPressed) {
                    displayText = key.getAttribute('data-kor-hard') || key.getAttribute('data-special-symbol');
                } else {
                    displayText = key.getAttribute('data-kor');
                    if (key.getAttribute('data-special-symbol') !== null) {
                        displayText = key.getAttribute('data-original');
                    }
                }
            } else { // 영어 모드일 때
                if (isShiftPressed) {
                    displayText = key.getAttribute('data-shift') || key.getAttribute('data-special-symbol');
                } else if (isCapsLockPressed) {
                    displayText = key.getAttribute('data-shift');
                    if (key.getAttribute('data-special-symbol')) {
                        displayText = key.getAttribute('data-original');
                    }
                } else {
                    displayText = key.getAttribute('data-original');
                    if (key.getAttribute('data-special-symbol') !== null) {
                        displayText = key.getAttribute('data-original');
                    }
                }
            }
            if (displayText !== null && displayText !== undefined) {
                key.textContent = displayText;
            }
        });

        if (isHangulMode) {
            hangulEngKey.classList.add('language-active');
        } else {
            hangulEngKey.classList.remove('language-active');
        }
    }

    // -------------------------------------------------

    // 텍스트를 한 글자씩 <span>으로 감싸서 화면에 표시
    const characters = originalText.split('').map(char => {
        const span = document.createElement('span');
        // Enter 키를 위한 시각적 표현
        if (char === '\n') {
            span.innerText = '↵\n';
        } else {
            span.innerText = char;
        }
        textDisplay.appendChild(span);
        return span;
    });

    if (characters.length > 0) {
        characters[currentIndex].classList.add('cursor');
    }

    // --- 이벤트 리스너 영역 ---

    document.addEventListener('compositionstart', () => {
        isComposing = true;
    });

    document.addEventListener('compositionend', (event) => {
        isComposing = false;
        // This is correct, but only fires after a completed composition
    });

    // 💥 1. keydown 리스너에서 직접 문자를 처리하는 부분을 제거하고, 특수 키만 남깁니다.
    document.addEventListener('keydown', (event) => {
        const keyElement = document.getElementById(`key-${event.code}`);
        if (keyElement) {
            keyElement.classList.add('active');
        }

        if (event.key === 'Shift') {
            if (!isShiftPressed) {
                isShiftPressed = true;
                updateKeyboardLayout();
            }
        } else if (event.key === 'CapsLock' && !isHangulMode) {
            isCapsLockPressed = !isCapsLockPressed;
            updateKeyboardLayout();
        } else if (event.key === 'HangulMode' || event.code === 'Lang1') {
            isHangulMode = !isHangulMode;
            updateKeyboardLayout();
            event.preventDefault();
        } else if (event.key === 'Backspace') {
            if (currentIndex > 0) {
                const prevSpan = characters[currentIndex - 1];
                prevSpan.classList.remove('correct', 'incorrect');
                characters[currentIndex].classList.remove('cursor');
                currentIndex -= 1;
                characters[currentIndex].classList.add('cursor');
            }
            event.preventDefault();
        } else if (event.key === 'Enter') {
            handleInput('Enter');
            event.preventDefault();
        } else if (event.key === 'Tab') {
            handleInput('Tab');
            event.preventDefault();
        }
        handleInput(event.key);
    });

    document.addEventListener('keyup', (event) => {
        const keyElement = document.getElementById(`key-${event.code}`);
        if (keyElement) {
            keyElement.classList.remove('active');
        }
        if (event.key === 'Shift') {
            if (isShiftPressed) {
                isShiftPressed = false;
                updateKeyboardLayout();
            }
        }
    });

    // 💥 2. 이 부분이 가장 중요합니다! 모든 문자 입력을 처리하는 'input' 이벤트 리스너를 다시 추가해야 합니다.
    document.addEventListener('input', (event) => {
        const typedChar = event.data;
        if (typedChar && !isComposing) {
            handleInput(typedChar);
        }
    });

    // --- 로직 처리 함수 영역 ---

    function handleInput(typedChar) {
        if (currentIndex > characters.length) return;

        const currentSpan = characters[currentIndex];
        const expectedChar = currentSpan.innerText;
        let isCorrect = false;
        let isEnter = false;

        if (expectedChar === '↵\n' && typedChar === 'Enter') {
            isEnter = true;
        } else if (expectedChar === '\t' && typedChar === 'Tab') {
            isCorrect = true;
        } else if (expectedChar === typedChar) {
            isCorrect = true;
        }

        if (isEnter) {
            handleEnter();
        } else {
            if (isCorrect) {
                handleCorrect();
            } else {
                handleIncorrect();
            }
        }
    }

    function handleEnter() {
        const currentSpan = characters[currentIndex];
        currentSpan.classList.remove('cursor', 'incorrect', 'correct');
        currentSpan.classList.add('expectedEnter');
        currentIndex += 1;
        if (currentIndex < characters.length) {
            characters[currentIndex].classList.add('cursor');
        } else {
            console.log('타이핑 끝.');
        }
    }

    function handleCorrect() {
        const currentSpan = characters[currentIndex];
        currentSpan.classList.remove('cursor', 'incorrect', 'expectedEnter');
        currentSpan.classList.add('correct');
        currentIndex += 1;
        if (currentIndex < characters.length) {
            characters[currentIndex].classList.add('cursor');
        } else {
            console.log('타이핑 끝.');
        }
    }

    function handleIncorrect() {
        const currentSpan = characters[currentIndex];
        currentSpan.classList.add('incorrect');
        currentSpan.classList.remove('correct');
        currentSpan.classList.remove('expectedEnter');

    }

    updateKeyboardLayout();
});