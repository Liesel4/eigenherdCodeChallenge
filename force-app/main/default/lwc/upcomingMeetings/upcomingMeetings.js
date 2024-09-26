import { LightningElement, wire, api, track } from 'lwc';
import getUpcomingMeetings from '@salesforce/apex/MeetingController.getUpcomingMeetings';

export default class UpcomingMeetings extends LightningElement {

    @api accountId;
    @track upcomingMeetings = [];

    columns = [
        {label: 'Meeting Name', fieldName: 'Name'},
        {label: 'Start', fieldName: 'startDate__c', type: 'date', typeAttributes: {day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'}},
        {label: 'Ende', fieldName: 'endDate__c', type: 'date', typeAttributes: {day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'}}
    ];

    @wire(getUpcomingMeetings, { accountId: '$accountId' })
    wiredMeetings({ error, data }) {
        if (data) {
            this.upcomingMeetings = data;
        } else if (error) {
            this.dispatchEvent(new ShowToastEvent({ title: 'Fehler', message: 'Fehler beim Laden der Meetings', variant: 'error' }));
        }
    }

    get hasMeetings(){
        return this.upcomingMeetings.length > 0;
    }


}