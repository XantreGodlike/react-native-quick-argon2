#import "QuickArgon2Module.h"

#import <React/RCTBridge+Private.h>
#import <React/RCTUtils.h>
#import <ReactCommon/RCTTurboModule.h>
#import <jsi/jsi.h>

#import "../cpp/RNA2QuickArgon2HostObject.h"

@implementation QuickArgon2Module

RCT_EXPORT_MODULE(QuickArgon2)

RCT_EXPORT_BLOCKING_SYNCHRONOUS_METHOD(install) {
  NSLog(@"Installing JSI bindings for react-native-quick-argon2...");
  RCTBridge* bridge = [RCTBridge currentBridge];
  RCTCxxBridge* cxxBridge = (RCTCxxBridge*)bridge;
  if (cxxBridge == nil) {
    return @false;
  }

  using namespace facebook;

  auto jsiRuntime = (jsi::Runtime*)cxxBridge.runtime;
  if (jsiRuntime == nil) {
    return @false;
  }
  auto& runtime = *jsiRuntime;
  auto callInvoker = bridge.jsCallInvoker;

  auto workerQueue =
      std::make_shared<rnargon2::DispatchQueue::dispatch_queue>("quick argon2 thread");
  auto hostObject = std::static_pointer_cast<jsi::HostObject>(
      std::make_shared<rnargon2::RNA2QuickArgon2HostObject>(callInvoker, workerQueue));
  auto object = jsi::Object::createFromHostObject(runtime, hostObject);
  runtime.global().setProperty(runtime, "__QuickArgon2Proxy", std::move(object));

  NSLog(@"Successfully installed JSI bindings for react-native-quick-argon2!");
  return @true;
}

@end
