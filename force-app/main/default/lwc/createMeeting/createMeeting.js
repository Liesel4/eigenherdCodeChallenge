import { LightningElement, track, api, wire } from 'lwc';
import createMeeting from '@salesforce/apex/MeetingController.createMeeting';
import getActiveUsers from '@salesforce/apex/UserController.getActiveUsers';
import getContactsByAccount from '@salesforce/apex/ContactController.getContactsByAccount';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class CreateMeeting extends LightningElement {

    @api accountId;

    meetingName;
    startDate;
    endDate;
    userId;
    @track userOptions;
    @track selectedContacts;
    @track contactOptions;

    @wire(getActiveUsers)
    wiredUsers({ error, data }) {
        if (data) {
            this.userOptions = data.map(user => {
                return { label: user.Name, value: user.Id };
            });
        } else if (error) {
            this.dispatchEvent(new ShowToastEvent({ title: 'Fehler', message: 'Fehler beim Laden der Benutzer', variant: 'error' }));
        }
    }

    @wire(getContactsByAccount, { accountId: '$accountId' })
    wiredContacts({ error, data }) {
        if (data) {
            this.contactOptions = data.map(contact => {
                return { label: contact.Name, value: contact.Id };
            });
        } else if (error) {
            this.dispatchEvent(new ShowToastEvent({ title: 'Fehler', message: 'Fehler beim Laden der Teilnehmer', variant: 'error' }));

        }
    }

    handleInputChangeName(event){
        this.meetingName = event.target.value;
    }
    handleInputChangeStart(event){
        this.startDate = event.target.value;
    }
    handleInputChangeEnd(event){        
        this.endDate = event.target.value;
    }

    handleInputChangeUser(event){
        this.userId = event.target.value;
    }

    handleContactSelection(event){
        this.selectedContacts = event.detail.value;
    }

    createMeeting(){
        const newMeeting = {
            Name: this.meetingName,
            startDate__c: this.startDate,
            endDate__c: this.endDate,
            Account__c: this.accountId,
            ResponsiblePerson__c: this.userId
        };

        createMeeting({ newMeeting: newMeeting, contactIds: this.selectedContacts })
            .then(() => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Erfolg',
                        message: 'Meeting erfolgreich erstellt!',
                        variant: 'success'
                    })
                );
                window.location.reload();
            })
            .catch(error => {
                console.log(JSON.stringify(error, null, 2));
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Fehler',
                        message: 'Fehler beim Erstellen des Meetings :(',
                        variant: 'error'
                    })
                );
            });
    }
}