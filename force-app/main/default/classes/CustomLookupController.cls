public with sharing class CustomLookupController {
    private final static String PERCENTAGE_CHAR = '%';
    private final static String CM_CHAR = ',';

    /* ***
    ** Name: CustomLookupController
    ** Description: Empty controller
    ** *** */
    public CustomLookupController() {
    }

    /* ***
    ** Name: getRecords
    ** Description: 
    ** *** */
    @AuraEnabled(cacheable=true)
    public static List<Account> getRecordsByDefault(String attributes) {
        String searchSpecification = PERCENTAGE_CHAR + attributes + PERCENTAGE_CHAR;
        List<Account> records = [
            SELECT Id, Name, AccountNumber
            FROM Account
            WHERE Name LIKE :searchSpecification
        ];
        System.debug(records);

        return records;
    }

    /* ***
    ** Name: getRecords
    ** Description: returns records by using inputs
    ** *** */
    @AuraEnabled
    public static List<Account> getRecords(List<String> fields, String objectName, String filterName, String filterValues) {
        String searchSpecification = PERCENTAGE_CHAR + filterValues + PERCENTAGE_CHAR;
        String searchString = 
            'SELECT Id,' + String.join(fields, CM_CHAR).removeEnd(CM_CHAR) + 
            ' FROM ' + objectName + ' ' +
            'WHERE ' + filterName + ' LIKE :searchSpecification';

        System.debug(searchString); 

        return Database.query(searchString);
    }
    
    /* ***
    ** Name: getSupportedObjectsHelper
    ** Description: returns list of objects supported.
    ** No usage
    ** *** */
    @AuraEnabled(cacheable=true)
    public static List<String> getSupportedObjectsHelper() {
        return new List<String>{'Account'};
    }
}
