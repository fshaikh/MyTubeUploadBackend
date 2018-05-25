import TranscodeRequest from "./TranscodeRequest";
// import AWS object without services
import AWS = require('aws-sdk/global');
// import individual service
import ElasticTranscoder = require('aws-sdk/clients/elastictranscoder');
import ResponseBase from "./ResponseBase";
import TranscodePresetId from "./TranscodePresetIdEnum";


export default class TranscodeService{
    constructor(){

    }

    public async Transcode(request: TranscodeRequest): Promise<ResponseBase>{
        return new Promise<ResponseBase>((resolve, reject) => {
            var response: ResponseBase = new ResponseBase();
            const elasticTranscoder: ElasticTranscoder  = this.createElasticTranscoder();
            elasticTranscoder.createJob(this.GetCreateJobRequest(request))
            .promise()
            .then((data) => {
              console.log(`ElasticTranscoder callback data: ${data}`);
              resolve(response);
            })
            .catch((error) => {
              console.log(`An error occured ${error}`);
              response.isSuccess = false;
              response.error = error;
              resolve(response);
            });
        });
    }

    private createElasticTranscoder(): ElasticTranscoder{
        return new ElasticTranscoder({
            region: process.env.ELASTIC_TRANSCODER_REGION
        });
    }

    private GetOutputKey(inputKey): string {
        return inputKey.split('.')[0];
    }

    private GetCreateJobRequest(request: TranscodeRequest): ElasticTranscoder.CreateJobRequest {
        const outputKey = this.GetOutputKey(request.InputKey);
        const jobInput: ElasticTranscoder.JobInput = {
            Key: request.InputKey
        };


        const createJobRequest: ElasticTranscoder.CreateJobRequest = {
            PipelineId : process.env.ELASTIC_TRANSCODER_PIPELINE_ID,
            OutputKeyPrefix: outputKey + '/',
            Input: jobInput,
            // For PresetId, refer : https://docs.aws.amazon.com/elastictranscoder/latest/developerguide/system-presets.html
            Outputs: [
                {
                    Key: outputKey + '-360p' + '.mp4',
                    PresetId:  TranscodePresetId.GENERIC360P
                }]
        };

        return createJobRequest;
    }
}