public with sharing class MeetingController {

    @AuraEnabled(cacheable=true)
    public static List<Meeting__c> getUpcomingMeetings(Id accountId) {
        return [SELECT Id, Name, startDate__c, endDate__c, ResponsiblePerson__c
                FROM Meeting__c
                WHERE Account__c = :accountId
                AND startDate__c >= :System.today()
                ORDER BY startDate__c ASC];
    }

    @AuraEnabled
    public static void createMeeting(Meeting__c newMeeting, List<Id> contactIds) {
        insert newMeeting;
        addMeetingParticipants(newMeeting.Id, contactIds);
    }

    public static void addMeetingParticipants(Id meetingId, List<Id> contactIds) {
        List<MeetingParticipants__c> participants = new List<MeetingParticipants__c>();

        for (Id contactId : contactIds) {
            participants.add(new MeetingParticipants__c(
                Meeting__c = meetingId, 
                Contact__c = contactId
            ));
        }
        insert participants;
    }
}