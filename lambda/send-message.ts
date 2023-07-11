import { SNSClient, PublishCommand } from "@aws-sdk/client-sns";

export async function main() {
  const client = new SNSClient({ region: process.env.AWS_Region });
  try {
    const input = {
      // PublishInput
      TopicArn: process.env.TOPIC_ARN,
      Message: "This is a message from lambda",
    };
    const command = new PublishCommand(input);
    const response = await client.send(command);
    console.log(response);
  } catch (error) {
    console.log(error)
  }

}
