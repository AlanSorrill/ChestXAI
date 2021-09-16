export abstract class ITask {
    id: string;
    constructor(id: string){
        this.id = id;
    }
    abstract get taskType(): string
    abstract onStart(): void;
    abstract onUpdate(title: string, alpha: number): void
    abstract onComplete(): void
    isComplete: boolean = false
    notifyComplete(){
        if(!this.isComplete){
            this.isComplete = true;
            this.onComplete();
        }
    }
}
export interface TaskListener {
    onUpdate: (title: string, alpha: number)=>void
    onComplete: ()=>void
}