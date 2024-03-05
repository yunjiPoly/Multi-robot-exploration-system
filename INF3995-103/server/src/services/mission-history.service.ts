import { Service } from 'typedi';
import MissionService from '../services/mission.service';
import DatabaseService from './database.service';
@Service()
export class MissionHistoryService {
    
    constructor( private missionService: MissionService, private databaseService: DatabaseService) { }
    
    async saveMission(): Promise<void> {
        try{
            await this.databaseService.addMission(
                this.missionService.getMissionId(), 
                this.missionService.getMissionType(),
                this.missionService.getTime(), 
                parseFloat(this.missionService.getDistance().toFixed(3)),
                this.missionService.getRobotNamesAsString()
            );
        } catch(err) {
            console.log(err);
        }
        
    }
}