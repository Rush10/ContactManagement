import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { Logger } from 'winston'; //for logger (1)
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston'; //for logger (1)
import { TestService } from './test.service'; //for test service
import { TestModule } from './test.module'; //for test module

describe('UserController', () => {
  let app: INestApplication;
  let logger: Logger; //init logger
  let testService: TestService; //init test service
  const basePath = '/api/users';

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, TestModule], //import app & test module
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    logger = app.get(WINSTON_MODULE_PROVIDER); //define logger
    testService = app.get(TestService); //define test service
  });

  describe('POST /api/users/v1/register', () => {
    const registerPath = '/v1/register';

    beforeEach(async () => {
      await testService.deleteUser(); //delete user if testing user still exist
    });

    afterEach(async () => {
      await testService.deleteUser(); //delete testing user that has been created or still exist
    });

    it('should be rejected if request invalid', async () => {
      //testing request
      const response = await request(app.getHttpServer())
        .post(basePath.concat(registerPath))
        .send({
          username: '',
          password: '',
          name: '',
        });

      logger.info(response.body);

      //test verification
      expect(response.status).toBe(400);
      expect(response.body.statusCode).toBe(400);
      expect(response.body.message).toBeDefined();
      expect(response.body.error).toBeDefined();
    });

    it('should be rejected if username already exist', async () => {
      await testService.createUser(); //create existing username with testing user

      //testing request
      const response = await request(app.getHttpServer())
        .post(basePath.concat(registerPath))
        .send({
          username: 'test username',
          password: 'test password',
          name: 'test name',
        });

      logger.info(response.body);

      //test verification
      expect(response.status).toBe(400);
      expect(response.body.statusCode).toBe(400);
      expect(response.body.message).toBeDefined();
      expect(response.body.error).toBeDefined();
    });

    it('should be able to register', async () => {
      //testing request
      const response = await request(app.getHttpServer())
        .post(basePath.concat(registerPath))
        .send({
          username: 'test username',
          password: 'test password',
          name: 'test name',
        });

      logger.info(response.body);

      //test verification
      expect(response.status).toBe(200);
      expect(response.body.statusCode).toBe(200);
      expect(response.body.message).toBeDefined();
      expect(response.body.data.username).toBe('test username');
      expect(response.body.data.name).toBe('test name');
    });
  });

  describe('POST /api/users/v1/login', () => {
    const loginPath = '/v1/login';

    beforeEach(async () => {
      await testService.deleteUser(); //delete user if testing user still exist
      await testService.createUser(); //create testing user
    });

    afterEach(async () => {
      await testService.deleteUser(); //delete testing user that has been created or still exist
    });

    it('should be rejected if request invalid', async () => {
      //testing request
      const response = await request(app.getHttpServer())
        .post(basePath.concat(loginPath))
        .send({
          username: '',
          password: '',
        });

      logger.info(response.body);

      //test verification
      expect(response.status).toBe(400);
      expect(response.body.statusCode).toBe(400);
      expect(response.body.message).toBeDefined();
      expect(response.body.error).toBeDefined();
    });

    it('should be rejected if wrong username', async () => {
      //testing request
      const response = await request(app.getHttpServer())
        .post(basePath.concat(loginPath))
        .send({
          username: 'test wrong username',
          password: 'test password',
        });

      logger.info(response.body);

      //test verification
      expect(response.status).toBe(401);
      expect(response.body.statusCode).toBe(401);
      expect(response.body.message).toBeDefined();
      expect(response.body.error).toBeDefined();
    });

    it('should be rejected if wrong password', async () => {
      //testing request
      const response = await request(app.getHttpServer())
        .post(basePath.concat(loginPath))
        .send({
          username: 'test username',
          password: 'test wrong password',
        });

      logger.info(response.body);

      //test verification
      expect(response.status).toBe(401);
      expect(response.body.statusCode).toBe(401);
      expect(response.body.message).toBeDefined();
      expect(response.body.error).toBeDefined();
    });

    it('should be able to login', async () => {
      //testing request
      const response = await request(app.getHttpServer())
        .post(basePath.concat(loginPath))
        .send({
          username: 'test username',
          password: 'test password',
        });

      logger.info(response.body);

      //test verification
      expect(response.status).toBe(200);
      expect(response.body.statusCode).toBe(200);
      expect(response.body.message).toBeDefined();
      expect(response.body.data.username).toBe('test username');
      expect(response.body.data.name).toBe('test name');
      expect(response.body.data.token).toBeDefined();
    });
  });

  describe('GET /api/users/v1/current', () => {
    const getPath = '/v1/current';

    beforeEach(async () => {
      await testService.deleteUser(); //delete user if testing user still exist
      await testService.createUser(); //create testing user
    });

    afterEach(async () => {
      await testService.deleteUser(); //delete testing user that has been created or still exist
    });

    it('should be rejected if token invalid', async () => {
      //testing request
      const response = await request(app.getHttpServer())
        .get(basePath.concat(getPath))
        .set('Authorization', 'test wrong token');

      logger.info(response.body);

      //test verification
      expect(response.status).toBe(401);
      expect(response.body.statusCode).toBe(401);
      expect(response.body.message).toBeDefined();
      expect(response.body.error).toBeDefined();
    });

    it('should be able to get current user', async () => {
      //testing request
      const response = await request(app.getHttpServer())
        .get(basePath.concat(getPath))
        .set('Authorization', 'test token');

      logger.info(response.body);

      //test verification
      expect(response.status).toBe(200);
      expect(response.body.statusCode).toBe(200);
      expect(response.body.message).toBeDefined();
      expect(response.body.data.username).toBe('test username');
      expect(response.body.data.name).toBe('test name');
    });
  });

  describe('PATCH /api/users/v1/current', () => {
    const updatePath = '/v1/current';

    beforeEach(async () => {
      await testService.deleteUser(); //delete user if testing user still exist
      await testService.createUser(); //create testing user
    });

    afterEach(async () => {
      await testService.deleteUser(); //delete testing user that has been created or still exist
    });

    it('should be rejected if token invalid', async () => {
      //testing request
      const response = await request(app.getHttpServer())
        .patch(basePath.concat(updatePath))
        .set('Authorization', 'test wrong token')
        .send({
          password: 'test change password',
          name: 'test change name',
        });

      logger.info(response.body);

      //test verification
      expect(response.status).toBe(401);
      expect(response.body.statusCode).toBe(401);
      expect(response.body.message).toBeDefined();
      expect(response.body.error).toBeDefined();
    });

    it('should be rejected if request invalid', async () => {
      //testing request
      const response = await request(app.getHttpServer())
        .patch(basePath.concat(updatePath))
        .set('Authorization', 'test token')
        .send({
          password: '',
          name: '',
        });

      logger.info(response.body);

      //test verification
      expect(response.status).toBe(400);
      expect(response.body.statusCode).toBe(400);
      expect(response.body.message).toBeDefined();
      expect(response.body.error).toBeDefined();
    });

    it('should be able to update name', async () => {
      //testing request
      const response = await request(app.getHttpServer())
        .patch(basePath.concat(updatePath))
        .set('Authorization', 'test token')
        .send({
          password: 'test password',
          name: 'test change name',
        });

      logger.info(response.body);

      //test verification
      expect(response.status).toBe(200);
      expect(response.body.statusCode).toBe(200);
      expect(response.body.message).toBeDefined();
      expect(response.body.data.username).toBe('test username');
      expect(response.body.data.name).toBe('test change name');
    });

    it('should be able to update password', async () => {
      //testing request
      let response = await request(app.getHttpServer())
        .patch(basePath.concat(updatePath))
        .set('Authorization', 'test token')
        .send({
          password: 'test change password',
          name: 'test name',
        });

      logger.info(response.body);

      //test verification
      expect(response.status).toBe(200);
      expect(response.body.statusCode).toBe(200);
      expect(response.body.message).toBeDefined();
      expect(response.body.data.username).toBe('test username');
      expect(response.body.data.name).toBe('test name');

      response = await request(app.getHttpServer())
        .post(basePath.concat('/v1/login'))
        .send({
          username: 'test username',
          password: 'test change password',
        });
      logger.info(response.body);
      expect(response.status).toBe(200);
      expect(response.body.statusCode).toBe(200);
      expect(response.body.message).toBeDefined();
      expect(response.body.data.username).toBe('test username');
      expect(response.body.data.name).toBe('test name');
      expect(response.body.data.token).toBeDefined();
    });
  });

  describe('DELETE /api/users/v1/current', () => {
    const deletePath = '/v1/current';

    beforeEach(async () => {
      await testService.deleteUser(); //delete user if testing user still exist
      await testService.createUser(); //create testing user
    });

    afterEach(async () => {
      await testService.deleteUser(); //delete testing user that has been created or still exist
    });

    it('should be rejected if token invalid', async () => {
      //testing request
      const response = await request(app.getHttpServer())
        .delete(basePath.concat(deletePath))
        .set('Authorization', 'test wrong token');

      logger.info(response.body);

      //test verification
      expect(response.status).toBe(401);
      expect(response.body.statusCode).toBe(401);
      expect(response.body.message).toBeDefined();
      expect(response.body.error).toBeDefined();
    });

    it('should be able to logout', async () => {
      //testing request
      const response = await request(app.getHttpServer())
        .delete(basePath.concat(deletePath))
        .set('Authorization', 'test token');

      logger.info(response.body);

      //test verification
      expect(response.status).toBe(200);
      expect(response.body.statusCode).toBe(200);
      expect(response.body.message).toBeDefined();
      expect(response.body.data).toBe(true);

      const user = await testService.getUser();
      expect(user.token).toBeNull();
    });
  });
});
