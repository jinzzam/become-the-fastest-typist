import random
import math
f = open("text/Korean-consonants-vowels.txt", "r", encoding="utf-8")
lines = f.readlines()

data = lines[0]
data = data.split(', ')
    
i=0
while i<len(data) :
    n =  math.floor(random.random() * len(data));
    print(data[n], end=';')
    # print(n)
    i+=1
    
print("한글 자음 읽기 완료")

f.close()