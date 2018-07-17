import S3Demo from "./S3Demo";

(async function(){
    const s3: S3Demo = new S3Demo();
    // const response = await s3.getFile();
    // console.log(response);
    const lambdas = await s3.getLambdas();
    console.log(lambdas);
})();