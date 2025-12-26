import { Controller, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiCookieAuth, ApiTags } from "@nestjs/swagger";
import { LeadService } from "./lead.service";

@ApiTags("leads")
// @UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@ApiBearerAuth()
@Controller("lead")
export class LeadController {
    constructor(private readonly service: LeadService) { }


}