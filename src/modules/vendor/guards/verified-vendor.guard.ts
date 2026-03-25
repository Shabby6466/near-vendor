import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vendors } from '../../../models/entities/vendors.entity';

@Injectable()
export class VerifiedVendorGuard implements CanActivate {
    constructor(
        @InjectRepository(Vendors)
        private vendorRepository: Repository<Vendors>,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const user = request.user;

        if (!user) {
            return false;
        }

        let vendor = await this.vendorRepository.findOne({
            where: { user: { id: user.id } }
        });

        if (!vendor) {
            vendor = await this.vendorRepository.findOne({
                where: { id: user.id }
            });
        }

        if (!vendor) {
            throw new ForbiddenException('Vendor profile not found');
        }

        if (!vendor.isVerified) {
            throw new ForbiddenException('Only verified vendors can perform this action');
        }

        // Attach vendor to request for convenience in controllers
        request.vendor = vendor;
        return true;
    }
}
