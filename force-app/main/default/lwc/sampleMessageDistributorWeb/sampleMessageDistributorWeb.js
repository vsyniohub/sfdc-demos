import {wire, LightningElement } from 'lwc';
import MESSAGE_CHANNEL from '@salesforce/messageChannel/DemoChannel__c';
import {subscribe, publish, MessageContext } from 'lightning/messageService';

export default class SampleMessageDistributorWeb extends LightningElement {
    messageReceived;
    subscription;

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
            });
    }
    handleMessage(messageObject) {
        this.messageReceived = messageObject ? JSON.stringify(messageObject, null, '\t') : 'Empty';
    }
}