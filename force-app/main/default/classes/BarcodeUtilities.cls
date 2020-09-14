/**
 * Name: BarcodeUtilities
 * Description: Barcode useful methods
 */
public with sharing class BarcodeUtilities {

    /**
     * Name: returnScanHistory
     * Description: fetches last 10 barcode scans
     *              Aura-enabled, returns list of sObjects
     */
    @AuraEnabled
    public static List<Scan_History__c> returnScanHistory(){
        return [SELECT 
                    Id, Name, Barcode_Body__c, Barcode_Type__c, CreatedDate 
                FROM Scan_History__c 
                ORDER BY CreatedDate DESC LIMIT 10];
    }
}
