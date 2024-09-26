public with sharing class ContactController {

    @AuraEnabled(cacheable=true)
    public static List<Contact> getContactsByAccount(Id accountId) {
        return [SELECT Id, Name FROM Contact WHERE AccountId = :accountId];
    }
}