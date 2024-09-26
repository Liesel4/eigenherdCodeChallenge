trigger MeetingParticipantTrigger on MeetingParticipants__c (before insert, before update) {

    Set<Id> meetingIds = new Set<Id>();
    
    for (MeetingParticipants__c mp : Trigger.new) {
        if (mp.Meeting__c != null) {
            meetingIds.add(mp.Meeting__c);
        }
    }

    Map<Id, Meeting__c> meetingMap = new Map<Id, Meeting__c>(
        [SELECT Id, Account__c FROM Meeting__c WHERE Id IN :meetingIds]
    );

    for (MeetingParticipants__c mp : Trigger.new) {
        if (mp.Meeting__c != null && mp.Contact__c != null) {

            Contact contact = [SELECT Id, AccountId FROM Contact WHERE Id = :mp.Contact__c LIMIT 1];
            
            Meeting__c meeting = meetingMap.get(mp.Meeting__c);

            if (meeting != null && contact.AccountId != meeting.Account__c) {
                mp.addError('Der ausgewählte Kontakt gehört nicht zum Account des Meetings.');
            }
        }
    }
}
