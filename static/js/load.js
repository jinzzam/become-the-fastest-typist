// document.addEventListener("load", (event) => {
//     // 텍스트를 한 글자씩 <span>으로 감싸서 화면에 표시
//     const characters = originalText.split('').map(char => {
//         const span = document.createElement('span');
//         // Enter 키를 위한 시각적 표현
//         if (char === '\n') {
//             span.innerText = '↵\n';
//         } else {
//             span.innerText = char;
//         }

//         textDisplay.appendChild(span);
//         return span;
//     });
//     characters = textDisplay.split('').map(char => {
//         const span = document.createElement('span');
//         // Enter 키를 위한 시각적 표현
//         if (char === '\n') {
//             span.innerText = '↵\n';
//         } else {
//             span.innerText = char;
//         }

//         textDisplay.appendChild(span);
//         return span;
//     });

//     if (characters.length > 0) {
//         characters[currentIndex].classList.add('cursor');
//     }

// });