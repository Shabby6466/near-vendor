import { SearchService } from "./search.service";
import { NearbyDto } from "./dto/nearby.dto";
export declare class SearchController {
    private readonly service;
    constructor(service: SearchService);
    search(body: NearbyDto): Promise<{
        success: boolean;
        results: void;
    }>;
    semanticSearch(body: NearbyDto): Promise<{
        success: boolean;
        results: void;
    }>;
    nearby(body: Omit<NearbyDto, "queryText">): Promise<{
        success: boolean;
        results: any;
    }>;
}
