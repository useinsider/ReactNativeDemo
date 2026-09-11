//
//  NotificationViewController.swift
//  InsiderNotificationContent
//

import UIKit
import UserNotifications
import UserNotificationsUI
import os.log
import InsiderMobileAdvancedNotification

// FIXME-INSIDER: Please change with your app group.
private let appGroup = "group.com.useinsider.reactnativedemo"

final class NotificationViewController: UIViewController,
                                        UNNotificationContentExtension,
                                        iCarouselDelegate,
                                        iCarouselDataSource {

    @IBOutlet private weak var carousel: iCarousel!

    override func viewWillDisappear(_ animated: Bool) {
        super.viewWillDisappear(animated)
        InsiderPushNotification.setTimeAttribution()
    }

    func didReceive(_ notification: UNNotification) {
        InsiderPushNotification.interactivePushLoad(
            appGroup,
            superView: view,
            notification: notification
        )

        carousel?.type = .rotary
        carousel?.reloadData()

        InsiderPushNotification.interactivePushDidReceive()
    }

    func didReceive(
        _ response: UNNotificationResponse,
        completionHandler completion: @escaping (UNNotificationContentExtensionResponseOption) -> Void
    ) {
        // Branch on the action alone, as the Objective-C original did. Folding the carousel's
        // nil-check in here sent a missing outlet down the placeholder path, which reports a body
        // tap that never happened and dismisses the notification instead of keeping it open.
        guard response.actionIdentifier == "insider_int_push_next" else {
            InsiderPushNotification.logPlaceholderClick(response)
            completion(.dismissAndForwardAction)
            return
        }

        // The SDK hears about the tap either way: in Objective-C this call was an argument to
        // scrollToItemAtIndex:, so it ran even when the outlet was nil (currentItemIndex on nil
        // gave 0). Only the scroll itself needs a live outlet.
        let nextIndex = InsiderPushNotification.didReceiveResponse(carousel?.currentItemIndex ?? 0)

        if let carousel = carousel {
            carousel.scrollToItem(at: nextIndex, animated: true)
        } else {
            // Only reachable if the storyboard outlet came unwired. Objective-C stayed silent
            // here; say so instead, rather than mis-reporting it as a body tap.
            os_log("Next tapped with no carousel outlet", log: .default, type: .error)
        }
        completion(.doNotDismiss)
    }

    // MARK: - iCarouselDataSource

    func numberOfItems(in carousel: iCarousel) -> Int {
        InsiderPushNotification.getNumberOfSlide()
    }

    func carousel(_ carousel: iCarousel, viewForItemAt index: Int, reusing view: UIView?) -> UIView {
        InsiderPushNotification.getSlide(index, reusing: view, superView: self.view)
    }

    // MARK: - iCarouselDelegate

    func carouselItemWidth(_ carousel: iCarousel) -> CGFloat {
        InsiderPushNotification.getItemWidth()
    }

    deinit {
        carousel?.delegate = nil
        carousel?.dataSource = nil
    }
}
