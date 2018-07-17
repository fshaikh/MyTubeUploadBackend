// import AWS object without services
import AWS = require('aws-sdk/global');
// import individual service
import S3 = require('aws-sdk/clients/s3');
import Lambda = require('aws-sdk/clients/lambda');
import { AWSError } from 'aws-sdk/global';
import { FunctionConfiguration } from 'aws-sdk/clients/greengrass';

export default class S3Demo {
    public async getFile(): Promise<string>{
        return new Promise<string>((resolve, reject) => {
            const s3 = new S3();
            const request : S3.GetObjectRequest = {
                Bucket : "mytube-bucket-source-videos",
                Key : "File.txt"
            };
            s3.getObject(request, (err: AWSError, data: S3.GetObjectOutput)=> {
                if(err){
                    resolve(err.message);
                }else{
                    resolve(data.Body.toString());
                }
            });
        });
        
    }

    public async getLambdas(): Promise<string[]>{
        let lambdas:string[] = [];

        return new Promise<string[]>((resolve, reject) => {
            console.log('executing');
            const lambda: Lambda = new Lambda({region:'us-east-1',accessKeyId :'AKIAJZCW2NKVNFWQHLXQ',secretAccessKey :'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'});
            var params = {
                FunctionVersion: 'ALL',
                MasterRegion: 'us-east-1'
              };
            lambda.listFunctions(params, (err: AWSError, data: Lambda.ListFunctionsResponse) => {
                if(err){
                    console.log(`Error in fetching lambdas: ${err.message}`);
                    resolve(lambdas);
                }else{
                    console.log('done');
                    const functions = data.Functions;
                    functions.forEach(element => {
                        lambdas.push(element.FunctionName);
                    });
                    resolve(lambdas);
                }
            });
        });

    }
}