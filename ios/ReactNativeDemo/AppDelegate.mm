#import "AppDelegate.h"

#import <React/RCTBundleURLProvider.h>
#import <Firebase.h>
#import <InsiderMobile/Insider.h>

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  self.moduleName = @"ReactNativeDemo";
  // You can add your custom initial props in the dictionary below.
  // They will be passed down to the ViewController used by React Native.
  self.initialProps = @{};
  
  UNUserNotificationCenter.currentNotificationCenter.delegate = self;
  
  [FIRApp configure];

  return [super application:application didFinishLaunchingWithOptions:launchOptions];
}

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
#if DEBUG
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index"];
#else
  return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif
}

/// This method controls whether the `concurrentRoot`feature of React18 is turned on or off.
///
/// @see: https://reactjs.org/blog/2022/03/29/react-v18.html
/// @note: This requires to be rendering on Fabric (i.e. on the New Architecture).
/// @return: `true` if the `concurrentRoot` feature is enabled. Otherwise, it returns `false`.
- (BOOL)concurrentRootEnabled
{
  return true;
}

+(void)load {
  [Insider setIsUNUserNotificationSwizzlersDisabled:true];
}

- (void)userNotificationCenter:(UNUserNotificationCenter *)center didReceiveNotificationResponse:(UNNotificationResponse *)response withCompletionHandler:(void (^)(void))completionHandler {
    NSDictionary *userInfo = response.notification.request.content.userInfo;
    
    if (userInfo[@"source"] && [userInfo[@"source"] isEqualToString:@"Insider"]) {
        [Insider triggerPushProcessWithUserInfo:userInfo];
    }
}

// If you want to enable push view on foreground
- (void)userNotificationCenter:(UNUserNotificationCenter *)center willPresentNotification:(UNNotification *)notification withCompletionHandler:(void (^)(UNNotificationPresentationOptions))completionHandler {
    NSDictionary *userInfo = notification.request.content.userInfo;
    
    if (userInfo[@"source"] && [userInfo[@"source"] isEqualToString:@"Insider"]) {
        if (userInfo[@"inapp_test"]) {
            [Insider triggerPushProcessWithUserInfo:userInfo];
        } else {
            if (@available(iOS 14, *)) {
                completionHandler(UNNotificationPresentationOptionSound +
                                  UNNotificationPresentationOptionBadge +
                                  UNNotificationPresentationOptionBanner +
                                  UNNotificationPresentationOptionList);
            } else {
                completionHandler(UNNotificationPresentationOptionSound +
                                  UNNotificationPresentationOptionBadge +
                                  UNNotificationPresentationOptionAlert);
            }
        }
    }
}

/* If you want to disable push view on foreground use this code
 
 - (void)userNotificationCenter:(UNUserNotificationCenter *)center willPresentNotification:(UNNotification *)notification withCompletionHandler:(void (^)(UNNotificationPresentationOptions))completionHandler {
     NSDictionary *userInfo = notification.request.content.userInfo;
     
     if (userInfo[@"source"] && [userInfo[@"source"] isEqualToString:@"Insider"]) {
        [Insider triggerPushProcessWithUserInfo:userInfo];
     }
 }
 
 */


@end
