import { LightningElement, track } from 'lwc';

export default class CustomLookup extends LightningElement {
    /* *************
    ** track variables
    ** ************* */
    @track itemList = [];
    @track selected = false;
    @track areRecords = false;

    /* *************
    ** functions
    ** ************* */
    handleItemClick(event) {
        console.log(event.currentTarget.dataset.id);
        this.removeResultList();

        this.selected = true;
        this.itemList = [];
    }
    removeSelected(event) {
        this.removeResultList();
    }
    changeSearch(event) {
        this.itemList = [];
        for (var i = 0; i < event.target.value.length; i++) {
            this.itemList = [
                ...this.itemList, 
                {
                    'Id' : '' + i,
                    'Some' : 'x'
                }
            ];
        }
        this.areRecords = true;
    }
    defocus(event) {
        this.itemList = [];
        this.removeResultList();
    }
    removeResultList() {
        this.areRecords = false;
    }
}