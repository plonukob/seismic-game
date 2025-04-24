/**
 * Seismic SDK for interacting with Seismic blockchain
 * This mock implementation simulates blockchain interactions
 * using localStorage for persistence
 */

interface GameData {
  player: Player;
  artifact: Artifact;
  achievements?: string[];
}

interface Player {
  x: number;
  y: number;
  direction: string;
  steps: number;
  movements: { x: number, y: number }[];
}

interface Artifact {
  x: number;
  y: number;
  found: boolean;
}

interface Transaction {
  type: string;
  data: any;
  timestamp: number;
  blockNumber?: number;
  confirmed?: boolean;
  action?: string;
}

interface User {
  name: string;
  id: string;
}

interface PlayerStatistics {
  movements?: number;
  distance?: number;
  path?: Array<{x: number, y: number}>;
}

class SeismicSDK {
  private userName: string | null = null;
  private transactions: Transaction[] = [];
  private isDevnetConnected: boolean = false;
  private readonly STORAGE_KEY = 'seismic_game_data';
  private readonly TX_STORAGE_KEY = 'seismic_transactions';
  private eventListeners: { [key: string]: Function[] } = {};
  
  // Add data namespace for method organization
  public data = {
    get: async (): Promise<GameData> => {
      const gameData = await this.getGameData();
      if (gameData) {
        // Simulate transaction
        this.logTransaction('DATA_RESPONSE', { action: 'DATA_RESPONSE' });
        return gameData;
      }
      
      // Return default data if nothing is saved
      return {
        player: {
          x: 7,
          y: 7,
          direction: 'down',
          steps: 0,
          movements: []
        },
        artifact: {
          x: Math.floor(Math.random() * 13) + 1,
          y: Math.floor(Math.random() * 13) + 1,
          found: false
        },
        achievements: []
      };
    },
    
    getStats: async (): Promise<PlayerStatistics> => {
      const gameData = await this.getGameData();
      if (!gameData || !gameData.player) {
        return {
          movements: 0,
          distance: 0,
          path: []
        };
      }
      
      // Calculate distance from movements
      let distance = 0;
      const movements = gameData.player.movements;
      const path = [...movements];
      
      for (let i = 1; i < movements.length; i++) {
        const prev = movements[i-1];
        const curr = movements[i];
        const dx = curr.x - prev.x;
        const dy = curr.y - prev.y;
        distance += Math.sqrt(dx*dx + dy*dy);
      }
      
      // Log transaction for stats retrieval
      this.logTransaction('GET_PLAYER_STATS', { action: 'DATA_RESPONSE' });
      
      return {
        movements: gameData.player.steps,
        distance,
        path
      };
    }
  };

  constructor() {
    this.loadTransactions();
  }

  /**
   * Initialize connection with username
   */
  public async connect(userName: string): Promise<boolean> {
    return new Promise((resolve) => {
      setTimeout(() => {
        this.userName = userName;
        localStorage.setItem('seismic_username', userName);
        this.isDevnetConnected = true;
        resolve(true);
      }, 1000);
    });
  }

  /**
   * Disconnect user session
   */
  public disconnect(): void {
    this.userName = null;
    this.isDevnetConnected = false;
    localStorage.removeItem('seismic_username');
  }

  /**
   * Check if user is connected
   */
  public isConnected(): boolean {
    if (!this.userName) {
      const storedUsername = localStorage.getItem('seismic_username');
      if (storedUsername) {
        this.userName = storedUsername;
        this.isDevnetConnected = true;
        return true;
      }
      return false;
    }
    return this.isDevnetConnected;
  }
  
  /**
   * Check if user is logged in (alias for isConnected)
   */
  public isLoggedIn(): boolean {
    return this.isConnected();
  }
  
  /**
   * Login user with simulated login process
   */
  public async login(): Promise<User> {
    const defaultName = 'Player' + Math.floor(Math.random() * 1000);
    return new Promise((resolve) => {
      setTimeout(() => {
        this.userName = defaultName;
        localStorage.setItem('seismic_username', defaultName);
        this.isDevnetConnected = true;
        this.logTransaction('LOGIN', { userName: defaultName });
        resolve({ name: defaultName, id: 'user_' + Date.now() });
      }, 1000);
    });
  }
  
  /**
   * Logout user
   */
  public async logout(): Promise<boolean> {
    return new Promise((resolve) => {
      setTimeout(() => {
        this.logTransaction('LOGOUT', { userName: this.userName });
        this.disconnect();
        resolve(true);
      }, 500);
    });
  }
  
  /**
   * Get user object
   */
  public getUser(): User | null {
    if (!this.userName) return null;
    return {
      name: this.userName,
      id: 'user_' + this.userName
    };
  }

  /**
   * Get currently connected username
   */
  public getUsername(): string | null {
    return this.userName;
  }
  
  /**
   * Get connection info for DevnetSetup component
   */
  public getConnectionInfo() {
    return {
      connected: this.isDevnetConnected,
      network: 'Seismic Devnet',
      chainId: 3330,
      contractAddress: this.isDevnetConnected ? '0x1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t' : '0x0000000000000000000000000000000000000000'
    };
  }
  
  /**
   * Get network stats for BlockchainInfo component
   */
  public async getNetworkStats() {
    return {
      blockHeight: Math.floor(Math.random() * 10000000) + 5000000,
      transactionsPerSecond: Math.floor(Math.random() * 200) + 800,
      activeNodes: Math.floor(Math.random() * 50) + 150,
      encryptionStrength: '256-bit FHE',
      networkLatency: Math.floor(Math.random() * 50) + 50 + 'ms'
    };
  }
  
  /**
   * Get transaction log for components
   */
  public getTransactionLog() {
    return this.transactions;
  }
  
  /**
   * Subscribe to events
   */
  public on(event: string, callback: Function) {
    if (!this.eventListeners[event]) {
      this.eventListeners[event] = [];
    }
    this.eventListeners[event].push(callback);
    
    // Return unsubscribe function
    return () => {
      this.eventListeners[event] = this.eventListeners[event].filter(cb => cb !== callback);
    };
  }

  /**
   * Save game data to blockchain (simulated)
   */
  public async saveGameData(data: GameData): Promise<boolean> {
    if (!this.userName) return false;

    return new Promise((resolve) => {
      setTimeout(() => {
        try {
          const storageKey = `${this.STORAGE_KEY}_${this.userName}`;
          localStorage.setItem(storageKey, JSON.stringify(data));
          
          // Log transaction
          this.logTransaction('SAVE_GAME_DATA', { ...data, action: 'DATA_UPDATE_COMPLETE' });
          
          resolve(true);
        } catch (error) {
          console.error('Failed to save game data:', error);
          resolve(false);
        }
      }, 300); // Simulated blockchain delay
    });
  }

  /**
   * Get game data from blockchain (simulated)
   */
  public async getGameData(): Promise<GameData | null> {
    if (!this.userName) return null;

    return new Promise((resolve) => {
      setTimeout(() => {
        try {
          const storageKey = `${this.STORAGE_KEY}_${this.userName}`;
          const data = localStorage.getItem(storageKey);
          
          if (data) {
            // Log transaction
            this.logTransaction('GET_GAME_DATA');
            resolve(JSON.parse(data));
          } else {
            resolve(null);
          }
        } catch (error) {
          console.error('Failed to get game data:', error);
          resolve(null);
        }
      }, 300); // Simulated blockchain delay
    });
  }

  /**
   * Log transaction to blockchain (simulated)
   */
  public logTransaction(type: string, data: any = {}): void {
    const transaction: Transaction = {
      type,
      data,
      timestamp: Date.now(),
      action: data.action || type
    };

    // Add to transactions list
    this.transactions.push(transaction);
    
    // Trigger event listeners
    if (this.eventListeners['transaction']) {
      this.eventListeners['transaction'].forEach(callback => {
        callback(transaction);
      });
    }
    
    // Simulate block confirmation after delay
    setTimeout(() => {
      const index = this.transactions.findIndex(
        (tx) => tx.timestamp === transaction.timestamp
      );
      
      if (index !== -1) {
        this.transactions[index].confirmed = true;
        this.transactions[index].blockNumber = Math.floor(Math.random() * 1000000) + 1;
        this.saveTransactions();
        
        // Trigger event listeners for confirmation
        if (this.eventListeners['transaction']) {
          this.eventListeners['transaction'].forEach(callback => {
            callback({...this.transactions[index], action: 'TRANSACTION_CONFIRMED'});
          });
        }
      }
    }, 2000);

    this.saveTransactions();
  }

  /**
   * Get all transactions
   */
  public getTransactions(): Transaction[] {
    return this.transactions;
  }

  /**
   * Setup connection to Seismic Devnet
   */
  public async setupDevnetConnection(): Promise<boolean> {
    return new Promise((resolve) => {
      setTimeout(() => {
        this.isDevnetConnected = true;
        
        // Trigger event listeners
        if (this.eventListeners['transaction']) {
          this.eventListeners['transaction'].forEach(callback => {
            callback({
              type: 'DEVNET_CONNECTED',
              action: 'DEVNET_CONNECTED',
              data: {},
              timestamp: Date.now()
            });
          });
        }
        
        resolve(true);
      }, 2000); // Simulate connection setup time
    });
  }

  /**
   * Check if Devnet is available
   */
  public async isDevnetAvailable(): Promise<boolean> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(true);
      }, 500);
    });
  }

  /**
   * Save transactions to localStorage
   */
  private saveTransactions(): void {
    try {
      localStorage.setItem(this.TX_STORAGE_KEY, JSON.stringify(this.transactions));
    } catch (error) {
      console.error('Failed to save transactions:', error);
    }
  }

  /**
   * Load transactions from localStorage
   */
  private loadTransactions(): void {
    try {
      const transactions = localStorage.getItem(this.TX_STORAGE_KEY);
      if (transactions) {
        this.transactions = JSON.parse(transactions);
      }
    } catch (error) {
      console.error('Failed to load transactions:', error);
    }
  }
}

// Export singleton instance
export const seismic = new SeismicSDK(); 