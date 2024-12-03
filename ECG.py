import numpy as np
import matplotlib.pyplot as plt

def generate_ecg(bpm, duration=10, fs=500):
    """
    Gera um vetor simulando um sinal de ECG com base na frequência cardíaca (bpm).
    :param bpm: Batimentos por minuto.
    :param duration: Duração do sinal em segundos.
    :param fs: Frequência de amostragem em Hz.
    :return: Vetor do sinal de ECG e o tempo correspondente.
    """
    t = np.linspace(0, duration, int(fs * duration))  # Vetor de tempo
    heart_rate = bpm / 60  # Hz (frequência cardíaca)
    
    
    ecg = np.sin(2 * np.pi * heart_rate * t) + 0.5 * np.sin(4 * np.pi * heart_rate * t)
    ecg += 0.1 * np.random.normal(size=len(t))  # Adicionando ruído
    
    return t, ecg

# Sinais de 60 bpm e 120 bpm
t_60, ecg_60 = generate_ecg(60)
t_120, ecg_120 = generate_ecg(120)

# Visualização
plt.figure(figsize=(12, 6))
plt.subplot(2, 1, 1)
plt.plot(t_60, ecg_60)
plt.title("ECG Simulado - 60 bpm")
plt.xlabel("Tempo (s)")
plt.ylabel("Amplitude")

plt.subplot(2, 1, 2)
plt.plot(t_120, ecg_120)
plt.title("ECG Simulado - 120 bpm")
plt.xlabel("Tempo (s)")
plt.ylabel("Amplitude")

plt.tight_layout()
plt.show()
