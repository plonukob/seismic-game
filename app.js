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

    // Изменение полей формы в зависимости от типа транзакции
    const txTypeSelect = document.getElementById('tx-type');
    if (txTypeSelect) {
        txTypeSelect.addEventListener('change', function() {
            const paymentFields = document.getElementById('payment-fields');
            const nftFields = document.getElementById('nft-fields');
            const voteFields = document.getElementById('vote-fields');
            
            paymentFields.style.display = 'none';
            nftFields.style.display = 'none';
            voteFields.style.display = 'none';
            
            switch(this.value) {
                case 'payment':
                    paymentFields.style.display = 'block';
                    break;
                case 'nft':
                    nftFields.style.display = 'block';
                    break;
                case 'vote':
                    voteFields.style.display = 'block';
                    break;
            }
        });
    }

    // Обработка кнопки генерации транзакции
    const generateTxBtn = document.getElementById('generate-tx-btn');
    if (generateTxBtn) {
        generateTxBtn.addEventListener('click', generateTransaction);
    }

    // Функция генерации транзакции
    function generateTransaction() {
        const txType = document.getElementById('tx-type').value;
        const useEncryption = document.getElementById('use-encryption').checked;
        
        // Получение значений из формы в зависимости от типа транзакции
        let txData = {};
        switch(txType) {
            case 'payment':
                txData = {
                    recipient: document.getElementById('recipient').value,
                    amount: document.getElementById('amount').value
                };
                break;
            case 'nft':
                txData = {
                    recipient: document.getElementById('nft-recipient').value,
                    tokenId: document.getElementById('token-id').value
                };
                break;
            case 'vote':
                txData = {
                    proposalId: document.getElementById('proposal').value,
                    choice: document.getElementById('vote-choice').value === '1'
                };
                break;
        }
        
        // Генерация и отображение транзакций
        displayPublicTransaction(txType, txData);
        if (useEncryption) {
            displayEncryptedTransaction(txType, txData);
        } else {
            // Очистить зашифрованную транзакцию, если шифрование отключено
            document.getElementById('encrypted-tx-output').textContent = 'Шифрование Seismic отключено';
        }
    }

    // Отображение публичной транзакции
    function displayPublicTransaction(txType, data) {
        const output = document.getElementById('public-tx-output');
        let txContent = '';
        
        switch(txType) {
            case 'payment':
                txContent = generatePaymentTransaction(data, false);
                break;
            case 'nft':
                txContent = generateNftTransaction(data, false);
                break;
            case 'vote':
                txContent = generateVoteTransaction(data, false);
                break;
        }
        
        output.innerHTML = txContent;
    }

    // Отображение зашифрованной транзакции
    function displayEncryptedTransaction(txType, data) {
        const output = document.getElementById('encrypted-tx-output');
        let txContent = '';
        
        switch(txType) {
            case 'payment':
                txContent = generatePaymentTransaction(data, true);
                break;
            case 'nft':
                txContent = generateNftTransaction(data, true);
                break;
            case 'vote':
                txContent = generateVoteTransaction(data, true);
                break;
        }
        
        output.innerHTML = txContent;
    }

    // Генерация транзакции платежа
    function generatePaymentTransaction(data, encrypted) {
        const { recipient, amount } = data;
        
        // Генерация хэша для имитации данных транзакции
        const functionHash = '0x7c26101e'; // Хэш фукнции transfer(address,uint256)
        const functionHashEncrypted = '0x9e8c1a2f'; // Хэш функции transfer(saddress,suint256)
        
        // Публичная транзакция
        if (!encrypted) {
            const recipientPadded = recipient.slice(2).padStart(64, '0');
            const amountHex = parseInt(amount).toString(16).padStart(64, '0');
            
            return `// Публичная транзакция - ВИДИМАЯ ДЛЯ ВСЕХ
{
  "from": "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
  "to": "0x89205A3A3b2A69De6Dbf7f01ED13B2108B2c43e7", // Контракт платежей
  "data": "${functionHash}000000000000000000000000${recipient.slice(2)}${amountHex}",
  "value": "0",
  "gasLimit": "210000",
  "function": "transfer(address to, uint256 amount)",
  "parameters": {
    "to": "${recipient}",
    "amount": "${amount}"
  }
}`;
        } 
        // Зашифрованная транзакция Seismic
        else {
            // Генерируем случайную последовательность для имитации зашифрованных данных
            const encryptedData = generateRandomHex(512);
            
            return `// Зашифрованная транзакция Seismic - ПРИВАТНАЯ
{
  "from": "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
  "to": "0x89205A3A3b2A69De6Dbf7f01ED13B2108B2c43e7", // Контракт платежей
  "data": "${functionHashEncrypted}${encryptedData}",
  "value": "0",
  "gasLimit": "240000",
  "function": "transfer(saddress to, suint256 amount)",
  "parameters": {
    "to": "ЗАШИФРОВАНО", // Значение: ${recipient}
    "amount": "ЗАШИФРОВАНО" // Значение: ${amount}
  },
  "encryptionPubkey": "0x04f3d2b5ce7e65a9d63864be195738b5f76b6ebad2ce93805eda88513bc8a27a74a1e9d17c27e9f9b2c0cc13ad8c7a04f83a3aa4b64a5950c15c1845b51c0be17e"
}`;
        }
    }

    // Генерация транзакции NFT
    function generateNftTransaction(data, encrypted) {
        const { recipient, tokenId } = data;
        
        // Генерация хэша для имитации данных транзакции
        const functionHash = '0x42842e0e'; // Хэш фукнции safeTransferFrom(address,address,uint256)
        const functionHashEncrypted = '0x8737c5ef'; // Хэш функции safeTransferFrom(address,saddress,uint256)
        
        // Публичная транзакция
        if (!encrypted) {
            const senderPadded = '71C7656EC7ab88b098defB751B7401B5f6d8976F'.padStart(64, '0');
            const recipientPadded = recipient.slice(2).padStart(64, '0');
            const tokenIdHex = parseInt(tokenId).toString(16).padStart(64, '0');
            
            return `// Публичная транзакция NFT - ВИДИМАЯ ДЛЯ ВСЕХ
{
  "from": "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
  "to": "0x3B1A05d8B7842bE8E8F6A36a17CB87A191E0b5Ad", // Контракт NFT
  "data": "${functionHash}000000000000000000000000${senderPadded}000000000000000000000000${recipientPadded}${tokenIdHex}",
  "value": "0",
  "gasLimit": "250000",
  "function": "safeTransferFrom(address from, address to, uint256 tokenId)",
  "parameters": {
    "from": "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
    "to": "${recipient}",
    "tokenId": "${tokenId}"
  }
}`;
        } 
        // Зашифрованная транзакция Seismic
        else {
            // Генерируем случайную последовательность для имитации зашифрованных данных
            const encryptedData = generateRandomHex(512);
            
            return `// Зашифрованная транзакция NFT Seismic - ПРИВАТНАЯ
{
  "from": "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
  "to": "0x3B1A05d8B7842bE8E8F6A36a17CB87A191E0b5Ad", // Контракт NFT
  "data": "${functionHashEncrypted}${encryptedData}",
  "value": "0",
  "gasLimit": "290000",
  "function": "safeTransferFrom(address from, saddress to, uint256 tokenId)",
  "parameters": {
    "from": "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
    "to": "ЗАШИФРОВАНО", // Значение: ${recipient}
    "tokenId": "${tokenId}"
  },
  "encryptionPubkey": "0x04f3d2b5ce7e65a9d63864be195738b5f76b6ebad2ce93805eda88513bc8a27a74a1e9d17c27e9f9b2c0cc13ad8c7a04f83a3aa4b64a5950c15c1845b51c0be17e"
}`;
        }
    }

    // Генерация транзакции голосования
    function generateVoteTransaction(data, encrypted) {
        const { proposalId, choice } = data;
        
        // Генерация хэша для имитации данных транзакции
        const functionHash = '0xc9d27afe'; // Хэш фукнции vote(uint256,bool)
        const functionHashEncrypted = '0xe69b5789'; // Хэш функции vote(uint256,sbool)
        
        // Публичная транзакция
        if (!encrypted) {
            const proposalIdHex = parseInt(proposalId).toString(16).padStart(64, '0');
            const choiceHex = choice ? '1'.padStart(64, '0') : '0'.padStart(64, '0');
            
            return `// Публичная транзакция голосования - ВИДИМАЯ ДЛЯ ВСЕХ
{
  "from": "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
  "to": "0xA0D4E5CcB74dC2ad7cA47a176260a741f72CEe4d", // Контракт голосования
  "data": "${functionHash}${proposalIdHex}${choiceHex}",
  "value": "0",
  "gasLimit": "180000",
  "function": "vote(uint256 proposalId, bool choice)",
  "parameters": {
    "proposalId": "${proposalId}",
    "choice": "${choice ? 'true (ЗА)' : 'false (ПРОТИВ)'}"
  }
}`;
        } 
        // Зашифрованная транзакция Seismic
        else {
            // Генерируем случайную последовательность для имитации зашифрованных данных
            const encryptedData = generateRandomHex(512);
            
            return `// Зашифрованная транзакция голосования Seismic - ПРИВАТНАЯ
{
  "from": "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
  "to": "0xA0D4E5CcB74dC2ad7cA47a176260a741f72CEe4d", // Контракт голосования
  "data": "${functionHashEncrypted}${proposalId.padStart(64, '0')}${encryptedData}",
  "value": "0",
  "gasLimit": "200000",
  "function": "vote(uint256 proposalId, sbool choice)",
  "parameters": {
    "proposalId": "${proposalId}",
    "choice": "ЗАШИФРОВАНО" // Значение: ${choice ? 'true (ЗА)' : 'false (ПРОТИВ)'}
  },
  "encryptionPubkey": "0x04f3d2b5ce7e65a9d63864be195738b5f76b6ebad2ce93805eda88513bc8a27a74a1e9d17c27e9f9b2c0cc13ad8c7a04f83a3aa4b64a5950c15c1845b51c0be17e"
}`;
        }
    }

    // Генерация случайной шестнадцатеричной строки
    function generateRandomHex(length) {
        const hexChars = '0123456789abcdef';
        let result = '';
        for (let i = 0; i < length; i++) {
            result += hexChars.charAt(Math.floor(Math.random() * hexChars.length));
        }
        return result;
    }
}); 