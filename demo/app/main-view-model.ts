import { Observable } from "tns-core-modules/data/observable";
import { getImage } from "./helpers/screenshot";
import { sendDataForImageComparison } from "./helpers/service-context";

export class HelloWorldModel extends Observable {
    private _img: any;

    constructor() { super();  }

    get img(): any {
        return this._img;
    }

    set img(value: any) {
        if (this._img !== value) { 
            this._img = value;
            this.notifyPropertyChange("img", value);
        }
    }

    onTap(args) {
        const source = getImage(args.object.page);
        this.img = source;
    }

    async sendImageData(){
        const result = await sendDataForImageComparison("test.png", this.img);
        console.log("", result);
    }
}
