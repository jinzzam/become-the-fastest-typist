from flask import Flask, render_template, request, jsonify, render_template_string

app = Flask(__name__)

# 기본 페이지 라우트 (GET 요청)
@app.route('/')
def show_text():
    file_content = "텍스트 파일을 찾을 수 없습니다." # 기본 메시지
    try:
        # 'text' 디렉토리가 app.py와 같은 레벨에 있다고 가정합니다.
        with open("text/code-java.txt", "r", encoding="utf-8") as f:
            file_content = f.read()
    except FileNotFoundError:
        # 파일이 없을 경우 콘솔에 에러 출력
        print("Error: 'text/code-java.txt' 파일을 찾을 수 없습니다.")
    except Exception as e:
        # 기타 파일 읽기 오류 처리
        print(f"파일 읽기 중 오류 발생: {e}")

    # 'templates' 폴더 안에 있는 'type-temp.html' 파일을 렌더링하고 내용을 전달합니다.
    return render_template('type-temp.html', practice_content=file_content)

# 데이터를 처리할 새로운 POST 라우트 정의
# 이 라우트는 jQuery AJAX에서 호출할 엔드포인트가 됩니다.
@app.route('/process-data', methods=['POST'])
def process_data():
    if request.method == 'POST':
        # 클라이언트에서 보낸 'myData' 값을 받습니다.
        # request.form.get()을 사용하여 키가 없을 때 오류 방지
        data = request.form.get('myData')
        characters=''
        if data:
            # 여기서는 받은 데이터를 그대로 응답하지만, 실제로는 파일 읽기 등의 로직을 추가할 수 있습니다.
            # 예: 'data' 값에 따라 다른 텍스트 파일을 읽어 반환할 수 있습니다.
            print("data : ",data)
            file_to_read = "text/" + data + ".txt"
            try:
                with open(file_to_read, "r", encoding="utf-8") as f:
                    read_content = f.readlines()
                    characters = ''
                    for line in read_content:
                        for i in range(len(line)):
                            char = line[i]
                            if(char == '\n') :
                                char = char + '↵\n'
                            char = "<span>" + char + "</span>"
                            # print("@#$%!@#$" + char)
                            characters += char
                            print(characters)
                    

                    render_template('type-temp.html', practice_content=characters)
                    return jsonify({'message': '성공적으로 처리되었습니다.', 'content': characters})
            except FileNotFoundError:
                return jsonify({'error': '해당 파일을 찾을 수 없습니다.'}), 404

            processed_message = f"서버에서 '{data}' 데이터를 성공적으로 받았습니다."
            return jsonify({'message': processed_message, 'received_data': data})
        else:
            return jsonify({'error': '데이터가 전달되지 않았습니다.'}), 400

# Flask 앱 실행
if __name__ == '__main__':
    # 디버그 모드는 개발 중에만 사용하고, 프로덕션에서는 비활성화해야 합니다.
    app.run(debug=True)

    #  const characters = response.content.split('').map(char => {
    #                             const span = document.createElement('span');
    #                             // Enter 키를 위한 시각적 표현
    #                             if (char === '\n') {
    #                                 span.innerText = '↵\n';
    #                             } else {
    #                                 span.innerText = char;
    #                             }
    #                             textDisplay.appendChild(span);
    #                             return span;
    #                         });

    #                         if (characters.length > 0) {
    #                             characters[currentIndex].classList.add('cursor');
    #                         }