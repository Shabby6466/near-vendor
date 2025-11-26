import { ApiProperty } from "@nestjs/swagger";
class IValidateData {
  @ApiProperty({ example: "token here" })
  token: string;

  @ApiProperty({ example: { email: "string", id: "string" } })
  user: { email: string; id: string };
}

export class SuccessValidate extends Response {
  @ApiProperty({ example: IValidateData })
  data: IValidateData;
  constructor(data: IValidateData) {
    super();
    this.data = data;
  }
}
