import { Express } from "express";
import http from 'http'

export class BackendServer {
    express: Express;
    httpServer: http.Server;
    protected constructor(app: Express, httpServer: http.Server){
        this.express = app;
        this.httpServer = httpServer;
    }
    async onInitialized(){

    }
    static async Create(app: Express, httpServer: http.Server): Promise<BackendServer> {
        let out = new BackendServer(app, httpServer);
        await out.onInitialized();
        return out;
    }

}