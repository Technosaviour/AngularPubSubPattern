import { Observer } from "rxjs";
import { Subject } from 'rxjs/Subject';
import { Type, Injectable } from "@angular/core";
import { Observable } from "rxjs/Observable";

type Channels = Map<Type<any>, Subject<any>>;

@Injectable()
export class ObserverService
{
    private channels: Channels = new Map<Type<any>, Subject<any>>();

    subscribe<T>(type: Type<T>): Observable<T> { 
        if (!this.channels.has(type)) {
            this.channels.set(type, new Subject<T>());
        }
        return this.getChannel(type).asObservable();
    }

    unsubscribe<T>(type: Type<T>): Observable<T> { 
        if (this.channels.has(type)) {
            this.channels.delete(type);
        }
        return new Observable();
    }

    publish<T>(type: Type<T>): void {
        if (!this.channels.has(type)) {
            this.channels.set(type, new Subject<T>());
        }
        this.getChannel(type).next();
    }

    private getChannel<T>(type: Type<T>) : Subject<any> {
        const obj = this.channels.get(type);
        if (obj) {
            return obj
        }
        console.log(`No subscription found for channel with type ${type}`);
    }
}

// this._observerService.subscribe(EventName).subscribe(() => { this.doSomething(); });
// this._observerService.publish(EventName);
