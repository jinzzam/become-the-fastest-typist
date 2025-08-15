document.addEventListener('DOMContentLoaded', () => {
    const keys = document.querySelectorAll('.key');
    // 한/영 키 요소를 ID로 직접 가져옵니다.
    const hangulEngKey = document.getElementById('key-HangulMode');
    // const userInput = document.getElementById('user-input'); // 사용자 입력 필드 가져오기


    let isShiftPressed = false;
    let isHangulMode = false; // 한글 모드 여부 상태

    // 키보드 레이아웃을 현재 상태(Shift, 한글/영어)에 맞춰 업데이트하는 함수
    function updateKeyboardLayout() {
        keys.forEach(key => {
            let displayText = '';

            // data-original 속성이 없거나 한/영 키인 경우는 텍스트 변경 없이 원래 텍스트 유지
            if (!key.hasAttribute('data-original') || key.id === 'key-HangulMode' || key.id === 'key-Backspace' || key.id === 'key-Tab' || key.id === 'key-CapsLock' || key.id === 'key-Enter' || key.id.includes('Shift') || key.id.includes('Control') || key.id.includes('Meta') || key.id.includes('Alt') || key.id === 'key-ContextMenu' || key.id === 'key-Space') {
                displayText = key.textContent;
            } else if (isHangulMode) {
                // 한글 모드일 때
                if (isShiftPressed) {
                    // 된소리 (data-korean-shift) 또는 일반 한글 (data-korean)
                    displayText = key.getAttribute('data-kor-hard');
                } else {
                    // 일반 한글 (data-korean)
                    displayText = key.getAttribute('data-kor');
                }
            } else if (!isHangulMode) {
                // 영어 모드일 때
                if (isShiftPressed) {
                    // Shifted 영어 (data-shift) 또는 일반 영어 (data-original)
                    displayText = key.getAttribute('data-shift');
                } else {
                    // 일반 영어 (data-original)
                    displayText = key.getAttribute('data-original');
                }
            }
            // null 값 방지 및 텍스트 업데이트
            if (displayText !== null && displayText !== undefined) {
                key.textContent = displayText;
            }

            // // 한/영 키의 활성화 상태 시각화
        });
        if (isHangulMode) {
            hangulEngKey.classList.add('language-active');
        } else {
            hangulEngKey.classList.remove('language-active');
        }

    }

    // 초기 키보드 레이아웃 설정 (페이지 로드 시)
    if (isHangulMode) {
        hangulEngKey.classList.add('language-active');
    } else {
        hangulEngKey.classList.remove('language-active');
    }
    updateKeyboardLayout();

    // 키보드 누르기 이벤트 (keydown)
    // Document.addEventListener('keydown', (event) => {
    const handleKeyboardEvent_keydown = (event) => {
        // 1. 눌린 키에 active 클래스 추가 (시각적 효과)
        // event.code를 사용하여 물리적인 키 위치에 맞는 요소를 찾습니다.
        const keyElement = document.getElementById(`key-${event.code}`);
        if (keyElement) {
            keyElement.classList.add('active');
        }

        // 2. Shift 키 상태 변경 및 레이아웃 업데이트
        // Shift 키가 눌리고 아직 Shift 모드가 아닐 때
        if (event.key === 'Shift' && !isShiftPressed) {
            isShiftPressed = true;
            updateKeyboardLayout(); // Shift 눌림 상태에 맞춰 키보드 텍스트 업데이트
        }

        // 3. 한/영 키 상태 변경 및 레이아웃 업데이트
        // 'HangulMode'는 한/영 키에 대한 표준 event.key 값입니다.
        // 일부 시스템에서는 'Process'나 'Lang1', 'Key229' 등을 사용할 수도 있습니다.
        if (event.key === 'HangulMode' || event.code === 'Lang1') {      //|| event.key === 'Process' ||  || event.code === 'Key229'
            isHangulMode = !isHangulMode; // 언어 모드 토글
            updateKeyboardLayout(); // 언어 모드 변경에 맞춰 키보드 텍스트 업데이트
            // 브라우저의 기본 IME 전환 동작 방지
            event.preventDefault();
        }
    };

    const handleKeyboardEvent_keyup = (event) => {
        const keyElement = document.getElementById(`key-${event.code}`);
        if (keyElement) {
            keyElement.classList.remove('active');
        }
        // 2. Shift 키 상태 변경 및 레이아웃 업데이트
        // Shift 키가 떼지고 아직 Shift 모드가 아닐 때
        if (event.key === 'Shift' && isShiftPressed) {
            isShiftPressed = false;
            updateKeyboardLayout(); // Shift 떼짐 상태에 맞춰 키보드 텍스트 업데이트
        }

        // 3. 한/영 키 상태 변경 및 레이아웃 업데이트
        // 'HangulMode'는 한/영 키에 대한 표준 event.key 값입니다.
        // 일부 시스템에서는 'Process'나 'Lang1', 'Key229' 등을 사용할 수도 있습니다.
        // if (event.key === 'HangulMode' || event.code === 'Lang1') {      //|| event.key === 'Process' ||  || event.code === 'Key229'
        //     // isHangulMode = !isHangulMode; // 언어 모드 토글
        //     updateKeyboardLayout(); // 언어 모드 변경에 맞춰 키보드 텍스트 업데이트
        //     // 브라우저의 기본 IME 전환 동작 방지
        //     event.preventDefault();
        // }
    };

    document.addEventListener('keydown', handleKeyboardEvent_keydown);
    document.addEventListener('keyup', handleKeyboardEvent_keyup);

    // input 필드에 포커스가 있을 때 (document 전체) 이벤트 처리
    // document.addEventListener('keydown', (event) => {
    //     if (event.target === userInput){
    //         handleKeyboardEvent_keydown();
    //     }
    // });

    // document.addEventListener('keyup', (event) => {
    //     if (event.target === userInput){
    //         handleKeyboardEvent_keyup();
    //     }
    // });

    // 키보드 떼기 이벤트 (keyup)
    // Document.addEventListener('keyup', (event) => {
    //     // 1. 떼어진 키에서 active 클래스 제거 (시각적 효과)
    //     const keyElement = document.getElementById(`key-${event.code}`);
    //     if (keyElement) {
    //         keyElement.classList.remove('active');
    //     }

    //     // 2. Shift 키 상태 변경 및 레이아웃 업데이트
    //     // Shift 키를 뗄 때
    //     if (event.key === 'Shift') {
    //         isShiftPressed = false;
    //         updateKeyboardLayout(); // Shift 떼어짐 상태에 맞춰 키보드 텍스트 업데이트
    //     }
    // });
});