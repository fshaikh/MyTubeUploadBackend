import S3KeyRetreiver from "./S3KeyRetreiver";
import TranscodeRequest from "./TranscodeRequest";
import TranscodeService from "./TranscodeService";
import ResponseBase from "./ResponseBase";

export default class TranscodeController {
    constructor(){

    }

    public async Start(event): Promise<ResponseBase>{
        const s3KeyRetreiver: S3KeyRetreiver = new S3KeyRetreiver();
        const inputKey = s3KeyRetreiver.GetKeyFromEvent(event);
        
        // invoke the transcode process
        const request: TranscodeRequest = new TranscodeRequest();
        request.InputKey = inputKey;
        const transcodeService: TranscodeService = new TranscodeService();
        return await transcodeService.Transcode(request);
    }


}