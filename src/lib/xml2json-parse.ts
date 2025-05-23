import { Injectable } from '@nestjs/common';
import { parseStringPromise } from 'xml2js';

@Injectable()
export class XmlService {
    async convertXmlToJson(xml: string): Promise<any> {
        try {
            const json = await parseStringPromise(xml, { explicitArray: false });
            return json;
        } catch (error) {
            throw new Error('Failed to parse XML');
        }
    }
}
