import { LightningElement, track, api } from 'lwc';
import getRecords from '@salesforce/apex/CustomLookupController.getRecords';
import getRecordsByDefault from '@salesforce/apex/CustomLookupController.getRecordsByDefault';
import getSupportedObjectsHelper from '@salesforce/apex/CustomLookupController.getSupportedObjectsHelper';

export default class CustomLookup extends LightningElement {
    /* *************
    ** variables
    ** ************* */
    minCharAmount = 2;
    zeroCharAmount = 0;

    /* *************
    ** api variables
    ** ************* */
    @api objectName = 'Account';
    @api filterField = 'AccountName';
    @api objectDataFields = [
        'AccountNumber', 'Name'
    ];

    /* *************
    ** track variables
    ** ************* */
    @track itemList = [];
    @track retrievedItems = [];
    @track selectedCaption;
    @track selected = false;
    @track areRecords = false;
    @track error;

    /* *************
    ** functions
    ** ************* */
    connectedCallback(event) {
        this.objectData = {

        };
    }
    handleItemClick(event) {
        console.log(event.currentTarget.dataset.id);
        this.removeResultList();

        this.selected = true;
        this.selectedCaption = this.itemList.find().Name;
        this.itemList = [];
    }
    removeSelected(event) {
        this.selected = !this.selected;
        this.removeResultList();
    }
    changeSearch(event) {
        this.itemList = [];
        let charsEntered = event.target.value.length;

        if (charsEntered > this.minCharAmount) {
            if (this.valuesNotSet()) {
                getRecords({
                    fields : this.objectDataFields,
                    objectName : this.objectName,
                    filterName : 'Name',
                    filterValues : event.target.value
                })
                .then(result => {
                    this.itemList = result;
                    console.log('Retrieved');
                    console.log(this.itemList);
                })
                .catch(error => {
                    this.error = error;
                });
            } else {
                getRecordsByDefault({attributes : event.target.value})
                .then(result => {
                    this.itemList = result;
                    console.log('Retrieved');
                    console.log(this.itemList);
                })
                .catch(error => {
                    this.error = error;
                });
            }
            
            this.areRecords = true;
        } else if (charsEntered === this.zeroCharAmount) {
            this.removeResultList();
        } else {

        }
    }
    defocus(event) {
        this.itemList = [];
        this.removeResultList();
    }
    removeResultList() {
        this.areRecords = false;
    }
    valuesNotSet() {
        let objectNameSet = this.objectName === undefined || this.objectName === '';
        let objectDataFieldsSet = this.objectDataFields === undefined || this.objectDataFields.length === 0;
        return objectNameSet || objectDataFieldsSet;
    }
}