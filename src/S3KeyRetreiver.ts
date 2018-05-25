import { IKeyRetreiver } from "./IKeyRetreiver";

export default class S3KeyRetreiver implements IKeyRetreiver {
    GetKeyFromEvent(event: any): string {
        const key = event.Records[0].s3.object.key;
        return key;
    }
}