({
    handlePublish: function(component, event, helper) {
        var payload = {
            recordId: "ABC0000X1",
            messageText: "Some Text Came Here",
            dateTimeGenerated : Date.now()
        };
        component.find("messageChannelComponent").publish(payload);
    }
})
