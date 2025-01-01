import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as puppeteer from 'puppeteer';

@Injectable()
export class ScraperService{
    constructor(private readonly configService: ConfigService){}
    async scrapeDAAD(): Promise<any[]> {
        const browser = await puppeteer.launch({ headless: true });
        const page = await browser.newPage();
    
        // Navigate to the DAAD website
        await page.goto(this.configService.get<string>('SCRAPER_URL'), {
          waitUntil: 'domcontentloaded',
        });
    
        // Example of scraping data
        const data = await page.evaluate(() => {
          const programElements = Array.from(document.querySelectorAll('.program-card'));
          return programElements.map((program) => ({
            universityName: program.querySelector('.university-name')?.textContent?.trim(),
            location: program.querySelector('.location')?.textContent?.trim(),
            offeredDegree: program.querySelector('.degree')?.textContent?.trim(),
            subject: program.querySelector('.subject')?.textContent?.trim(),
            tuitionFee: program.querySelector('.tuition-fee')?.textContent?.trim(),
            courseWebsiteLink: program.querySelector('.course-link a')?.getAttribute('href'),
          }));
        });
    
        await browser.close();
        return data;
      }
}