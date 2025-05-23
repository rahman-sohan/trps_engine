import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { HTTP_METHOD } from './httpcode.constant';

interface AxiosResponseType {
    response: any;
    totalExecutionTime: number;
}

@Injectable()
export class CustomHttpService {
    constructor(private readonly httpService: HttpService) {}

    async sendRequest(
        url: string,
        method: HTTP_METHOD,
        payload?: any,
        headers?: any,
        responseType?: any,
    ): Promise<AxiosResponseType> {
        const startTime = new Date().getTime();
        const response = await this.httpService.axiosRef({
            url,
            method,
            data: payload,
            responseType: responseType,
            headers,
        });
        const endTime = new Date().getTime();
        const totalExecutionTime = (endTime - startTime) / 1000;

        // console.log(`Exection time of endpoint: ${url} --> ${totalExecutionTime} s`);

        return {
            response,
            totalExecutionTime,
        };
        //TODO:  Analysis with sakib vai for this issue
    }
}
