import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { Logger } from 'winston'; //for logger (1)
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston'; //for logger (1)
import { TestService } from './test.service'; //for test service
import { TestModule } from './test.module'; //for test module

describe('ContactController', () => {
  let app: INestApplication;
  let logger: Logger; //init logger
  let testService: TestService; //init test service
  const basePath = '/api/contacts';

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, TestModule], //import app & test module
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    logger = app.get(WINSTON_MODULE_PROVIDER); //define logger
    testService = app.get(TestService); //define test service
  });

  describe('POST /api/contacts/v1', () => {
    const createPath = '/v1';

    beforeEach(async () => {
      await testService.deleteContact(); //delete contact if contact user still exist
      await testService.deleteUser(); //delete user if testing user still exist
      await testService.createUser(); //create testing user
    });

    afterEach(async () => {
      await testService.deleteContact(); //delete contact user that has been created or still exist
      await testService.deleteUser(); //delete testing user that has been created or still exist
    });

    it('should be rejected if token invalid', async () => {
      //testing request
      const response = await request(app.getHttpServer())
        .post(basePath.concat(createPath))
        .set('Authorization', 'test wrong token')
        .send({
          first_name: 'test first name',
          last_name: 'test last name',
          email: 'test@email.com',
          phone: 'test phone',
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
        .post(basePath.concat(createPath))
        .set('Authorization', 'test token')
        .send({
          first_name: '',
          last_name: '',
          email: '',
          phone: '',
        });

      logger.info(response.body);

      //test verification
      expect(response.status).toBe(400);
      expect(response.body.statusCode).toBe(400);
      expect(response.body.message).toBeDefined();
      expect(response.body.error).toBeDefined();
    });

    it('should be able to create contact', async () => {
      //testing request
      const response = await request(app.getHttpServer())
        .post(basePath.concat(createPath))
        .set('Authorization', 'test token')
        .send({
          first_name: 'test first name',
          last_name: 'test last name',
          email: 'test@mail.com',
          phone: 'test phone',
        });

      logger.info(response.body);

      //test verification
      expect(response.status).toBe(201);
      expect(response.body.statusCode).toBe(201);
      expect(response.body.message).toBeDefined();
      expect(response.body.data.id).toBeDefined();
      expect(response.body.data.first_name).toBe('test first name');
      expect(response.body.data.last_name).toBe('test last name');
      expect(response.body.data.email).toBe('test@mail.com');
      expect(response.body.data.phone).toBe('test phone');
    });
  });

  describe('GET /api/contacts/v1/:contactId', () => {
    const getPath = '/v1';

    beforeEach(async () => {
      await testService.deleteContact(); //delete contact if contact user still exist
      await testService.deleteUser(); //delete user if testing user still exist
      await testService.createUser(); //create testing user
      await testService.createContact(1); //create contact for testing user
    });

    afterEach(async () => {
      await testService.deleteContact(); //delete contact user that has been created or still exist
      await testService.deleteUser(); //delete testing user that has been created or still exist
    });

    it('should be rejected if token invalid', async () => {
      const contact = await testService.getContact(); //get contact data
      const reqParam = contact.id; //init request

      //testing request
      const response = await request(app.getHttpServer())
        .get(`${basePath.concat(getPath)}/${reqParam}`)
        .set('Authorization', 'test wrong token');

      logger.info(response.body);

      //test verification
      expect(response.status).toBe(401);
      expect(response.body.statusCode).toBe(401);
      expect(response.body.message).toBeDefined();
      expect(response.body.error).toBeDefined();
    });

    it('should be rejected if request invalid', async () => {
      const reqParam = 'abcde'; //init request

      //testing request
      const response = await request(app.getHttpServer())
        .get(`${basePath.concat(getPath)}/${reqParam}`)
        .set('Authorization', 'test token');

      logger.info(response.body);

      //test verification
      expect(response.status).toBe(400);
      expect(response.body.statusCode).toBe(400);
      expect(response.body.message).toBeDefined();
      expect(response.body.error).toBeDefined();
    });

    it('should be rejected if contact is not found', async () => {
      const contact = await testService.getContact(); //get contact data
      const reqParam = contact.id + 1; //init request

      //testing request
      const response = await request(app.getHttpServer())
        .get(`${basePath.concat(getPath)}/${reqParam}`)
        .set('Authorization', 'test token');

      logger.info(response.body);

      //test verification
      expect(response.status).toBe(404);
      expect(response.body.statusCode).toBe(404);
      expect(response.body.message).toBeDefined();
      expect(response.body.error).toBeDefined();
    });

    it('should be able to get specific contact', async () => {
      const contact = await testService.getContact(); //get contact data
      const reqParam = contact.id; //init request

      //testing request
      const response = await request(app.getHttpServer())
        .get(`${basePath.concat(getPath)}/${reqParam}`)
        .set('Authorization', 'test token');

      logger.info(response.body);

      //test verification
      expect(response.status).toBe(200);
      expect(response.body.statusCode).toBe(200);
      expect(response.body.message).toBeDefined();
      expect(response.body.data.id).toBeDefined();
      expect(response.body.data.first_name).toBe('test first name 1');
      expect(response.body.data.last_name).toBe('test last name 1');
      expect(response.body.data.email).toBe('test1@mail.com');
      expect(response.body.data.phone).toBe('test phone 1');
    });
  });

  describe('PUT /api/contacts/v1/:contactId', () => {
    const updatePath = '/v1';

    beforeEach(async () => {
      await testService.deleteContact(); //delete contact if contact user still exist
      await testService.deleteUser(); //delete user if testing user still exist
      await testService.createUser(); //create testing user
      await testService.createContact(1); //create contact for testing user
    });

    afterEach(async () => {
      await testService.deleteContact(); //delete contact user that has been created or still exist
      await testService.deleteUser(); //delete testing user that has been created or still exist
    });

    it('should be rejected if token invalid', async () => {
      const contact = await testService.getContact(); //get contact data
      const reqParam = contact.id; //init request

      //testing request
      const response = await request(app.getHttpServer())
        .put(`${basePath.concat(updatePath)}/${reqParam}`)
        .set('Authorization', 'test wrong token')
        .send({
          first_name: 'test change first name',
          last_name: 'test change last name',
          email: 'testchange@mail.com',
          phone: 'test change phone',
        });

      logger.info(response.body);

      //test verification
      expect(response.status).toBe(401);
      expect(response.body.statusCode).toBe(401);
      expect(response.body.message).toBeDefined();
      expect(response.body.error).toBeDefined();
    });

    it('should be rejected if request param invalid', async () => {
      const reqParam = 'abcde'; //init request

      //testing request
      const response = await request(app.getHttpServer())
        .put(`${basePath.concat(updatePath)}/${reqParam}`)
        .set('Authorization', 'test token')
        .send({
          first_name: 'test change first name',
          last_name: 'test change last name',
          email: 'testchange@mail.com',
          phone: 'test change phone',
        });

      logger.info(response.body);

      //test verification
      expect(response.status).toBe(400);
      expect(response.body.statusCode).toBe(400);
      expect(response.body.message).toBeDefined();
      expect(response.body.error).toBeDefined();
    });

    it('should be rejected if request body invalid', async () => {
      const contact = await testService.getContact(); //get contact data
      const reqParam = contact.id; //init request

      //testing request
      const response = await request(app.getHttpServer())
        .put(`${basePath.concat(updatePath)}/${reqParam}`)
        .set('Authorization', 'test token')
        .send({
          first_name: '',
          last_name: '',
          email: '',
          phone: '',
        });

      logger.info(response.body);

      //test verification
      expect(response.status).toBe(400);
      expect(response.body.statusCode).toBe(400);
      expect(response.body.message).toBeDefined();
      expect(response.body.error).toBeDefined();
    });

    it('should be rejected if contact is not found', async () => {
      const contact = await testService.getContact(); //get contact data
      const reqParam = contact.id + 1; //init request

      //testing request
      const response = await request(app.getHttpServer())
        .put(`${basePath.concat(updatePath)}/${reqParam}`)
        .set('Authorization', 'test token')
        .send({
          first_name: 'test change first name',
          last_name: 'test change last name',
          email: 'testchange@mail.com',
          phone: 'test change phone',
        });

      logger.info(response.body);

      //test verification
      expect(response.status).toBe(404);
      expect(response.body.statusCode).toBe(404);
      expect(response.body.message).toBeDefined();
      expect(response.body.error).toBeDefined();
    });

    it('should be able to update specific contact', async () => {
      const contact = await testService.getContact(); //get contact data
      const reqParam = contact.id; //init request

      //testing request
      const response = await request(app.getHttpServer())
        .put(`${basePath.concat(updatePath)}/${reqParam}`)
        .set('Authorization', 'test token')
        .send({
          first_name: 'test change first name',
          last_name: 'test change last name',
          email: 'testchange@mail.com',
          phone: 'test change phone',
        });

      logger.info(response.body);

      //test verification
      expect(response.status).toBe(200);
      expect(response.body.statusCode).toBe(200);
      expect(response.body.message).toBeDefined();
      expect(response.body.data.id).toBeDefined();
      expect(response.body.data.first_name).toBe('test change first name');
      expect(response.body.data.last_name).toBe('test change last name');
      expect(response.body.data.email).toBe('testchange@mail.com');
      expect(response.body.data.phone).toBe('test change phone');
    });
  });

  describe('DELETE /api/contacts/v1/:contactId', () => {
    const getPath = '/v1';

    beforeEach(async () => {
      await testService.deleteContact(); //delete contact if contact user still exist
      await testService.deleteUser(); //delete user if testing user still exist
      await testService.createUser(); //create testing user
      await testService.createContact(0); //create contact for testing user
    });

    afterEach(async () => {
      await testService.deleteContact(); //delete contact user that has been created or still exist
      await testService.deleteUser(); //delete testing user that has been created or still exist
    });

    it('should be rejected if token invalid', async () => {
      const contact = await testService.getContact(); //get contact data
      const reqParam = contact.id; //init request

      //testing request
      const response = await request(app.getHttpServer())
        .delete(`${basePath.concat(getPath)}/${reqParam}`)
        .set('Authorization', 'test wrong token');

      logger.info(response.body);

      //test verification
      expect(response.status).toBe(401);
      expect(response.body.statusCode).toBe(401);
      expect(response.body.message).toBeDefined();
      expect(response.body.error).toBeDefined();
    });

    it('should be rejected if request invalid', async () => {
      const reqParam = 'abcde'; //init request

      //testing request
      const response = await request(app.getHttpServer())
        .delete(`${basePath.concat(getPath)}/${reqParam}`)
        .set('Authorization', 'test token');

      logger.info(response.body);

      //test verification
      expect(response.status).toBe(400);
      expect(response.body.statusCode).toBe(400);
      expect(response.body.message).toBeDefined();
      expect(response.body.error).toBeDefined();
    });

    it('should be rejected if contact is not found', async () => {
      const contact = await testService.getContact(); //get contact data
      const reqParam = contact.id + 1; //init request

      //testing request
      const response = await request(app.getHttpServer())
        .delete(`${basePath.concat(getPath)}/${reqParam}`)
        .set('Authorization', 'test token');

      logger.info(response.body);

      //test verification
      expect(response.status).toBe(404);
      expect(response.body.statusCode).toBe(404);
      expect(response.body.message).toBeDefined();
      expect(response.body.error).toBeDefined();
    });

    it('should be able to delete specific contact', async () => {
      const contact = await testService.getContact(); //get contact data
      const reqParam = contact.id; //init request

      //testing request
      const response = await request(app.getHttpServer())
        .delete(`${basePath.concat(getPath)}/${reqParam}`)
        .set('Authorization', 'test token');

      logger.info(response.body);

      //test verification
      expect(response.status).toBe(200);
      expect(response.body.statusCode).toBe(200);
      expect(response.body.message).toBeDefined();
      expect(response.body.data).toBe(true);

      const getContact = await testService.getContact();
      expect(getContact).toBeNull;
    });
  });

  describe('GET /api/contacts/v1', () => {
    const getPath = '/v1';

    beforeEach(async () => {
      await testService.deleteContact(); //delete contact if contact user still exist
      await testService.deleteUser(); //delete user if testing user still exist
      await testService.createUser(); //create testing user
      await testService.createContact(2); //create contact for testing user
    });

    afterEach(async () => {
      await testService.deleteContact(); //delete contact user that has been created or still exist
      await testService.deleteUser(); //delete testing user that has been created or still exist
    });

    it('should be rejected if token invalid', async () => {
      //testing request
      const response = await request(app.getHttpServer())
        .get(`${basePath.concat(getPath)}`)
        .set('Authorization', 'test wrong token');

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
        .get(`${basePath.concat(getPath)}`)
        .query({
          name: '',
          email: '',
          phone: '',
          page: 0,
          size: 0,
        })
        .set('Authorization', 'test token');

      logger.info(response.body);

      //test verification
      expect(response.status).toBe(400);
      expect(response.body.statusCode).toBe(400);
      expect(response.body.message).toBeDefined();
      expect(response.body.error).toBeDefined();
    });

    it('should be able to search contact (without query param)', async () => {
      //testing request
      const response = await request(app.getHttpServer())
        .get(`${basePath.concat(getPath)}`)
        .set('Authorization', 'test token');

      logger.info(response.body);

      //test verification
      expect(response.status).toBe(200);
      expect(response.body.statusCode).toBe(200);
      expect(response.body.message).toBeDefined();
      expect(response.body.data.length).toBe(2);

      const dataLength = response.body.data.length;
      for (let i = 1; i <= dataLength; i++) {
        expect(response.body.data[i - 1].id).toBeDefined();
        expect(response.body.data[i - 1].first_name).toBe(
          `test first name ${i}`,
        );
        expect(response.body.data[i - 1].last_name).toBe(`test last name ${i}`);
        expect(response.body.data[i - 1].email).toBe(`test${i}@mail.com`);
        expect(response.body.data[i - 1].phone).toBe(`test phone ${i}`);
      }

      expect(response.body.paging.current_page).toBe(1);
      expect(response.body.paging.size).toBe(10);
      expect(response.body.paging.total_page).toBe(1);
    });

    it('should be able to search contact by name (1)', async () => {
      //testing request
      const response = await request(app.getHttpServer())
        .get(`${basePath.concat(getPath)}`)
        .query({
          name: 'name 1',
        })
        .set('Authorization', 'test token');

      logger.info(response.body);

      //test verification
      expect(response.status).toBe(200);
      expect(response.body.statusCode).toBe(200);
      expect(response.body.message).toBeDefined();
      expect(response.body.data.length).toBe(1);
      expect(response.body.data[0].id).toBeDefined();
      expect(response.body.data[0].first_name).toBe('test first name 1');
      expect(response.body.data[0].last_name).toBe('test last name 1');
      expect(response.body.data[0].email).toBe('test1@mail.com');
      expect(response.body.data[0].phone).toBe('test phone 1');
      expect(response.body.paging.current_page).toBe(1);
      expect(response.body.paging.size).toBe(10);
      expect(response.body.paging.total_page).toBe(1);
    });

    it('should be able to search contact by name (2)', async () => {
      //testing request
      const response = await request(app.getHttpServer())
        .get(`${basePath.concat(getPath)}`)
        .query({
          name: 'name 2',
        })
        .set('Authorization', 'test token');

      logger.info(response.body);

      //test verification
      expect(response.status).toBe(200);
      expect(response.body.statusCode).toBe(200);
      expect(response.body.message).toBeDefined();
      expect(response.body.data.length).toBe(1);
      expect(response.body.data[0].id).toBeDefined();
      expect(response.body.data[0].first_name).toBe('test first name 2');
      expect(response.body.data[0].last_name).toBe('test last name 2');
      expect(response.body.data[0].email).toBe('test2@mail.com');
      expect(response.body.data[0].phone).toBe('test phone 2');
      expect(response.body.paging.current_page).toBe(1);
      expect(response.body.paging.size).toBe(10);
      expect(response.body.paging.total_page).toBe(1);
    });

    it('should be able to search contact by name (3)', async () => {
      //testing request
      const response = await request(app.getHttpServer())
        .get(`${basePath.concat(getPath)}`)
        .query({
          name: 'name',
        })
        .set('Authorization', 'test token');

      logger.info(response.body);

      //test verification
      expect(response.status).toBe(200);
      expect(response.body.statusCode).toBe(200);
      expect(response.body.message).toBeDefined();
      expect(response.body.data.length).toBe(2);

      const dataLength = response.body.data.length;
      for (let i = 1; i <= dataLength; i++) {
        expect(response.body.data[i - 1].id).toBeDefined();
        expect(response.body.data[i - 1].first_name).toBe(
          `test first name ${i}`,
        );
        expect(response.body.data[i - 1].last_name).toBe(`test last name ${i}`);
        expect(response.body.data[i - 1].email).toBe(`test${i}@mail.com`);
        expect(response.body.data[i - 1].phone).toBe(`test phone ${i}`);
      }

      expect(response.body.paging.current_page).toBe(1);
      expect(response.body.paging.size).toBe(10);
      expect(response.body.paging.total_page).toBe(1);
    });

    it('should be able to search contact by name not found', async () => {
      //testing request
      const response = await request(app.getHttpServer())
        .get(`${basePath.concat(getPath)}`)
        .query({
          name: 'wrong name',
        })
        .set('Authorization', 'test token');

      logger.info(response.body);

      //test verification
      expect(response.status).toBe(200);
      expect(response.body.statusCode).toBe(200);
      expect(response.body.message).toBeDefined();
      expect(response.body.data.length).toBe(0);
      expect(response.body.paging.current_page).toBe(1);
      expect(response.body.paging.size).toBe(10);
      expect(response.body.paging.total_page).toBe(0);
    });

    it('should be able to search contact by email', async () => {
      //testing request
      const response = await request(app.getHttpServer())
        .get(`${basePath.concat(getPath)}`)
        .query({
          email: 'mail',
        })
        .set('Authorization', 'test token');

      logger.info(response.body);

      //test verification
      expect(response.status).toBe(200);
      expect(response.body.statusCode).toBe(200);
      expect(response.body.message).toBeDefined();
      expect(response.body.data.length).toBe(2);

      const dataLength = response.body.data.length;
      for (let i = 1; i <= dataLength; i++) {
        expect(response.body.data[i - 1].id).toBeDefined();
        expect(response.body.data[i - 1].first_name).toBe(
          `test first name ${i}`,
        );
        expect(response.body.data[i - 1].last_name).toBe(`test last name ${i}`);
        expect(response.body.data[i - 1].email).toBe(`test${i}@mail.com`);
        expect(response.body.data[i - 1].phone).toBe(`test phone ${i}`);
      }

      expect(response.body.paging.current_page).toBe(1);
      expect(response.body.paging.size).toBe(10);
      expect(response.body.paging.total_page).toBe(1);
    });

    it('should be able to search contact by email not found', async () => {
      //testing request
      const response = await request(app.getHttpServer())
        .get(`${basePath.concat(getPath)}`)
        .query({
          email: 'wrong email',
        })
        .set('Authorization', 'test token');

      logger.info(response.body);

      //test verification
      expect(response.status).toBe(200);
      expect(response.body.statusCode).toBe(200);
      expect(response.body.message).toBeDefined();
      expect(response.body.data.length).toBe(0);
      expect(response.body.paging.current_page).toBe(1);
      expect(response.body.paging.size).toBe(10);
      expect(response.body.paging.total_page).toBe(0);
    });

    it('should be able to search contact by phone', async () => {
      //testing request
      const response = await request(app.getHttpServer())
        .get(`${basePath.concat(getPath)}`)
        .query({
          phone: 'phone',
        })
        .set('Authorization', 'test token');

      logger.info(response.body);

      //test verification
      expect(response.status).toBe(200);
      expect(response.body.statusCode).toBe(200);
      expect(response.body.message).toBeDefined();
      expect(response.body.data.length).toBe(2);

      const dataLength = response.body.data.length;
      for (let i = 1; i <= dataLength; i++) {
        expect(response.body.data[i - 1].id).toBeDefined();
        expect(response.body.data[i - 1].first_name).toBe(
          `test first name ${i}`,
        );
        expect(response.body.data[i - 1].last_name).toBe(`test last name ${i}`);
        expect(response.body.data[i - 1].email).toBe(`test${i}@mail.com`);
        expect(response.body.data[i - 1].phone).toBe(`test phone ${i}`);
      }

      expect(response.body.paging.current_page).toBe(1);
      expect(response.body.paging.size).toBe(10);
      expect(response.body.paging.total_page).toBe(1);
    });

    it('should be able to search contact by phone not found', async () => {
      //testing request
      const response = await request(app.getHttpServer())
        .get(`${basePath.concat(getPath)}`)
        .query({
          phone: 'phoneeee',
        })
        .set('Authorization', 'test token');

      logger.info(response.body);

      //test verification
      expect(response.status).toBe(200);
      expect(response.body.statusCode).toBe(200);
      expect(response.body.message).toBeDefined();
      expect(response.body.data.length).toBe(0);
      expect(response.body.paging.current_page).toBe(1);
      expect(response.body.paging.size).toBe(10);
      expect(response.body.paging.total_page).toBe(0);
    });

    it('should be able to search contact by all query param (1)', async () => {
      //testing request
      const response = await request(app.getHttpServer())
        .get(`${basePath.concat(getPath)}`)
        .query({
          name: 'test first name 1',
          email: 'test1@mail.com',
          phone: 'test phone 1',
          page: 1,
          size: 10,
        })
        .set('Authorization', 'test token');

      logger.info(response.body);

      //test verification
      expect(response.status).toBe(200);
      expect(response.body.statusCode).toBe(200);
      expect(response.body.message).toBeDefined();
      expect(response.body.data.length).toBe(1);
      expect(response.body.data[0].id).toBeDefined();
      expect(response.body.data[0].first_name).toBe('test first name 1');
      expect(response.body.data[0].last_name).toBe('test last name 1');
      expect(response.body.data[0].email).toBe('test1@mail.com');
      expect(response.body.data[0].phone).toBe('test phone 1');
      expect(response.body.paging.current_page).toBe(1);
      expect(response.body.paging.size).toBe(10);
      expect(response.body.paging.total_page).toBe(1);
    });

    it('should be able to search contact by all query param (2)', async () => {
      //testing request
      const response = await request(app.getHttpServer())
        .get(`${basePath.concat(getPath)}`)
        .query({
          name: 'test last name 1',
          email: 'test1@mail.com',
          phone: 'test phone 1',
          page: 1,
          size: 10,
        })
        .set('Authorization', 'test token');

      logger.info(response.body);

      //test verification
      expect(response.status).toBe(200);
      expect(response.body.statusCode).toBe(200);
      expect(response.body.message).toBeDefined();
      expect(response.body.data.length).toBe(1);
      expect(response.body.data[0].id).toBeDefined();
      expect(response.body.data[0].first_name).toBe('test first name 1');
      expect(response.body.data[0].last_name).toBe('test last name 1');
      expect(response.body.data[0].email).toBe('test1@mail.com');
      expect(response.body.data[0].phone).toBe('test phone 1');
      expect(response.body.paging.current_page).toBe(1);
      expect(response.body.paging.size).toBe(10);
      expect(response.body.paging.total_page).toBe(1);
    });
  });
});
