// alert() 대신 사용할 커스텀 메시지 박스 함수
function showMessageBox(message) {
    document.getElementById('messageContent').innerText = message;
    document.getElementById('messageBox').style.display = 'block';
}

// --- 타이핑 게임 로직 ---
let TypingGame = {
    originalText: "",
    characters: [], // 각 문자를 <span> 요소로 저장할 배열
    charIndex: 0,
    errorCount: 0,
    typingStarted: false,

    // 키보드 상태 변수 (TypingGame 객체 내부에 포함)
    isShiftPressed: false,
    isHangulMode: false, // 한/영 모드
    isCapsLockPressed: false,
    isComposing: false, // 한글 입력 중 (조합 중)

    // 가상 키보드 관련 DOM 요소
    keys: null,
    korean_keys: null,
    hangulEngKey: null,

    // 이벤트 리스너 참조를 저장하여 나중에 제거할 수 있도록 함
    eventListeners: {
        keydown: null,
        keyup: null,
        input: null,
        compositionstart: null,
        compositionend: null
    },

    init: function (text) {
        this.originalText = text;
        this.charIndex = 0;
        this.errorCount = 0;
        this.typingStarted = false;

        // 키보드 상태 초기화
        this.isShiftPressed = false;
        this.isHangulMode = false;
        this.isCapsLockPressed = false;
        this.isComposing = false;

        // 텍스트를 original-text에 저장 (선택 사항, 내부적으로 originalText 사용)
        $('#original-text').text(this.originalText);

        // text-display를 초기화하고 각 문자를 span으로 감싸 표시
        this.renderText();

        // 입력 필드 초기화 및 포커스
        $('#typing-input').val('').focus();

        // 기존 이벤트 리스너 모두 제거
        this.removeAllEventListeners();

        // 새로운 이벤트 리스너 추가 및 참조 저장
        this.eventListeners.keydown = this.handleKeyDown.bind(this);
        document.addEventListener('keydown', this.eventListeners.keydown);

        this.eventListeners.keyup = this.handleKeyUp.bind(this);
        document.addEventListener('keyup', this.eventListeners.keyup);

        this.eventListeners.input = this.handleInputEvent.bind(this);
        document.addEventListener('input', this.eventListeners.input);

        this.eventListeners.compositionstart = this.handleCompositionStart.bind(this);
        document.addEventListener('compositionstart', this.eventListeners.compositionstart);

        this.eventListeners.compositionend = this.handleCompositionEnd.bind(this);
        document.addEventListener('compositionend', this.eventListeners.compositionend);

        console.log("타이핑 게임 초기화 완료:", this.originalText.substring(0, Math.min(this.originalText.length, 50)) + "...");

        // 가상 키보드 관련 요소들을 여기서 초기화 (HTML에 키보드가 추가되었으므로 활성화)
        this.keys = document.querySelectorAll('.key');
        this.korean_keys = document.querySelectorAll('.kor');
        this.hangulEngKey = document.getElementById('key-HangulMode');
        this.updateKeyboardLayout(); // 초기 키보드 레이아웃 업데이트
    },

    // 모든 이벤트 리스너 제거 함수
    removeAllEventListeners: function () {
        for (let type in this.eventListeners) {
            if (this.eventListeners[type]) {
                document.removeEventListener(type, this.eventListeners[type]);
                this.eventListeners[type] = null;
            }
        }
    },

    renderText: function () {
        // text-display 비우기
        $('#text-display').empty();
        this.characters = []; // span 배열 초기화

        // 원본 텍스트를 순회하며 각 문자를 span으로 만들어 삽입
        for (let i = 0; i < this.originalText.length; i++) {
            const char = this.originalText[i];
            const span = document.createElement('span');

            // Enter 키를 위한 시각적 표현
            if (char === '\n') {
                span.innerText = '↵'; // '↵' 기호 표시
                $('#text-display').append(span);
                $('#text-display').append(document.createElement('br')); // 실제 줄바꿈
            } else if (char === '\t') {
                span.innerText = '→'; // 탭을 위한 시각적 표현
                span.style.width = '2em'; // 탭 공간 확보 (CSS로 처리하는게 더 좋음)
                span.style.display = 'inline-block';
                $('#text-display').append(span);
            } else {
                span.innerText = char;
                $('#text-display').append(span);
            }
            this.characters.push(span);
        }

        // 초기 커서 위치 설정
        if (this.characters.length > 0) {
            this.characters[this.charIndex].classList.add('current');
        }
        this.scrollToCurrentChar(); // 초기 렌더링 후 스크롤
    },

    scrollToCurrentChar: function () {
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
    },

    // 가상 키보드 레이아웃을 현재 상태에 맞춰 업데이트하는 함수
    updateKeyboardLayout: function () {
        // 가상 키보드 요소가 초기화되었는지 확인
        if (!this.keys || !this.hangulEngKey) {
            // 키보드 요소가 아직 없으면 다시 쿼리
            this.keys = document.querySelectorAll('.key');
            this.korean_keys = document.querySelectorAll('.kor');
            this.hangulEngKey = document.getElementById('key-HangulMode');
            if (!this.keys || !this.hangulEngKey) return; // 여전히 없으면 종료
        }

        this.keys.forEach(key => {
            let displayText = '';
            // 특수 키나 컨트롤 키는 항상 고정된 텍스트
            if (!key.hasAttribute('data-original') || key.id === 'key-HangulMode' || key.id === 'key-Backspace' || key.id === 'key-Tab' || key.id === 'key-CapsLock' || key.id === 'key-Enter' || key.id.includes('Shift') || key.id.includes('Control') || key.id.includes('Meta') || key.id.includes('Alt') || key.id === 'key-ContextMenu' || key.id === 'key-Space') {
                displayText = key.textContent;
            } else if (this.isHangulMode) {  // 한글 모드일 때
                if (this.isShiftPressed) {
                    displayText = key.getAttribute('data-kor-hard') || key.getAttribute('data-special-symbol');
                } else {
                    displayText = key.getAttribute('data-kor');
                    if (key.getAttribute('data-special-symbol') !== null) {
                        displayText = key.getAttribute('data-original');
                    }
                }
            } else { // 영어 모드일 때
                if (this.isShiftPressed) {
                    displayText = key.getAttribute('data-shift') || key.getAttribute('data-special-symbol');
                } else if (this.isCapsLockPressed) {
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

        if (this.isHangulMode) {
            this.hangulEngKey.classList.add('language-active');
        } else {
            this.hangulEngKey.classList.remove('language-active');
        }
    },

    handleKeyDown: function (e) {
        // 가상 키보드 요소에 'active' 클래스 추가
        const keyElement = document.getElementById(`key-${e.code}`);
        if (keyElement) { keyElement.classList.add('active'); }

        // 특수 키 처리 (글자 입력은 input 이벤트에서 처리)
        if (e.key === 'Shift') {
            if (!this.isShiftPressed) {
                this.isShiftPressed = true;
                this.updateKeyboardLayout(); // 가상 키보드 레이아웃 업데이트
            }
        } else if (e.key === 'CapsLock' && !this.isHangulMode) {
            this.isCapsLockPressed = !this.isCapsLockPressed;
            this.updateKeyboardLayout(); // 가상 키보드 레이아웃 업데이트
        } else if (e.key === 'HangulMode' || e.code === 'Lang1') {
            this.isHangulMode = !this.isHangulMode;
            this.updateKeyboardLayout(); // 가상 키보드 레이아웃 업데이트
            e.preventDefault(); // 기본 한영 전환 방지
        } else if (e.key === 'Backspace') {
            if (this.charIndex > 0) {
                const prevSpan = this.characters[this.charIndex - 1];
                // 이전 글자 스타일 초기화
                prevSpan.classList.remove('correct', 'incorrect', 'expectedEnter');
                // 현재 커서 제거
                if (this.charIndex < this.characters.length) { // 마지막 글자에서 백스페이스 시 에러 방지
                    this.characters[this.charIndex].classList.remove('current');
                }
                this.charIndex -= 1;
                this.characters[this.charIndex].classList.add('current'); // 새 커서 위치 설정
            }
            e.preventDefault(); // 브라우저의 기본 백스페이스 동작 방지
            // 한글 입력 중 백스페이스 처리 시 isComposing 상태를 고려해야 함
            // (TODO: 한글 조합 중 백스페이스 시 특수 처리 로직 추가)
        } else if (e.key === 'Enter') {
            this.handleInput('Enter'); // Enter 키는 직접 처리
            e.preventDefault();
        } else if (e.key === 'Tab') {
            this.handleInput('Tab'); // Tab 키는 직접 처리
            e.preventDefault();
        }
        // 다른 일반 문자 키는 input 이벤트에서 처리되도록 함 (특히 한글 조합)
    },

    handleKeyUp: function (e) {
        // 가상 키보드 요소에 'active' 클래스 제거
        const keyElement = document.getElementById(`key-${e.code}`);
        if (keyElement) { keyElement.classList.remove('active'); }

        if (e.key === 'Shift') {
            if (this.isShiftPressed) {
                this.isShiftPressed = false;
                this.updateKeyboardLayout(); // 가상 키보드 레이아웃 업데이트
            }
        }
    },

    // 모든 문자 입력을 처리하는 'input' 이벤트 리스너 (일반 문자, IME 입력)
    handleInputEvent: function (event) {
        // compositioning 중인 경우, compositionend에서 최종 문자 처리
        if (this.isComposing) {
            // 현재 입력 필드의 조합 중인 텍스트를 임시로 표시하거나 처리하는 로직 추가 가능
            return;
        }

        // event.data는 입력된 문자열 (한글 조합 완료된 문자 포함)
        const typedChar = event.data;
        if (typedChar) {
            // 입력 필드 초기화 (이전 입력 유지 방지)
            $('#typing-input').val('');
            this.handleInput(typedChar);
        }
    },

    handleCompositionStart: function () {
        this.isComposing = true;
        // console.log("Composition Started");
    },

    handleCompositionEnd: function (event) {
        this.isComposing = false;
        // console.log("Composition Ended:", event.data);
        // 조합이 끝난 최종 문자를 handleInput으로 전달
        const typedChar = event.data;
        if (typedChar) {
            $('#typing-input').val(''); // 입력 필드 초기화
            this.handleInput(typedChar);
        }
    },

    // --------------- 로직 함수 ----------------------------
    handleInput: function (typedChar) {
        if (this.charIndex >= this.characters.length) {
            // 이미 끝난 경우
            return;
        }

        // 타이핑 시작 플래그 설정
        if (!this.typingStarted) {
            this.typingStarted = true;
            // 여기에 타이머 시작 등의 로직 추가 가능
        }

        const currentSpan = this.characters[this.charIndex];
        let expectedChar = currentSpan.innerText; // span 내부의 텍스트가 예상 문자

        // 엔터나 탭 기호를 실제 문자('\n', '\t')로 변환하여 비교
        if (expectedChar === '↵') expectedChar = '\n';
        if (expectedChar === '→') expectedChar = '\t';

        let isCorrect = false;

        // 엔터 키 처리
        if (expectedChar === '\n' && typedChar === 'Enter') {
            this.handleEnter();
            return;
        }
        // 탭 키 처리
        if (expectedChar === '\t' && typedChar === 'Tab') {
            isCorrect = true; // 탭은 항상 올바른 입력으로 간주
        }
        // 스페이스 키 처리 (스페이스바 누르면 동일)
        else if (expectedChar === ' ' && typedChar === ' ') {
            isCorrect = true;
        }
        // 일반 문자 처리
        else if (expectedChar === typedChar) {
            isCorrect = true;
        }

        if (isCorrect) {
            this.handleCorrect();
        } else {
            this.handleIncorrect();
        }
    },

    handleEnter: function () {
        const currentSpan = this.characters[this.charIndex];
        currentSpan.classList.remove('cursor', 'incorrect', 'correct');
        currentSpan.classList.add('expectedEnter'); // 엔터 시각적 표시

        this.charIndex += 1;
        if (this.charIndex < this.characters.length) {
            this.characters[this.charIndex].classList.add('cursor');
        } else {
            this.finishGame();
        }
        this.scrollToCurrentChar();
    },

    handleCorrect: function () {
        const currentSpan = this.characters[this.charIndex];
        currentSpan.classList.remove('cursor', 'incorrect', 'expectedEnter');
        currentSpan.classList.add('correct');

        this.charIndex += 1;
        if (this.charIndex < this.characters.length) {
            this.characters[this.charIndex].classList.add('cursor');
        } else {
            this.finishGame();
        }
        this.scrollToCurrentChar();
    },

    handleIncorrect: function () {
        const currentSpan = this.characters[this.charIndex];
        currentSpan.classList.add('incorrect');
        currentSpan.classList.remove('correct', 'expectedEnter'); // 올바른/엔터 표시 제거
        this.errorCount++; // 오류 카운트 증가

        // 틀린 글자도 일단 진행
        this.charIndex += 1;
        if (this.charIndex < this.characters.length) {
            this.characters[this.charIndex].classList.add('cursor');
        } else {
            this.finishGame();
        }
        this.scrollToCurrentChar();
    },

    finishGame: function () {
        this.typingStarted = false;
        this.removeAllEventListeners(); // 모든 이벤트 리스너 제거
        showMessageBox(`타이핑 완료! 총 오류: ${this.errorCount}개`);
        // 여기에 결과 표시, 재시작 버튼 등의 로직 추가
    }
};

$(document).ready(function () {
    // 페이지 로드 시 초기 텍스트로 게임 초기화
    // Jinja2로 전달된 practice_content를 사용합니다.
    let initialContent = $('#text-display').text().trim(); // 초기 로드된 텍스트
    if (initialContent) {
        TypingGame.init(initialContent);
    }

    // 언어 선택 드롭다운 메뉴의 값이 변경될 때마다 실행
    $("#language").on("change", function () {
        var selectedLanguage = $(this).val();
        var dataToSend = "code-" + selectedLanguage.toLowerCase();

        // AJAX 요청 시작
        $.ajax({
            method: "POST",
            url: "/process-data", // Flask 서버의 새로 정의된 POST 라우트와 일치
            data: { myData: dataToSend },
            success: function (response) {
                console.log("서버 응답:", response);
                if (response && response.content) {
                    // 서버에서 받은 새 텍스트로 타이핑 게임 재초기화
                    TypingGame.init(response.content);
                    showMessageBox("새 텍스트가 성공적으로 로드되었습니다!");
                } else if (response && response.error) {
                    showMessageBox("오류: " + response.error);
                } else {
                    showMessageBox("알 수 없는 서버 응답 형식.");
                }
            },
            error: function (xhr, status, error) {
                console.error("AJAX Error:", status, error, xhr.responseText);
                let errorMessage = "알 수 없는 에러 발생.";
                try {
                    const errorJson = JSON.parse(xhr.responseText);
                    if (errorJson.error) {
                        errorMessage = "에러 발생: " + errorJson.error;
                    }
                } catch (e) {
                    errorMessage = "에러 발생: " + (xhr.responseText || error);
                }
                showMessageBox(errorMessage);
            }
        });
    });
});
