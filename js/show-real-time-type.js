$(function () {
    let combinedString = ""; // 결과를 저장할 변수
    //keydown : 키 누를 때
    $("#temp").keydown(function (event) {
        let keyPressed = event.key;
        if (keyPressed === "Backspace") {
            combinedString = combinedString.slice(0, -1); // 마지막 문자 삭제
        } else if (keyPressed === "Enter") {
            combinedString += "\n"; // 줄바꿈 문자 추가
        }
        else {
            combinedString += keyPressed; // 문자열 연결
        }
        $("#result").text(combinedString);
        // console.log(combinedString);
    });
});