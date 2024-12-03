import cv2
import requests
import time
from deepface import DeepFace

# Inicializa a captura de vídeo
cap = cv2.VideoCapture(0)

# URL para upload
upload_url = "http://192.168.0.177:3000/ia"

# Tempo total para captura (10 segundos)
capture_duration = 10
start_time = time.time()

# Flag de detecção de inveja
envy_detected = False

print("Captura ativa por 10 segundos. Pressione 'q' para sair.")

while True:
    ret, frame = cap.read()
    
    if not ret:
        print("Erro ao acessar a webcam.")
        break
    
    # Mostra o frame capturado
    cv2.imshow("Webcam - Captura de Emoção", frame)
    
    try:
        # Analisa a emoção da face no frame capturado
        analysis = DeepFace.analyze(frame, actions=['emotion'], enforce_detection=False)
        emotion = analysis[0]['dominant_emotion']
        
        # Substitui 'angry' por 'envy'
        if emotion == 'angry':
            emotion = 'envy'
        
        print(f"Emoção detectada: {emotion}")
        
        # Atualiza o status se detectar "envy"
        if emotion == 'envy':
            envy_detected = True
        
        # Adiciona a emoção detectada ao frame
        cv2.putText(frame, f"Emocao: {emotion}", (10, 50), 
                    cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2, cv2.LINE_AA)
    
    except Exception as e:
        print(f"Erro ao analisar emoção: {str(e)}")
    
    # Verifica o tempo decorrido
    elapsed_time = time.time() - start_time
    if elapsed_time >= capture_duration:
        # Determina o valor a ser enviado (0 ou 1)
        value = 1 if envy_detected else 0
        
        # Envia o valor para o servidor
        try:
            print(value)
            response = requests.get(f"{upload_url}/{value}/samuel")
            print(f"Enviando valor {value}: {response}")
            if response.status_code == 200:
                print("Upload bem-sucedido.")
            else:
                print(f"Falha no upload: {response.status_code}")
        except Exception as e:
            print(f"Erro ao enviar dados: {e}")
        
        # Encerra o programa após 10 segundos
        print("Tempo de captura encerrado.")
        break
    
    # Verifica se a tecla 'q' foi pressionada para sair antes do tempo
    key = cv2.waitKey(1) & 0xFF
    if key == ord('q'):
        print("Encerrando antes do tempo.")
        break

# Libera a captura de vídeo e fecha as janelas
cap.release()
cv2.destroyAllWindows()
