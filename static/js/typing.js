document.addEventListener('DOMContentLoaded', () => {

    const keys = document.querySelectorAll('.key');
    const korean_keys = document.querySelectorAll('.kor');
    const hangulEngKey = document.getElementById('key-HangulMode');
    originalTextElement = document.getElementById('original-text');
    originalText = originalTextElement.innerText;
    textDisplay = document.getElementById('text-display');
    bodyText = textDisplay.innerText;

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
            } else if (isHangulMode) {  // 한글 모드일 때
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
    characters = originalText.split('').map(char => {
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
    bodyText = characters;

    if (bodyText.length > 0) {
        bodyText[currentIndex].classList.add('cursor');
    }

    // ====================메시지 박스==============================
    function showMessageBox(message) {
        document.getElementById('messageContent').innerText = message;
        document.getElementById('messageBox').style.display = 'block';
    }

    // --------- 이벤트 리스너 영역 ------------

    // keydown 리스너에서 직접 문자를 처리하는 부분을 제거하고, 특수 키만 남김
    document.addEventListener('keydown', (event) => {
        const keyElement = document.getElementById(`key-${event.code}`);
        if (keyElement) {
            keyElement.classList.add('active');
        }

        if (isHangulMode) {
            korean_keys.forEach(key => {
                key = document.getElementById(`key-${event.code}`);
                if (key) {
                    handleInput(key.textContent);
                    console.log(key.textContent);
                }
            });
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
                const prevSpan = bodyText[currentIndex - 1];
                prevSpan.classList.remove('correct', 'incorrect');
                bodyText[currentIndex].classList.remove('cursor');
                currentIndex -= 1;
                bodyText[currentIndex].classList.add('cursor');
            }
            event.preventDefault();
        } else if (event.key === 'Enter') {
            handleInput('Enter');
            event.preventDefault();
        } else if (event.key === 'Tab') {
            handleInput('Tab');
            event.preventDefault();
        } else if (event.key === 'Space') {
            handleInput('Space');
            event.preventDefault();
        }

        // if (event.keyCode === 32) {
        //     event.preventDefault();
        //     //기능구현
        // }

        handleInput(event.key);

        scrollToCurrentChar();
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

    // 모든 문자 입력을 처리하는 'input' 이벤트 리스너
    // 한글과 관련
    document.addEventListener('input', (event) => {
        const typedChar = event.data;
        if (typedChar) {
            handleInput(typedChar);
        }
    });
    document.addEventListener('compositionstart', () => {
        isComposing = true;
    });

    document.addEventListener('compositionend', (event) => {
        if (isHangulMode) isComposing = false;
        // This is correct, but only fires after a completed composition
        const typedChar = event.data;
        console.log(typedChar);
        if (typedChar) {
            handleInput(typedChar);
        }
    });


    // ---------------로직함수 ----------------------------
    function handleInput(typedChar) {
        if (currentIndex > bodyText.length) return;

        const currentSpan = bodyText[currentIndex];
        const expectedChar = currentSpan.innerText;
        let isCorrect = false;
        let isEnter = false;

        if (expectedChar === '↵\n' && typedChar === 'Enter') {
            isEnter = true;
        } else if (expectedChar === '\t' && typedChar === 'Tab') {
            isCorrect = true;
        } else if (expectedChar === ' ' && typedChar === 'Space') {
            isCorrect = true;
            preventDefault();
        } else if (isHangulMode && expectedChar === ' ' && typedChar === 'Space') { /*key.id === 'key-Space'*/
            isCorrect = true;
        } else if (!isHangulMode && expectedChar === typedChar) {
            isCorrect = true;
        } else if (isHangulMode && expectedChar === typedChar) {
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
        const currentSpan = bodyText[currentIndex];
        currentSpan.classList.remove('cursor', 'incorrect', 'correct');
        currentSpan.classList.add('expectedEnter');
        currentIndex += 1;
        if (currentIndex < bodyText.length) {
            bodyText[currentIndex].classList.add('cursor');
        } else {
            console.log('타이핑 끝.');
        }
    }

    function handleCorrect() {
        const currentSpan = bodyText[currentIndex];
        currentSpan.classList.remove('cursor', 'incorrect', 'expectedEnter');
        currentSpan.classList.add('correct');
        currentIndex += 1;
        if (currentIndex < bodyText.length) {
            bodyText[currentIndex].classList.add('cursor');
        } else {
            console.log('타이핑 끝.');
            var result = confirm("이번 내용 타이핑이 끝났습니다.");
            console.log(result);
        }
    }

    function handleIncorrect() {
        const currentSpan = bodyText[currentIndex];
        currentSpan.classList.add('incorrect');
        currentSpan.classList.remove('correct');
    }

    updateKeyboardLayout();

    function scrollToCurrentChar() {
        const $textDisplay = $('#text-display');
        if (this.charIndex < this.characters.length) {
            const $currentChar = $(this.characters[this.charIndex]);
            if ($currentChar.length > 0) {
                const displayHeight = $textDisplay.height();
                const currentCharTop = $currentChar.position().top;
                const scrollTop = $textDisplay.scrollTop();

                // 현재 글자가 화면 하단에 가까워지면 스크롤
                if (currentCharTop + $currentChar.height() > displayHeight + scrollTop) {
                    $textDisplay.scrollTop(currentCharTop + $currentChar.height() - displayHeight + 20); // 20px 여유
                }
                // 현재 글자가 화면 상단 밖으로 벗어나면 스크롤 조정
                else if (currentCharTop < scrollTop) {
                    $textDisplay.scrollTop(currentCharTop - 20); // 20px 여유
                }
            }
        }
    }
});