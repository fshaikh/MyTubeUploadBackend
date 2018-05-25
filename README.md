# Intro
Serverless Backend for MyTube Video Sharing app. This is a AWS Lambda recipe for uploading video files to a source S3 bucket and transcoding the video file using AWS ElasticTranscoder
into various video formats. 

# Architecture
![](https://github.com/fshaikh/MyTubeUploadBackend/blob/master/Architecture.PNG)

# Setting up Dev Environment
    1. Install Node (> v8.10), Preferred IDE, Windows Powershell
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
