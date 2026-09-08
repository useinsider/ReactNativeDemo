//
//  NotificationViewController.swift
//  InsiderNotificationContent
//

import UIKit
import UserNotifications
import UserNotificationsUI
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
        if let carousel = carousel, response.actionIdentifier == "insider_int_push_next" {
            let nextIndex = InsiderPushNotification.didReceiveResponse(carousel.currentItemIndex)
            carousel.scrollToItem(at: nextIndex, animated: true)
            completion(.doNotDismiss)
        } else {
            InsiderPushNotification.logPlaceholderClick(response)
            completion(.dismissAndForwardAction)
        }
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
