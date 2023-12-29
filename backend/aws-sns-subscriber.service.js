const Aws = require('./aws');
const sns = new Aws.SNS();
const MessageValidator = require('sns-validator')


const initSubs = () => {
    let params = {
        Protocol: 'https',
        TopicArn: process.env.SNS_FILE_UPLOAD_TOPIC,
        Endpoint: 'https://karam23234.serveo.net/notifications'
    };

    sns.subscribe(params, (err, data) => {
        if (err) {
            throw new Error(`Subscription initialization failed: ${err.message}`)
        }
    });
};

const confirmSubscription = (request) => {
    console.log('running  confirmSubscription', request.body)
    const {Token, TopicArn} = request.body
    const params = {
        Token,
        TopicArn
    }

    sns.confirmSubscription(params, function (err, data) {
        if (err) console.log({err, stack: err.stack, message: "error confirming subscription"}); // an error occurred
        else console.log({data, message: "successfully confirmed subscription"});           // successful response
    });
}

const handleSubscriptions = (req, io) => {
    const validator = new MessageValidator();
    req.body = JSON.parse(req.body);

    const messageType = req.body.Type

    validator.validate(req.body, function (err, message) {
        if (err) {
            throw new Error(`Error validating message: ${err}`)
        }

        // SNS subscription confirmation
        if (messageType === 'SubscriptionConfirmation') {
            confirmSubscription(req)
        }

        // SNS notifications
        if (messageType === 'Notification') {
            const {Message} = req.body;
            const parsed = JSON.parse(Message);
            console.log(parsed);
            console.log({messageType, message: parsed.Records[0].s3.object.key});
            io.emit('success', { message: parsed.Records[0].s3.object.key });
            console.log("Emitted success event");
        }
    });
}


module.exports = {initSubs, handleSubscriptions}