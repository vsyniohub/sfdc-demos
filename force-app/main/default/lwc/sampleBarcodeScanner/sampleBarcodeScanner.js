import { LightningElement } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { getBarcodeScanner } from 'lightning/mobileCapabilities';

export default class SampleBarcodeScanner extends LightningElement {
    myScanner;
    scanButtonDisabled = false;
    scannedBarcode = '';
    barcodeValue = ['QR'];
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

    handleBarcodeSelection(event) {
        this.barcodeValue = event.detail.value;
    }

    connectedCallback() {
        this.myScanner = getBarcodeScanner();
        if (this.myScanner == null || !this.myScanner.isAvailable()) {
            this.scanButtonDisabled = true;
        }
    }

    handleBeginScanClick(event) {
        // Reset scannedBarcode to empty string before starting new scan
        this.scannedBarcode = '';

        if (this.myScanner != null && this.myScanner.isAvailable()) {
            const scanningOptions = {
                //barcodeTypes: [this.myScanner.barcodeTypes.QR]
                barcodeTypes : this.barcodeValue
            };
            this.myScanner
                .beginCapture(scanningOptions)
                .then((result) => {
                    console.log(result);

                    this.scannedBarcode = decodeURIComponent(result.value);
                    this.dispatchEvent(
                        new ShowToastEvent({
                            title: 'Successful Scan',
                            message: 'Barcode scanned successfully.',
                            variant: 'success'
                        })
                    );
                })
                .catch((error) => {
                    console.error(error);

                    // Handle unexpected errors here
                    // Inform the user we ran into something unexpected
                    this.dispatchEvent(
                        new ShowToastEvent({
                            title: 'Barcode Scanner Error',
                            message:
                                'There was a problem scanning the barcode: ' +
                                JSON.stringify(error) +
                                ' Please try again.',
                            variant: 'error',
                            mode: 'sticky'
                        })
                    );
                })
                .finally(() => {
                    console.log('#finally');

                    this.myScanner.endCapture();
                });
        } else {
            console.log(
                'Scan Barcode button should be disabled and unclickable.'
            );
            console.log('Somehow it got clicked: ');
            console.log(event);

            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Barcode Scanner Is Not Available',
                    message:
                        'Try again from the Salesforce app on a mobile device.',
                    variant: 'error'
                })
            );
        }
    }
}