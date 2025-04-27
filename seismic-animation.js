// Функция для анимации сейсмических волн данных
function animateSeismicData(container) {
    if (!container) return;
    
    // Создаем центральную точку сейсмической волны
    const seismicWave = document.createElement('div');
    seismicWave.className = 'seismic-wave';
    seismicWave.style.position = 'absolute';
    seismicWave.style.left = '50%';
    seismicWave.style.top = '50%';
    seismicWave.style.width = '0';
    seismicWave.style.height = '0';
    seismicWave.style.pointerEvents = 'none';
    container.appendChild(seismicWave);
    
    // Создаем концентрические круги для анимации
    for (let i = 0; i < 5; i++) {
        const waveCircle = document.createElement('div');
        waveCircle.className = 'seismic-wave-circle';
        waveCircle.style.animation = `seismicWave 3s ease-out infinite`;
        waveCircle.style.animationDelay = `${i * 0.6}s`;
        seismicWave.appendChild(waveCircle);
    }
    
    // Добавляем точки сейсмических данных
    for (let i = 0; i < 8; i++) {
        const dataPoint = document.createElement('div');
        dataPoint.className = 'seismic-data-point';
        
        // Случайное расположение вокруг центра
        const angle = Math.random() * Math.PI * 2;
        const distance = Math.random() * 80 + 20;
        dataPoint.style.left = `calc(50% + ${Math.cos(angle) * distance}px)`;
        dataPoint.style.top = `calc(50% + ${Math.sin(angle) * distance}px)`;
        
        // Добавляем анимацию пульсации
        dataPoint.style.animation = 'pulse 2s infinite alternate';
        dataPoint.style.animationDelay = `${Math.random() * 2}s`;
        
        container.appendChild(dataPoint);
    }
    
    // Добавляем соединительные линии после небольшой задержки,
    // чтобы гарантировать, что элементы уже отрендерены
    setTimeout(() => createSeismicConnections(container), 100);
}

// Создание соединительных линий между сейсмическими точками и TEE
function createSeismicConnections(container) {
    const dataPoints = container.querySelectorAll('.seismic-data-point');
    const teeProcessor = container.querySelector('.tee-processor');
    
    if (!teeProcessor || dataPoints.length === 0) return;
    
    // Измеряем размеры контейнера для позиционирования
    const containerRect = container.getBoundingClientRect();
    
    // Центр TEE процессора
    const teeCenterX = containerRect.width / 2;
    const teeCenterY = containerRect.height / 2;
    
    // Для каждой точки создаем соединение с TEE
    dataPoints.forEach((point, index) => {
        if (index % 2 !== 0) return; // Соединяем только четные точки
        
        // Получаем положение точки
        const pointStyle = window.getComputedStyle(point);
        const pointRect = point.getBoundingClientRect();
        
        // Вычисляем центр точки относительно контейнера
        const pointCenterX = pointRect.left - containerRect.left + pointRect.width / 2;
        const pointCenterY = pointRect.top - containerRect.top + pointRect.height / 2;
        
        // Рассчитываем расстояние и угол
        const dx = teeCenterX - pointCenterX;
        const dy = teeCenterY - pointCenterY;
        const length = Math.sqrt(dx * dx + dy * dy);
        const angle = Math.atan2(dy, dx) * 180 / Math.PI;
        
        // Создаем линию соединения
        const connectionLine = document.createElement('div');
        connectionLine.className = 'seismic-connection-line';
        connectionLine.style.width = `${length}px`;
        connectionLine.style.left = `${pointCenterX}px`;
        connectionLine.style.top = `${pointCenterY}px`;
        connectionLine.style.transform = `rotate(${angle}deg)`;
        
        // Добавляем анимацию пульсации
        connectionLine.style.animation = 'seismicPulse 3s infinite';
        connectionLine.style.animationDelay = `${Math.random() * 2}s`;
        
        container.appendChild(connectionLine);
    });
}

// Функция для создания анимации частиц шифрования
function createEncryptionParticles(container) {
    if (!container) return;
    
    // Получаем размер контейнера
    const containerRect = container.getBoundingClientRect();
    const containerWidth = containerRect.width;
    const containerHeight = containerRect.height;
    
    // Создаем частицы, которые будут двигаться от originalData к encryptedData
    const originalData = container.querySelector('.original-data');
    const encryptedData = container.querySelector('.encrypted-data');
    const teeProcessor = container.querySelector('.tee-processor');
    
    if (!originalData || !encryptedData || !teeProcessor) return;
    
    // Получаем позиции элементов
    const originalRect = originalData.getBoundingClientRect();
    const encryptedRect = encryptedData.getBoundingClientRect();
    const teeRect = teeProcessor.getBoundingClientRect();
    
    // Вычисляем стартовую и конечную позиции относительно контейнера
    const startX = originalRect.left - containerRect.left + originalRect.width / 2;
    const startY = originalRect.top - containerRect.top + originalRect.height / 2;
    
    const teeX = teeRect.left - containerRect.left + teeRect.width / 2;
    const teeY = teeRect.top - containerRect.top + teeRect.height / 2;
    
    const endX = encryptedRect.left - containerRect.left + encryptedRect.width / 2;
    const endY = encryptedRect.top - containerRect.top + encryptedRect.height / 2;
    
    // Создаем частицы
    const particleCount = 20;
    const colors = ['#4cc9f0', '#3a86ff', '#4361ee', '#7209b7', '#9b5de5'];
    
    for (let i = 0; i < particleCount; i++) {
        // Создаем частицу
        const particle = document.createElement('div');
        particle.className = 'data-particle';
        
        // Случайный размер частицы
        const size = Math.floor(Math.random() * 8) + 4;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        
        // Случайный цвет из палитры
        const color = colors[Math.floor(Math.random() * colors.length)];
        particle.style.backgroundColor = color;
        particle.style.boxShadow = `0 0 ${size}px ${color}`;
        
        // Начальная позиция - вокруг originalData
        const offset = size * 2;
        particle.style.left = `${startX + (Math.random() * offset - offset/2)}px`;
        particle.style.top = `${startY + (Math.random() * offset - offset/2)}px`;
        
        // Добавляем частицу в контейнер
        container.appendChild(particle);
        
        // Первая анимация - от originalData к teeProcessor
        setTimeout(() => {
            // Плавный переход к teeProcessor
            particle.style.transition = 'all 1s ease-in-out';
            particle.style.left = `${teeX + (Math.random() * 20 - 10)}px`;
            particle.style.top = `${teeY + (Math.random() * 20 - 10)}px`;
        }, 100 + i * 50);
        
        // Вторая анимация - от teeProcessor к encryptedData
        setTimeout(() => {
            // Меняем цвет на более яркий (шифрованный)
            particle.style.backgroundColor = '#7209b7';
            particle.style.boxShadow = `0 0 ${size * 1.5}px #7209b7`;
            
            // Плавный переход к encryptedData
            particle.style.left = `${endX + (Math.random() * offset - offset/2)}px`;
            particle.style.top = `${endY + (Math.random() * offset - offset/2)}px`;
        }, 1500 + i * 50);
        
        // Удаляем частицу после завершения анимации
        setTimeout(() => {
            particle.remove();
        }, 3000 + i * 50);
    }
}

// Экспортируем функции для использования
window.animateSeismicData = animateSeismicData;
window.createEncryptionParticles = createEncryptionParticles;

// Добавляем обработчик кнопки управления сейсмической анимацией
document.addEventListener('DOMContentLoaded', function() {
    const toggleButton = document.getElementById('toggleSeismicAnimationBtn');
    if (toggleButton) {
        // Флаг состояния анимации
        let isAnimationActive = true;
        
        // Обработчик кнопки
        toggleButton.addEventListener('click', function() {
            const encryptionAnimation = document.getElementById('encryptionAnimation');
            
            if (encryptionAnimation) {
                // Переключаем состояние
                isAnimationActive = !isAnimationActive;
                
                if (isAnimationActive) {
                    // Включаем анимацию
                    // Удаляем все существующие элементы анимации
                    const existingElements = encryptionAnimation.querySelectorAll('.seismic-wave, .seismic-data-point, .seismic-connection-line');
                    existingElements.forEach(el => el.remove());
                    
                    // Создаем новую анимацию
                    animateSeismicData(encryptionAnimation);
                    
                    // Меняем текст кнопки
                    toggleButton.innerHTML = '<i class="fas fa-wave-square"></i> Сейсмические волны: ВКЛ';
                    toggleButton.classList.replace('btn-secondary', 'btn-info');
                } else {
                    // Выключаем анимацию - удаляем элементы
                    const animationElements = encryptionAnimation.querySelectorAll('.seismic-wave, .seismic-data-point, .seismic-connection-line');
                    animationElements.forEach(el => el.remove());
                    
                    // Меняем текст кнопки
                    toggleButton.innerHTML = '<i class="fas fa-wave-square"></i> Сейсмические волны: ВЫКЛ';
                    toggleButton.classList.replace('btn-info', 'btn-secondary');
                }
            }
        });
    }
});

// Добавляем инициализацию анимации при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    // Получаем контейнеры для анимации (два разных ID используются в HTML)
    const encryptionAnimation = document.getElementById('encryptionAnimation') || 
                              document.getElementById('encryption-animation');
    
    if (encryptionAnimation) {
        // Показываем контейнер анимации
        encryptionAnimation.style.display = 'block';
        
        // Инициализируем анимацию
        setTimeout(() => {
            // Добавляем класс для запуска анимации
            encryptionAnimation.classList.add('animate');
            
            // Добавляем базовую структуру для TEE-процессора, если её ещё нет
            if (!encryptionAnimation.querySelector('.tee-processor')) {
                const teeProcessor = document.createElement('div');
                teeProcessor.className = 'tee-processor';
                teeProcessor.innerHTML = '<i class="bi bi-cpu"></i>';
                
                // Центрируем процессор в контейнере
                teeProcessor.style.position = 'absolute';
                teeProcessor.style.left = '50%';
                teeProcessor.style.top = '50%';
                teeProcessor.style.transform = 'translate(-50%, -50%)';
                
                encryptionAnimation.appendChild(teeProcessor);
            }
            
            // Добавляем структуру блокчейн-блока, если её нет
            if (!encryptionAnimation.querySelector('.blockchain-block')) {
                const blockchainBlock = document.createElement('div');
                blockchainBlock.className = 'blockchain-block';
                blockchainBlock.innerHTML = `
                    <div class="block-header">Блок <span class="block-number">#0000000</span></div>
                    <div class="block-content">
                        <div class="encrypted-value">0x0000...</div>
                    </div>
                `;
                
                // Позиционируем блок в правом нижнем углу
                blockchainBlock.style.position = 'absolute';
                blockchainBlock.style.right = '10%';
                blockchainBlock.style.bottom = '10%';
                blockchainBlock.style.width = '150px';
                blockchainBlock.style.fontSize = '0.8rem';
                
                encryptionAnimation.appendChild(blockchainBlock);
            }
            
            // Запускаем анимацию сейсмических волн
            animateSeismicData(encryptionAnimation);
        }, 500);
    }
}); 