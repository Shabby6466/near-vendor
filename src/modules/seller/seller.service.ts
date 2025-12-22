import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Seller } from "models/entities/sellers.entity";
import { createSellerDto } from "./dto/seller.dto";
import { SellerNotFoundException } from "./seller.exception";


@Injectable()
export class SellerService {
    constructor(
        @InjectRepository(Seller)
        private readonly sellerRepo: Repository<Seller>
    ) { }

    async createSeller(dto: createSellerDto) {
        const seller = new Seller();
        seller.sellerFullName = dto.sellerName;
        seller.sellerPhoneNumber = dto.sellerPhoneNumber;
        return this.sellerRepo.save(seller);
    }

    async getSellerByPhoneNumber(phoneNumber: string) {
        const seller = await this.sellerRepo.findOne({ where: { sellerPhoneNumber: phoneNumber } });
        if (!seller) {
            throw new SellerNotFoundException()
        }
        return seller;
    }

    async updateSeller(id: string, dto: createSellerDto) {
        const seller = await this.sellerRepo.findOne({ where: { id } });
        if (!seller) {
            throw new SellerNotFoundException()
        }
        seller.sellerFullName = dto.sellerName;
        seller.sellerPhoneNumber = dto.sellerPhoneNumber;
        return this.sellerRepo.save(seller);
    }

}