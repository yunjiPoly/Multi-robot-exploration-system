import { Service } from 'typedi';
import * as fs from 'fs';

// is a service that writes messages to a log file
// the file is created in the server/src/logs directory and is named with the mission id

@Service()
export class LoggingFilesService {


	createLogFile(missionId: number): void {
		// create a new log file with the mission number
		const logFile = `/server/src/logs/mission_${missionId}.txt`;
		fs.writeFile(logFile, '', (err) => {
			if (err) {
				console.log(err);
			}
		});
	}

	writeToLogFile(message: string, missionId: number): void {
		const logFile = `/server/src/logs/mission_${missionId}.txt`;
		fs.appendFile(logFile, `${message}\n`, (err) => {
			if (err) {
				console.log(err);
			}
		});
	}

	getLogFile(missionId: string): string {
		// read and return the log file
		const logFile = `/server/src/logs/mission_${missionId}.txt`;
		const data = fs.readFileSync(logFile, 'utf8');
		return data;
	}


	getAvailableLogs(): number[] {
		const ids: number[] = [];
		fs.readdirSync('/server/src/logs', {encoding: 'utf-8'}).forEach((file) => {
			ids.push(parseInt(file.split('_')[1].split('.')[0], 10));
		});
		return ids;
	}

}