import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Buyers } from "models/entities/buyers.entity";
import { Repository } from "typeorm";
import { CreateBuyerDto } from "./dto/buyer.dto";
import { BuyerNotFoundException, PhoneNumberNotFoundException } from "./buyer.exception";


@Injectable()
export class BuyerService {
    constructor(
        @InjectRepository(Buyers)
        private readonly buyerRepo: Repository<Buyers>
    ) { }

    async createBuyer(dto: CreateBuyerDto) {
        if (!dto.buyerPhoneNumber) {
            throw new PhoneNumberNotFoundException()
        }
        const buyer = new Buyers();
        buyer.buyerFullName = dto.buyerName;
        buyer.buyerPhoneNumber = dto.buyerPhoneNumber;
        buyer.lastKnownLatitude = dto.latitude;
        buyer.lastKnownLongitude = dto.longitude;
        await this.buyerRepo.save(buyer);
        return buyer;
    }

    async getBuyer(id: string) {
        const buyer = await this.buyerRepo.findOne({ where: { id } });
        return buyer;
    }

    async getBuyerByPhoneNumber(phoneNumber: string) {
        const buyer = await this.buyerRepo.findOne({ where: { buyerPhoneNumber: phoneNumber } });
        if (!buyer) {
            throw new BuyerNotFoundException()
        }
        return buyer;
    }

}