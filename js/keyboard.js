document.addEventListener('keydown', (event) => {
    let keyElement;

    // event.key로 대부분의 키를 처리
    const keyId = `key-${event.key}`;
    keyElement = document.getElementById(keyId);

    // 특수키 (Shift, Control, Alt)의 경우 event.code로 처리
    // 왼쪽/오른쪽을 구분하기 위함
    if (!keyElement && (event.key === 'Shift' || event.key === 'Control' || event.key === 'Alt' || event.key === 'Tab'
        || event.key === 'HangulMode' || event.key === 'Meta')) {
        const keyIdWithCode = `key-${event.code}`;
        keyElement = document.getElementById(keyIdWithCode);
        keyElement.classList.add('active');
    }

    // Shift 키가 눌렸을 때
    if (keyElement === 'Shift' && isShiftPressed) {
        isShiftPressed = true;
        // 각 키를 순회하며 텍스트를 변경합니다.
        keys.forEach(key => {
            const shiftedText = key.getAttribute("data-shift");
            // data-shift 속성이 있는 키만 변경합니다.
            if (shiftedText) {
                key.textContent = shiftedText;
                key.classList.add('active');
            }
        });
        // 현재 눌린 키를 시각적으로 표시합니다.

        // if (keyElement.isKeyPressed) {
        //     keyElement.classList.add('active');
        // }
    }

    if (keyElement) {
        keyElement.classList.add('active');
    }
});

document.addEventListener('keyup', (event) => {
    let keyElement;

    const keyId = `key-${event.key}`;
    keyElement = document.getElementById(keyId);

    if (!keyElement && (event.key === 'Shift' || event.key === 'Control' || event.key === 'Alt' || event.key === 'Tab'
        || event.key === 'HangulMode' || event.key === 'Meta')) {
        const keyIdWithCode = `key-${event.code}`;
        keyElement = document.getElementById(keyIdWithCode);
        keyElement.classList.remove('active');
    }

    const keys = document.querySelectorAll('.key');

    // Shift 키를 떼었을 때
    if (keyElement === 'Shift') {
        isShiftPressed = false;
        // 각 키를 순회하며 텍스트를 원래대로 되돌립니다.
        keys.forEach(key => {
            // data-shift 속성이 있는 키만 원래 텍스트로 되돌립니다.
            const shiftedText = key.getAttribute("data-shift").textContent;
            // data-shift 속성이 있는 키만 변경합니다.
            if (shiftedText) {
                key.textContent = shiftedText.textContent;
                key.classList.remove('active');
            }

            // const shiftedText = key.;
            // if (key.hasAttribute('data-shift')) {
            //     const originalText = key.textContent;
            //     key.textContent = originalText;
            //     key.classList.remove('active');
            // }
        });
    }


    if (keyElement && !keyElement.isKeyPressed) {
        keyElement.classList.remove('active');
    }
});

// document.addEventListener('keydown', function (event) {
//     console.log("keyCode:", event.keyCode);
//     console.log("code:", event.code);
//     console.log("key:", event.key);
// });
