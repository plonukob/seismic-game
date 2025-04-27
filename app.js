document.addEventListener('DOMContentLoaded', function() {
    // Плавная прокрутка к разделам
    window.scrollToSection = function(sectionId) {
        const section = document.getElementById(sectionId);
        if (section) {
            window.scrollTo({
                top: section.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    };

    // Инициализация Seismic Explorer
    function initSeismicExplorer() {
        // DOM Элементы
        const gameContainer = document.getElementById('seismic-explorer-game');
        const startScreen = document.getElementById('seismic-explorer-start');
        const gameInterface = gameContainer.querySelector('.game-interface');
        const startBtn = document.getElementById('seismic-explorer-start-btn');
        const connectBtn = document.getElementById('seismic-explorer-connect-btn');
        const encryptBtn = document.getElementById('seismic-encrypt-btn');
        const sendTxBtn = document.getElementById('seismic-send-tx-btn');
        const clearLogBtn = document.getElementById('seismic-clear-log-btn');
        const txTypeSelect = document.getElementById('seismic-tx-type');
        const txValueInput = document.getElementById('seismic-tx-value');
        const txLog = document.getElementById('seismic-tx-log');
        const connectionStatus = gameContainer.querySelector('.connection-status');
        const encryptionAnimation = document.getElementById('encryption-animation');
        
        // Состояние
        let isConnected = false;
        let wallet = null;
        let currentEncryption = null;
        
        // Запуск игры
        if (startBtn) {
            startBtn.addEventListener('click', startGame);
        }
        
        // Функция начала игры
        function startGame() {
            startScreen.style.display = 'none';
            gameInterface.style.display = 'block';
            initSeismicConnection();
        }
        
        // Подключение к Seismic
        function initSeismicConnection() {
            connectionStatus.textContent = 'Подключение к Seismic...';
            connectionStatus.className = 'badge bg-warning connection-status';
            
            // Загрузка библиотеки Seismic
            loadSeismicLibrary();
        }
        
        // Загрузка библиотеки Seismic
        function loadSeismicLibrary() {
            addLogEntry('Система', 'Загрузка библиотеки Seismic...');
            
            // Используем SDK для подключения
            if (window.seismicSDK) {
                seismicSDK.initialize()
                    .then(success => {
                        if (success) {
                            addLogEntry('Система', 'Подключено к Seismic Devnet');
                            connectionStatus.textContent = 'Подключено к Devnet';
                            connectionStatus.className = 'badge bg-success connection-status';
                            
                            // Проверяем цепочку
                            addLogEntry('Система', `Цепочка: ${seismicConfig.network.name} (ID: ${seismicConfig.network.chainId})`);
                            addLogEntry('Система', `RPC URL: ${seismicConfig.network.rpcUrl}`);
                            
                            // Подготовка среды визуализации
                            prepareVisualization();
                        } else {
                            addLogEntry('Ошибка', 'Не удалось инициализировать SDK');
                            connectionStatus.textContent = 'Ошибка подключения';
                            connectionStatus.className = 'badge bg-danger connection-status';
                        }
                    })
                    .catch(error => {
                        addLogEntry('Ошибка', 'Ошибка подключения к Seismic: ' + error.message);
                        connectionStatus.textContent = 'Ошибка подключения';
                        connectionStatus.className = 'badge bg-danger connection-status';
                    });
            } else {
                // Если SDK не доступен, используем имитацию (существующий код)
                setTimeout(() => {
                    addLogEntry('Система', 'Библиотека Seismic загружена (имитация)');
                    connectionStatus.textContent = 'Подключено (имитация)';
                    connectionStatus.className = 'badge bg-info connection-status';
                    prepareVisualization();
                }, 1000);
            }
        }
        
        // Подготовка среды визуализации
        function prepareVisualization() {
            // Создаем элементы для визуализации
            encryptionAnimation.innerHTML = `
                <div class="position-relative w-100 h-100">
                    <div class="tee-processor">
                        <i class="bi bi-cpu"></i>
                    </div>
                    <div class="original-data" style="opacity: 0;"></div>
                    <div class="encrypted-data" style="opacity: 0;"></div>
                    <div class="zk-proof">Verified ✓</div>
                    <div class="network-activity"></div>
                </div>
            `;
            
            // Добавляем сейсмическую анимацию волн данных
            if (typeof window.animateSeismicData === 'function') {
                window.animateSeismicData(encryptionAnimation);
            }
            
            // Добавляем обработчики событий
            connectBtn.addEventListener('click', showWalletOptions);
            encryptBtn.addEventListener('click', encryptData);
            sendTxBtn.addEventListener('click', sendTransaction);
            clearLogBtn.addEventListener('click', clearLog);
        }
        
        // Функция для отображения модального окна выбора кошелька
        function showWalletOptions() {
            if (isConnected) {
                addLogEntry('Система', 'Кошелек уже подключен');
                return;
            }

            // Создаем модальное окно, если его еще нет
            let walletModal = document.getElementById('wallet-connect-modal');
            if (!walletModal) {
                walletModal = document.createElement('div');
                walletModal.id = 'wallet-connect-modal';
                walletModal.className = 'modal fade';
                walletModal.tabIndex = '-1';
                walletModal.setAttribute('aria-labelledby', 'walletModalLabel');
                walletModal.setAttribute('aria-hidden', 'true');
                
                walletModal.innerHTML = `
                    <div class="modal-dialog modal-dialog-centered">
                        <div class="modal-content bg-dark text-light">
                            <div class="modal-header">
                                <h5 class="modal-title" id="walletModalLabel">Выберите кошелек</h5>
                                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div class="modal-body">
                                <div class="d-grid gap-2">
                                    <button id="connect-metamask" class="btn btn-outline-light d-flex align-items-center justify-content-between p-3">
                                        <span>MetaMask</span>
                                        <i class="bi bi-currency-bitcoin fs-4"></i>
                                    </button>
                                    <button id="connect-walletconnect" class="btn btn-outline-light d-flex align-items-center justify-content-between p-3">
                                        <span>WalletConnect</span>
                                        <i class="bi bi-phone fs-4"></i>
                                    </button>
                                    <button id="connect-coinbase" class="btn btn-outline-light d-flex align-items-center justify-content-between p-3">
                                        <span>Coinbase Wallet</span>
                                        <i class="bi bi-wallet2 fs-4"></i>
                                    </button>
                                    <button id="connect-demo" class="btn btn-outline-info d-flex align-items-center justify-content-between p-3">
                                        <span>Демо кошелек (без подключения)</span>
                                        <i class="bi bi-bug fs-4"></i>
                                    </button>
                                </div>
                            </div>
                            <div class="modal-footer">
                                <div class="small text-muted">
                                    Используйте демо кошелек, если у вас нет расширения для криптокошелька в браузере
                                </div>
                            </div>
                        </div>
                    </div>
                `;
                
                document.body.appendChild(walletModal);
                
                // Добавляем обработчики событий для кнопок кошельков
                document.getElementById('connect-metamask').addEventListener('click', () => {
                    connectWallet('metamask');
                    bootstrap.Modal.getInstance(walletModal).hide();
                });
                
                document.getElementById('connect-walletconnect').addEventListener('click', () => {
                    connectWallet('walletconnect');
                    bootstrap.Modal.getInstance(walletModal).hide();
                });
                
                document.getElementById('connect-coinbase').addEventListener('click', () => {
                    connectWallet('coinbase');
                    bootstrap.Modal.getInstance(walletModal).hide();
                });
                
                document.getElementById('connect-demo').addEventListener('click', () => {
                    connectWallet('demo');
                    bootstrap.Modal.getInstance(walletModal).hide();
                });
            }
            
            // Показываем модальное окно
            const modal = new bootstrap.Modal(walletModal);
            modal.show();
        }
        
        // Подключение кошелька
        function connectWallet(walletType = 'metamask') {
            if (isConnected) {
                addLogEntry('Система', 'Кошелек уже подключен');
                return;
            }
            
            addLogEntry('Система', `Подключение кошелька ${walletType}...`);
            
            // Если выбран демо-режим, сразу переходим к имитации
            if (walletType === 'demo') {
                useDemoWallet();
                return;
            }
            
            // Проверка наличия провайдера для разных кошельков
            let provider = null;
            
            switch (walletType) {
                case 'metamask':
                    provider = window.ethereum;
                    break;
                case 'walletconnect':
                    // Здесь можно добавить код для WalletConnect
                    // Для полной реализации нужно подключить библиотеку WalletConnect
                    addLogEntry('Система', 'WalletConnect в данный момент недоступен, используется демо-режим');
                    useDemoWallet();
                    return;
                case 'coinbase':
                    // Здесь можно добавить код для Coinbase Wallet
                    // Для полной реализации нужно подключить библиотеку Coinbase Wallet SDK
                    addLogEntry('Система', 'Coinbase Wallet в данный момент недоступен, используется демо-режим');
                    useDemoWallet();
                    return;
            }
            
            // Проверяем наличие провайдера
            if (!provider) {
                const walletName = walletType.charAt(0).toUpperCase() + walletType.slice(1);
                addLogEntry('Ошибка', `${walletName} не обнаружен. Убедитесь, что расширение установлено и активно`);
                addLogEntry('Система', 'Переключение в демо-режим...');
                useDemoWallet();
                return;
            }
            
            // Используем SDK для подключения кошелька
            if (window.seismicSDK) {
                seismicSDK.connect(walletType)
                    .then(connectedWallet => {
                        wallet = connectedWallet;
                        isConnected = true;
                        
                        connectBtn.textContent = 'Кошелек подключен';
                        connectBtn.classList.remove('btn-outline-light');
                        connectBtn.classList.add('btn-success');
                        
                        // Показываем кнопку фаусета
                        const faucetBtn = document.getElementById('seismic-faucet-btn');
                        if (faucetBtn) {
                            faucetBtn.style.display = 'inline-block';
                            faucetBtn.href = `${seismicConfig.network.faucet}?address=${wallet.address}`;
                        }
                        
                        addLogEntry('Система', `Кошелек подключен: ${wallet.address.substring(0, 8)}...`);
                        
                        // Получаем баланс
                        seismicSDK.getBalance()
                            .then(balance => {
                                addLogEntry('Система', `Баланс: ${balance} ETH`);
                                
                                // Предлагаем получить тестовые токены, если баланс близок к нулю
                                if (parseFloat(balance) < 0.01) {
                                    addLogEntry('Система', 'Для отправки транзакций вам потребуются тестовые токены. Используйте кнопку "Получить тестовые токены".');
                                }
                            })
                            .catch(error => {
                                console.error('Ошибка получения баланса:', error);
                            });
                    })
                    .catch(error => {
                        addLogEntry('Ошибка', `Ошибка подключения кошелька: ${error.message}`);
                        addLogEntry('Система', 'Если у вас нет расширения кошелька, используйте опцию "Демо кошелек" при подключении');
                    });
            } else {
                // Если SDK не доступен, используем имитацию
                useDemoWallet();
            }
        }

        // Функция для использования демо-кошелька
        function useDemoWallet() {
            setTimeout(() => {
                wallet = {
                    address: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F',
                    publicKey: '0x04f3d2b5ce7e65a9d63864be195738b5f76b6ebad2ce93805eda88513bc8a27a74a1e9d17c27e9f9b2c0cc13ad8c7a04f83a3aa4b64a5950c15c1845b51c0be17e',
                    type: 'demo'
                };
                
                isConnected = true;
                connectBtn.textContent = 'Демо кошелек подключен';
                connectBtn.classList.remove('btn-outline-light');
                connectBtn.classList.add('btn-info');
                
                // Показываем кнопку фаусета даже в режиме имитации
                const faucetBtn = document.getElementById('seismic-faucet-btn');
                if (faucetBtn) {
                    faucetBtn.style.display = 'inline-block';
                    faucetBtn.href = `${seismicConfig.network.faucet}?address=${wallet.address}`;
                }
                
                addLogEntry('Система', `Демо кошелек подключен: ${wallet.address.substring(0, 8)}...`);
                addLogEntry('Система', 'Используется демонстрационный режим без настоящего подключения к блокчейну');
            }, 1000);
        }
        
        // Функция шифрования данных
        function encryptData() {
            // Проверка подключения кошелька
            if (!isConnected) {
                addLogEntry('Ошибка', 'Сначала подключите кошелек');
                return;
            }
            
            // Получение значений из формы
            const dataType = txTypeSelect.value;
            const dataValue = txValueInput.value.trim();
            
            // Валидация ввода
            if (!dataValue) {
                addLogEntry('Ошибка', 'Введите значение для шифрования');
                return;
            }
            
            // Подготовка валидации по типу данных
            let isValid = true;
            let errorMsg = '';
            
            switch (dataType) {
                case 'suint':
                    if (isNaN(dataValue) || parseInt(dataValue) < 0) {
                        isValid = false;
                        errorMsg = 'suint требует положительное целое число';
                    }
                    break;
                case 'saddress':
                    if (!dataValue.startsWith('0x') || dataValue.length !== 42) {
                        isValid = false;
                        errorMsg = 'saddress требует валидный Ethereum адрес (0x...)';
                    }
                    break;
                case 'sbool':
                    if (dataValue !== 'true' && dataValue !== 'false') {
                        isValid = false;
                        errorMsg = 'sbool принимает только значения "true" или "false"';
                    }
                    break;
            }
            
            if (!isValid) {
                addLogEntry('Ошибка', errorMsg);
                return;
            }
            
            // Используем SDK для шифрования или имитируем процесс
            if (window.seismicSDK) {
                addLogEntry('Система', `Шифрование ${dataType}: ${dataValue}`);
                
                // Вызываем шифрование через SDK
                seismicSDK.encrypt(dataType, dataValue)
                    .then(encryptedData => {
                        currentEncryption = encryptedData;
                        
                        // Активируем кнопку отправки транзакции
                        sendTxBtn.disabled = false;
                        
                        // Обновляем анимацию с реальными данными
                        animateEncryption(dataType, dataValue);
                        
                        // Логируем результат - безопасно извлекаем строку для отображения
                        let encryptedString;
                        try {
                            if (typeof encryptedData.encryptedValue === 'string') {
                                encryptedString = encryptedData.encryptedValue.substring(0, 10) + '...';
                            } else if (encryptedData.encryptedValue && encryptedData.encryptedValue.toString) {
                                encryptedString = encryptedData.encryptedValue.toString().substring(0, 10) + '...';
                            } else {
                                encryptedString = JSON.stringify(encryptedData.encryptedValue).substring(0, 10) + '...';
                            }
                        } catch (e) {
                            encryptedString = '[encrypted]';
                            console.error('Ошибка форматирования зашифрованных данных:', e);
                        }
                        
                        addLogEntry('Шифрование', 
                            `Данные зашифрованы успешно`,
                            null,
                            {
                                type: dataType,
                                encryptedValue: encryptedString
                            });
                    })
                    .catch(error => {
                        addLogEntry('Ошибка', 'Ошибка шифрования: ' + error.message);
                    });
            } else {
                // Имитация шифрования для демонстрации
                setTimeout(() => {
                    // Создаем имитацию зашифрованных данных
                    const encryptedValue = generateEncryptedValue(dataType, dataValue);
                    currentEncryption = {
                        type: dataType,
                        originalValue: dataValue,
                        encryptedValue: encryptedValue
                    };
                    
                    // Активируем кнопку отправки транзакции
                    sendTxBtn.disabled = false;
                    
                    // Запускаем анимацию шифрования
                    animateEncryption(dataType, dataValue);
                    
                    // Логируем результат
                    addLogEntry('Шифрование', 
                        `Данные зашифрованы успешно`,
                        null,
                        {
                            type: dataType,
                            encryptedValue: encryptedValue.substring(0, 10) + '...'
                        });
                }, 1500);
            }
        }
        
        // Анимация процесса шифрования
        function animateEncryption(dataType, dataValue) {
            try {
                // Получаем элементы для анимации
                const originalData = encryptionAnimation.querySelector('.original-data');
                const encryptedData = encryptionAnimation.querySelector('.encrypted-data');
                const teeProcessor = encryptionAnimation.querySelector('.tee-processor');
                
                // Создаем представление исходных данных
                let dataDisplay;
                switch (dataType) {
                    case 'suint':
                        dataDisplay = `<span class="data-number">${dataValue}</span>`;
                        break;
                    case 'saddress':
                        dataDisplay = `<span class="data-address">${dataValue.substring(0, 8)}...${dataValue.substring(38)}</span>`;
                        break;
                    case 'sbool':
                        dataDisplay = `<span class="data-bool">${dataValue}</span>`;
                        break;
                    default:
                        dataDisplay = `<span class="data-text">${dataValue}</span>`;
                }
                
                // Устанавливаем исходные данные
                if (originalData) {
                    originalData.innerHTML = `
                        <div class="p-2 rounded bg-light">
                            <div class="data-label">Исходные данные (${dataType}):</div>
                            <div class="data-value">${dataDisplay}</div>
                        </div>
                    `;
                    originalData.style.opacity = '1';
                }
                
                // Анимация процессора TEE
                if (teeProcessor) {
                    teeProcessor.classList.add('active');
                    setTimeout(() => teeProcessor.classList.remove('active'), 2000);
                }
                
                // Создаем представление зашифрованных данных
                const encryptedValue = currentEncryption.encryptedValue;
                let encryptedDisplay;
                
                try {
                    // Форматируем зашифрованное значение для отображения
                    const formattedEncryption = typeof encryptedValue === 'string' 
                        ? encryptedValue.substring(0, 12) + '...' 
                        : JSON.stringify(encryptedValue).substring(0, 12) + '...';
                    
                    encryptedDisplay = `<span class="data-encrypted">${formattedEncryption}</span>`;
                } catch (e) {
                    encryptedDisplay = `<span class="data-encrypted">[encrypted]</span>`;
                }
                
                // С задержкой показываем зашифрованные данные
                setTimeout(() => {
                    if (encryptedData) {
                        encryptedData.innerHTML = `
                            <div class="p-2 rounded bg-primary text-light">
                                <div class="data-label">Зашифрованные данные:</div>
                                <div class="data-value">${encryptedDisplay}</div>
                            </div>
                        `;
                        encryptedData.style.opacity = '1';
                    }
                }, 1000);
                
                // Добавляем анимацию частиц для визуального эффекта
                if (typeof window.createEncryptionParticles === 'function') {
                    setTimeout(() => {
                        window.createEncryptionParticles(encryptionAnimation);
                    }, 500);
                }
            } catch (error) {
                console.error("Ошибка в анимации шифрования:", error);
                addLogEntry('Ошибка', 'Ошибка в анимации: ' + error.message);
            }
        }
        
        // Отправка транзакции в блокчейн
        function sendTransaction() {
            // Проверяем, есть ли зашифрованные данные
            if (!currentEncryption) {
                addLogEntry('Ошибка', 'Сначала зашифруйте данные');
                return;
            }
            
            addLogEntry('Система', 'Отправка транзакции в Seismic...');
            
            // Используем SDK для отправки или имитируем
            if (window.seismicSDK) {
                seismicSDK.sendTransaction(currentEncryption)
                    .then(result => {
                        // Показываем анимацию отправки транзакции
                        displayTransactionAnimation(
                            currentEncryption,
                            result.txHash,
                            result.blockNumber
                        );
                        
                        // Сбрасываем текущее шифрование
                        currentEncryption = null;
                        sendTxBtn.disabled = true;
                        
                        // Логируем успешную транзакцию
                        addLogEntry('Транзакция', 
                            `Транзакция отправлена и подтверждена в блоке #${result.blockNumber}`, 
                            result.txHash);
                            
                        // Добавляем ссылку на эксплорер
                        const txLink = document.createElement('a');
                        txLink.href = `${seismicConfig.network.explorer}/tx/${result.txHash}`;
                        txLink.target = '_blank';
                        txLink.textContent = 'Посмотреть в обозревателе блоков';
                        txLink.className = 'text-info d-block mt-1';
                        
                        // Находим последнюю запись в логе
                        const lastLogEntry = txLog.lastElementChild;
                        if (lastLogEntry) {
                            lastLogEntry.appendChild(txLink);
                        }
                    })
                    .catch(error => {
                        addLogEntry('Ошибка', 'Ошибка отправки транзакции: ' + error.message);
                    });
            } else {
                // Имитация процесса отправки
                setTimeout(() => {
                    // Генерируем фиктивный хеш транзакции и номер блока
                    const txHash = "0x" + Array.from({length: 64}, () => 
                        Math.floor(Math.random() * 16).toString(16)).join('');
                    const blockNumber = Math.floor(Math.random() * 1000000) + 1000000;
                    
                    // Показываем анимацию отправки
                    displayTransactionAnimation(currentEncryption, txHash, blockNumber);
                    
                    // Сбрасываем текущее шифрование
                    currentEncryption = null;
                    sendTxBtn.disabled = true;
                    
                    // Логируем успешную транзакцию
                    addLogEntry('Транзакция', 
                        `Транзакция отправлена и подтверждена в блоке #${blockNumber}`, 
                        txHash);
                }, 2000);
            }
        }
        
        // Функция для анимации отправки транзакции
        function displayTransactionAnimation(encryptedData, txHash, blockNumber) {
            // Получаем элементы для анимации
            const networkActivity = encryptionAnimation.querySelector('.network-activity');
            const blockchainBlock = encryptionAnimation.querySelector('.blockchain-block');
            
            // Активируем индикатор сетевой активности
            if (networkActivity) {
                networkActivity.classList.add('active');
                setTimeout(() => networkActivity.classList.remove('active'), 5000);
            }
            
            // Анимируем блок в блокчейне
            if (blockchainBlock) {
                blockchainBlock.classList.add('active');
                
                // Обновляем информацию в блоке
                const blockNumberElement = blockchainBlock.querySelector('.block-number');
                if (blockNumberElement) {
                    blockNumberElement.textContent = `#${blockNumber}`;
                }
                
                const txData = blockchainBlock.querySelector('.encrypted-value');
                if (txData) {
                    // Безопасно извлекаем строковое представление
                    let encryptedString;
                    try {
                        if (typeof encryptedData.encryptedValue === 'string') {
                            encryptedString = encryptedData.encryptedValue.substring(0, 6) + '...';
                        } else if (encryptedData.encryptedValue && encryptedData.encryptedValue.toString) {
                            encryptedString = encryptedData.encryptedValue.toString().substring(0, 6) + '...';
                        } else {
                            encryptedString = JSON.stringify(encryptedData.encryptedValue).substring(0, 6) + '...';
                        }
                    } catch (e) {
                        encryptedString = '[encrypted]';
                        console.error('Ошибка форматирования зашифрованных данных:', e);
                    }
                    
                    txData.textContent = encryptedString;
                }
                
                setTimeout(() => blockchainBlock.classList.remove('active'), 3000);
            }
            
            // Создаем анимацию движения данных к блокчейну
            const zkProof = encryptionAnimation.querySelector('.zk-proof');
            if (zkProof) {
                zkProof.classList.add('active');
                setTimeout(() => zkProof.classList.remove('active'), 3000);
            }
            
            // Добавляем информацию о транзакции в лог
            const txInfo = document.createElement('div');
            txInfo.className = 'mt-2 text-info';
            txInfo.innerHTML = `TX: <a href="${seismicConfig.network.explorer}/tx/${txHash}" target="_blank">${txHash}</a>`;
            
            // Находим последнюю запись в логе
            const lastLogEntry = txLog.lastElementChild;
            if (lastLogEntry) {
                lastLogEntry.appendChild(txInfo);
            }
        }
        
        // Сброс визуализации
        function resetVisualization() {
            const originalData = encryptionAnimation.querySelector('.original-data');
            const encryptedData = encryptionAnimation.querySelector('.encrypted-data');
            const zkProof = encryptionAnimation.querySelector('.zk-proof');
            
            originalData.style.opacity = '0';
            encryptedData.style.opacity = '0';
            zkProof.classList.remove('active');
            
            sendTxBtn.disabled = true;
        }
        
        // Генерация зашифрованного значения
        function generateEncryptedValue(type, value) {
            // Используем простой алгоритм для демонстрационных целей
            // В реальном приложении здесь было бы использование библиотеки Seismic
            const randomHex = Array.from({length: 64}, () => 
                Math.floor(Math.random() * 16).toString(16)
            ).join('');
            
            return '0x' + randomHex;
        }
        
        // Добавление элемента в лог
        function addLogEntry(category, message, txHash = null, encryptionData = null) {
            const entry = document.createElement('div');
            entry.className = 'log-entry';
            
            const timestamp = new Date().toLocaleTimeString();
            
            let entryHTML = `<span class="timestamp">[${timestamp}]</span> <span class="event-name">${category}:</span> ${message}`;
            
            if (txHash) {
                entryHTML += `<br><span class="tx-hash">TX: ${txHash}</span>`;
            }
            
            if (encryptionData) {
                entryHTML += `<br><span class="encrypted-value">Зашифровано: ${encryptionData.type} (${encryptionData.encryptedValue.substring(0, 14)}...)</span>`;
            }
            
            entry.innerHTML = entryHTML;
            
            // Проверка наличия начального сообщения и удаление его
            const initialMessage = txLog.querySelector('.text-secondary');
            if (initialMessage) {
                txLog.innerHTML = '';
            }
            
            // Добавление новой записи в начало лога
            txLog.insertBefore(entry, txLog.firstChild);
        }
        
        // Очистка лога
        function clearLog() {
            txLog.innerHTML = '<div class="text-secondary">Лог транзакций очищен</div>';
        }
    }
    
    // Вызвать инициализацию Seismic Explorer при загрузке страницы
    if (document.getElementById('seismic-explorer-game')) {
        initSeismicExplorer();
    }
}); 