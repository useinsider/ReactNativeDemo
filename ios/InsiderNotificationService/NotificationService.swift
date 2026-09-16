//
//  NotificationService.swift
//  InsiderNotificationService
//

import UserNotifications
import InsiderMobileAdvancedNotification

// FIXME-INSIDER: Please change with your app group.
private let appGroup = "group.com.useinsider.reactnativedemo"

final class NotificationService: UNNotificationServiceExtension {

    private var contentHandler: ((UNNotificationContent) -> Void)?
    private var bestAttemptContent: UNMutableNotificationContent?

    override func didReceive(
        _ request: UNNotificationRequest,
        withContentHandler contentHandler: @escaping (UNNotificationContent) -> Void
    ) {
        self.contentHandler = contentHandler

        guard let content = request.content.mutableCopy() as? UNMutableNotificationContent else {
            contentHandler(request.content)
            return
        }
        bestAttemptContent = content

        // MARK: You can customize these.
        let nextButtonText = ">>"
        let goToAppText = "Launch App"

        InsiderPushNotification.showInsiderRichPush(
            content,
            appGroup: appGroup,
            nextButtonText: nextButtonText,
            goToAppText: goToAppText
        ) { attachment in
            if let attachment {
                content.attachments = [attachment]
            }
            contentHandler(content)
        }
    }

    override func serviceExtensionTimeWillExpire() {
        if let contentHandler, let bestAttemptContent {
            contentHandler(bestAttemptContent)
        }
    }
}
