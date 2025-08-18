import requests
from bs4 import BeautifulSoup

# 웹페이지 가져오기
URL = 'http://127.0.0.1:5000/templates/type-temp.html'


try:
    response = requests.get(URL)
    response.raise_for_status() # HTTP 에러 발생 시 예외 처리
    html = response.text
    # html 파싱
    soup = BeautifulSoup(html, 'html.parser')

    # select 요소 찾기
    select_element = soup.find('select', {'id':'mySelect'})

    if select_element:
        select_option = select_element.find('option', selected=True)
        if select_option : 
            selected_value = select_option['value']
            print(f"선택된 값: {selected_value}")
        else:
            print("선택된 옵션이 없습니다.")
    else: print("select 요소를 찾을 수 없습니다.")

except requests.exceptions.RequestException as e :
    print(f"HTTP 요청 에러 : {e}")
except Exception as e:
    print(f"오류 발생 : {e}")