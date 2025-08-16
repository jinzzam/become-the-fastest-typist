import random
import math
f = open("text/English-alphabet.txt", "r", encoding="utf-8")
lines = f.readlines()

for line in lines : 
    data = line.split(',')
    
    i=0
    while i<len(data) :
        n =  math.floor(random.random() * len(data));
        print(data[n], end=';')
        # print(n)
        i+=1
    
print("알파벳 읽기 완료")

f.close()