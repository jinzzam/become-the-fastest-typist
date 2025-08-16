import requests
from bs4 import BeautifulSoup
from flask import Flask, render_template_string
app = Flask(__name__)

@app.route('/')
def show_text():
    
    try:
        with open("text/code-java.txt", "r", encoding="utf-8") as f:
            file_content = f.read()
        with open("type-temp.html", "w", encoding='utf-8') as h:
            html_content = h.readlines()
            for line in html_content:
                # 내가 원하는 html 태그 자리가 찾아진다면
                if line.index('<h3 id="typeText">'):
                    # 내용 삽입할 인덱스를 찾고
                    # 해당 위치에 읽었던 텍스트 파일 내용을 붙인다
                    indexForInsert = line.index('></h3>')
                    line[indexForInsert] += file_content

    except FileNotFoundError:
        file_content = "텍스트 파일을 찾을 수 없습니다. 파일생성해주세요."
        
#     html_template = '''
#     <!DOCTYPE html>
#     <html lang="ko">
#     <head>
#         <meta charset="UTF-8">
#         <title>텍스트 파일 뷰어</title>
#     </head>
#     <body>
#         <h1>텍스트 파일 내용 (실시간)</h1>
#         <p>{{ content|safe }}</p>
#     </body>
#     </html>
# '''
    return render_template_string(content=file_content)

if __name__=='__main__':
    app.run(debug=True)

# lines = f.readlines()

# for line in lines:
#     data = line
    
#     i=0
#     n = len(data)
#     while i<n :
#         print(data[i], end='')
#         i+=1
    
    
# print("코드 읽기 완료")

# f.close()