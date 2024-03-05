import { Service } from 'typedi';
import { Database } from 'sqlite3';
import { MissionType } from '../classes/mission';

const DB_SQLITE_FILE_NAME = './src/database/db.sqlite';

@Service()
export default class DatabaseService {
  private db: Database;
    
  constructor(db?: Database | undefined) {
    if (db) {
      this.db = db;
    } else {
      this.db = new Database(DB_SQLITE_FILE_NAME, (err) => {
        if (err) {
          console.error(err.message);
        } else {
          console.log('Connected to the database.');
        }
      });
    }
    this.createDB();
  }

  get database(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.db.all('SELECT * FROM Mission', (err: Error | null, rows: any) => {
        if (err) { 
            reject(err);
        }
        resolve(rows);
      });
    });
  }
    
  async createDB(): Promise<void> {
    this.db.exec( `CREATE TABLE IF NOT EXISTS Mission(
      id INTEGER PRIMARY KEY,
      time TEXT,
      type TEXT,
      robots TEXT,
      distance REAL,
      date TEXT
      );`, (err) => {
        if (err) {
          console.error(err.message);
        }         
    }); 
  }

  async addMission(id: number, type: MissionType | null, time: string, distance: number, robotsAsString: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (isNaN(id)) {
        throw new Error('The id given was not a number');
      }
      if (type === null){
        throw new Error('The type given cannot be null');
      }
      if (isNaN(distance)) {
        throw new Error('Distance should be a number');
      }
      if (/[^a-zA-Z0-9_.:/ ]/.test(time)) {
        throw new Error('Time should only contain characthers related to time or alhpanumerical characters');
      }
      const date: string = new Date().toLocaleString().replace(/[,]/, '');

      this.db.run(`INSERT INTO mission(id, time, type, robots, date, distance) 
        VALUES(?, ?, ?, ?, ?, ?);`, [id, time, type, robotsAsString, date, distance], (err) => {
        if (err) {
          reject(err);
        }
        console.log('Inserted data in database');
        resolve();
      });
    });
  }

  async deleteMission(id: number): Promise<void> {
    if(isNaN(id)) {
      throw new Error('The id sent was not a number');
    }
    this.db.run('DELETE FROM mission WHERE id = ?;',[id], (err) => {
      if (err) {
        console.error(err.message);
      } else {
        console.log('Sucessfuly deleted data in database');
      }
    });
  }

  close(): void {
    this.db.close();
  }

}


