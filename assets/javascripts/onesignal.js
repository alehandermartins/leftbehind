'use strict';

(function(ns){

  ns.OneSignal = function(){
    var OneSignal = window.OneSignal || [];

    // OneSignal.on('notificationDisplay', function (event) {
    //   alert('OneSignal notification displayed:', event)
    // })

    OneSignal.push(function() {
      OneSignal.on('subscriptionChange', function (isSubscribed) {
        console.log(isSubscribed)
        OneSignal.push(function() {
          OneSignal.getUserId(function(userId) {
            ns.Backend.notifyMe({
              uuid: LB.playerUuid(),
              player_id: userId
            })        
            console.log("OneSignal User ID:", userId)
          })
        })
      })
    })

    OneSignal.push(["init", {
      appId: "ee9d0079-e53b-46e8-b664-f6c7f4647f96",
      autoRegister: false, /* Set to true to automatically prompt visitors */
      notifyButton: {
        enable: true, /* Required to use the notify button */
        size: 'medium', /* One of 'small', 'medium', or 'large' */
        theme: 'default', /* One of 'default' (red-white) or 'inverse" (white-red) */
        position: 'bottom-right', /* Either 'bottom-left' or 'bottom-right' */
        offset: {
            bottom: '0px',
            left: '0px', /* Only applied if bottom-left */
            right: '0px' /* Only applied if bottom-right */
        },
        prenotify: true, /* Show an icon with 1 unread message for first-time site visitors */
        showCredit: false, /* Hide the OneSignal logo */
        text: {
            'tip.state.unsubscribed': 'Subscribe to notifications',
            'tip.state.subscribed': "You're subscribed to notifications",
            'tip.state.blocked': "You've blocked notifications",
            'message.prenotify': 'Click to subscribe to notifications',
            'message.action.subscribed': "Thanks for subscribing!",
            'message.action.resubscribed': "You're subscribed to notifications",
            'message.action.unsubscribed': "You won't receive notifications again",
            'dialog.main.title': 'Manage Site Notifications',
            'dialog.main.button.subscribe': 'SUBSCRIBE',
            'dialog.main.button.unsubscribe': 'UNSUBSCRIBE',
            'dialog.blocked.title': 'Unblock Notifications',
            'dialog.blocked.message': "Follow these instructions to allow notifications:"
        }
      },
      promptOptions: {
        /* These prompt options values configure both the HTTP prompt and the HTTP popup. */
        /* Change bold title, limited to 30 characters */
        siteName: 'Left Behind',
        /* actionMessage limited to 90 characters */
        actionMessage: "Notifications will let you know when other players are ready",
        /* acceptButtonText limited to 15 characters */
        acceptButtonText: "ALLOW",
        /* cancelButtonText limited to 15 characters */
        cancelButtonText: "NO THANKS",
        /* Example notification title */
        exampleNotificationTitle: 'Left Behind',
        /* Example notification message */
        exampleNotificationMessage: 'Cooperate, betray... survive',
        /* Text below example notification, limited to 50 characters */
        exampleNotificationCaption: 'You can unsubscribe anytime',
      }
    }])
  }
}(LB || {}));