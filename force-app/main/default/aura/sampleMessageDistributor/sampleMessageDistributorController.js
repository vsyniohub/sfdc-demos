({
    handlePublish: function(component, event, helper) {
        var payload = {
            recordId:           "ABC0000X1",
            nameSent:           component.find("messageComponentName").get("v.value"),
            messageText:        component.find("messageTextBox").get("v.value"),
            dateTimeGenerated : Date.now()
        };
        component.find("messageChannelComponent").publish(payload);
    },
    onMessage: function(component, message, helper) {
        let messageThread = component.get("v.messageThread");
        let name = message.getParam("nameSent");
        let text = message.getParam("messageText");
        component.set(
            "v.messageThread", 
            messageThread + name + ': ' + text + '\n'
        );
    }
})
