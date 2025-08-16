document.addEventListener('DOMContentLoaded', () => {
    const textDisplay = document.getElementById('text-display');
    const originalTextElement = document.getElementById('original-text');
    const originalText = originalTextElement.innerText;

    // 현재 커서 위치 : 입력해야 할 글자의 인덱스
    let currentIndex = 0;

    // 텍스트를 한 글자씩 <span>으로 감싸서 화면에 표시
    const characters = originalText.split('').map(char => {
        if (char === '\n') {
            char = '⏎\n';
        }
        const span = document.createElement('span');
        span.innerText = char;
        textDisplay.appendChild(span);
        return span;
    });


    // 첫 번째 글자에 커서 표시
    if (characters.length > 0) {
        characters[currentIndex].classList.add('cursor');
    }

    document.addEventListener('keydown', (event) => {
        if (currentIndex >= characters.length) return;

        const currentSpan = characters[currentIndex];
        const expectedChar = currentSpan.innerText;
        const typedKey = event.key;

        // if (expectedChar === '⏎\n' && typedKey === null) {
        //     currentSpan.classList.add('correct');
        // }
        if (expectedChar === '⏎\n' && typedKey === 'Enter') {
            handleEnter();
        } else if (expectedChar === '\t' && typedKey === 'Tab') {
            handleCorrect();
        } else if (typedKey === expectedChar) {
            handleCorrect();
        } else if (event.metaKey || event.ctrlKey || event.altKey || typedKey.length > 1) {
            // nothing
        } else {
            currentSpan.classList.add('incorrect');
            currentSpan.classList.remove('correct');
        }
    });

    function handleCorrect() {
        const currentSpan = characters[currentIndex];
        currentSpan.classList.remove('cursor', 'incorrect');
        currentSpan.classList.add('correct');

        currentIndex += 1;

        if (currentIndex < characters.length) {
            characters[currentIndex].classList.add('cursor');
        } else {
            console.log('타이핑 끝.');
        }
    }

    function handleEnter() {
        const currentSpan = characters[currentIndex];
        currentSpan.classList.remove('cursor', 'incorrect');
        currentSpan.classList.add('expectedEnter');

        currentIndex += 1;

        if (currentIndex < characters.length) {
            characters[currentIndex].classList.add('cursor');
            characters[currentIndex].classList.remove('expectedEnter');
        } else {
            console.log('타이핑 끝.');
        }

    }
});