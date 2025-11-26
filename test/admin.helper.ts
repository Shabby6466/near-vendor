import { INestApplication } from "@nestjs/common";
import request from "supertest";
import { Helper } from "./abstrct-helper";

export class AdminHelper extends Helper {
  public testUserDto = {
    email: "test_admin_helper@yopmail.com",
    password: "Test@1234",
    passwordConfirmation: "Test@1234",
    code: "1234",
  };

  public testUser = {
    email: "test_user_helper@yopmail.com",
    password: "Test@1234",
    passwordConfirmation: "Test@1234",
    code: "1234",
  };

  constructor(app: INestApplication) {
    super(app);
  }

  public async init() {
    return;
  }
}
