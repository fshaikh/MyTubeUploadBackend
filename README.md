# Intro
Serverless Backend for MyTube Video Sharing app. This is a AWS Lambda recipe for uploading video files to a source S3 bucket and transcoding the video file using AWS ElasticTranscoder
into various video formats. 

# Architecture
![](https://github.com/fshaikh/MyTubeUploadBackend/blob/master/Architecture.PNG)

# Setting up Dev Environment
    1. Install Node (> v8.10), Preferred IDE, Windows Powershell, AWS CLI
    2. mkdir awslambda-transcode-recipe
    3. cd awslambda-transcode-recipe
    4. git clone  https://github.com/fshaikh/MyTubeUploadBackend.git
    5. npm install

## Prepare package for upload
   ### Unix/Mac OS X - 
   ### Windows
   1. Open Powershell as administrator
   2. Run: Install-Module -Force Microsoft.PowerShell.Archive
   3. Run: Set-ExecutionPolicy -Scope Process -ExecutionPolicy AllSigned
   4. Run: npm run deploy
   5. This will create lambda-transcoder-package.zip in dist folder
   ### Manual
   1. zip all js files in "dist" directory. This will be the AWS Lambda package to be uploaded

## AWS Changes - Manual
This describes the manual steps to configure services on AWS.
1. Login to AWS Console
   NOTE: If you are not using Free Tier, you will incur costs on some of the operations
2. **AWS S3**
    * Create 2 S3 buckets
         * mytube-bucket-source-videos - This is the source S3 bucket where the user uploads the video files.
			   * mytube-bucket-destination-videos - This is the destination S3 bucket where the AWS Lambda uploads the transcoded video files.
3. **AWS IAM**
   * AWS Lambda needs access to S3 and Elastic Transcoder services. Create a Role with following Policies:
     * AWSLambdaExecute, AmazonElasticTranscoderJobsSubmitter, CloudWatchLogsFullAccess
4. **AWS Elastic Transcoder**
   * Create a pipeline
   * Set Pipeline Name
   * Input Bucket: mytube-bucket-source-videos
   * Configuration for Amazon S3 Bucket for Transcoded Files and Playlists
			Bucket: mytube-bucket-destination-videos, Storage Class: Standard
	 * Configuration for Amazon S3 Bucket for Thumbnails
			Bucket: mytube-bucket-destination-videos, Storage Class: Standard
	 * Note down the pipeline ID. This will be required when configuring AWS Lambda function
5. **AWS Lambda**
   * Create a AWS Lambda function from scratch. Set the following properties
       * Name
       * Runtime: 8.10
       * Role: Choose an existing role
       * Existing Role: <Enter the role which was created in STEP 3>
    * From Code entry type drop down, select : Upload a .ZIP file and upload the package
    * Select S3 Trigger and configure as below
       * Bucket: <source bucket>
       * Event Type: ObjectCreated
    * Set the following 2 environment variables:
       * ELASTIC_TRANSCODER_PIPELINE_ID:  <Pipeline ID from STEP 4 above>
       * ELASTIC_TRANSCODER_REGION: <AWS Region. For eg : us-west-2>
    * Click Save
    
   	At this stage, all the required pieces are in place.
   
   ## AWS Changes - Using CloudFormation
   AWS CloudFormation allows automation of AWS infrastructure and services. Using JSON/YAML, one can describe the target state of the infrastructure. This project provides CloudFormation template (cloudformation-template.json) which will create a stack described in manual steps above. This eases the deployment considerably. Steps below describe how to use AWS CLI to create the stack.
   
 1. Create S3 bucket to store lambda zip package.
 2. Upload uploads-package.zip S3 bucket
 3. Open Command prompt and type aws configure. Enter access key id and secret
 4. Enter the following CLI command. Replace the parameters as appropriate:
 * aws cloudformation create-stack --stack-name mytube-upload-9 --capabilities CAPABILITY_NAMED_IAM --template-body file://cloudformation-template.json --parameters ParameterKey=DestinationS3BucketParam,ParameterValue=mytube-destination-bucket-test ParameterKey=ElasticTranscodePipelineIdParam,ParameterValue=1527241054803-l0xrum ParameterKey=ElasticTranscodeRegionParam,ParameterValue=us-west-2 ParameterKey=LambdaFunctionsS3BucketParam,ParameterValue=mytube-lambdafunctions-bucket ParameterKey=LambdaIAMRoleParam,ParameterValue=mytube-iamrole-test ParameterKey=SourceS3BucketParam,ParameterValue=mytube-source-bucket-test ParameterKey=UploadLambdaFunctionNameParam,ParameterValue=mytube-lambda-upload-test ParameterKey=UploadLambdaZipFileNameParam,ParameterValue=uploads.package.zip
 5. Go to console and check the status of the stack

   
 ## Troubleshooting
 * To see the errors, open Configuration tab in AWS Lambda
 * Various metrics are shown graphically. Select "View Logs" and select the second option. This will open logs in CloudWatch
 * Check for errors. This will show all the detailed logs along with execution time and memory consumed.
