import { expect } from 'chai';
import { Database } from 'sqlite3';
import sinon, { SinonStubbedInstance } from 'sinon';
import DatabaseService from './database.service';

describe('DatabaseService', () => {
  let dbStub: SinonStubbedInstance<Database>;
  let databaseService: DatabaseService;

  beforeEach(() => {
    dbStub = sinon.createStubInstance(Database);
    databaseService = new DatabaseService(dbStub);
    databaseService['db'] = dbStub;
  });

  afterEach(() => {
    sinon.restore();
  });

  describe('constructor', () => {
    it('should create a new instance of DatabaseService', () => {
      expect(databaseService['db']).to.be.an.instanceof(Database);
      expect(databaseService['db']).to.equal(dbStub);
    });
  });
});
