import { ApiProperty } from "@nestjs/swagger";
import { Response } from "response/response";


class IValidateData {
    @ApiProperty({ example: "token here" })
    token: string;
    user: any;
}