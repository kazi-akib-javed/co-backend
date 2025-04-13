import { Controller, Get } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { ScraperService } from "./scraper.service";

@ApiTags("Scraper")
@Controller("scraper")
export class ScraperController {
  constructor(private readonly scraperService: ScraperService) {}

  //@ApiBearerAuth()
  @Get()
  async getScrapedData() {
    return await this.scraperService.scrapeDAAD();
  }
}
