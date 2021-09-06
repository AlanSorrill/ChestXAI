export abstract class Session {
    id: string;
    hasSocket: boolean = false
    constructor(id: string){
        this.id = id;
    }
}