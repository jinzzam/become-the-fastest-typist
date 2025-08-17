from flask import Flask, render_template
# from jinja2 import Template
app = Flask(__name__)

@app.route('/')
def show_text():

    try:
        with open("text/test.txt", "r", encoding="utf-8") as f:
            file_content = f.read();
    except FileNotFoundError:
        file_content = "텍스트 파일을 찾을 수 없습니다. 파일생성해주세요."
        
    # 가공된 리스트를 템플릿으로 바로 전달
    return render_template('type-temp.html', practice_content = file_content)
if __name__=='__main__':
    app.run(debug=True)