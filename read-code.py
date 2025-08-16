from flask import Flask, render_template
from jinja2 import Template
app = Flask(__name__)

@app.route('/')
def show_text():

    try:
        with open("text/code-java.txt", "r", encoding="utf-8") as f:
            line_content=[]
            lines = f.readlines()
            for line in lines:
                temp = line.replace("\n", "")
                # temp = temp.replace("\t", "&nbsp;"*8)
                line_content.append(temp)

    except FileNotFoundError:
        file_content = "텍스트 파일을 찾을 수 없습니다. 파일생성해주세요."
        
        # template = Template(template_string)
        # file_content = {"file_content" : file_content}
        # html_output = template.render(file_content)
        # print('html : ',html_output)
                
    # 가공된 리스트를 템플릿으로 바로 전달
    return render_template('type-temp.html', practice_content = line_content)
if __name__=='__main__':
    app.run(debug=True)