# Bird detection message handler
This code is a notification sample of Alexa Proactive API.
Handling the MQTT message from AWS Deeplens and filter that Keyword was 'bird'
Then Call Proactiv API to notify Alexa devices.

# summery
In this sample, there is a three things to do.

- Handling MQTT message from AWS deeplens
- Filtering message only when content includes a keyword 'bird'
- Calling Alexa proactive API

# prerequirements
- serverless framework
- aws system manager (parameter store)

# preparation
This code sample needs 3 parameters.

- ClientId of alexa skill
- Client Secret of alexa Skill
- Topic of deployed model from deeplens

And, You needs to add these values to parameter store by following names

- bird-detection-client-id
- bird-detection-client-secret
- bird-detection-topic-filter

if you can use the AWS CLI, You can add these parameters with this command.

```
aws ssm put-parameter --type String --name bird-detection-client-id --value <your-client-id>
aws ssm put-parameter --type String --name bird-detection-client-secret --value <your-client-secret>
aws ssm put-parameter --type String --name bird-detection-topic-filter --value <your-mqtt-topic-filter>
```

# deploy
```
npm install
sls deploy
```

# Note
if you want to change the interval of notification, Modify notificationExpiryMinutes parameter in serverless.yml
if you want to change condition of filtering, Modify sql parameter in serverless.yml






