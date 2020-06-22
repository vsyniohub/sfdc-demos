import {track, wire, api, LightningElement } from 'lwc';
import MESSAGE_CHANNEL from '@salesforce/messageChannel/DemoChannel__c';
import {subscribe, publish, APPLICATION_SCOPE, MessageContext } from 'lightning/messageService';

export default class SampleMessageDistributorWeb extends LightningElement {
    messageReceived;
    subscription;
    @track message = '';
    @track messageThread = '';
    @track name = 'Web Component';

    @wire(MessageContext)
    messageContext;

    connectedCallback() {
        this.subscribeListen();
    }

    subscribeListen() {
        this.subscription = subscribe(
            this.messageContext,
            MESSAGE_CHANNEL, 
            (messageObject) => {
                this.handleMessage(messageObject);
            },
            {
                scope: APPLICATION_SCOPE 
            });
    }
    handleMessage(messageObject) {
        this.messageReceived = messageObject ? JSON.stringify(messageObject, null, '\t') : 'Empty';
        this.messageThread = this.messageThread + messageObject.nameSent + ': ' + messageObject.messageText + '\n'
    }
    handlePublish() {
        var payload = {
            recordId:           "ABC0000X1",
            nameSent:           this.name,
            messageText:        this.message,
            dateTimeGenerated : Date.now()
        };
        console.log(payload);
        publish(this.messageContext, MESSAGE_CHANNEL, payload);
    }
    setMessage(event) {
        this.message = event.target.value;
    }
    setName(event) {
        this.name = event.target.value;
    }
}