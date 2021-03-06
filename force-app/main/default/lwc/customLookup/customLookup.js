import { LightningElement, track, api } from 'lwc';
import getRecords from '@salesforce/apex/CustomLookupController.getRecords';
import getRecordsByDefault from '@salesforce/apex/CustomLookupController.getRecordsByDefault';
//import getSupportedObjectsHelper from '@salesforce/apex/CustomLookupController.getSupportedObjectsHelper';

export default class CustomLookup extends LightningElement {
    /* *************
    ** variables
    ** ************* */
    minCharAmount = 2;
    zeroCharAmount = 0;
    readOnlyDefault = true;

    /* *************
    ** api variables
    ** ************* */
    @api objectName;
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
    @track selected     = false;
    @track areRecords   = false;
    @track isError      = false;
    @track error;

    /* *************
    ** functions
    ** ************* */
    connectedCallback(event) {
        if (this.valuesNotSet()) {
            this.isError = true;
            this.selected = true;
        }
    }
    handleItemClick(event) {
        console.log(event.currentTarget.dataset.id);
        this.removeResultList();

        this.selected = true;
        this.isError  = false;
        this.selectedCaption = this.itemList.find(c => c.Id === event.currentTarget.dataset.id).Name;
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
            getRecords({
                fields : this.objectDataFields,
                objectName : this.objectName,
                filterName : 'Name',
                filterValues : event.target.value
            })
            .then(result => {
                this.itemList = result;
                console.log('Retrieved');
                console.log(JSON.stringify(this.itemList));
            })
            .catch(error => {
                this.error = error;
            });
        
            this.areRecords = true;
        } else if (charsEntered === this.zeroCharAmount) {
            this.removeResultList();
        } else {
            //no logic yet
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
        let objectNameFalseSet = this.objectName === undefined || this.objectName === '';
        let objectDataFieldsFalseSet = this.objectDataFields === undefined || this.objectDataFields.length === 0;
        return objectNameFalseSet || objectDataFieldsFalseSet;
    }
}