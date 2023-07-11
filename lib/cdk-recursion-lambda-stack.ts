import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as sns from 'aws-cdk-lib/aws-sns';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as iam from 'aws-cdk-lib/aws-iam';
import { aws_sns_subscriptions } from 'aws-cdk-lib';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import path = require('path');

export class CdkRecursionLambdaStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const topic = new sns.Topic(this, 'MyTopic');
    topic.addSubscription(new aws_sns_subscriptions.EmailSubscription("you-email-address"))


    const hello = new NodejsFunction(this, 'HelloHandler', {
      runtime: lambda.Runtime.NODEJS_18_X,    // execution environment
      entry: path.join(
        __dirname,
        "../lambda/send-message.ts"
      ),  // code loaded from "lambda" directory
      handler: 'main',
      environment: {
        TOPIC_ARN: topic.topicArn
      }
    });

    hello.role?.addManagedPolicy(iam.ManagedPolicy.fromAwsManagedPolicyName(
      'AmazonSNSFullAccess',
    ),)

    topic.addSubscription(new aws_sns_subscriptions.LambdaSubscription(hello))


    // hello.addEventSource(new SnsEventSource(topic))
  }
}
