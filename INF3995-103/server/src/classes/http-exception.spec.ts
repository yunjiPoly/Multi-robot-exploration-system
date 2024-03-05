import { expect } from 'chai';
import { HttpException } from './http-exception';
import { Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import sinon, { SinonSpy } from 'sinon';

describe('HttpException', () => {
  describe('sendError', () => {
    it('should call response.status and response.send with the right parameters', () => {
      const error = new Error('Test error');
      const response: Response = {
        status: sinon.stub().callsFake(() => response) as SinonSpy,
        send: sinon.stub().callsFake(() => response) as SinonSpy,
      } as unknown as Response;

      HttpException.sendError(error, response);

      expect((response.status as SinonSpy).calledWith(StatusCodes.INTERNAL_SERVER_ERROR)).to.be.true;
      expect((response.send as SinonSpy).calledWith({ message: error.message, status: StatusCodes.INTERNAL_SERVER_ERROR })).to.be.true;
    });

    it('should call response.status and response.send with the right parameters for HttpException', () => {
      const error = new HttpException('Test error', StatusCodes.BAD_REQUEST);
      const response: Response = {
        status: sinon.stub().callsFake(() => response) as SinonSpy,
        send: sinon.stub().callsFake(() => response) as SinonSpy,
      } as unknown as Response;

      HttpException.sendError(error, response);

      expect((response.status as SinonSpy).calledWith(StatusCodes.BAD_REQUEST)).to.be.true;
      expect((response.send as SinonSpy).calledWith({ message: error.message, status: StatusCodes.BAD_REQUEST })).to.be.true;
    });
  });
});
