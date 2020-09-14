import { LightningElement, track } from 'lwc';
import { getBarcodeScanner } from 'lightning/mobileCapabilities';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { createRecord } from 'lightning/uiRecordApi';
import { refreshApex } from '@salesforce/apex';
import { subscribe, unsubscribe, onError, setDebugFlag, isEmpEnabled } from 'lightning/empApi';
import returnScanHistory from '@salesforce/apex/BarcodeUtilities.returnScanHistory';
import SCAN_HISTORY_OBJECT from '@salesforce/schema/Scan_History__c';
import BARCODE_BODY from '@salesforce/schema/Scan_History__c.Barcode_Body__c';
import BARCODE_TYPE from '@salesforce/schema/Scan_History__c.Barcode_Type__c';

const columns = [
    { label: 'Number', fieldName: 'Name' },
    { label: 'Type', fieldName: 'Barcode_Type__c' },
    { label: 'Body', fieldName: 'Barcode_Body__c' },
    { label: 'Created', fieldName: 'CreatedDate', type: 'date' }
];

export default class SampleBarcodeScanner extends LightningElement {
    @track scannedBarcode  = '';
    @track data = [];
    @track scannedBarcodeStream = '';

    myScanner;
    selectAllState      = false;
    scanButtonDisabled  = false;
    
    error           = '';
    barcodeTypeScan = '';

    barcodeHistoryColumns = columns;
    defaultSelection    = ['QR'];
    barcodeValue        = ['QR'];

    subsctiption        = {};
    
    topicName = '/topic/CheckForNewScans';

    get barcodeOptions() {
        return [
            { label: 'Code 128', value: 'CODE_128' },
            { label: 'Code 39', value: 'CODE_39' },
            { label: 'Code 93', value: 'CODE_93' },
            { label: 'Data Matrix', value: 'DATA_MATRIX' },
            { label: 'EAN-13/GTIN-13', value: 'EAN_13' },
            { label: 'EAN-8/GTIN-8', value: 'EAN_8' },
            { label: 'Interleaved 2 of 5', value: 'ITF' },
            { label: 'PDF417', value: 'PDF_417' },
            { label: 'QR-Code', value: 'QR' },
            { label: 'UPC-E/GTIN-12', value: 'UPC_E' },
        ];
    }

    get selectedValues() {
        return this.barcodeValue.join(',');
    }

    selectAll(event) {
        if (!this.selectAllState) {
            this.barcodeValue = this.barcodeOptions.map(option => option.value);
        } else {
            this.barcodeValue = this.defaultSelection;
        }
        this.selectAllState = !this.selectAllState;
    }

    handleBarcodeSelection(event) {
        this.barcodeValue = event.detail.value;
    }

    connectedCallback() {
        this.myScanner = getBarcodeScanner();
        if (this.myScanner == null || !this.myScanner.isAvailable()) {
            this.scanButtonDisabled = true;
        }
        this.handleSubscribe();
        this.returnHistory();
    }

    handleBeginScanClick(event) {
        this.scannedBarcode = '';

        if (this.myScanner != null && this.myScanner.isAvailable()) {
            const scanningOptions = {
                //barcodeTypes: [this.myScanner.barcodeTypes.QR]
                barcodeTypes : this.barcodeValue
            };
            this.myScanner
                .beginCapture(scanningOptions)
                .then((result) => {
                    console.log(result.value + ' ' + result.type);

                    this.scannedBarcode     = decodeURIComponent(result.value);
                    this.barcodeTypeScan    = decodeURIComponent(result.type);
                    this.createBarcodeScanHistoryRecord();
                    this.dispatchEvent(
                        new ShowToastEvent({
                            title: 'Successful Scan',
                            message: 'Barcode scanned successfully : ' + this.scannedBarcode + '/' + this.barcodeTypeScan,
                            variant: 'success'
                        })
                    );
                    
                })
                .catch((error) => {
                    console.error(error);
                    this.dispatchEvent(
                        new ShowToastEvent({
                            title: 'Barcode Scanner Error',
                            message:
                                'Error: ' +
                                JSON.stringify(error),
                            variant: 'error',
                            mode: 'sticky'
                        })
                    );
                })
                .finally(() => {
                    this.myScanner.endCapture();
                });
        } else {
            console.log(event);

            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Barcode Scanner Is Not Available',
                    message: 'Try again from the Salesforce app on a mobile device.',
                    variant: 'error'
                })
            );
        }
    }

    createBarcodeScanHistoryRecord() {
        const fields = {};
        fields[BARCODE_BODY.fieldApiName] = this.scannedBarcode;
        fields[BARCODE_TYPE.fieldApiName] = this.barcodeTypeScan;
        const recordInput = { apiName: SCAN_HISTORY_OBJECT.objectApiName, fields };
        createRecord(recordInput)
            .then(scan => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Success',
                        message: 'Scan History created',
                        variant: 'success',
                    }),
                );
            })
            .catch(error => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error creating record',
                        message: error.body.message,
                        variant: 'error',
                    }),
                );
            });
    }

    handleSubscribe() {
        const messageCallback = (response) => {
            console.log(JSON.stringify(response));
            if (response.data && response.data.sobject) {
                this.scannedBarcodeStream = response.data.sobject.Barcode_Body__c;
                returnScanHistory()
                .then(result => {
                    console.log('Returning history subscription');
                    this.data = [... result];
                })
                .catch(error => {
                    console.log(error);
                    this.error = error;
                });
            }
        };

        subscribe(this.topicName, -1, messageCallback).then(response => {
            console.log(JSON.stringify(response.channel));
            this.subscription = response;
        });
    }

    returnHistory() {
        console.log('Inside History JS');
        returnScanHistory()
        .then(result => {
            console.log('Returning history');
            //console.log(JSON.stringify(result));
            this.data = result;
        })
        .catch(error => {
            console.log(error);
            this.error = error;
        });
    }
}