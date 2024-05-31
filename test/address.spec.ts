import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { Logger } from 'winston'; //for logger (1)
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston'; //for logger (1)
import { TestService } from './test.service'; //for test service
import { TestModule } from './test.module'; //for test module

describe('AddressController', () => {
  let app: INestApplication;
  let logger: Logger; //init logger
  let testService: TestService; //init test service

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, TestModule], //import app & test module
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    logger = app.get(WINSTON_MODULE_PROVIDER); //define logger
    testService = app.get(TestService); //define test service
  });

  describe('POST /api/contacts/:contactId/addresses/v1', () => {
    beforeEach(async () => {
      await testService.deleteAddress(); //delete contact address if contact user still exist
      await testService.deleteContact(); //delete contact if contact user still exist
      await testService.deleteUser(); //delete user if testing user still exist
      await testService.createUser(); //create testing user
      await testService.createContact(1); //create contact for testing user
    });

    afterEach(async () => {
      await testService.deleteAddress(); //delete user contact address that has been created or still exist
      await testService.deleteContact(); //delete user contact that has been created or still exist
      await testService.deleteUser(); //delete testing user that has been created or still exist
    });

    it('should be rejected if token invalid', async () => {
      const contact = await testService.getContact();

      //testing request
      const response = await request(app.getHttpServer())
        .post(`/api/contacts/${contact.id}/addresses/v1`)
        .set('Authorization', 'test wrong token')
        .send({
          street: 'test street',
          city: 'test city',
          province: 'test province',
          country: 'test country',
          postal_code: 'postcode',
        });

      logger.info(response.body);

      //test verification
      expect(response.status).toBe(401);
      expect(response.body.statusCode).toBe(401);
      expect(response.body.message).toBeDefined();
      expect(response.body.error).toBeDefined();
    });

    it('should be rejected if request param invalid', async () => {
      const param = 'abcdef';

      //testing request
      const response = await request(app.getHttpServer())
        .post(`/api/contacts/${param}/addresses/v1`)
        .set('Authorization', 'test token')
        .send({
          street: 'test street',
          city: 'test city',
          province: 'test province',
          country: 'test country',
          postal_code: 'postcode',
        });

      logger.info(response.body);

      //test verification
      expect(response.status).toBe(400);
      expect(response.body.statusCode).toBe(400);
      expect(response.body.message).toBeDefined();
      expect(response.body.error).toBeDefined();
    });

    it('should be rejected if request body invalid', async () => {
      const contact = await testService.getContact();

      //testing request
      const response = await request(app.getHttpServer())
        .post(`/api/contacts/${contact.id}/addresses/v1`)
        .set('Authorization', 'test token')
        .send({
          street: '',
          city: '',
          province: '',
          country: '',
          postal_code: '',
        });

      logger.info(response.body);

      //test verification
      expect(response.status).toBe(400);
      expect(response.body.statusCode).toBe(400);
      expect(response.body.message).toBeDefined();
      expect(response.body.error).toBeDefined();
    });

    it('should be rejected if contact is not found', async () => {
      const contact = await testService.getContact();

      //testing request
      const response = await request(app.getHttpServer())
        .post(`/api/contacts/${contact.id + 1}/addresses/v1`)
        .set('Authorization', 'test token')
        .send({
          street: 'test street',
          city: 'test city',
          province: 'test province',
          country: 'test country',
          postal_code: 'postcode',
        });

      logger.info(response.body);

      //test verification
      expect(response.status).toBe(404);
      expect(response.body.statusCode).toBe(404);
      expect(response.body.message).toBeDefined();
      expect(response.body.error).toBeDefined();
    });

    it('should be able to create address', async () => {
      const contact = await testService.getContact();

      //testing request
      const response = await request(app.getHttpServer())
        .post(`/api/contacts/${contact.id}/addresses/v1`)
        .set('Authorization', 'test token')
        .send({
          street: 'test street',
          city: 'test city',
          province: 'test province',
          country: 'test country',
          postal_code: 'postcode',
        });

      logger.info(response.body);

      //test verification
      expect(response.status).toBe(201);
      expect(response.body.statusCode).toBe(201);
      expect(response.body.message).toBeDefined();
      expect(response.body.data.id).toBeDefined();
      expect(response.body.data.street).toBe('test street');
      expect(response.body.data.city).toBe('test city');
      expect(response.body.data.province).toBe('test province');
      expect(response.body.data.country).toBe('test country');
      expect(response.body.data.postal_code).toBe('postcode');
    });
  });

  describe('GET /api/contacts/:contactId/addresses/v1/:addressId', () => {
    beforeEach(async () => {
      await testService.deleteAddress(); //delete contact address if contact user still exist
      await testService.deleteContact(); //delete contact if contact user still exist
      await testService.deleteUser(); //delete user if testing user still exist
      await testService.createUser(); //create testing user
      await testService.createContact(1); //create contact for testing user
      await testService.createAddress(1); //create address for testing user
    });

    afterEach(async () => {
      await testService.deleteAddress(); //delete user contact address that has been created or still exist
      await testService.deleteContact(); //delete contact user that has been created or still exist
      await testService.deleteUser(); //delete testing user that has been created or still exist
    });

    it('should be rejected if token invalid', async () => {
      const address = await testService.getAddress(); //get address data

      //testing request
      const response = await request(app.getHttpServer())
        .get(`/api/contacts/${address.contact_id}/addresses/v1/${address.id}`)
        .set('Authorization', 'test wrong token');

      logger.info(response.body);

      //test verification
      expect(response.status).toBe(401);
      expect(response.body.statusCode).toBe(401);
      expect(response.body.message).toBeDefined();
      expect(response.body.error).toBeDefined();
    });

    it('should be rejected if request contact param invalid', async () => {
      const contactParam = 'abcde';
      const address = await testService.getAddress(); //get address data

      //testing request
      const response = await request(app.getHttpServer())
        .get(`/api/contacts/${contactParam}/addresses/v1/${address.id}`)
        .set('Authorization', 'test token');

      logger.info(response.body);

      //test verification
      expect(response.status).toBe(400);
      expect(response.body.statusCode).toBe(400);
      expect(response.body.message).toBeDefined();
      expect(response.body.error).toBeDefined();
    });

    it('should be rejected if request address param invalid', async () => {
      const address = await testService.getAddress(); //get address data
      const addressParam = 'abcde';

      //testing request
      const response = await request(app.getHttpServer())
        .get(`/api/contacts/${address.contact_id}/addresses/v1/${addressParam}`)
        .set('Authorization', 'test token');

      logger.info(response.body);

      //test verification
      expect(response.status).toBe(400);
      expect(response.body.statusCode).toBe(400);
      expect(response.body.message).toBeDefined();
      expect(response.body.error).toBeDefined();
    });

    it('should be rejected if contact is not found', async () => {
      const address = await testService.getAddress(); //get address data

      //testing request
      const response = await request(app.getHttpServer())
        .get(
          `/api/contacts/${address.contact_id + 1}/addresses/v1/${address.id}`,
        )
        .set('Authorization', 'test token');

      logger.info(response.body);

      //test verification
      expect(response.status).toBe(404);
      expect(response.body.statusCode).toBe(404);
      expect(response.body.message).toBeDefined();
      expect(response.body.error).toBeDefined();
    });

    it('should be rejected if address is not found', async () => {
      const address = await testService.getAddress(); //get address data

      //testing request
      const response = await request(app.getHttpServer())
        .get(
          `/api/contacts/${address.contact_id}/addresses/v1/${address.id + 1}`,
        )
        .set('Authorization', 'test token');

      logger.info(response.body);

      //test verification
      expect(response.status).toBe(404);
      expect(response.body.statusCode).toBe(404);
      expect(response.body.message).toBeDefined();
      expect(response.body.error).toBeDefined();
    });

    it('should be able to get specific contact', async () => {
      const address = await testService.getAddress(); //get address data

      //testing request
      const response = await request(app.getHttpServer())
        .get(`/api/contacts/${address.contact_id}/addresses/v1/${address.id}`)
        .set('Authorization', 'test token');

      logger.info(response.body);

      //test verification
      expect(response.status).toBe(200);
      expect(response.body.statusCode).toBe(200);
      expect(response.body.message).toBeDefined();
      expect(response.body.data.id).toBeDefined();
      expect(response.body.data.street).toBe('test street 1');
      expect(response.body.data.city).toBe('test city 1');
      expect(response.body.data.province).toBe('test province 1');
      expect(response.body.data.country).toBe('test country 1');
      expect(response.body.data.postal_code).toBe('postcode 1');
    });
  });

  describe('PUT /api/contacts/:contactId/addresses/v1/:addressId', () => {
    beforeEach(async () => {
      await testService.deleteAddress(); //delete contact address if contact user still exist
      await testService.deleteContact(); //delete contact if contact user still exist
      await testService.deleteUser(); //delete user if testing user still exist
      await testService.createUser(); //create testing user
      await testService.createContact(1); //create contact for testing user
      await testService.createAddress(1); //create address for testing user
    });

    afterEach(async () => {
      await testService.deleteAddress(); //delete user contact address that has been created or still exist
      await testService.deleteContact(); //delete contact user that has been created or still exist
      await testService.deleteUser(); //delete testing user that has been created or still exist
    });

    it('should be rejected if token invalid', async () => {
      const address = await testService.getAddress(); //get address data

      //testing request
      const response = await request(app.getHttpServer())
        .put(`/api/contacts/${address.contact_id}/addresses/v1/${address.id}`)
        .set('Authorization', 'test wrong token')
        .send({
          street: 'test change street',
          city: 'test change city',
          province: 'test change province',
          country: 'test change country',
          postal_code: 'postchange',
        });

      logger.info(response.body);

      //test verification
      expect(response.status).toBe(401);
      expect(response.body.statusCode).toBe(401);
      expect(response.body.message).toBeDefined();
      expect(response.body.error).toBeDefined();
    });

    it('should be rejected if request contact id param invalid', async () => {
      const contactParam = 'abcde';
      const address = await testService.getAddress(); //get address data

      //testing request
      const response = await request(app.getHttpServer())
        .put(`/api/contacts/${contactParam}/addresses/v1/${address.id}`)
        .set('Authorization', 'test token')
        .send({
          street: 'test change street',
          city: 'test change city',
          province: 'test change province',
          country: 'test change country',
          postal_code: 'postchange',
        });

      logger.info(response.body);

      //test verification
      expect(response.status).toBe(400);
      expect(response.body.statusCode).toBe(400);
      expect(response.body.message).toBeDefined();
      expect(response.body.error).toBeDefined();
    });

    it('should be rejected if request address id param invalid', async () => {
      const addressParam = 'abcde';
      const address = await testService.getAddress(); //get address data

      //testing request
      const response = await request(app.getHttpServer())
        .put(`/api/contacts/${address.contact_id}/addresses/v1/${addressParam}`)
        .set('Authorization', 'test token')
        .send({
          street: 'test change street',
          city: 'test change city',
          province: 'test change province',
          country: 'test change country',
          postal_code: 'postchange',
        });

      logger.info(response.body);

      //test verification
      expect(response.status).toBe(400);
      expect(response.body.statusCode).toBe(400);
      expect(response.body.message).toBeDefined();
      expect(response.body.error).toBeDefined();
    });

    it('should be rejected if request body invalid', async () => {
      const address = await testService.getAddress(); //get address data

      //testing request
      const response = await request(app.getHttpServer())
        .put(`/api/contacts/${address.contact_id}/addresses/v1/${address.id}`)
        .set('Authorization', 'test token')
        .send({
          street: '',
          city: '',
          province: '',
          country: '',
          postal_code: '',
        });

      logger.info(response.body);

      //test verification
      expect(response.status).toBe(400);
      expect(response.body.statusCode).toBe(400);
      expect(response.body.message).toBeDefined();
      expect(response.body.error).toBeDefined();
    });

    it('should be rejected if contact is not found', async () => {
      const address = await testService.getAddress(); //get address data

      //testing request
      const response = await request(app.getHttpServer())
        .put(
          `/api/contacts/${address.contact_id + 1}/addresses/v1/${address.id}`,
        )
        .set('Authorization', 'test token')
        .send({
          street: 'test change street',
          city: 'test change city',
          province: 'test change province',
          country: 'test change country',
          postal_code: 'postchange',
        });

      logger.info(response.body);

      //test verification
      expect(response.status).toBe(404);
      expect(response.body.statusCode).toBe(404);
      expect(response.body.message).toBeDefined();
      expect(response.body.error).toBeDefined();
    });

    it('should be rejected if address is not found', async () => {
      const address = await testService.getAddress(); //get address data

      //testing request
      const response = await request(app.getHttpServer())
        .put(
          `/api/contacts/${address.contact_id}/addresses/v1/${address.id + 1}`,
        )
        .set('Authorization', 'test token')
        .send({
          street: 'test change street',
          city: 'test change city',
          province: 'test change province',
          country: 'test change country',
          postal_code: 'postchange',
        });

      logger.info(response.body);

      //test verification
      expect(response.status).toBe(404);
      expect(response.body.statusCode).toBe(404);
      expect(response.body.message).toBeDefined();
      expect(response.body.error).toBeDefined();
    });

    it('should be able to update specific contact address', async () => {
      const address = await testService.getAddress(); //get address data

      //testing request
      const response = await request(app.getHttpServer())
        .put(`/api/contacts/${address.contact_id}/addresses/v1/${address.id}`)
        .set('Authorization', 'test token')
        .send({
          street: 'test change street',
          city: 'test change city',
          province: 'test change province',
          country: 'test change country',
          postal_code: 'postchange',
        });

      logger.info(response.body);

      //test verification
      expect(response.status).toBe(200);
      expect(response.body.statusCode).toBe(200);
      expect(response.body.message).toBeDefined();
      expect(response.body.data.id).toBeDefined();
      expect(response.body.data.street).toBe('test change street');
      expect(response.body.data.city).toBe('test change city');
      expect(response.body.data.province).toBe('test change province');
      expect(response.body.data.country).toBe('test change country');
      expect(response.body.data.postal_code).toBe('postchange');
    });
  });

  describe('DELETE /api/contacts/:contactId/addresses/v1/:addressId', () => {
    beforeEach(async () => {
      await testService.deleteAddress(); //delete contact address if contact user still exist
      await testService.deleteContact(); //delete contact if contact user still exist
      await testService.deleteUser(); //delete user if testing user still exist
      await testService.createUser(); //create testing user
      await testService.createContact(1); //create contact for testing user
      await testService.createAddress(1); //create address for testing user
    });

    afterEach(async () => {
      await testService.deleteAddress(); //delete user contact address that has been created or still exist
      await testService.deleteContact(); //delete contact user that has been created or still exist
      await testService.deleteUser(); //delete testing user that has been created or still exist
    });

    it('should be rejected if token invalid', async () => {
      const address = await testService.getAddress(); //get address data

      //testing request
      const response = await request(app.getHttpServer())
        .delete(
          `/api/contacts/${address.contact_id}/addresses/v1/${address.id}`,
        )
        .set('Authorization', 'test wrong token');

      logger.info(response.body);

      //test verification
      expect(response.status).toBe(401);
      expect(response.body.statusCode).toBe(401);
      expect(response.body.message).toBeDefined();
      expect(response.body.error).toBeDefined();
    });

    it('should be rejected if request contact param invalid', async () => {
      const contactParam = 'abcde';
      const address = await testService.getAddress(); //get address data

      //testing request
      const response = await request(app.getHttpServer())
        .delete(`/api/contacts/${contactParam}/addresses/v1/${address.id}`)
        .set('Authorization', 'test token');

      logger.info(response.body);

      //test verification
      expect(response.status).toBe(400);
      expect(response.body.statusCode).toBe(400);
      expect(response.body.message).toBeDefined();
      expect(response.body.error).toBeDefined();
    });

    it('should be rejected if request address param invalid', async () => {
      const address = await testService.getAddress(); //get address data
      const addressParam = 'abcde';

      //testing request
      const response = await request(app.getHttpServer())
        .delete(
          `/api/contacts/${address.contact_id}/addresses/v1/${addressParam}`,
        )
        .set('Authorization', 'test token');

      logger.info(response.body);

      //test verification
      expect(response.status).toBe(400);
      expect(response.body.statusCode).toBe(400);
      expect(response.body.message).toBeDefined();
      expect(response.body.error).toBeDefined();
    });

    it('should be rejected if contact is not found', async () => {
      const address = await testService.getAddress(); //get address data

      //testing request
      const response = await request(app.getHttpServer())
        .delete(
          `/api/contacts/${address.contact_id + 1}/addresses/v1/${address.id}`,
        )
        .set('Authorization', 'test token');

      logger.info(response.body);

      //test verification
      expect(response.status).toBe(404);
      expect(response.body.statusCode).toBe(404);
      expect(response.body.message).toBeDefined();
      expect(response.body.error).toBeDefined();
    });

    it('should be rejected if address is not found', async () => {
      const address = await testService.getAddress(); //get address data

      //testing request
      const response = await request(app.getHttpServer())
        .delete(
          `/api/contacts/${address.contact_id}/addresses/v1/${address.id + 1}`,
        )
        .set('Authorization', 'test token');

      logger.info(response.body);

      //test verification
      expect(response.status).toBe(404);
      expect(response.body.statusCode).toBe(404);
      expect(response.body.message).toBeDefined();
      expect(response.body.error).toBeDefined();
    });

    it('should be able to delete specific address contact', async () => {
      const address = await testService.getAddress(); //get address data

      //testing request
      const response = await request(app.getHttpServer())
        .delete(
          `/api/contacts/${address.contact_id}/addresses/v1/${address.id}`,
        )
        .set('Authorization', 'test token');

      logger.info(response.body);

      //test verification
      expect(response.status).toBe(200);
      expect(response.body.statusCode).toBe(200);
      expect(response.body.message).toBeDefined();
      expect(response.body.data).toBe(true);

      const getAddress = await testService.getAddress();
      expect(getAddress).toBeNull;
    });
  });

  describe('GET /api/contacts/:contactId/addresses/v1', () => {
    beforeEach(async () => {
      await testService.deleteAddress(); //delete contact address if contact user still exist
      await testService.deleteContact(); //delete contact if contact user still exist
      await testService.deleteUser(); //delete user if testing user still exist
      await testService.createUser(); //create testing user
      await testService.createContact(1); //create contact for testing user
      await testService.createAddress(2); //create address for testing user
    });

    afterEach(async () => {
      await testService.deleteAddress(); //delete user contact address that has been created or still exist
      await testService.deleteContact(); //delete contact user that has been created or still exist
      await testService.deleteUser(); //delete testing user that has been created or still exist
    });

    it('should be rejected if token invalid', async () => {
      const address = await testService.getAddress(); //get address data

      //testing request
      const response = await request(app.getHttpServer())
        .get(`/api/contacts/${address.contact_id}/addresses/v1`)
        .set('Authorization', 'test wrong token');

      logger.info(response.body);

      //test verification
      expect(response.status).toBe(401);
      expect(response.body.statusCode).toBe(401);
      expect(response.body.message).toBeDefined();
      expect(response.body.error).toBeDefined();
    });

    it('should be rejected if request param invalid', async () => {
      const param = 'abc';

      //testing request
      const response = await request(app.getHttpServer())
        .get(`/api/contacts/${param}/addresses/v1`)
        .set('Authorization', 'test token');

      logger.info(response.body);

      //test verification
      expect(response.status).toBe(400);
      expect(response.body.statusCode).toBe(400);
      expect(response.body.message).toBeDefined();
      expect(response.body.error).toBeDefined();
    });

    it('should be rejected if contact not found', async () => {
      const address = await testService.getAddress(); //get address data

      //testing request
      const response = await request(app.getHttpServer())
        .get(`/api/contacts/${address.contact_id + 1}/addresses/v1`)
        .set('Authorization', 'test token');

      logger.info(response.body);

      //test verification
      expect(response.status).toBe(404);
      expect(response.body.statusCode).toBe(404);
      expect(response.body.message).toBeDefined();
      expect(response.body.error).toBeDefined();
    });

    it('should be able to get all contact', async () => {
      const address = await testService.getAddress(); //get address data

      //testing request
      const response = await request(app.getHttpServer())
        .get(`/api/contacts/${address.contact_id}/addresses/v1`)
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
        expect(response.body.data[i - 1].street).toBe(`test street ${i}`);
        expect(response.body.data[i - 1].city).toBe(`test city ${i}`);
        expect(response.body.data[i - 1].province).toBe(`test province ${i}`);
        expect(response.body.data[i - 1].country).toBe(`test country ${i}`);
        expect(response.body.data[i - 1].postal_code).toBe(`postcode ${i}`);
      }
    });
  });
});
