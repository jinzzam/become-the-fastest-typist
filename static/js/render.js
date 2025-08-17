// alert() 대신 사용할 커스텀 메시지 박스 함수
function showMessageBox(message) {
    document.getElementById('messageContent').innerText = message;
    document.getElementById('messageBox').style.display = 'block';
}

$(document).ready(function () {
    // 언어 선택 드롭다운 메뉴의 값이 변경될 때마다 실행
    $("#language").on("change", function () {
        var selectedLanguage = $(this).val(); // 선택된 언어 값 가져오기 (예: "Java", "Python")
        $(".txt").text(selectedLanguage); // 현재 선택된 언어를 임시로 표시

        console.log("선택된 언어: " + selectedLanguage);

        // 서버로 보낼 데이터 준비 (예: "code-java", "code-python")
        var dataToSend = "code-" + selectedLanguage.toLowerCase();
        console.log("서버로 보낼 데이터: " + dataToSend);

        // AJAX 요청 시작
        $.ajax({
            method: "POST", // POST 방식으로 요청
            url: "/process-data", // Flask 서버의 새로 정의된 POST 라우트와 일치하도록 수정
            data: { myData: dataToSend }, // 'myData'라는 이름으로 데이터 전송
            success: function (response) {
                // 요청이 성공했을 때 실행될 콜백 함수
                // Flask 서버에서 반환한 JSON 응답을 받습니다.
                console.log("서버 응답:", response);
                if (response && response.message) {
                    showMessageBox("서버 응답: " + response.message + " (받은 데이터: " + selectedLanguage + ")");
                    // 실제 애플리케이션에서는 여기서 .txt 요소에 새로운 텍스트 콘텐츠를 로드할 수 있습니다.
                    $("#text-display").text(response.content);

                } else {
                    showMessageBox("알 수 없는 서버 응답 형식.");
                }
            },
            error: function (xhr, status, error) {
                // 요청이 실패했을 때 실행될 콜백 함수
                console.error("AJAX Error:", status, error, xhr.responseText);
                showMessageBox("에러 발생: " + (xhr.responseText || error));
            }
        });
    });
});