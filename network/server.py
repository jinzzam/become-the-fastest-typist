import socket 
from _thread import *
# 소켓 설정
# 서버에 접속하는 사용자마다 thread 추가 해줄 것임

# 소켓 정보 보관 리스트
client_sockets=[]

HOST = socket.gethostbyname(socket.gethostname())
PORT = 8080

# 스레드 진행
# 새로운 스레드
def threaded(client_socket, addr):
    print('>> Connected by :', addr[0], ':', addr[1])

# 연결 끊기지 전까지 계속 진행함
    while True:
        try:
            data = client_socket.recv(1024)

            if not data:
                print('>> Disconnected by ' + addr[0], ':', addr[1])
                break
            print('>> Received from ' + addr[0], ':', addr[1], data.decode())

            # 연결된 client와 통신
            for client in client_sockets:
                if client != client_socket:
                    client.send(data)
        
        except ConnectionResetError as e:
            print('>> Disconnected by ' + addr[0], ':', addr[1])
            break
    
    if client_socket in client_sockets:
        client_sockets.remove(client_socket)
        print('remove client list : ', len(client_sockets))

    client_socket.close()
    
# 소켓을 만들고 연결
print('>> Server Start with ip :', HOST)
server_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
server_socket.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
server_socket.bind((HOST, PORT))

# client의 접속 요청을 기다린다
server_socket.listen()

# client 요청 수락
try:
    while True:
        print(">> Wait")

        client_socket, addr = server_socket.accept()
        client_sockets.append(client_socket)
        start_new_thread(threaded, (client_socket, addr))
        print("참가자 수 : ", len(client_sockets))

except Exception as e:
    print("에러 : ", e)
finally:
    server_socket.close()