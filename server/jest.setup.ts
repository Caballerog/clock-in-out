import 'reflect-metadata';
import 'expect-more-jest';
import * as fetch from 'jest-fetch-mock';

jasmine.DEFAULT_TIMEOUT_INTERVAL = 300000;

jest.setMock('node-fetch', fetch);
