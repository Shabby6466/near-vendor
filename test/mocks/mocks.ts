import * as http from "http";
import express, { Request, Response } from "express";
export const MailerMock = {
  sendMail: jest.fn(() => {
    return;
  }),
};

export const LoggerMock = {
  log: jest.fn((value: string) => {
    return;
  }),
  error: jest.fn((value: string) => {
    return;
  }),
  setContext: jest.fn((value: string) => {
    return;
  }),
  debug: jest.fn(() => {
    return;
  }),
};

export const CacheManagerMock = {
  deleteOTP: jest.fn(),
  setOTP: jest.fn(() => "123456"),
  getOTP: jest.fn(() => "123456"),
  setToken: jest.fn(() => "test_token"),
  getToken: jest.fn(() => "test_token"),
  delToken: jest.fn(() => "test"),
};

export const MessagebirdMock = {
  messageCreate: jest.fn(() => {
    return "Success!";
  }),
};
